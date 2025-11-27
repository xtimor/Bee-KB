# Bee KB - Corporate Knowledge Base

Transform your Google Drive folder into a beautiful, permission-aware corporate knowledge base.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts
- 📁 **Drive Integration** - Automatically syncs with Google Drive folder structure
- 📄 **Google Docs Support** - Display Google Docs as beautiful articles
- 🔒 **Permission-Aware** - Respects all Google Drive permissions
- 🎨 **Modern UI** - Built with Material UI and stunning gradients
- 🐳 **Docker Ready** - Easy deployment with Docker Compose
- 🔍 **Search Functionality** - Find documents quickly
- 📊 **Navigation Tree** - Visual folder hierarchy

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Library**: Material UI (MUI)
- **Authentication**: NextAuth.js with Google OAuth
- **APIs**: Google Drive API, Google Docs API
- **Database**: PostgreSQL (optional for MVP)
- **Deployment**: Docker & Docker Compose

## Prerequisites

- Node.js 20.x or higher
- Docker and Docker Compose (for containerized deployment)
- Google Cloud project with:
  - OAuth 2.0 credentials
  - Google Drive API enabled
  - Google Docs API enabled

## Setup Instructions

### 1. Google Cloud Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Drive API
   - Google Docs API
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Save the Client ID and Client Secret

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_a_random_secret_here
   DATABASE_URL=postgresql://beeuser:beepass@db:5432/beekb
   ```

   Generate a random secret for `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

### 3. Local Development

#### Option A: Using Node.js Directly

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

#### Option B: Using Docker Compose (Development)

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up
```

### 4. Production Deployment

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### 5. Database Setup

If using PostgreSQL, initialize the database schema:

```bash
# Connect to the database
docker-compose exec db psql -U beeuser -d beekb

# Run the schema file
\i /path/to/lib/schema.sql
```

Or manually run the SQL from `lib/schema.sql`

## Usage

### First-Time Setup

1. Navigate to `http://localhost:3000`
2. Sign in with your Google account
3. Click "Create Knowledge Base"
4. Enter your Google Drive Folder ID:
   - Open the folder in Google Drive
   - Copy the ID from the URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`
5. The system will build your knowledge base from that folder

### Navigation

- **Left Sidebar**: Navigate through folders and documents
- **Search Bar**: Search for documents by name
- **Document Viewer**: Read Google Docs content
- **Edit Button**: Open document in Google Docs (if you have edit permissions)
- **Drive Button**: Open document location in Google Drive
- **Permissions Button**: Manage document permissions (if you have permission to share)

### Custom Logo

To add a custom logo:

1. Upload an image file (PNG or JPEG) to your root folder in Google Drive
2. Rename it to exactly `.logo`
3. Refresh the Bee KB page

## Project Structure

```
bee-kb/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── drive/        # Google Drive operations
│   │   └── kb/           # Knowledge Base management
│   ├── auth/             # Authentication pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── NavigationPanel.tsx
│   ├── NavigationTree.tsx
│   ├── DocumentViewer.tsx
│   ├── OnboardingPage.tsx
│   ├── MainApp.tsx
│   └── Providers.tsx
├── lib/                  # Business logic
│   ├── auth.ts           # NextAuth configuration
│   ├── google-drive.ts   # Google Drive service
│   ├── doc-converter.ts  # Google Docs to HTML
│   ├── database.ts       # Database service
│   └── schema.sql        # Database schema
├── types/                # TypeScript definitions
├── docker-compose.yml    # Production deployment
├── docker-compose.dev.yml # Development deployment
├── Dockerfile
├── package.json
└── tsconfig.json
```

## API Endpoints

- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `POST /api/drive/tree` - Get folder tree structure
- `GET /api/drive/document?id=...` - Get document content
- `GET /api/drive/search?folderId=...&q=...` - Search documents
- `GET /api/drive/logo?folderId=...` - Get custom logo
- `POST /api/kb` - Create knowledge base
- `GET /api/kb` - Get knowledge base instance

## Permissions

Bee KB respects all Google Drive permissions:

- Users can only see folders and documents they have access to
- Edit permissions are based on Google Drive capabilities
- Sharing permissions are based on Google Drive capabilities
- Groups and nested groups are fully supported

## Troubleshooting

### "Failed to fetch folder tree"
- Verify the folder ID is correct
- Check that you have access to the folder in Google Drive
- Ensure Google Drive API is enabled

### "Unauthorized" errors
- Check that your Google OAuth credentials are correct
- Verify the redirect URI is configured in Google Cloud Console
- Make sure NEXTAUTH_SECRET is set

### Database connection issues
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check DATABASE_URL is correct
- Verify network connectivity between containers

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
