// Règles partagées entre le navigateur et le serveur.
import { z } from 'zod'

// Nombre de générations incluses dans l'abonnement, par mois et par client.
export const GENERATIONS_PAR_MOIS = 30

// Nombre de posts produits à chaque génération (une semaine).
export const POSTS_PAR_GENERATION = 5

export const TONS = ['Professionnel', 'Chaleureux', 'Direct', 'Inspirant'] as const

// Ce que l'utilisateur envoie.
export const DemandeSchema = z.object({
  metier: z
    .string()
    .trim()
    .min(2, 'Dis-nous ton métier.')
    .max(200, 'Ton métier : 200 caractères maximum.'),
  cible: z
    .string()
    .trim()
    .min(2, 'Dis-nous à qui tu t’adresses.')
    .max(300, 'Tes clients : 300 caractères maximum.'),
  ton: z.enum(TONS),
  semaine: z
    .string()
    .trim()
    .max(8000, 'Ton texte est trop long : 8 000 caractères maximum.')
    .default(''),
})
export type Demande = z.infer<typeof DemandeSchema>

// Ce que l'IA doit renvoyer.
export const PostSchema = z.object({
  jour: z.string(),
  angle: z.string(),
  texte: z.string(),
})
export const ReponseSchema = z.object({
  posts: z.array(PostSchema),
})
export type Post = z.infer<typeof PostSchema>
