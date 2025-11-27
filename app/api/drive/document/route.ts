import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleDriveService } from '@/lib/google-drive';
import { convertDocToHtml } from '@/lib/doc-converter';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const documentId = searchParams.get('id');

        if (!documentId) {
            return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }

        const driveService = new GoogleDriveService(session.accessToken);

        // Get document metadata
        const metadata = await driveService.getFileMetadata(documentId);

        // Get document content
        const doc = await driveService.getDocumentContent(documentId);

        // Convert to HTML
        const html = convertDocToHtml(doc);

        return NextResponse.json({
            id: documentId,
            title: metadata.name,
            html,
            webViewLink: metadata.webViewLink,
            capabilities: metadata.capabilities,
        });
    } catch (error) {
        console.error('Error getting document:', error);
        return NextResponse.json(
            { error: 'Failed to get document content' },
            { status: 500 }
        );
    }
}
