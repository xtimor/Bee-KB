import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleDriveService } from '@/lib/google-drive';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { folderId } = await req.json();

        if (!folderId) {
            return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
        }

        const driveService = new GoogleDriveService(session.accessToken);

        // Check if user has access to the folder
        const hasAccess = await driveService.checkAccess(folderId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'No access to this folder' }, { status: 403 });
        }

        // Build folder tree
        const folderTree = await driveService.buildFolderTree(folderId);

        return NextResponse.json({ tree: folderTree });
    } catch (error) {
        console.error('Error building folder tree:', error);
        return NextResponse.json(
            { error: 'Failed to build folder tree' },
            { status: 500 }
        );
    }
}
