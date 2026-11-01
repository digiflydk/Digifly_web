# Visual assets

The homepage mixes generated photographic concepts, code-rendered interface mockups and one illustrative AI scene. None of the visuals depicts a verified Digifly client, actual client data or a documented customer system. The page identifies them as **Konceptbilleder og illustrative systemvisninger**.

## Generated photographic concepts

The coordinator created the images with the built-in image generation tool. The original PNGs remain in the generation output; only lightweight WebP versions are included in public/images. Conversion uses the existing Sharp dependency, quality 84, without resizing or cropping the source. Browser cropping uses object-fit.

| File | Dimensions | Size | Creative direction summary |
| --- | --- | --- | --- |
| hero-workshop.webp | 1536 × 1024 | 91,966 bytes | Quiet Scandinavian workspace, hands discussing a digital solution, paper sketches and laptop; no identifiable company or client |
| warehouse.webp | 1536 × 1024 | 141,286 bytes | Warehouse task with handheld scanner, shelves and neutral cartons; no identifiable client or operational data |
| retail-labels.webp | 1536 × 1024 | 141,642 bytes | Neutral beverage packaging, blank label stock and material samples in natural light; no brand, certification or compliance claims |

The summaries describe the generation brief, not verbatim prompts. The hero image loads eagerly; the two case photographs use native lazy loading. Explicit image dimensions reserve layout space. Total image payload is approximately 366 KiB.

## Native interface visuals

interface-preview.tsx contains illustrative connection, development, planning, omnichannel and task-board views. They are visual examples, not functional app controls, product screenshots or customer evidence. Text uses generic tasks, with no names, dates, result metrics or customer records. Fondsresearch uses an editorial document composition. The existing AI illustration remains the sole pastel scene on the homepage.
