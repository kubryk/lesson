'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import type { SortOption } from '@/lib/types'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Спочатку нові',
  oldest: 'Спочатку старі',
  price_asc: 'Ціна: від низької',
  price_desc: 'Ціна: від високої',
}

export function ListingsSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = (searchParams.get('sort') as SortOption) ?? 'newest'

  function setSort(sort: SortOption) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {SORT_LABELS[current]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => setSort(opt)}
            className={current === opt ? 'font-medium' : ''}
          >
            {SORT_LABELS[opt]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
