// Point d'entrée serveur : POST /api/generer
// Sur Vercel, chaque fichier du dossier api/ devient une fonction serveur.
import { genererPosts } from '../server/generer-posts'
import { DemandeSchema } from '../src/lib/palabra'

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return json({ erreur: 'Méthode non autorisée.' }, 405)
    }

    let corps: unknown
    try {
      corps = await request.json()
    } catch {
      return json({ erreur: 'Demande illisible.' }, 400)
    }

    const demande = DemandeSchema.safeParse(corps)
    if (!demande.success) {
      const premiere = demande.error.issues[0]?.message ?? 'Demande invalide.'
      return json({ erreur: premiere }, 400)
    }

    // À l'étape 4, on vérifiera ici que le client est connecté
    // et qu'il n'a pas dépassé ses générations du mois.

    try {
      const posts = await genererPosts(demande.data)
      return json({ posts })
    } catch (e) {
      console.error('[palabra] erreur OpenAI', e)
      return json(
        { erreur: 'La rédaction a échoué. Réessaie dans un instant.' },
        502,
      )
    }
  },
}
