import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleDriveService } from '@/lib/google-drive';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const folderId = searchParams.get('folderId');
        const query = searchParams.get('q');

        if (!folderId || !query) {
            return NextResponse.json(
                { error: 'Folder ID and query are required' },
                { status: 400 }
            );
        }

        const driveService = new GoogleDriveService(session.accessToken);
        const results = await driveService.searchDocuments(query, folderId);

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Error searching documents:', error);
        return NextResponse.json(
            { error: 'Failed to search documents' },
            { status: 500 }
        );
    }
}
