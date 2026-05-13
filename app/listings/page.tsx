export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/listings/listing-card'
import { ListingsFilters } from '@/components/listings/listings-filters'
import { ListingsSort } from '@/components/listings/listings-sort'
import { getListings } from '@/lib/actions/listings'
import { createClient } from '@/lib/supabase/server'
import type { ListingFilters, SortOption } from '@/lib/types'

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const filters: ListingFilters = {
    search: params.search || undefined,
    category: params.category as ListingFilters['category'] || undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    location: params.location || undefined,
  }

  const sort = (params.sort as SortOption) || 'newest'
  const listings = await getListings(filters, sort)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Оголошення</h1>
        {user && (
          <Button asChild>
            <Link href="/listings/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Додати оголошення
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Suspense>
          <ListingsFilters />
        </Suspense>
        <Suspense>
          <ListingsSort />
        </Suspense>
      </div>

      {listings.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">Оголошень не знайдено</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
