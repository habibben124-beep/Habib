import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/remboursement')({
  component: Remboursement,
})

function Remboursement() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">
        Conditions de remboursement
      </h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>
          Palabra est un abonnement mensuel à 49 € par mois, sans engagement.
        </p>
        <p>
          Le mois entamé n’est pas remboursé. Tu peux résilier à tout moment
          depuis ton espace : l’abonnement s’arrête à la fin du mois déjà payé,
          et aucun nouveau prélèvement n’est fait.
        </p>
      </div>
    </section>
  )
}
