'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const CATEGORIES = [
  { value: '', label: 'Усі категорії' },
  { value: 'sale', label: 'Продаж' },
  { value: 'rent', label: 'Оренда' },
  { value: 'service', label: 'Послуги' },
  { value: 'job', label: 'Робота' },
  { value: 'other', label: 'Інше' },
]

export function ListingsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`/listings?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = () => router.push('/listings')

  const hasFilters = ['search', 'category', 'minPrice', 'maxPrice', 'location'].some(
    (k) => searchParams.get(k)
  )

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        placeholder="Пошук..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => updateParam('search', e.target.value)}
        className="w-44"
      />

      <select
        value={searchParams.get('category') ?? ''}
        onChange={(e) => updateParam('category', e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <Input
        type="number"
        placeholder="Ціна від"
        defaultValue={searchParams.get('minPrice') ?? ''}
        onChange={(e) => updateParam('minPrice', e.target.value)}
        className="w-28"
      />

      <Input
        type="number"
        placeholder="Ціна до"
        defaultValue={searchParams.get('maxPrice') ?? ''}
        onChange={(e) => updateParam('maxPrice', e.target.value)}
        className="w-28"
      />

      <Input
        placeholder="Місто"
        defaultValue={searchParams.get('location') ?? ''}
        onChange={(e) => updateParam('location', e.target.value)}
        className="w-36"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
          <X className="h-4 w-4" />
          Скинути
        </Button>
      )}
    </div>
  )
}
