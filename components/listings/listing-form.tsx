'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createListing, updateListing } from '@/lib/actions/listings'
import type { Listing } from '@/lib/types'

const CATEGORIES = [
  { value: 'sale', label: 'Продаж' },
  { value: 'rent', label: 'Оренда' },
  { value: 'service', label: 'Послуги' },
  { value: 'job', label: 'Робота' },
  { value: 'other', label: 'Інше' },
]

interface ListingFormProps {
  listing?: Listing
}

export function ListingForm({ listing }: ListingFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (listing) {
        await updateListing(listing.id, formData)
      } else {
        await createListing(formData)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Заголовок *</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={listing?.title}
          placeholder="Коротко опишіть оголошення"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Опис *</Label>
        <textarea
          id="description"
          name="description"
          required
          defaultValue={listing?.description}
          placeholder="Детальний опис..."
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Категорія *</Label>
        <select
          id="category"
          name="category"
          required
          defaultValue={listing?.category ?? ''}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="" disabled>Оберіть категорію</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Ціна</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={listing?.price ?? ''}
            placeholder="Необов'язково"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Місце</Label>
          <Input
            id="location"
            name="location"
            defaultValue={listing?.location ?? ''}
            placeholder="Місто або район"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Збереження...' : listing ? 'Зберегти зміни' : 'Опублікувати'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Скасувати
        </Button>
      </div>
    </form>
  )
}
