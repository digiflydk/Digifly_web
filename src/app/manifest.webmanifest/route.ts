export function GET() {
  const body = {
    name: "Digifly",
    short_name: "Digifly",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [],
  };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/manifest+json' }
  });
}
