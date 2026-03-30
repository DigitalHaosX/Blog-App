---
applyTo: "src/**/*.tsx,src/**/*.ts"
description: "HeroUI v2 and Tailwind CSS v4 coding conventions for the blog-app. Enforces design system usage, auth wiring patterns, and Firestore access patterns."
---

# Blog-App: HeroUI & Code Conventions

## UI Library: HeroUI v2

Import from `@heroui/react`. Never import from `@nextui-org/react` (that is v1).

```tsx
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
```

### Preferred Components

| Use case      | Component                                                                         |
| ------------- | --------------------------------------------------------------------------------- | -------- | ----- | ------- |
| Buttons       | `<Button color="primary" variant="solid                                           | bordered | light | flat">` |
| Text inputs   | `<Input label="..." variant="bordered" isInvalid={!!error} errorMessage={error}>` |
| Textareas     | `<Textarea label="..." variant="bordered" minRows={4}>`                           |
| Article card  | `<Card isPressable isHoverable>` with `CardHeader`, `CardBody`, `CardFooter`      |
| Modals        | `useDisclosure()` hook + `<Modal>` + `<ModalContent>` render-prop                 |
| Dropdowns     | `<Dropdown>` with `<DropdownTrigger>` and `<DropdownMenu>`                        |
| Loading state | `<Spinner color="primary" size="lg">` (full-page) or `isLoading` prop on Button   |
| User avatar   | `<Avatar name={user.email} size="sm">`                                            |
| Tags / labels | `<Chip color="primary" variant="flat" size="sm">`                                 |
| Empty state   | Centered `<div>` with `<p className="text-default-500">`                          |

### Color Token Reference

Always prefer HeroUI semantic tokens over raw Tailwind hex values:

| Token                | Usage                             |
| -------------------- | --------------------------------- |
| `text-foreground`    | Main body text                    |
| `text-default-500`   | Muted / secondary text            |
| `text-primary`       | Accent / link text                |
| `text-danger`        | Error messages                    |
| `text-success`       | Success messages                  |
| `bg-default-100`     | Subtle background (cards, inputs) |
| `bg-content1`        | Card / surface background         |
| `border-default-200` | Divider / border                  |

## Tailwind CSS v4 Conventions

- Mobile-first responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Standard page container: `container mx-auto max-w-5xl px-4 py-8`
- Standard card spacing: `p-4` or `p-6` inside `CardBody`
- Use `gap-4` / `gap-6` for flex/grid gaps (not `space-x-*` on grids)
- No `style={{}}` inline styles except the `/gift` easter egg

## Auth Wiring

Always obtain the current user from context, never hardcode IDs:

```tsx
const { user } = useAuthContext();

// Writing to Firestore:
await addDoc(collection(db, "articles"), {
  ...formData,
  authorId: user!.uid,
  createdAt: serverTimestamp(),
});

// Conditional UI:
{
  user?.uid === article.authorId && <Button color="danger">Delete</Button>;
}
```

## Firestore Access Patterns

| Task             | Preferred method                                                           |
| ---------------- | -------------------------------------------------------------------------- |
| Fetch single doc | `getDoc(doc(db, "articles", id))`                                          |
| Fetch collection | `getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc")))` |
| Real-time list   | `onSnapshot(...)` with cleanup in `useEffect` return                       |
| Filtered query   | `query(collection(db, "comments"), where("articleId", "==", id))`          |
| Write            | `addDoc` (auto-ID) or `setDoc` (known ID)                                  |
| Update           | `updateDoc(doc(db, "articles", id), { ...fields })`                        |
| Delete           | `deleteDoc(doc(db, "articles", id))`                                       |

## Protected Routes

Wrap authenticated-only pages with `<ProtectedRoute>`:

```tsx
// App.tsx
<Route path="/create" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
<Route path="/edit/:id" element={<ProtectedRoute><EditArticle /></ProtectedRoute>} />
```

`ProtectedRoute` **must** handle the auth loading state. Firebase Auth takes 300–800ms to initialize after page load — without this check, authenticated users get incorrectly redirected to `/login`.

```tsx
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
```

## Tailwind CSS v4 Setup

This project uses Tailwind v4. The `src/index.css` entry file must use:

```css
@import "tailwindcss";
@config "../tailwind.config.js";
```

Do **not** use the legacy `@tailwind base/components/utilities` directives — they are v3 syntax and will prevent HeroUI's CSS variables from loading.

## Firebase Storage Bucket

New Firebase projects use the `firebasestorage.app` domain (not `appspot.com`):

```ts
storageBucket: "<project-id>.firebasestorage.app";
```

## Dark Mode

HeroUI dark mode is activated by adding `class="dark"` to the `<html>` element in `index.html`. Do not use Tailwind's `dark:` variants for theming — HeroUI handles it via CSS variables.

## Component File Structure

```
// 1. Imports (react, heroui, router, services, types)
// 2. Props interface
// 3. Component function
//   a. hooks (useState, useEffect, context)
//   b. derived state / handlers
//   c. JSX return
```

## Naming Conventions

- Components: `PascalCase` — `ArticleCard.tsx`
- Services: `camelCase` — `articleService.ts`
- Custom hooks: `use` prefix — `useAuthContext.ts`
- Types: `PascalCase` interfaces in `src/types/index.ts`

## Do Not

- Do not install new dependencies — the project already has HeroUI, Tailwind, Firebase, React Router
- Do not use `@nextui-org/react` imports (v1)
- Do not bypass `ProtectedRoute` for write operations
- Do not use raw `<button>`, `<input>`, or `<select>` HTML elements; always use HeroUI equivalents
- Do not repeat Firestore collection name strings — extract to constants if used in multiple files
