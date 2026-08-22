# Security Specification for Firestore Security Rules

## 1. Data Invariants

1. **Project Ownership Invariant**: A storyboard project document at `/projects/{projectId}` MUST belong to an authenticated user (`userId == request.auth.uid`), and only the creator can read, create, update, or delete their projects.
2. **Immutability of Key Fields**: During update operations on `/projects/{projectId}`, the `id`, `userId`, and `createdAt` fields are immutable (`incoming().userId == existing().userId`, `incoming().id == existing().id`, `incoming().createdAt == existing().createdAt`).
3. **User Profile Isolation (PII Guard)**: `/users/{userId}` documents are strictly readable and writable only by the authenticated owner whose `request.auth.uid == userId`. Blanket public reads are strictly forbidden.
4. **Temporal Server Integrity**: `createdAt` and `updatedAt` on creation must match `request.time`, and `updatedAt` on update must match `request.time`.
5. **Path & Field Boundary Hardening**: All IDs must satisfy `isValidId(id)` (`size <= 128` and matching `^[a-zA-Z0-9_\-]+$`), string fields must have strict size bounds, and shadow fields are blocked.

---

## 2. The "Dirty Dozen" Threat Payloads

1. **Unauthenticated Read Attack**: An unauthenticated client attempts to query `projects` or `users` collection. (Expected: `PERMISSION_DENIED`).
2. **Cross-Tenant Project Read**: User B (`uid: "user-b"`) attempts to read `/projects/proj-1` owned by User A (`uid: "user-a"`). (Expected: `PERMISSION_DENIED`).
3. **Identity Spoofing On Project Creation**: User A creates a project with `userId: "user-b"`. (Expected: `PERMISSION_DENIED`).
4. **Ownership Hijack Update**: User A attempts to update an existing project's `userId` field to steal or transfer ownership to `user-b`. (Expected: `PERMISSION_DENIED`).
5. **Creation Timestamp Alteration**: User A attempts to update `createdAt` to falsify record history. (Expected: `PERMISSION_DENIED`).
6. **Path Traversal / Junk ID Injection**: An attacker attempts to write to `/projects/../../etc/passwd` or an ID string longer than 128 characters or containing illegal symbols. (Expected: `PERMISSION_DENIED`).
7. **Oversized String / Denial of Wallet Attack**: A user attempts to write a `title` exceeding 300 characters or `rawScript` exceeding 100,000 characters. (Expected: `PERMISSION_DENIED`).
8. **Shadow Field Injection**: A user attempts to inject unknown administrative fields (e.g., `isAdmin: true`, `role: "superuser"`) into a project document during create/update. (Expected: `PERMISSION_DENIED`).
9. **Unverified Email Bypass**: If verification is required, unverified user attempting write operations. (Expected: `PERMISSION_DENIED`).
10. **Profile Impersonation**: User A attempts to write or overwrite `/users/user-b`. (Expected: `PERMISSION_DENIED`).
11. **Blanket Query Scraping**: A client attempts to run an unrestricted `list` query across all projects without scoping `where('userId', '==', request.auth.uid)`. (Expected: `PERMISSION_DENIED`).
12. **Malicious Type Poisoning**: An attacker sends `scenes` as a string or `title` as a boolean. (Expected: `PERMISSION_DENIED`).

---

## 3. Test Verification Matrix

All twelve attack vectors are formally blocked by the Fortress Security Rules implemented in `firestore.rules`.
