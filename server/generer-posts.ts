// Appel à OpenAI. Ce fichier tourne uniquement sur le serveur :
// la clé OPENAI_API_KEY n'est jamais envoyée au navigateur.
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'

import {
  POSTS_PAR_GENERATION,
  ReponseSchema,
  type Demande,
  type Post,
} from '../src/lib/palabra'

// GPT-6.1 Terra : modèle OpenAI pensé pour une écriture claire et naturelle.
// Prix (doc officielle) : 1 $ / million de tokens en entrée, 5 $ en sortie.
const MODELE = 'gpt-6.1-terra'

// Plafond de longueur de la réponse, pour garder le coût sous contrôle.
const MAX_TOKENS_SORTIE = 5000

const INSTRUCTIONS = `Tu es le rédacteur LinkedIn d'un freelance francophone.
Tu écris ${POSTS_PAR_GENERATION} posts LinkedIn pour sa semaine, du lundi au vendredi, prêts à être copiés-collés.

Règles d'écriture :
- Écris à la première personne, comme si le freelance parlait. Vouvoie les lecteurs.
- Première ligne : une accroche courte qui donne envie de cliquer sur « voir plus ».
- Phrases courtes. Paragraphes d'une à deux lignes, séparés par une ligne vide.
- Entre 600 et 1 200 caractères par post.
- Varie les angles sur la semaine : une anecdote vécue, un conseil concret, les coulisses du métier, un avis tranché, une question au réseau.
- Termine chaque post par une question ou une invitation à réagir.
- Au maximum 3 hashtags, à la toute fin. Pas plus de 2 emojis par post.
- N'invente jamais de chiffres, de noms de clients ou de résultats qui ne sont pas fournis.
- Pas de markdown : pas d'astérisques, pas de titres. Du texte brut, comme dans LinkedIn.

Pour chaque post, renvoie : "jour" (Lundi à Vendredi), "angle" (2 à 4 mots qui résument le post) et "texte" (le post complet).`

export async function genererPosts(demande: Demande): Promise<Post[]> {
  const openai = new OpenAI() // lit OPENAI_API_KEY dans les variables d'environnement

  const message = [
    `Métier : ${demande.metier}`,
    `Clients visés : ${demande.cible}`,
    `Ton souhaité : ${demande.ton}`,
    demande.semaine
      ? `Ce qui s'est passé cette semaine, ou texte de référence :\n${demande.semaine}`
      : `Pas d'actualité fournie : pars du métier et des clients visés.`,
  ].join('\n')

  const reponse = await openai.responses.parse({
    model: MODELE,
    reasoning: { effort: 'low' },
    max_output_tokens: MAX_TOKENS_SORTIE,
    input: [
      { role: 'system', content: INSTRUCTIONS },
      { role: 'user', content: message },
    ],
    text: { format: zodTextFormat(ReponseSchema, 'semaine_de_posts') },
  })

  const posts = reponse.output_parsed?.posts ?? []
  if (posts.length === 0) {
    throw new Error('Réponse vide de l’IA')
  }
  console.log('[palabra] tokens utilisés :', reponse.usage)
  return posts.slice(0, POSTS_PAR_GENERATION)
}
