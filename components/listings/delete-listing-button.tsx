'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteListing } from '@/lib/actions/listings'
import { Trash2 } from 'lucide-react'

interface DeleteListingButtonProps {
  id: string
}

export function DeleteListingButton({ id }: DeleteListingButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Видалити це оголошення?')) return
    startTransition(() => deleteListing(id))
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? 'Видалення...' : 'Видалити'}
    </Button>
  )
}
