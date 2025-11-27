import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { GoogleDriveService } from '@/lib/google-drive';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { folderId } = await req.json();

        if (!folderId) {
            return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
        }

        const driveService = new GoogleDriveService(session.accessToken);

        // Verify access and get folder metadata
        const folderMetadata = await driveService.getFileMetadata(folderId);

        if (!folderMetadata || folderMetadata.mimeType !== 'application/vnd.google-apps.folder') {
            return NextResponse.json(
                { error: 'Invalid folder or no access' },
                { status: 403 }
            );
        }

        // Save to database
        const db = new DatabaseService();
        const kbInstance = await db.createKBInstance(
            session.user.email,
            session.user.email,
            folderId,
            folderMetadata.name || 'Untitled Folder'
        );

        await db.logActivity(
            kbInstance.id,
            session.user.email,
            'kb_created',
            `Created KB from folder: ${folderMetadata.name}`
        );

        return NextResponse.json({
            success: true,
            kbInstance,
        });
    } catch (error: any) {
        console.error('Error creating KB:', error);

        // Check if KB already exists
        if (error.code === '23505') {
            return NextResponse.json(
                { error: 'Knowledge Base already exists for this folder' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create Knowledge Base' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = new DatabaseService();
        const kbInstance = await db.getKBInstanceByOwner(session.user.email);

        return NextResponse.json({ kbInstance });
    } catch (error) {
        console.error('Error getting KB:', error);
        return NextResponse.json(
            { error: 'Failed to get Knowledge Base' },
            { status: 500 }
        );
    }
}
