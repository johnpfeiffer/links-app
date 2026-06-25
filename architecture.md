# Architecture

This document records derived implementation facts. `/KERNEL/` remains the authority.

## System Design

```mermaid
flowchart TD
  User["User opens hidden chat URL"] --> UI["React ChatPage<br/>/_chat or /:app/_chat"]
  UI --> Loader["Root loader<br/>Link.loadAll"]
  Loader --> Links["Existing normalized links"]
  UI --> Prompt["chat model helper<br/>buildChatPrompt"]
  Prompt --> API["POST /links/chat"]
  API --> Worker["Cloudflare Worker chat example"]
  Worker --> Provider["Gemini provider"]
  Provider --> Worker
  Worker --> Parser["parseChatRecommendations"]
  Parser --> Validate["Resolve ids against existing links"]
  Validate --> Render["Render only existing link attributes"]
```

The hidden chat UI route is separate from `/links/chat` because `/links/chat` is the Cloudflare Worker API route in the imported backend example. The UI is reachable at `/_chat` for a root-hosted app and `/:app/_chat` for app-prefixed hosting, such as `/links/_chat`.

## Chat Journey

```mermaid
sequenceDiagram
  participant User
  participant ChatPage
  participant Worker as POST /links/chat
  participant Gemini

  User->>ChatPage: Submit link request
  ChatPage->>ChatPage: Build prompt from loaded links
  ChatPage->>Worker: Send JSON message
  Worker->>Gemini: Provider request
  Gemini-->>Worker: JSON recommendation text
  Worker-->>ChatPage: message and interaction id
  ChatPage->>ChatPage: Parse link ids and validate against loaded links
  ChatPage-->>User: Show grounded recommendations
  ChatPage->>ChatPage: Disable after 2 recommendation answers
```

## Invariant Mapping

- `INV-017`: Chat renders only recommendations whose link ids resolve to currently loaded links. Unknown ids and duplicate ids inside a recommendation are dropped before display.
- `INV-018`: Chat displays `Recommendations used: N / 2` and disables new submissions after two successful recommendation answers.
- `INV-010`: Chat is an unpublished auxiliary route. Published navigation remains in the `/tags` and `/sources` namespaces.
