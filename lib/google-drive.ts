import { google } from 'googleapis';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    parents?: string[];
    webViewLink?: string;
    createdTime?: string;
    modifiedTime?: string;
}

export interface FolderStructure {
    id: string;
    name: string;
    type: 'folder' | 'document';
    children?: FolderStructure[];
    webViewLink?: string;
}

export class GoogleDriveService {
    private drive;
    private docs;

    constructor(accessToken: string) {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        this.drive = google.drive({ version: 'v3', auth });
        this.docs = google.docs({ version: 'v1', auth });
    }

    /**
     * List all files and folders in a specific folder
     */
    async listFilesInFolder(folderId: string): Promise<DriveFile[]> {
        try {
            const response = await this.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, parents, webViewLink, createdTime, modifiedTime)',
                orderBy: 'folder,name',
            });

            return (response.data.files || []) as DriveFile[];
        } catch (error) {
            console.error('Error listing files:', error);
            throw new Error('Failed to list files from Google Drive');
        }
    }

    /**
     * Build folder tree structure recursively
     */
    async buildFolderTree(folderId: string): Promise<FolderStructure> {
        const files = await this.listFilesInFolder(folderId);

        const rootFile = await this.drive.files.get({
            fileId: folderId,
            fields: 'id, name, webViewLink',
        });

        const tree: FolderStructure = {
            id: folderId,
            name: rootFile.data.name || 'Root',
            type: 'folder',
            children: [],
            webViewLink: rootFile.data.webViewLink || undefined,
        };

        for (const file of files) {
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // Recursively build subfolder tree
                const subtree = await this.buildFolderTree(file.id);
                tree.children!.push(subtree);
            } else if (file.mimeType === 'application/vnd.google-apps.document') {
                // Add Google Docs only
                tree.children!.push({
                    id: file.id,
                    name: file.name,
                    type: 'document',
                    webViewLink: file.webViewLink,
                });
            }
            // Ignore other file types
        }

        return tree;
    }

    /**
     * Get file metadata
     */
    async getFileMetadata(fileId: string) {
        try {
            const response = await this.drive.files.get({
                fileId,
                fields: 'id, name, mimeType, parents, webViewLink, permissions, capabilities',
            });
            return response.data;
        } catch (error) {
            console.error('Error getting file metadata:', error);
            throw new Error('Failed to get file metadata');
        }
    }

    /**
     * Check if user has access to a file
     */
    async checkAccess(fileId: string): Promise<boolean> {
        try {
            await this.drive.files.get({
                fileId,
                fields: 'id',
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get Google Doc content
     */
    async getDocumentContent(documentId: string) {
        try {
            const response = await this.docs.documents.get({
                documentId,
            });
            return response.data;
        } catch (error) {
            console.error('Error getting document content:', error);
            throw new Error('Failed to get document content');
        }
    }

    /**
     * Search for documents
     */
    async searchDocuments(query: string, rootFolderId: string): Promise<DriveFile[]> {
        try {
            const response = await this.drive.files.list({
                q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.document' and name contains '${query}' and trashed = false`,
                fields: 'files(id, name, mimeType, webViewLink)',
                orderBy: 'name',
            });

            return (response.data.files || []) as DriveFile[];
        } catch (error) {
            console.error('Error searching documents:', error);
            throw new Error('Failed to search documents');
        }
    }

    /**
     * Get logo file from root folder
     */
    async getLogoFile(rootFolderId: string): Promise<string | null> {
        try {
            const response = await this.drive.files.list({
                q: `'${rootFolderId}' in parents and name = '.logo' and trashed = false`,
                fields: 'files(id, mimeType)',
            });

            const files = response.data.files || [];
            if (files.length === 0) {
                return null;
            }

            const logoFile = files[0];
            if (!logoFile.id) {
                return null;
            }

            // Check if it's an image
            const mimeType = logoFile.mimeType || '';
            if (!mimeType.startsWith('image/')) {
                return null;
            }

            // Get download URL
            const fileResponse = await this.drive.files.get(
                {
                    fileId: logoFile.id,
                    alt: 'media',
                },
                { responseType: 'arraybuffer' }
            );

            // Convert to base64
            const base64 = Buffer.from(fileResponse.data as ArrayBuffer).toString('base64');
            return `data:${mimeType};base64,${base64}`;
        } catch (error) {
            console.error('Error getting logo file:', error);
            return null;
        }
    }
}
