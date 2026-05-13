export type Category = 'sale' | 'rent' | 'service' | 'job' | 'other'
export type Status = 'active' | 'inactive'

export interface Listing {
  id: string
  title: string
  description: string
  category: Category
  price: number | null
  location: string | null
  status: Status
  user_id: string
  created_at: string
  updated_at: string
}

export interface ListingFilters {
  category?: Category
  minPrice?: number
  maxPrice?: number
  location?: string
  search?: string
}

export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc'
