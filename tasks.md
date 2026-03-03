## Flashy Dashboard — Work Tasks (Design → Build)

This file is the running “task log” for building the app.
Check items as they are completed and add notes/links to commits/PRs as needed.

### Product summary

- Web app where users create equations \(y = f(x)\), render graphs with configurable x/y ranges, and post them to a timeline.
- Timeline supports **posts, comments, likes**.
- **Admin** can delete any post.

### Design-first spec (MVP)

#### Primary loop

- Timeline → Create Equation → enter formula + ranges → Preview → add caption → Post → others like/comment.

#### Screens (MVP)

- **Timeline** (`/`): newest-first graph posts; CTA “Create Equation”.
- **Create** (`/create`): equation input, x/y range, preview graph, caption, submit.
- **Post detail** (`/post/:id`): full post + comments.
- **Auth** (`/login`, `/register`): user system.
- **Profile** (`/u/:username`) (optional in MVP; can be Phase 2).

#### Post card contents

- Author (avatar/username), created time
- Rendered graph (canvas/image)
- Pretty formula display + caption
- Like count + comment count
- Actions: like/unlike, comment, share link
- Admin: delete post (confirm modal)

#### Graph rendering (MVP constraints)

- 2D Cartesian, single variable: **\(y = f(x)\)** only.
- Supported ops: `+ - * / ^` and parentheses.
- Supported functions: `sin cos tan asin acos atan log ln exp sqrt abs`.
- Constants: `pi`, `e`. Variable: `x`.
- Safety: limit range size + sample points; friendly validation errors.

### Architecture rules to follow

- Stack: **Vue.js frontend + FastAPI backend + MongoDB**.
- DRY but not over-DRY; open for extension, closed for modification.
- Layering:
  - Frontend components = UI only; feature `api/` modules own HTTP details.
  - Backend routers = request/response wiring; services = business logic; repositories/db = Mongo access.

---

## Phase 0 — Project setup

- [ ] Decide auth method: email/password vs OAuth (Google/GitHub) 
  -> just use email/password only for now!
- [ ] Decide graph library / math parser approach (client-side preview)
- [ ] Decide how graphs are stored:
  - [ ] Store equation+ranges only (render on client every time)
    -> this is ok
  - [ ] Store equation+ranges + snapshot image (recommended for timeline speed)
    -> let's keep this for later

## Phase 1 — Data model + backend foundation (FastAPI + MongoDB)

### Core entities
- [ ] `User`: id, username, email, password_hash, role (`user|admin`), created_at
- [ ] `Post`: id, author_id, equation_text, x_min/x_max, y_min/y_max, y_auto, caption, created_at
- [ ] `Comment`: id, post_id, author_id, text, created_at
- [ ] `Like`: post_id + user_id (unique), created_at

### API (MVP)
- [ ] Auth
  - [ ] `POST /auth/register`
  - [ ] `POST /auth/login`
  - [ ] `POST /auth/logout` (optional)
  - [ ] `GET /me`
- [ ] Posts
  - [ ] `GET /posts?limit=20&cursor=<opaque>` (newest-first)
    -> Decision: use **opaque cursor pagination** (NOT page numbers) for timeline stability.
    -> Sort rule: `created_at desc`, then `_id desc` (tie-breaker).
    -> Cursor payload (server-defined, client treats as opaque): `{ t: last.created_at, id: last._id }`, encoded (e.g., base64url JSON).
    -> Next page query rule: `(created_at < t) OR (created_at == t AND _id < id)`.
  - [ ] `POST /posts` (create post)
  - [ ] `GET /posts/{id}`
  - [ ] `DELETE /posts/{id}` (admin)
- [ ] Likes
  - [ ] `POST /posts/{id}/like`
  - [ ] `DELETE /posts/{id}/like`
- [ ] Comments
  - [ ] `GET /posts/{id}/comments`
  - [ ] `POST /posts/{id}/comments`

### Backend quality & safety
- [ ] Input validation for equation string and ranges
- [ ] Rate limiting / spam controls (simple: per-user per-minute) (optional MVP)
- [ ] Authorization checks:
  - [ ] Only logged-in users can post/like/comment
  - [ ] Only admin can delete any post (and optionally author can delete own)
- [ ] Indexing plan:
  - [ ] `posts.created_at` descending
  - [ ] unique index on likes `(post_id, user_id)`
  - [ ] `comments.post_id` + `created_at`

## Phase 2 — Frontend foundation (Vue)

### App scaffolding
- [ ] Routing: timeline, create, post detail, login/register
- [ ] Global auth state (Pinia/Vuex) + route guards
- [ ] API client layer (fetch/axios wrapper + error handling)

### Timeline
- [ ] Post list (infinite scroll or “Load more”)
  -> let's discus about recycle view that redue the memory usage when user
     scroll through large amount of posts
  -> Decision (MVP): start with **Load more** + small page size (10–20) and only render the current pages.
  -> Decision (scale later): add list virtualization (e.g., `vue-virtual-scroller`) so off-screen post cards are unmounted to reduce DOM/memory usage.
- [ ] Post card component (graph + formula + caption + actions)
- [ ] Like/unlike behavior (optimistic update)
- [ ] Open post detail

### Create Equation
- [ ] Equation input with examples + quick buttons (`sin`, `sqrt`, `^`, `pi`, etc.)
- [ ] Range inputs with defaults
- [ ] Preview rendering (graph canvas)
- [ ] Validate equation and show friendly errors
- [ ] Submit post (with caption)

### Post detail + comments
- [ ] Render full post
- [ ] List comments (pagination optional)
- [ ] Add comment

## Phase 3 — Admin controls

- [ ] Admin role recognition on frontend
- [ ] Delete post UI + confirm modal
- [ ] Backend admin delete endpoint + audit logging (optional)

## Phase 4 — Polish + launch checklist

- [ ] UX polish: loading states, empty states, error toasts
- [ ] Basic moderation/spam controls (optional)
- [ ] Basic analytics (page views, post created) (optional)
- [ ] Deploy plan for frontend + backend + MongoDB (infra)
      -> for now using docker compose & dockerfile
         the nginx configuration & jenkins deployment will be discuss later

