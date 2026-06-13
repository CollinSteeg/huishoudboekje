# Huishoudboekje

Webapplicatie om uitgaven en inkomsten per huishoudboekje bij te houden. Gebouwd met React 19, TypeScript, Vite en Firebase (Auth + Firestore).

## Functionaliteit

- Huishoudboekjes aanmaken, bewerken en archiveren/herstellen
- Uitgaven en inkomsten per maand bekijken met statistieken
- Categorieën met budget en visuele waarschuwingen
- Transacties koppelen aan maximaal één categorie
- Real-time updates via Firestore `onSnapshot`

## Vereisten

- Node.js 20+
- Firebase-project met Authentication (e-mail/wachtwoord) en Cloud Firestore

## Installatie

```bash
npm install
cp .env.example .env
```

Vul `.env` met je Firebase Web App-configuratie uit de Firebase Console.

## Ontwikkeling

```bash
npm run dev
```

## Tests

```bash
npm run test:run
npm run test:coverage
```

## Build

```bash
npm run build
```

## Firebase deploy (acceptatie)

1. Installeer de Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Pas `.firebaserc` aan met je project-id
4. Deploy rules, indexes en hosting:

```bash
npm run build
firebase deploy
```

Na deploy is de app bereikbaar op `https://<project-id>.web.app`.

## Firestore-structuur

```
householdBooks/{bookId}
  name, description, ownerId, archived, createdAt

householdBooks/{bookId}/transactions/{txId}
  amount, description, date, categoryId, createdAt

householdBooks/{bookId}/categories/{catId}
  name, maxBudget, endDate, createdAt
```

## Architectuur

- `src/services/` — Firestore-operaties (geen React)
- `src/hooks/` — real-time subscriptions
- `src/components/` — herbruikbare UI
- `src/pages/` — schermen en compositie
