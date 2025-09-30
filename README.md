# Pipelines - Deal Tracking

A sales pipeline management application that helps teams move opportunities from first contact to closed‑won. It combines clear pipeline management with a visual interface where each stage reflects a step in your sales process, giving instant clarity on what's active, stuck, or ready to close.

![Screenshot](static/images/screenshot.jpeg)

## Features

- Create and manage pipeline opportunities
- Track deals through different stages (Discovery, Qualification, Proposal, Negotiation)
- Manage deal values, probabilities, and expected close dates
- Contact management integration
- Beautiful glassmorphic UI with dark theme
- Custom date picker with quick actions
- Responsive design

## Technologies

- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Turso** - Edge SQLite database
- **Drizzle ORM** - Database toolkit
- **Lucide Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Turso account (for deployment)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the root directory:
   ```bash
   TURSO_DATABASE_URL=libsql://your-database-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

### Deployment to Vercel

1. **Create a Turso database:**
   - Sign up at [turso.tech](https://turso.tech)
   - Create a new database
   - Get your database URL and auth token

2. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`

3. **Deploy:**
   - Vercel will automatically deploy on every push to main
   - Your app will be live at your Vercel domain

### Migrating Existing SQLite Data

If you have existing local SQLite data, run the migration script:

```bash
npx tsx migrate-to-turso.ts
```

This will copy all data from your local `pipelines.db` to Turso.

## License

MIT
