
An index of great learning resources - applicable for career development in software and engineering leadership.

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/johnpfeiffer/links-app/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/johnpfeiffer/links-app/tree/main)

# File Layout

- `KERNEL/`: human only authoring of invariants and requirements
- `cloud-deploy.sh`: deploys the `app/` directory to the hosting repo.
- `app/`: the deployable application (see below).

## App Directory (`app/`)

- `index.html`: HTML entry point.
- `package.json`: dependencies and scripts.
- `vite.config.js`: Vite build configuration.
- `src/index.jsx`: app entry point (mounts React).
- `src/App.jsx`: router + theme; wires the top-level routes.
- `src/components/`: UI modules (e.g., `HomePage.jsx`, `SourcesPage.jsx`, `LinksSection.jsx`).
- `src/lib/`: app helpers (`parseUrlPath`).
- `src/models/`: data models and collection helpers (`tag.js`, `tags.js`, `link.js`, `links.js`).
- `src/content/`: JSON data sources loaded at runtime.
- Hidden chat MVP: UI route `/_chat` or `/:app/_chat`; backend API route `POST /links/chat`.

## Content Schema

This application depends on the remote resource of "favorites" on github, but as a fallback has locally cached content

Each link entry in `src/content/*.json` uses this shape:

```json
{
      "title": "Lex Fridman: Gustav Soderstrom on AI in Spotify Music",
      "url": "https://lexfridman.com/gustav-soderstrom/",
      "published": "2019-07-29",
      "tags": [
        "AI",
        "Machine Learning",
        "Podcast"
      ]
    },


{
  "title": "Example title",
  "url": "https://example.com",
  "alternate-url": "https://web.archive.org/example.com",
  "published": "2024-06-28",
  "tags": ["Example", "Tag2"]
}
```

## Development

```bash
cd app
npm install
npm run dev
```

## Testing

```bash
cd app
npm test
npm run test:vitest
```

Also see <https://blog.john-pfeiffer.com/ai-opportunities-need-improved-spec-driven-development-with-tla/>

## Application Flow

```mermaid
flowchart TD
  A[index.jsx<br/>createRoot] --> B[App.jsx<br/>ThemeProvider and RouterProvider]
  B --> C[createBrowserRouter<br/>root loader + nested routes]
  C --> D[linksRootLoader<br/>defer Link.loadAll]
  D --> E[Link.loadAll<br/>import.meta.glob JSON]
  E --> F[Normalize links<br/>Tag.fromLabel]
  C --> G[HomePage.jsx or SourcesPage.jsx]
  G --> H[useRouteLoaderData]
  H --> I[Await and Suspense]
  I --> J[AllTagsSection<br/>tag list]
  I --> K[LinksSection<br/>filters and count]
  K --> L[LinksList<br/>render items]
  C --> M[ChatPage.jsx<br/>hidden route]
  M --> N[chat model helper<br/>prompt and validation]
  N --> O[Cloudflare Worker<br/>POST /links/chat]
```

See `architecture.md` for the hidden chat system and user journey diagrams.
