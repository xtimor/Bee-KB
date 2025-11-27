# Bee KB – Tech Stack Requirements

## 0. Purpose

This document defines **technology stack requirements** for the Bee Knowledge Base (Bee KB) project so that:
- The implementation is **simple to reason about** and friendly for a non-programmer owner.
- The stack is **highly compatible with AI code generators** (ChatGPT, Gemini, Google Antigravity, etc.).
- The UI is **visually attractive out of the box** with rich, ready-made components.
- The whole system is **containerized with Docker** and easily deployable via **docker-compose**.

---

## 1. High-Level Architecture

### 1.1 Application Type
- Single web application, implemented as a **full-stack Next.js application**.
- Frontend (UI) and backend (API) are implemented in the **same codebase** and **same runtime** (Node.js).
- No separate backend service is required in the first version.

### 1.2 Responsibilities
- **Frontend/UI**:
  - Render navigation panel (logo, search, tree, user block).
  - Render document view (header actions + content area).
  - Handle user interactions (navigation, search, open in Drive, etc.).

- **Backend/API (within Next.js)**:
  - Handle Google OAuth authentication.
  - Communicate with Google Drive and Google Docs APIs.
  - Resolve and enforce access permissions based on Google.
  - (Optionally) interact with a small database for configuration and logging.

### 1.3 Deployment Model
- Application is packaged into **Docker images**.
- A **docker-compose.yml** file is used to:
  - Start the Next.js application container.
  - Optionally start a database container (PostgreSQL) when needed.
  - Configure environment variables, networking, and volumes.

---

## 2. Core Stack Components

### 2.1 Runtime & Language
- **Node.js** (LTS version; e.g. 20.x or higher).
- **TypeScript** as the primary language for both frontend and backend code.

### 2.2 Framework
- **Next.js** (latest stable major version) with **App Router**.
- Use **Next.js API Routes** / **route handlers** for backend-endpoints.

### 2.3 UI Library
- **React** (as included with Next.js).
- **Material UI (MUI)** for UI components and styling:
  - `@mui/material`
  - `@mui/icons-material`
- MUI is used for:
  - Application layout (AppBar, Drawer, Box, Container, Grid, etc.).
  - Navigation tree (MUI TreeView or compatible component).
  - Buttons, inputs, search field, dialogs, icons, user avatar.

### 2.4 State Management
- Use **React hooks** and **Next.js server components** where appropriate.
- For client-side state, start with **React Context + hooks**.
- Avoid introducing heavy state-management libraries (Redux, MobX) in first version.

### 2.5 Styling
- Use **MUI theming system** for colors, typography, spacing.
- Use MUI’s styled components / `sx` prop for minor layout tuning.
- No custom low-level CSS framework (like raw Tailwind) in the first version.

---

## 3. Authentication & Authorization

### 3.1 Authentication Method
- **Google OAuth 2.0 / OpenID Connect** as the only authentication method.
- Use a standard solution such as **next-auth** (or alternative maintained library) with **Google provider**.

### 3.2 Session Handling
- Sessions managed via `next-auth` (or equivalent), using:
  - Secure cookies for browser sessions.
  - Optional JWT session storage if needed.

### 3.3 Permissions Model
- The application does **not** maintain its own permission model.
- All access is derived from **Google Drive / Google Docs permissions**, including:
  - Direct user access.
  - Group and nested-group access via Google Workspace.

### 3.4 Required Google Scopes
- Scopes must cover:
  - Reading folder structure from Drive.
  - Reading Google Docs content.
  - Checking file and folder permissions.
  - (Optionally) managing permissions if the user has such rights.
- Scopes should be **minimal** and explicitly documented.

---

## 4. Google API Integration

### 4.1 Libraries
- Use official Google Node.js client:
  - `googleapis` package.

### 4.2 APIs Used
- **Google Drive API**:
  - List folders and files within the selected root folder.
  - Determine folder hierarchy (parent/children).
  - Open Drive links for folder and file.

- **Google Docs API**:
  - Read the content of Google Docs as structured data.
  - Convert it into a continuous HTML/React-renderable view (without headers/footers/page breaks).

- **Google Admin SDK (optional, for groups)**:
  - Retrieve group membership to respect nested group permissions, if not directly exposed through Drive.

### 4.3 API Access Pattern
- All calls to Google APIs are made from **server-side Next.js API routes**, not from the browser.
- Access tokens are obtained via OAuth flow and stored securely according to library best practices.

---

## 5. Data Storage & Configuration

### 5.1 Minimal DB (Phase 1)
- First version may operate **without a dedicated database**, if possible, by:
  - Deriving configuration directly from Google (root folder, logo file, etc.).
  - Using environment variables for global settings.

### 5.2 Optional Database (Phase 2)
- When persistence is required, use **PostgreSQL** as the primary database.
- Basic tables may include:
  - `kb_instances` (id, owner_user_id, root_folder_id, created_at, updated_at).
  - `sync_logs` / `activity_logs`.

### 5.3 Configuration Management
- All sensitive configuration is provided via **environment variables**, for example:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `ROOT_FOLDER_ID` (if preconfigured) or similar.
  - DB connection parameters (if DB is used).

- Environment variables are loaded using:
  - Next.js built-in `.env` support.
  - docker-compose environment section.

---

## 6. Docker & Deployment Requirements

### 6.1 Containerization
- The application must build and run inside a **Docker container**.
- A **multi-stage Dockerfile** is required to:
  - Stage 1: Install dependencies and build the Next.js app.
  - Stage 2: Run the production build with minimal image size.

Example structure (conceptual):
- Use official `node:<LTS>-alpine` or `node:<LTS>` base image.
- Install dependencies with `npm ci` or `pnpm install`.
- Run `npm run build` for Next.js.
- Use `next start` in production container.

### 6.2 docker-compose Requirements
- Provide a `docker-compose.yml` file that:
  - Defines a `web` service for the Next.js app.
  - Optionally defines a `db` service for PostgreSQL.
  - Configures environment variables for the web service.
  - Maps a host port (e.g. 3000) to the container port.

Example high-level structure:

- `services.web`:
  - `build`: path to Dockerfile.
  - `ports`: `"3000:3000"`.
  - `env_file` or `environment` for critical variables.
  - `depends_on`: ["db"] (only if DB is enabled).

- `services.db` (optional):
  - `image`: `postgres:16-alpine` (or similar).
  - `environment`: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB.
  - `volumes`: persistent data volume.

### 6.3 Development vs Production
- Support two modes:
  - **Development**: hot-reload, `next dev` inside container or on host.
  - **Production**: compiled build with `next build` + `next start`.

- docker-compose may include:
  - A `docker-compose.dev.yml` for local development (optional).
  - A main `docker-compose.yml` focused on production-like deployment.

### 6.4 Logging & Monitoring
- Application logs should be written to **stdout/stderr** so Docker can capture them.
- No heavy logging stack is required in v1, but logging points should be present on:
  - Google API calls (success/failure).
  - Authentication events.
  - Critical errors.

---

## 7. Testing & Quality

### 7.1 Type Safety
- TypeScript must be properly configured with **strict mode** enabled (`strict: true`).
- Types for Google API responses should be either:
  - Derived from official type definitions, or
  - Explicitly defined with interfaces/types where needed.

### 7.2 Basic Testing (Optional for MVP)
- At minimum, some **smoke tests** or **integration tests** for key API routes (auth, tree loading, doc loading).
- Use **Jest** or **Vitest** for tests, if tests are introduced.

---

## 8. AI Code Generation Friendliness

### 8.1 Conventions
- Use **standard, widely adopted patterns** in Next.js and MUI, so AI tools can:
  - Generate new pages and components by example.
  - Modify existing components without breaking structure.
- Organize code into clear directories:
  - `app/` (Next.js App Router pages and layouts).
  - `app/api/` (API route handlers).
  - `components/` (reusable React components).
  - `lib/` (Google API wrappers, permission logic, helpers).

### 8.2 Documentation & Prompts
- The tech stack description (this document) should be available to AI tools as context.
- Code comments and README should briefly explain:
  - How authentication works.
  - Where Google API logic resides.
  - Where navigation and document rendering components live.

---

## 9. Non-Functional Requirements (Tech-Related)

### 9.1 Performance
- Navigation tree loading should be optimized (lazy loading or batching requests to Google APIs where possible).
- Document rendering should be efficient for long documents.

### 9.2 Security
- All secrets are passed via environment variables.
- OAuth tokens are handled using library best practices.
- HTTPS termination handled by reverse-proxy or platform (out of scope of application code, but compatible with Docker deployment).

### 9.3 Maintainability
- Code should follow standard ESLint + Prettier rules for React/Next/TS.
- Prefer simple, readable code over overly clever abstractions.

---

# End of Tech Stack Requirements

