import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mentions-legales')({
  component: MentionsLegales,
})

function MentionsLegales() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Mentions légales</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <div>
          <h2 className="font-semibold text-foreground">Éditeur du site</h2>
          <p className="mt-2">
            [Nom ou raison sociale] — [Adresse] — SIRET : [numéro]
            <br />
            Contact : [adresse email]
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Hébergement</h2>
          <p className="mt-2">
            Vercel Inc. — [adresse à vérifier à l’étape 7]
          </p>
        </div>
      </div>
    </section>
  )
}
