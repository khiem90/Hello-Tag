# Mail Buddy

Mail Buddy is an elegant mail merge studio. Create beautifully personalized letters, certificates, labels, and envelopes — import your data once, design with care, and export polished documents in minutes.

https://github.com/user-attachments/assets/placeholder

## Features

- Drag-and-drop merge editor with a live preview; arrow keys nudge selections for pixel-level placement.
- Customize visibility, font size, color, background theme, and text alignment for every block.
- Accent color palette plus custom picker to match your branding.
- Ready-made templates for common use cases like certificates, client letters, and event labels.
- Sign in to save your designs and export documents faster.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start designing.

### Environment variables

Create a `.env.local` file with your Firebase web app config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

You can copy these values from the Firebase console under **Project Settings → General → Your apps**. Enable Google as a provider inside **Build → Authentication → Sign-in method** so the web app can offer “Sign in with Google”.

### Linting

```bash
npm run lint
```

## Tech Stack

- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [`react-draggable`](https://github.com/react-grid-layout/react-draggable)

## License

MIT
