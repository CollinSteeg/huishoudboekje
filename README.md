# Huishoudboekje

A household finance web app for tracking income and expenses per book. Built with React 19, TypeScript, Vite, and **Firebase** (Authentication, Firestore, Hosting).

## Features

- Create, edit, archive, and restore household books
- View monthly income and expenses with statistics
- Categories with budgets and visual warnings
- Link transactions to at most one category
- Real-time updates via Firestore `onSnapshot`

## Firebase setup

### 1. Create a Firebase project

In the [Firebase Console](https://console.firebase.google.com/):

1. Create a new project (or use an existing one).
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Create a **Firestore** database (production mode is fine; security rules are included in this repo).
4. Register a **Web app** and copy the config values.

### 2. Configure environment variables

```bash
npm install
cp .env.example .env
```

Fill `.env` with your Firebase Web App config:

| Variable | Firebase Console field |
|---|---|
| `VITE_FIREBASE_API_KEY` | apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |

The app initializes Firebase in `src/lib/firebase.ts` and exports `auth` and `db`.

### 3. Firestore data model

```
householdBooks/{bookId}
  name, description, ownerId, archived, createdAt

householdBooks/{bookId}/transactions/{txId}
  amount, description, date, categoryId, createdAt

householdBooks/{bookId}/categories/{catId}
  name, maxBudget, endDate, createdAt
```

Each book is owned by a single user (`ownerId` = Firebase Auth UID). Transactions and categories are nested subcollections.

### 4. Security rules

Rules live in `firebase/firestore.rules`. Access is restricted to authenticated users who own the book:

- **householdBooks** — read/create/update/delete only for the book owner
- **transactions** and **categories** — read/write only if the parent book belongs to the current user

Deploy rules with `firebase deploy --only firestore:rules`.

### 5. Indexes

`firebase/firestore.indexes.json` defines a composite index on `householdBooks` (`ownerId` + `archived`) for listing active and archived books per user.

Deploy indexes with `firebase deploy --only firestore:indexes`.

## Development

```bash
npm run dev
```

## Tests

```bash
npm run test:run
npm run test:coverage
```

## Build & deploy

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install the CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Set your project ID in `.firebaserc`
4. Build and deploy:

```bash
npm run build
firebase deploy
```

This deploys Firestore rules, indexes, and Hosting. The app is served from the `dist` folder with SPA rewrites (all routes → `index.html`).

After deploy: `https://<project-id>.web.app`

### Take the site offline

Disable Hosting to stop serving the website. Firestore and Auth keep running.

```bash
firebase hosting:disable
```

Confirm when prompted. Visitors get a “site not found” style page.

**Bring it back online:**

```bash
npm run build
firebase deploy --only hosting
```

## Architecture

| Layer | Role |
|---|---|
| `src/lib/firebase.ts` | Firebase app, Auth, and Firestore instances |
| `src/services/` | Firestore CRUD and `onSnapshot` subscriptions (no React) |
| `src/hooks/` | Real-time data hooks wrapping services |
| `src/components/` | Reusable UI |
| `src/pages/` | Screens and composition |

Authentication flows through `src/services/authService.ts` (email/password sign-up, sign-in, sign-out). Data hooks subscribe to Firestore and update the UI automatically when documents change.
