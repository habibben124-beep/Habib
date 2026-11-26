import { defineConfig, loadEnv, type Plugin } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En développement seulement : fait tourner les fichiers du dossier api/
// comme Vercel le fera en ligne (format « export default { fetch } »).
function apiEnLocal(): Plugin {
  return {
    name: 'palabra-api-en-local',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const chemin = req.url?.split('?')[0] ?? ''
        const nom = /^\/api\/([a-z0-9-]+)$/.exec(chemin)?.[1]
        if (!nom) return next()
        try {
          const module = await server.ssrLoadModule(`/api/${nom}.ts`)
          const morceaux: Buffer[] = []
          for await (const morceau of req) morceaux.push(morceau as Buffer)
          const corps = Buffer.concat(morceaux)
          const entetes = new Headers()
          for (const [cle, valeur] of Object.entries(req.headers)) {
            if (typeof valeur === 'string') entetes.set(cle, valeur)
          }
          const requete = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: entetes,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : corps,
          })
          const reponse: Response = await module.default.fetch(requete)
          res.statusCode = reponse.status
          reponse.headers.forEach((valeur, cle) => res.setHeader(cle, valeur))
          res.end(Buffer.from(await reponse.arrayBuffer()))
        } catch (erreur) {
          next(erreur)
        }
      })
    },
  }
}

const config = defineConfig(({ mode }) => {
  // Charge .env.local côté serveur (les clés ne vont jamais au navigateur :
  // seules les variables qui commencent par VITE_ y sont envoyées).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      viteReact(),
      apiEnLocal(),
    ],
  }
})

export default config
