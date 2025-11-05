'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <h1 className="text-3xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm text-muted-foreground">
                {error.message || 'An unexpected error occurred.'}
            </p>
            <button
                onClick={() => reset()}
                className="inline-block mt-8 text-primary underline"
            >
                Try again
            </button>
        </div>
    </main>
  )
}
