# Bee KB MVP - Deployment Checklist

## ✅ Pre-Deployment Checklist

### Google Cloud Setup
- [ ] Create Google Cloud project
- [ ] Enable Google Drive API
- [ ] Enable Google Docs API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Copy Client ID
- [ ] Copy Client Secret

### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `GOOGLE_CLIENT_ID`
- [ ] Set `GOOGLE_CLIENT_SECRET`
- [ ] Set `NEXTAUTH_URL` (e.g., `http://localhost:3000`)
- [ ] Generate `NEXTAUTH_SECRET` using `openssl rand -base64 32`
- [ ] Set `DATABASE_URL` (default: `postgresql://beeuser:beepass@db:5432/beekb`)

### Docker Setup
- [ ] Install Docker
- [ ] Install Docker Compose
- [ ] Verify Docker is running: `docker --version`
- [ ] Verify Docker Compose is running: `docker-compose --version`

### Database Setup
- [ ] Review `lib/schema.sql`
- [ ] Prepare to initialize database on first run

## 🚀 Deployment Options

### Option 1: Docker Production (Recommended)

```bash
# 1. Start services
docker-compose up -d

# 2. Check logs
docker-compose logs -f

# 3. Initialize database
docker-compose exec db psql -U beeuser -d beekb < lib/schema.sql

# 4. Access application
# Open http://localhost:3000
```

**Checklist:**
- [ ] Run `docker-compose up -d`
- [ ] Verify containers are running: `docker-compose ps`
- [ ] Check logs for errors: `docker-compose logs`
- [ ] Initialize database schema
- [ ] Access http://localhost:3000
- [ ] Sign in with Google
- [ ] Create Knowledge Base
- [ ] Verify folder tree loads
- [ ] Open a document

### Option 2: Docker Development

```bash
# 1. Start development environment
docker-compose -f docker-compose.dev.yml up

# 2. Wait for services to start

# 3. Access application with hot reload
# Open http://localhost:3000
```

**Checklist:**
- [ ] Run `docker-compose -f docker-compose.dev.yml up`
- [ ] Wait for npm install to complete
- [ ] Access http://localhost:3000
- [ ] Verify hot reload works

### Option 3: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL (if using database)
docker-compose up db

# 3. Run development server
npm run dev

# 4. Access application
# Open http://localhost:3000
```

**Checklist:**
- [ ] Node.js 20.x installed
- [ ] Run `npm install`
- [ ] Start PostgreSQL
- [ ] Run `npm run dev`
- [ ] Access http://localhost:3000

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Navigate to http://localhost:3000
- [ ] Redirected to sign-in page
- [ ] Click "Sign in with Google"
- [ ] Google OAuth popup appears
- [ ] Authorize application
- [ ] Redirected back to application
- [ ] Session is established

### Knowledge Base Creation
- [ ] Onboarding page appears
- [ ] Click "Create Knowledge Base"
- [ ] Enter valid Google Drive folder ID
- [ ] KB instance created in database
- [ ] Navigation panel appears
- [ ] Folder tree loads

### Navigation
- [ ] Logo displays (or "Bee KB" text)
- [ ] Search bar is functional
- [ ] Folder tree shows structure
- [ ] Click on folders to expand/collapse
- [ ] Click on document to view
- [ ] User profile shows at bottom

### Document Viewing
- [ ] Document content loads
- [ ] Document title shows in header
- [ ] Edit icon appears (if user has edit rights)
- [ ] Drive folder icon appears
- [ ] Permissions icon appears (if user can share)
- [ ] Click edit icon → opens Google Docs
- [ ] Click Drive icon → opens Drive folder
- [ ] Click permissions → opens sharing dialog

### Search
- [ ] Type in search bar
- [ ] Documents are filtered
- [ ] Click search result → document loads

### Permissions
- [ ] Create test users with different permissions
- [ ] Verify users see only accessible folders
- [ ] Verify users see only accessible documents
- [ ] Verify action icons respect permissions

## 🐛 Troubleshooting Checklist

### Application Won't Start
- [ ] Check Docker is running
- [ ] Check .env file exists and has values
- [ ] Check port 3000 is not in use
- [ ] Check Docker Compose logs: `docker-compose logs`

### OAuth Errors
- [ ] Verify Client ID is correct
- [ ] Verify Client Secret is correct
- [ ] Check redirect URI in Google Console
- [ ] Verify APIs are enabled in Google Cloud

### Database Errors
- [ ] Check PostgreSQL container is running
- [ ] Verify DATABASE_URL is correct
- [ ] Check database logs: `docker-compose logs db`
- [ ] Manually connect: `docker-compose exec db psql -U beeuser -d beekb`

### Can't Access Folder/Document
- [ ] Verify user has access in Google Drive
- [ ] Check access token is valid
- [ ] Verify folder ID is correct
- [ ] Check API logs for errors

### TreeView Not Loading
- [ ] Check browser console for errors
- [ ] Verify @mui/lab is installed
- [ ] Check API response: `/api/drive/tree`
- [ ] Verify folder has documents

## 📊 Performance Checklist

### Load Times
- [ ] Initial load < 3 seconds
- [ ] Folder tree load < 2 seconds
- [ ] Document load < 2 seconds
- [ ] Search results < 1 second

### Optimization Opportunities
- [ ] Large folder structures? → Consider lazy loading
- [ ] Slow document loading? → Add caching
- [ ] High API usage? → Implement rate limiting

## 🔒 Security Checklist

### Configuration
- [ ] .env file is in .gitignore
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] OAuth credentials are secure
- [ ] No secrets in code
- [ ] Environment variables used for all config

### Runtime
- [ ] HTTPS in production (via reverse proxy)
- [ ] Session cookies are secure
- [ ] API routes check authentication
- [ ] User permissions are validated

## 📝 Post-Deployment Checklist

### Documentation
- [ ] Share README.md with team
- [ ] Document Google Cloud setup
- [ ] Document folder ID retrieval process
- [ ] Create user guide

### Monitoring
- [ ] Set up log monitoring
- [ ] Monitor API usage/quotas
- [ ] Check error rates
- [ ] Track user activity

### Backup
- [ ] Backup database regularly
- [ ] Document recovery procedures
- [ ] Test restore process

### Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor Google API changes
- [ ] Review security advisories
- [ ] Update documentation as needed

## 🎯 Success Criteria

Your MVP is successful if:

- [x] Users can sign in with Google
- [x] Users can create a KB from a Drive folder
- [x] Folder structure is displayed correctly
- [x] Documents are viewable with proper formatting
- [x] Permissions are respected
- [x] Search works
- [x] Custom logo can be added
- [x] Application is stable and fast
- [x] Docker deployment works
- [x] Documentation is clear

## 📞 Support

If you encounter issues:

1. Check this checklist
2. Review logs: `docker-compose logs`
3. Check browser console
4. Consult README.md
5. Review DEVELOPMENT.md
6. Check Google API quotas
7. Verify environment variables

## 🎉 Launch!

Once all checklists are complete:

- [ ] Announce to team
- [ ] Share access instructions
- [ ] Collect feedback
- [ ] Plan next iterations

**Congratulations on deploying Bee KB!** 🐝
