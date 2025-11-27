# Development Guide

## Getting Started

### Prerequisites
- Node.js 20.x
- Docker & Docker Compose
- Google Cloud project with OAuth credentials

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

### Docker Development

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:
- Start the Next.js dev server with hot reload
- Start PostgreSQL database
- Mount your code as a volume for live changes

## Code Structure

### `/app` - Next.js App Router

- **`layout.tsx`**: Root layout with providers
- **`page.tsx`**: Home page with auth redirect
- **`api/`**: API route handlers
- **`auth/signin/`**: Sign-in page

### `/components` - React Components

- **`MainApp.tsx`**: Main application logic
- **`NavigationPanel.tsx`**: Left sidebar with logo, search, tree, and user profile
- **`NavigationTree.tsx`**: Recursive tree view of folders/documents
- **`DocumentViewer.tsx`**: Document display with actions
- **`OnboardingPage.tsx`**: Initial KB creation flow
- **`Providers.tsx`**: Context providers wrapper

### `/lib` - Business Logic

- **`auth.ts`**: NextAuth configuration
- **`google-drive.ts`**: Google Drive API wrapper
- **`doc-converter.ts`**: Convert Google Docs to HTML
- **`database.ts`**: PostgreSQL database service

## API Routes

All API routes use Next.js App Router format with `route.ts` files.

### Authentication: `/api/auth/[...nextauth]/route.ts`
Handles all NextAuth operations (signin, callback, session).

### Drive Operations: `/api/drive/`
- **`tree/route.ts`**: Build folder tree
- **`document/route.ts`**: Fetch document content
- **`search/route.ts`**: Search documents
- **`logo/route.ts`**: Get custom logo

### KB Management: `/api/kb/route.ts`
- `POST`: Create new KB instance
- `GET`: Get user's KB instance

## Adding New Features

### Adding a New API Route

1. Create `app/api/your-feature/route.ts`
2. Implement GET/POST handlers
3. Add authentication check:
   ```typescript
   const session = await getServerSession(authOptions);
   if (!session?.accessToken) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

### Adding a New Component

1. Create `components/YourComponent.tsx`
2. Use `'use client'` directive if using hooks
3. Follow Material UI theming
4. Export default

### Styling Guidelines

- Use MUI's `sx` prop for styling
- Follow the existing color scheme (gradient: `#667eea` to `#764ba2`)
- Use glassmorphism effects for premium look:
  ```typescript
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  ```

## Database

### Schema

Located in `lib/schema.sql`. Tables:
- `kb_instances`: Knowledge base configurations
- `activity_logs`: User activity tracking
- `sync_logs`: Synchronization events

### Migrations

For schema changes:
1. Update `lib/schema.sql`
2. Create migration script if needed
3. Document changes

## Google APIs

### Required Scopes

Defined in `lib/auth.ts`:
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/drive.readonly`
- `https://www.googleapis.com/auth/drive.metadata.readonly`
- `https://www.googleapis.com/auth/documents.readonly`

### Rate Limits

Google Drive API has quotas. Implement caching if needed.

## Testing

### Manual Testing Checklist

- [ ] Sign in with Google
- [ ] Create KB with valid folder ID
- [ ] Navigate folder tree
- [ ] Open document
- [ ] Search functionality
- [ ] Edit document (opens in new tab)
- [ ] Permissions button (if user has permissions)
- [ ] Logo upload and display
- [ ] Sign out

### Error Scenarios

- [ ] Invalid folder ID
- [ ] No access to folder
- [ ] Deleted folder
- [ ] Network errors
- [ ] Invalid OAuth credentials

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Production

```bash
docker-compose build
docker-compose up -d
```

### Environment Variables

Required for production:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL` (your domain)
- `NEXTAUTH_SECRET` (strong random string)
- `DATABASE_URL` (if using database)

## Debugging

### Common Issues

1. **"Cannot find module"** errors
   - Run `npm install`
   - Check import paths use `@/` alias

2. **OAuth errors**
   - Verify redirect URI in Google Console
   - Check credentials

3. **Database connection**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL format

### Logging

Add console.log statements in API routes:
```typescript
console.log('Fetching document:', documentId);
```

View logs:
```bash
# Docker
docker-compose logs -f web

# Local
# Check terminal running npm run dev
```

## Performance Optimization

### Folder Tree

Large folder structures may be slow. Consider:
- Lazy loading subfolders
- Pagination
- Caching responses

### Document Content

- Cache converted HTML
- Implement stale-while-revalidate pattern

## Security

### Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Validate all API inputs
- Check user permissions on every request
- Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive comments

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI](https://mui.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Google Drive API](https://developers.google.com/drive)
- [Google Docs API](https://developers.google.com/docs)
