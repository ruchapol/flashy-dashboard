## Flashy Dashboard — MongoDB Schema (MVP)

Collections:
- `users`
- `posts`
- `comments`
- `likes`

---

## 1. `users` collection

```json
{
  "_id": "ObjectId",
  "username": "math_nerd",
  "email": "you@example.com",
  "password_hash": "argon2id:...",
  "role": "user",             // "user" | "admin"
  "created_at": "ISODate"
}
```

**Indexes**
- Unique: `username`
- Unique: `email`

---

## 2. `posts` collection

```json
{
  "_id": "ObjectId",
  "author_id": "ObjectId",          // ref users._id
  "equation_text": "sin(x)/x",
  "x_min": -10,
  "x_max": 10,
  "y_min": -5,
  "y_max": 5,
  "y_auto": true,
  "caption": "My cool sinc function",
  "created_at": "ISODate",
  "like_count": 12,
  "comment_count": 3
  // "snapshot_url": null          // reserved for later
}
```

**Indexes**
- `{ created_at: -1, _id: -1 }` (cursor-based timeline)
- Optional: `{ author_id: 1, created_at: -1 }` (profile pages later)

---

## 3. `comments` collection

```json
{
  "_id": "ObjectId",
  "post_id": "ObjectId",       // ref posts._id
  "author_id": "ObjectId",     // ref users._id
  "text": "Nice graph!",
  "created_at": "ISODate"
}
```

**Indexes**
- `{ post_id: 1, created_at: 1 }`
- Optional: `{ author_id: 1, created_at: -1 }`

---

## 4. `likes` collection

```json
{
  "_id": "ObjectId",
  "post_id": "ObjectId",     // ref posts._id
  "user_id": "ObjectId",     // ref users._id
  "created_at": "ISODate"
}
```

**Indexes**
- Unique: `{ post_id: 1, user_id: 1 }`
- `{ user_id: 1, created_at: -1 }` (for “posts I liked” later)

---

## 5. Denormalization strategy

- `posts.like_count` and `posts.comment_count` are denormalized counters.
- Update them with atomic `$inc` on like/unlike and comment create/delete.
- Timeline reads only from `posts` without aggregations for counts.

