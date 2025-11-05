import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex h-[calc(100vh-10rem)] items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The resource you’re looking for does not exist.
        </p>
        <Link href="/" className="inline-block mt-8 text-primary underline">Go home</Link>
      </div>
    </main>
  );
}
