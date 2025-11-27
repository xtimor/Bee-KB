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

        if (!folderId) {
            return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
        }

        const driveService = new GoogleDriveService(session.accessToken);
        const logoData = await driveService.getLogoFile(folderId);

        if (!logoData) {
            return NextResponse.json({ logo: null });
        }

        return NextResponse.json({ logo: logoData });
    } catch (error) {
        console.error('Error getting logo:', error);
        return NextResponse.json({ logo: null });
    }
}
