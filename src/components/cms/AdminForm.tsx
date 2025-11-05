
"use client";

import { useState } from "react";

export default function AdminForm() {
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [homeHeadline, setHomeHeadline] = useState("");

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Logo URL</label>
        <input className="w-full border rounded px-3 py-2" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Favicon URL</label>
        <input className="w-full border rounded px-3 py-2" value={faviconUrl} onChange={e=>setFaviconUrl(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Home Headline</label>
        <input className="w-full border rounded px-3 py-2" value={homeHeadline} onChange={e=>setHomeHeadline(e.target.value)} />
      </div>
      <p className="text-sm text-gray-500">Placeholder CMS form (DGF-042 will wire saving).</p>
    </form>
  );
}
