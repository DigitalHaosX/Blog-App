# Blog App — TODO

## Completed ✅

### UI Overhaul (2026-03-27)

- [x] Install `react-icons` package
- [x] Add "Plus Jakarta Sans" Google Font via `<link>` in `index.html`
- [x] Configure `@theme { --font-sans }` in `index.css` for Tailwind v4
- [x] Create `src/context/ThemeContext.tsx` — `ThemeProvider` + `useTheme()` hook
- [x] Wrap app in `ThemeProvider` in `src/main.tsx`
- [x] **Navbar**: add dark/light theme toggle button (sun/moon icon via `react-icons/fi`)
- [x] **Navbar**: add GitHub, Twitter/X, LinkedIn social icon buttons (desktop + mobile menu)
- [x] **Home page**: change article grid to single column (`grid-cols-1`)
- [x] **ArticleCard**: rewrite to horizontal full-width layout (`bg-default-100`, `border-l-4 border-primary`)
- [x] **ArticleCard**: add hover effect (`hover:shadow-xl hover:-translate-y-1 transition-all duration-200`)
- [x] **ArticleCard**: "Read more" button with `hover:scale-105 transition-transform`
- [x] **RatingStars**: add `hoverValue` state for preview fill before clicking
- [x] **RatingStars**: replace `★` text with `FaStar` / `FaRegStar` icons from `react-icons/fa`
- [x] **RatingStars**: show "✓ Rated!" success chip after submitting; disable re-rating
- [x] **RatingStars**: `hover:scale-125` animation per star; "Sign in to rate" hint when logged out
- [x] **ArticleForm**: validate → open HeroUI confirmation modal ("Ready to publish?") → confirm fires `createArticle()`
- [x] **CommentForm**: validate → open HeroUI confirmation modal ("Post this comment?") → confirm fires `addComment()`
- [x] **CommentForm / ArticleForm**: submit buttons with `hover:scale-105 transition-transform`

---

## In Progress 🔄

_Nothing currently in progress_

---

## Backlog 📋

### Social Links

- [ ] Create `src/config/social.ts` constants file to make social URLs easily configurable
- [ ] Replace placeholder GitHub/Twitter/LinkedIn URLs in Navbar with real profile links

### Features

- [ ] Add article image upload support (`imageUrl` field exists in Article type but unused)
- [ ] Show author name instead of `authorId` in article cards (requires user profile lookup)
- [ ] Add article tags/categories for filtering
- [ ] Implement article search bar
- [ ] Add pagination or infinite scroll for the article list
- [ ] Add "Edit" / "Delete" article buttons on ArticleDetails page (for article owner)

### UX

- [ ] Add toast notifications on successful publish / comment post (instead of modal only)
- [ ] Add skeleton loading cards while articles are fetching
- [ ] Add article read time estimate
- [ ] Add comment count chip to ArticleCard

### Performance

- [ ] Code-split large bundle (currently 1.2MB pre-gzip)
- [ ] Add route-level lazy loading with `React.lazy`

### Testing

- [ ] Write tests for `ThemeContext` toggle and localStorage persistence
- [ ] Write tests for `RatingStars` hover state and submitted state
- [ ] Write tests for `ArticleForm` confirmation modal flow
- [ ] Write tests for `CommentForm` confirmation modal flow
- [ ] Fix pre-existing unused import warnings in `Navbar.test.tsx` and `Login.test.tsx`
- [ ] Fix `vite.config.ts` Vitest type annotation (`/// <reference types="vitest" />`)

### Code Quality

- [ ] Move social link URLs to a `src/config/social.ts` constants file
- [ ] Add `aria-label` to all icon-only interactive elements (partially done)
- [ ] Add `ErrorBoundary` wrapper around main routes
