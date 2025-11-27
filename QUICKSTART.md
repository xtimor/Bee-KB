# 🚀 Quick Start Guide

Get Bee KB running in 5 minutes!

## Prerequisites

- Docker & Docker Compose installed
- Google account
- 5 minutes of your time

## Step 1: Google Cloud Setup (2 minutes)

1. Go to https://console.cloud.google.com
2. Create a new project (e.g., "Bee KB")
3. Enable APIs:
   - Search "Google Drive API" → Enable
   - Search "Google Docs API" → Enable
4. Create credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Configure consent screen if prompted
   - Application type: "Web application"
   - Name: "Bee KB"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"
   - Copy your **Client ID** and **Client Secret**

## Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

Fill in these values:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_this_command_openssl_rand_base64_32
```

Generate secret:
```bash
openssl rand -base64 32
```

## Step 3: Start the Application (1 minute)

### Option A: Production Mode
```bash
docker-compose up -d
```

### Option B: Development Mode
```bash
docker-compose -f docker-compose.dev.yml up
```

### Option C: Local Development
```bash
npm install
npm run dev
```

Wait for the containers to start...

## Step 4: Initialize Database (30 seconds)

```bash
# Connect to database
docker-compose exec db psql -U beeuser -d beekb

# Run schema (copy-paste from lib/schema.sql)
# Or execute:
docker-compose exec web sh -c "cat lib/schema.sql | docker-compose exec -T db psql -U beeuser -d beekb"
```

## Step 5: Access the Application (30 seconds)

1. Open browser: http://localhost:3000
2. Click "Sign in with Google"
3. Authorize the application
4. Click "Create Knowledge Base"
5. Enter your Google Drive folder ID:
   - Open any folder in Google Drive
   - Copy ID from URL: `drive.google.com/drive/folders/[THIS_IS_THE_ID]`
   - Paste the ID
6. Done! 🎉

## Common Issues

### "Redirect URI mismatch"
→ Add `http://localhost:3000/api/auth/callback/google` to Google Console

### "Cannot connect to database"
→ Wait 30 seconds for PostgreSQL to start, then retry

### "Unauthorized"
→ Check your Client ID and Secret are correct

## Next Steps

- Add a `.logo` file to your Drive folder for custom branding
- Share the Drive folder with your team
- Enjoy your knowledge base!

## Need Help?

See full documentation:
- **README.md** - Complete setup guide
- **DEVELOPMENT.md** - Developer documentation
- **IMPLEMENTATION_SUMMARY.md** - Technical overview

---

**That's it!** You now have a running corporate knowledge base. 🐝
