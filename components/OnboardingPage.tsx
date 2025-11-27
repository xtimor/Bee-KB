'use client';

import { useState } from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false);

    const handleCreateKB = async () => {
        setLoading(true);

        try {
            // Open Google Drive Picker (would need Google Picker API)
            // For MVP, we can use a simple prompt
            const folderId = prompt(
                'Enter the Google Drive Folder ID:\n\n' +
                'You can get this from the folder URL:\n' +
                'https://drive.google.com/drive/folders/[FOLDER_ID]'
            );

            if (!folderId) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/kb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderId: folderId.trim() }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Error: ${error.error}`);
                setLoading(false);
                return;
            }

            // Reload to show the KB
            window.location.reload();
        } catch (error) {
            console.error('Error creating KB:', error);
            alert('Failed to create Knowledge Base');
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={24}
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <FolderIcon
                        sx={{
                            fontSize: 80,
                            color: '#667eea',
                            mb: 3,
                        }}
                    />

                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            mb: 2,
                        }}
                    >
                        Welcome to Bee KB
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            mb: 4,
                            fontWeight: 400,
                        }}
                    >
                        Transform your Google Drive folder into a corporate knowledge base
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            mb: 5,
                            maxWidth: 600,
                            mx: 'auto',
                        }}
                    >
                        Select a Google Drive folder to serve as the root of your knowledge
                        base. All permissions will be synchronized from Google Drive.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleCreateKB}
                        disabled={loading}
                        sx={{
                            py: 2,
                            px: 6,
                            fontSize: '1.2rem',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                            },
                            '&:disabled': {
                                background: '#ccc',
                            },
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Knowledge Base'}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
