import { createFileRoute } from '@tanstack/react-router'

import { Moteur } from '@/components/moteur'

// Page de test du moteur. À l'étape 4, le moteur ira dans /app,
// réservé aux clients connectés, et cette page sera supprimée.
export const Route = createFileRoute('/essai')({ component: Essai })

function Essai() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Moteur />
    </section>
  )
}
