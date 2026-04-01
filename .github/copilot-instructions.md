# Copilot Instructions

## Tech Stack

React 19 + TypeScript, Vite, Tailwind CSS v4, HeroUI v2, Firebase (Firestore, Auth, Storage), React Router v7, Vitest + Testing Library, Recharts.

## Commands

```bash
npm start              # Dev server (http://localhost:5173)
npm run build          # tsc -b && vite build
npm run lint           # ESLint
npm test               # Vitest watch mode
npm test -- --run      # Single run (CI)
npm test -- Home       # Run a single test file by name
npm run test:coverage  # Coverage report
```

## Architecture

**Provider tree** (`main.tsx`): `ThemeProvider → HeroUIProvider → BrowserRouter → AuthProvider → App`

**Route structure** (`App.tsx`):
- Public: `/`, `/article/:id`, `/login`, `/gift`
- Protected (auth required): `/create`, `/edit/:id`, `/dashboard`

**Auth flow**: `AuthProvider` wraps the app and calls Firebase `onAuthStateChanged`, storing `{ user, loading }` in `AuthContext`. `ProtectedRoute` shows a spinner while `loading === true`, then redirects to `/login` if `user` is null.

**Owner-only actions**: `src/config/owner.ts` exports `OWNER_UID` (from `VITE_OWNER_UID` env var) and `canDelete(uid, authorId)`. The dashboard route and article deletion are gated by this helper.

**Service layer** (`src/services/`): All Firebase SDK calls go through service modules — never call Firestore/Auth directly from components. Services return Promises or unsubscribe functions (real-time listeners).

```ts
// Real-time subscription pattern used in components:
useEffect(() => {
  const unsubscribe = subscribeToArticles(setArticles);
  return () => unsubscribe();
}, []);
```

## Firestore Collections

| Collection | Key fields |
|---|---|
| `articles` | `title`, `content`, `authorId`, `createdAt` (Unix ms), `avgRating?`, `imageUrl?` |
| `comments` | `articleId`, `userId`, `text`, `createdAt` |
| `ratings` | `articleId`, `userId`, `value` (1–5) |
| `pageViews` | `articleId`, `timestamp`, `sessionId` (dedupes same-session views) |
| `analytics/summary` | `totalVisitors`, `totalArticleReads` (Cloud Functions only — never write from client) |

## Key Conventions

**Styling**: Tailwind v4 uses `@import "tailwindcss"` in `index.css` (not `@tailwind` directives). Dark mode is toggled via `.dark` class on `<html>`, managed by `ThemeContext` and persisted to `localStorage`. HeroUI components read this automatically.

**HeroUI compound components**: Use the full composition pattern for Modals, Navbars, and Dropdowns:
```tsx
<Modal><ModalContent><ModalHeader /><ModalBody /><ModalFooter /></ModalContent></Modal>
<Dropdown><DropdownTrigger /><DropdownMenu><DropdownItem /></DropdownMenu></Dropdown>
```

**State management**: Context + `useState` only — no Redux or Zustand. Use `useAuthContext()` (throws if outside `AuthProvider`) rather than `useAuth()` in components that require auth. Use HeroUI's `useDisclosure()` for modal open/close state.

**TypeScript**: Shared types live in `src/types/index.ts` (`Article`, `Comment`, `Rating`). Use `import type` for type-only imports. Service functions use `Omit<Article, "id">` for creates and `Partial<Article>` for updates.

**File naming**: Components and pages → `PascalCase.tsx`; hooks → `camelCase.ts` with `use` prefix; services → `camelCase.ts` (e.g., `articleService.ts`); constants → `SCREAMING_SNAKE_CASE`.

## Testing

- Firebase is mocked — see `src/test/setup.ts` and `src/__mocks__/`
- Use `renderWithProviders(ui, { route, authUser })` from `src/test/renderWithProviders.tsx` to render components with auth context and router pre-wired
- Test files use `.test.tsx` suffix or live in `__tests__/` subdirectories alongside the source files

## Environment Variables

Requires a `.env` file with `VITE_FIREBASE_*` keys (see `.env.example`) plus `VITE_OWNER_UID` for owner-gated features.
