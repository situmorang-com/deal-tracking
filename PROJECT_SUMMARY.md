# Pipelines Project - Setup Summary

## What Was Created

This is a standalone SvelteKit project that contains the pipelines/opportunities management feature extracted from the business-card-scanner-sv project.

## Location

`/Users/edmundsitumorang/DEV/pipelines`

## Files Copied

### Main Page
- `src/routes/+page.svelte` - Main pipelines page (from opportunities/+page.svelte)

### Components
- `src/lib/components/PipelineOpportunityForm.svelte` - Form for creating/editing opportunities
- `src/lib/components/ui/DatePicker.svelte` - Custom date picker with weekend highlighting
- `src/lib/components/ui/Input.svelte` - Input component
- `src/lib/components/ui/Label.svelte` - Label component
- `src/lib/components/ui/Textarea.svelte` - Textarea component
- `src/lib/components/ui/Button.svelte` - Button component (created new)

### Utilities & Styles
- `src/lib/utils.ts` - Utility functions (including generateId)
- `src/app.css` - Global styles
- `tailwind.config.js` - Tailwind configuration

### Configuration
- `vite.config.ts` - Vite configuration with Tailwind plugin
- `src/routes/+layout.svelte` - Layout file to import app.css

## Dependencies Installed

- lucide-svelte (icons)
- @internationalized/date (date handling)
- tailwindcss & @tailwindcss/vite (styling)
- nanoid (ID generation)
- tailwind-merge (utility for merging Tailwind classes)
- clsx (conditional classes)

## Running the Project

```bash
cd /Users/edmundsitumorang/DEV/pipelines
npm run dev
```

The app will start on `http://localhost:5175` (or 5176 if 5175 is in use)

## Features Included

- ✅ Pipeline opportunities list view
- ✅ Create/Edit opportunity form with:
  - Deal title and company
  - Deal value (in Rupiah)
  - Expected close date with custom date picker
  - Probability slider
  - Stage selection (Discovery, Qualification, Proposal, Negotiation)
  - Contact search/selection
  - Description field
  - Delete button (for editing)
- ✅ Custom DatePicker with:
  - Weekend highlighting (Saturday/Sunday in red)
  - Quick actions (Today, 1d, 1w, 1mo)
  - ESC key support
  - Svelte 5 runes ($state, $derived, $bindable)
- ✅ Dark glassmorphic UI theme
- ✅ Responsive design
- ✅ Currency formatting (Rupiah with commas)

## Notes

- The project uses mock data currently (in +page.svelte)
- Contact management is prepared but needs backend API integration
- Database functionality is not included (can be added later)
- All Svelte 5 runes are used properly for reactivity

## Next Steps (Optional)

1. Add backend API for data persistence
2. Integrate with a database (SQLite, PostgreSQL, etc.)
3. Add authentication/authorization
4. Implement contact management API
5. Add data export features
6. Create dashboard/analytics views
