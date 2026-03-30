# Blog App

A full-stack blog application built with React 19, HeroUI v2, Tailwind CSS v4, and Firebase.

## Tech Stack

| Layer             | Technology                          |
| ----------------- | ----------------------------------- |
| UI Framework      | React 19 + TypeScript               |
| Component Library | HeroUI v2 (`@heroui/react`)         |
| Styling           | Tailwind CSS v4                     |
| Build Tool        | Vite 7                              |
| Routing           | React Router DOM v7                 |
| Backend           | Firebase (Auth, Firestore, Storage) |
| Testing           | Vitest + Testing Library            |

## Getting Started

```bash
npm install
npm run start      # dev server at http://localhost:5173
npm test           # run all tests
npm run build      # production build
```

## Project Structure

```
src/
  App.tsx                    # routes + ProtectedRoute wrapping
  main.tsx                   # provider tree: HeroUIProvider → BrowserRouter → AuthProvider
  index.css                  # Tailwind v4 entry (@import "tailwindcss")
  auth/
    AuthContext.ts            # React context type + createContext
    AuthProvider.tsx          # onAuthStateChanged listener, exposes user/loading/logout
    ProtectedRoute.tsx        # shows Spinner while loading, redirects when logged out
    useAuth.ts                # thin wrapper around useAuthContext
    useAuthContext.ts         # throws if used outside AuthProvider
  components/
    ArticleCard.tsx           # Card with date, excerpt, rating chip, "Read more" button
    ArticleForm.tsx           # Create-article form (title + content + validation)
    CommentForm.tsx           # Inline comment input + Post button
    CommentList.tsx           # Lists comments, refreshes via refreshKey prop
    Navbar.tsx                # HeroUI Navbar with avatar dropdown / login button
    RatingStars.tsx           # 1–5 star rating widget
  pages/
    Home.tsx                  # Hero banner + article grid
    ArticleDetails.tsx        # Full article + rating + comments
    CreateArticle.tsx         # Protected — wraps ArticleForm
    EditArticle.tsx           # Protected — loads article, saves edits
    Login.tsx                 # Sign in / Create account
    Gift.tsx                  # Easter egg page
  services/
    firebase.ts               # Firebase app init, exports db/auth/storage
    articleService.ts         # CRUD + real-time subscription for articles
    commentService.ts         # addComment + getCommentsByArticle
    ratingService.ts          # addRating + getRatingsForArticle
  test/
    setup.ts                  # imports @testing-library/jest-dom
    renderWithProviders.tsx   # wraps UI in HeroUIProvider + MemoryRouter + AuthContext
  types/
    index.ts                  # Article, Comment, Rating interfaces
```

## Key Decisions & Changes

### Tailwind CSS v4 Setup

Tailwind v4 uses `@import` syntax instead of the old `@tailwind` directives:

```css
/* src/index.css */
@import "tailwindcss";
@config "../tailwind.config.js";
```

The `@config` line loads the `heroui()` plugin. Without it, all HeroUI CSS variables and utility classes fail to generate.

### Firebase Storage Bucket

New Firebase projects (post-2023) use `firebasestorage.app`, not `appspot.com`:

```ts
storageBucket: "blog-app-506ab.firebasestorage.app";
```

### ProtectedRoute — Auth Loading State

`ProtectedRoute` waits for Firebase Auth to initialize before deciding to redirect. Without this, authenticated users are bounced to `/login` during the 300–800ms Firebase startup window:

```tsx
if (loading) return <Spinner color="primary" size="lg" />;
return user ? <>{children}</> : <Navigate to="/login" replace />;
```

### Dark Theme

HeroUI reads the `.dark` class from `<html>` to switch its CSS variable palette:

```html
<html lang="en" class="dark"></html>
```

### renderWithProviders — Auth-Aware

The shared test helper accepts `authUser` and `authLoading` so tests can simulate any auth state without hitting Firebase:

```tsx
renderWithProviders(<MyComponent />, {
  authUser: { uid: "u1", email: "u@test.com" },
  authLoading: false,
});
```

## Test Coverage

| File                                  | Tests                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/auth/ProtectedRoute.test.tsx`    | spinner while loading, redirect when logged out, renders children when authenticated |
| `src/components/ArticleCard.test.tsx` | title, link, date, preview, rating chip, no-rating fallback, read more button        |
| `src/components/Navbar.test.tsx`      | brand, login button, avatar when logged in, nav links                                |
| `src/pages/Home.test.tsx`             | hero title, empty state, CTA buttons, article cards, article count                   |
| `src/pages/Login.test.tsx`            | inputs, sign in call, error display, register call                                   |

Run tests:

```bash
npm test           # watch mode
npm test -- --run  # single run
npm run test:coverage
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
