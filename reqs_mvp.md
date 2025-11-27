# Feature Specification for Bee Knowledge Base

## Overview

Bee Knowledge Base (Bee KB) is a system that converts a designated Google Drive folder into a fully functional, permission-aware corporate knowledge base. It synchronizes structure, documents, and access rights directly from Google Drive, displaying Google Docs as articles within a web interface. The system is initialized by the user selecting a Google Drive folder on first launch.

---

## 1. Authentication and Access Control

### 1.1 Google Authentication Only
- Users authenticate exclusively through their Google account.
- No local accounts or password management.

### 1.2 Access Based on Google Drive Permissions
- A user can access Bee KB only if they have access (directly or via group or nested groups) to the selected Google Drive folder.
- All access permission checks rely on Google Drive permissions.
- Group and nested-group membership are respected.

### 1.3 Document-Level Permissions
- A user sees only the folders and documents for which they have Google Drive access.
- A user can view, edit, or manage permissions strictly based on their Google Drive rights.

---

## 2. Supported File Types

### 2.1 Google Docs Only
- System works exclusively with Google Docs.
- Other file types (Sheets, Slides, PDFs, etc.) are ignored.

---

## 3. Knowledge Base Creation Flow

### 3.1 First Visit
- When the user first enters the application, they arrive at a simple onboarding screen.
- A single button is displayed: **“Create Knowledge Base”**.

### 3.2 Google Authorization and Folder Selection
- After clicking the button, the system requests Google authorization to access Drive.
- User selects the folder that will serve as the root of the knowledge base.
- After selection, the folder **cannot be changed**.

### 3.3 Knowledge Base Deletion Logic
- If the root folder is deleted in Google Drive, the system automatically detects its absence.
- The corresponding knowledge base is removed from Bee KB.

### 3.4 No Separate Admin Panel
- System configuration is kept minimal.
- No dedicated admin UI.
- All behavior is derived from Google Drive structure and permissions.

### 3.5 Logo Configuration
- To configure a logo, the root folder must contain a file named `.logo`.
- Supported formats: PNG or JPEG.
- This logo appears in the top-left corner of the navigation panel.

---

## 4. Navigation Panel (Left Sidebar)

### 4.1 Layout Structure
- Top: Custom Logo (from `.logo` file).
- Below Logo: Search field.
- Below Search: Navigation Tree.
- Bottom: Logged-in user profile.

### 4.2 Logo
- Automatically taken from `.logo` file in the root folder.
- If `.logo` is missing, a default placeholder logo is used.

### 4.3 Search Field
- Searches across documents the user has access to.
- Search respects Google Drive permissions.

### 4.4 Navigation Tree
- Mirrors the folder structure of the selected Google Drive root folder.
- Includes:
  - Folders and subfolders.
  - Google Docs inside these folders.
- Displays only items accessible to the current user.

### 4.5 User Profile Block
- Located at bottom of left panel.
- Shows Google user name and Google avatar.

---

## 5. Main Content Area (Right Section)

### 5.1 Layout
- Occupies ~80% of horizontal space.
- Contains Document Header Bar and Document Content Area.

### 5.2 Document Header Bar
Left side:
- Full document title.

Right side (icons):

#### 5.2.1 Edit Icon
- Visible only if user has edit rights.
- Opens Google Doc in edit mode in a new tab.

#### 5.2.2 Google Drive Icon
- Opens Google Drive in a new tab.
- Navigates to folder containing the document.
- Highlights the document.

#### 5.2.3 Permissions Icon
- Visible only if user can manage access.
- Opens Google permission management UI or custom permission modal.

### 5.3 Document Content Area
- Displays Google Doc content.
- Continuous scroll, single long page.
- No headers or footers.
- No artificial page breaks.

---

## 6. System Behavior and Synchronization

### 6.1 Folder Synchronization
- Bee KB mirrors Google Drive folder structure.
- Synchronization occurs live or on schedule.

### 6.2 Document Synchronization
- Google Doc content fetched live or on schedule.
- Updates in Google Docs reflected on reload.

### 6.3 Permission Synchronization
- Based on current Google Drive permissions.
- Group and nested group permissions fully respected.

---

## 7. Settings and Customization

### 7.1 Logo via `.logo`
- Admin adds a `.logo` file to the root folder.
- Supported: PNG, JPEG.

### 7.2 Root Folder
- User selects root folder only once during creation.
- To remove KB: delete folder in Drive.

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Efficient loading for deep folder structures.
- Optimized rendering for long scrolling content.

### 8.2 Security
- Google OAuth only.
- No local password storage.
- Permissions checked via Google API.

### 8.3 Scalability
- Supports hundreds of folders, thousands of docs.
- Organizational access via Google Groups.

---

## 9. User Roles

### 9.1 Regular User
- Access based on Drive permissions.
- May edit or manage permissions only if allowed.

### 9.2 Knowledge Base Owner
- User who selected the root folder.
- Can configure the logo.
- Cannot override Drive permissions.

---

## 10. High-Level User Flow

1. User enters application.
2. If no KB exists, onboarding screen appears with "Create Knowledge Base".
3. User authenticates via Google.
4. User selects a root Google Drive folder.
5. System builds navigation tree and content structure.
6. User sees only documents and folders they have access to.
7. User opens a document:
   - Reads content.
   - Edits if allowed.
   - Manages permissions if allowed.
   - Opens Drive location.

---

# End of Specification

