# Birthday Comic Demo

A comic-inspired birthday microsite by Luca Brandao. This public portfolio edition replaces the private project's family photographs and messages with fictional content and a local SVG illustration.

## Features

- Chapter-based responsive layout and photo lightbox
- Expandable message cards using safe text insertion
- English and European Portuguese interface toggle
- Keyboard controls, reduced-motion support and a skippable opening sequence
- Synthesised browser audio with no external audio service
- A dependency-free Node preview server restricted to localhost

## Run locally

Install a supported Node.js LTS release, then run:

```sh
npm run dev
```

Open http://127.0.0.1:5173. No package installation is needed.

```sh
npm run check
```

## Project layout

| File | Purpose |
| --- | --- |
| `dist/index.html` | Accessible page structure and fictional sample content |
| `dist/style.css` | Responsive comic styling |
| `dist/script.js` | Messages, lightbox, language controls, opening sequence and audio |
| `dist/translations.js` | European Portuguese interface strings |
| `dist/placeholder.svg` | Original neutral illustration for the demo |
| `preview.cjs` | Local preview server |

The `dist` folder is the source of this static site, rather than a generated build folder. It can be hosted as static files. `_headers` provides restrictive headers on hosts that support that format.

## Privacy and scope

The original project and its history remain private. This edition has its own commit history and no connection to a live production project. See [SECURITY.md](SECURITY.md) before adapting it.

## GitHub Pages

Run `npm run build` to regenerate `docs/`, then commit the updated output. In the repository's Pages settings, publish the `main` branch and `/docs` folder. This deployment is separate from the original personal site.

`docs/.nojekyll` preserves the generated static files. The generated HTML includes a resource Content Security Policy and no-referrer policy. GitHub Pages does not apply the `_headers` file used by other hosts, so those host-specific HTTP header settings are not claimed here.
