'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import LockIcon from '@mui/icons-material/Lock';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface DocumentViewerProps {
    documentId: string | null;
    documentName: string;
}

export default function DocumentViewer({
    documentId,
    documentName,
}: DocumentViewerProps) {
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!documentId) {
            setDocument(null);
            return;
        }

        const fetchDocument = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/drive/document?id=${documentId}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch document');
                }

                const data = await response.json();
                setDocument(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    if (!documentId) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        Welcome to Bee KB
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                        Select a document from the navigation panel to get started
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            {/* Document Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    {document?.title || documentName}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Edit Icon */}
                    {document?.capabilities?.canEdit && (
                        <Tooltip title="Edit in Google Docs">
                            <IconButton
                                onClick={() => {
                                    if (document?.webViewLink) {
                                        window.open(document.webViewLink, '_blank');
                                    }
                                }}
                                sx={{
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                    },
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Drive Folder Icon */}
                    <Tooltip title="Open in Google Drive">
                        <IconButton
                            onClick={() => {
                                if (document?.webViewLink) {
                                    // Open the document's folder in Drive
                                    const driveUrl = document.webViewLink.replace(
                                        '/document/d/',
                                        '/drive/folders/'
                                    ).split('/edit')[0];
                                    window.open(driveUrl, '_blank');
                                }
                            }}
                            sx={{
                                transition: 'all 0.2s',
                                '&:hover': {
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                },
                            }}
                        >
                            <FolderIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Permissions Icon */}
                    {document?.capabilities?.canShare && (
                        <Tooltip title="Manage Permissions">
                            <IconButton
                                onClick={() => {
                                    if (document?.webViewLink) {
                                        window.open(
                                            `${document.webViewLink}?usp=sharing`,
                                            '_blank'
                                        );
                                    }
                                }}
                                sx={{
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                    },
                                }}
                            >
                                <LockIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Paper>

            {/* Document Content */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 4,
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.9)',
                        }}
                    >
                        <Typography variant="h6" color="error" gutterBottom>
                            Error Loading Document
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {error}
                        </Typography>
                    </Paper>
                ) : document ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            maxWidth: 900,
                            mx: 'auto',
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: document.html }}
                            style={{
                                fontFamily: "'Inter', 'Roboto', sans-serif",
                                fontSize: '16px',
                                lineHeight: '1.8',
                                color: '#333',
                            }}
                        />
                    </Paper>
                ) : null}
            </Box>
        </Box>
    );
}
