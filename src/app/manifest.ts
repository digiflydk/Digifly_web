import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Digifly",
    short_name: "Digifly",
    description: "Flow. Digitalize. Scale.",
    start_url: "/",
    display: "browser",
    background_color: "#f7f7f2",
    theme_color: "#4f46e5",
    lang: "da",
    icons: [
      { src: "/brand/digifly-icon.png", sizes: "64x64", type: "image/png" },
    ],
  };
}
