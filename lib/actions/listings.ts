'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Listing, ListingFilters, SortOption } from '@/lib/types'

export async function getListings(
  filters: ListingFilters = {},
  sort: SortOption = 'newest'
): Promise<Listing[]> {
  const supabase = await createClient()
  let query = supabase.from('listings').select('*').eq('status', 'active')

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.search) query = query.ilike('title', `%${filters.search}%`)
  if (filters.location) query = query.ilike('location', `%${filters.location}%`)
  if (filters.minPrice != null) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice)

  if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'oldest') query = query.order('created_at', { ascending: true })
  else if (sort === 'price_asc') query = query.order('price', { ascending: true, nullsFirst: false })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false, nullsFirst: false })

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Listing[]
}

export async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
  if (error) return null
  return data as Listing
}

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase.from('listings').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    price: formData.get('price') ? Number(formData.get('price')) : null,
    location: (formData.get('location') as string) || null,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/listings')
  redirect('/listings')
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase
    .from('listings')
    .update({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      location: (formData.get('location') as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/listings')
  revalidatePath(`/listings/${id}`)
  redirect(`/listings/${id}`)
}

export async function deleteListing(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/listings')
  redirect('/listings')
}
