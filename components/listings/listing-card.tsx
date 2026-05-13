import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, DollarSign } from 'lucide-react'
import type { Listing } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  sale: 'Продаж',
  rent: 'Оренда',
  service: 'Послуги',
  job: 'Робота',
  other: 'Інше',
}

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const date = new Date(listing.created_at).toLocaleDateString('uk-UA')

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2">{listing.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
          <div className="flex items-center justify-between text-sm pt-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              {listing.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {listing.location}
                </span>
              )}
              <span>{date}</span>
            </div>
            {listing.price != null && (
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="h-3 w-3" />
                {listing.price.toLocaleString('uk-UA')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
