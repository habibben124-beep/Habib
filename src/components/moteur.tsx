import { useState } from 'react'
import { CheckIcon, CopyIcon, FileTextIcon, RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { TONS, type Demande, type Post } from '@/lib/palabra'

export function Moteur() {
  const [posts, setPosts] = useState<Post[] | null>(null)

  if (posts) {
    return <Resultat posts={posts} onRecommencer={() => setPosts(null)} />
  }
  return <Formulaire onResultat={setPosts} />
}

function Formulaire({ onResultat }: { onResultat: (posts: Post[]) => void }) {
  const [demande, setDemande] = useState<Demande>({
    metier: '',
    cible: '',
    ton: 'Professionnel',
    semaine: '',
  })
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  function modifier<K extends keyof Demande>(cle: K, valeur: Demande[K]) {
    setDemande((d) => ({ ...d, [cle]: valeur }))
  }

  async function lireFichier(fichier: File | undefined) {
    if (!fichier) return
    if (fichier.size > 50_000) {
      setErreur('Fichier trop lourd : 50 Ko maximum.')
      return
    }
    const texte = await fichier.text()
    modifier('semaine', (demande.semaine ? demande.semaine + '\n\n' : '') + texte)
  }

  async function envoyer(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      const reponse = await fetch('/api/generer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demande),
      })
      const data = await reponse.json()
      if (!reponse.ok) throw new Error(data.erreur ?? 'Erreur inconnue.')
      onResultat(data.posts)
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Erreur inconnue.')
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form onSubmit={envoyer} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="metier">Ton métier</FieldLabel>
          <Input
            id="metier"
            required
            maxLength={200}
            placeholder="Ex. : graphiste freelance spécialisée en identité visuelle"
            value={demande.metier}
            onChange={(e) => modifier('metier', e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="cible">Tes clients</FieldLabel>
          <Input
            id="cible"
            required
            maxLength={300}
            placeholder="Ex. : artisans et commerçants qui lancent leur marque"
            value={demande.cible}
            onChange={(e) => modifier('cible', e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="ton">Ton des posts</FieldLabel>
          <NativeSelect
            id="ton"
            value={demande.ton}
            onChange={(e) => modifier('ton', e.target.value as Demande['ton'])}
          >
            {TONS.map((ton) => (
              <NativeSelectOption key={ton} value={ton}>
                {ton}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="semaine">Ta semaine (facultatif)</FieldLabel>
          <Textarea
            id="semaine"
            rows={6}
            maxLength={8000}
            placeholder="Un projet livré, une question de client, une idée… ou colle un texte que tu as écrit."
            value={demande.semaine}
            onChange={(e) => modifier('semaine', e.target.value)}
          />
          <FieldDescription>
            Tu peux aussi importer un fichier texte (.txt ou .md).
          </FieldDescription>
          <Button variant="outline" asChild className="w-fit">
            <label className="cursor-pointer">
              <FileTextIcon />
              Importer un fichier
              <input
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                className="sr-only"
                onChange={(e) => {
                  void lireFichier(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </label>
          </Button>
        </Field>

        {erreur && (
          <p role="alert" className="text-sm text-destructive">
            {erreur}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={enCours}
          className="h-11 w-full text-base sm:w-auto sm:px-6"
        >
          {enCours ? (
            <>
              <Spinner /> Rédaction en cours…
            </>
          ) : (
            'Écrire mes posts de la semaine'
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}

function Resultat({
  posts,
  onRecommencer,
}: {
  posts: Post[]
  onRecommencer: () => void
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Tes {posts.length} posts de la semaine
        </h2>
        <Button variant="outline" onClick={onRecommencer}>
          <RotateCcwIcon /> Recommencer
        </Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <CartePost key={post.jour + post.angle} post={post} />
        ))}
      </div>
    </div>
  )
}

function CartePost({ post }: { post: Post }) {
  const [copie, setCopie] = useState(false)

  async function copier() {
    await navigator.clipboard.writeText(post.texte)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">{post.jour}</p>
          <CardTitle className="mt-1">{post.angle}</CardTitle>
        </div>
        <Button size="sm" onClick={copier} className="shrink-0">
          {copie ? <CheckIcon /> : <CopyIcon />}
          {copie ? 'Copié' : 'Copier'}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-6 text-sm break-words whitespace-pre-line text-muted-foreground">
          {post.texte}
        </p>
      </CardContent>
    </Card>
  )
}
