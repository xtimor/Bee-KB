'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/material';
import NavigationPanel from '@/components/NavigationPanel';
import DocumentViewer from '@/components/DocumentViewer';
import OnboardingPage from '@/components/OnboardingPage';

export default function MainApp() {
    const { data: session, status } = useSession();
    const [kbInstance, setKbInstance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [selectedDocName, setSelectedDocName] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            fetchKBInstance();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status]);

    const fetchKBInstance = async () => {
        try {
            const response = await fetch('/api/kb');
            const data = await response.json();
            setKbInstance(data.kbInstance);
        } catch (error) {
            console.error('Error fetching KB:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentSelect = (documentId: string, documentName: string) => {
        setSelectedDocId(documentId);
        setSelectedDocName(documentName);
    };

    if (loading || status === 'loading') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <CircularProgress sx={{ color: 'white' }} size={60} />
            </Box>
        );
    }

    if (!kbInstance) {
        return <OnboardingPage />;
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <NavigationPanel
                rootFolderId={kbInstance.root_folder_id}
                onDocumentSelect={handleDocumentSelect}
            />
            <Box sx={{ flex: 1, ml: '320px' }}>
                <DocumentViewer
                    documentId={selectedDocId}
                    documentName={selectedDocName}
                    rootFolderId={kbInstance.root_folder_id}
                    rootFolderName={kbInstance.root_folder_name}
                />
            </Box>
        </Box>
    );
}
