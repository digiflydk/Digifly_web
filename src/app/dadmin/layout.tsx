
export default function DadminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="bg-card border-b">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight text-primary">Digifly CMS</h1>
              <span className="text-sm text-muted-foreground">v1.0.13</span>
            </div>
          </header>
          <main className="flex-1 max-w-4xl mx-auto w-full py-10 px-6">{children}</main>
          <footer className="text-center text-muted-foreground text-sm py-4 border-t">
            © {new Date().getFullYear()} Digifly — Admin Console
          </footer>
        </div>
      </body>
    </html>
  );
}
