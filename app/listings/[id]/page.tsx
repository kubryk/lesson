export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, DollarSign, Calendar, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeleteListingButton } from '@/components/listings/delete-listing-button'
import { getListing } from '@/lib/actions/listings'
import { createClient } from '@/lib/supabase/server'

const CATEGORY_LABELS: Record<string, string> = {
  sale: 'Продаж',
  rent: 'Оренда',
  service: 'Послуги',
  job: 'Робота',
  other: 'Інше',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === listing.user_id

  const date = new Date(listing.created_at).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="secondary">{CATEGORY_LABELS[listing.category] ?? listing.category}</Badge>
          <h1 className="text-2xl font-bold">{listing.title}</h1>
        </div>
        {isOwner && (
          <div className="flex gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href={`/listings/${id}/edit`}>
                <Pencil className="h-4 w-4" />
                Редагувати
              </Link>
            </Button>
            <DeleteListingButton id={id} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {listing.price != null && (
          <span className="flex items-center gap-1 text-foreground font-semibold text-lg">
            <DollarSign className="h-4 w-4" />
            {listing.price.toLocaleString('uk-UA')}
          </span>
        )}
        {listing.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {date}
        </span>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{listing.description}</p>
      </div>

      <Button asChild variant="outline">
        <Link href="/listings">← До списку</Link>
      </Button>
    </div>
  )
}
