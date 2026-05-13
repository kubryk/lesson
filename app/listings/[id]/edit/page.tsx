export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { getListing } from '@/lib/actions/listings'
import { createClient } from '@/lib/supabase/server'
import { ListingForm } from '@/components/listings/listing-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const listing = await getListing(id)
  if (!listing) notFound()
  if (listing.user_id !== user.id) redirect(`/listings/${id}`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Редагувати оголошення</h1>
      <ListingForm listing={listing} />
    </div>
  )
}
