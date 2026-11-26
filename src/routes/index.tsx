import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckIcon } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: Home })

const etapes = [
  {
    titre: 'Parle de ton activité.',
    texte:
      'Ton métier, tes clients, ce qui s’est passé cette semaine. Quelques lignes suffisent, ou colle un texte.',
  },
  {
    titre: 'Palabra écrit pour toi.',
    texte:
      'En moins d’une minute, tes publications de la semaine sont rédigées, avec ton ton.',
  },
  {
    titre: 'Copie, colle, publie.',
    texte:
      'Un clic par post. Tu es présent chaque semaine, sans y passer tes soirées.',
  },
]

const inclus = [
  'Tes posts LinkedIn de la semaine, prêts à coller',
  '5 posts par génération',
  '30 générations par mois',
  'Ton style et ton métier respectés',
  'Sans engagement, annulable en un clic',
]

const questions = [
  {
    q: 'Pour quel réseau ?',
    r: 'LinkedIn. Palabra est pensé pour ses formats : accroche courte, phrases aérées, appel à réagir.',
  },
  {
    q: 'Les posts vont-ils sonner comme moi ?',
    r: 'Oui. Tu décris ton activité et ton ton, et Palabra écrit à partir de ça. Tu peux tout retoucher avant de publier.',
  },
  {
    q: 'Est-ce que Palabra publie à ma place ?',
    r: 'Non. Tu gardes le contrôle : tu copies et tu publies toi-même.',
  },
  {
    q: 'Puis-je arrêter quand je veux ?',
    r: 'Oui. Pas d’engagement : tu annules depuis ton espace, et l’abonnement s’arrête à la fin du mois payé.',
  },
]

function BoutonCommencer({ children }: { children: React.ReactNode }) {
  return (
    <Button asChild size="lg" className="h-11 w-full px-6 text-base sm:w-auto">
      <Link to="/" hash="prix">
        {children}
      </Link>
    </Button>
  )
}

function Home() {
  return (
    <>
      {/* Titre + promesse */}
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-16 sm:pt-24 sm:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Tes publications de la semaine,{' '}
            <span className="text-primary">prêtes à poster.</span>
          </h1>
          <p className="mt-5 text-lg text-pretty text-muted-foreground sm:text-xl">
            Tu es freelance et tu n’as pas le temps d’écrire. Dis à Palabra ce
            que tu fais, il rédige tes posts LinkedIn de la semaine. Tu n’as
            plus qu’à copier-coller.
          </p>
          <div className="mt-8">
            <BoutonCommencer>Recevoir mes posts de la semaine</BoutonCommencer>
            <p className="mt-3 text-sm text-muted-foreground">
              49 € par mois · Sans engagement
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Comment ça marche
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {etapes.map((etape, i) => (
              <li key={etape.titre}>
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{etape.titre}</h3>
                <p className="mt-2 text-muted-foreground">{etape.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Prix */}
      <section id="prix" className="scroll-mt-14 border-t">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Un seul prix, tout compris
          </h2>
          <Card className="mt-8 max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">Palabra Pro</CardTitle>
              <CardDescription>
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  49 €
                </span>{' '}
                par mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {inclus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="h-11 w-full text-base">
                Commencer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Questions fréquentes */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions fréquentes
          </h2>
          <Accordion type="single" collapsible className="mt-6 max-w-2xl">
            {questions.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.r}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
