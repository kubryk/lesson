import Link from 'next/link'
import { Suspense } from 'react'
import { AuthButton } from '@/components/auth-button'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { hasEnvVars } from '@/lib/utils'
import { EnvVarWarning } from '@/components/env-var-warning'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/">Дошка оголошень</Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4">
          <h1 className="text-4xl font-bold">Дошка оголошень</h1>
          <p className="text-muted-foreground max-w-md text-lg">
            Розміщуйте та знаходьте оголошення про продаж, оренду, послуги та роботу.
          </p>
          <Button asChild size="lg">
            <Link href="/listings">Переглянути оголошення</Link>
          </Button>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  )
}
