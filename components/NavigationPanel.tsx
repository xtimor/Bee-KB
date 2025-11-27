'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Drawer,
    TextField,
    Avatar,
    Typography,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSession } from 'next-auth/react';
import NavigationTree from './NavigationTree';

interface NavigationPanelProps {
    rootFolderId: string;
    onDocumentSelect: (documentId: string, documentName: string) => void;
}

const DRAWER_WIDTH = 320;

export default function NavigationPanel({
    rootFolderId,
    onDocumentSelect,
}: NavigationPanelProps) {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const [logoLoading, setLogoLoading] = useState(true);

    useEffect(() => {
        // Fetch logo
        const fetchLogo = async () => {
            try {
                const response = await fetch(
                    `/api/drive/logo?folderId=${rootFolderId}`
                );
                const data = await response.json();
                setLogo(data.logo);
            } catch (error) {
                console.error('Error fetching logo:', error);
            } finally {
                setLogoLoading(false);
            }
        };

        fetchLogo();
    }, [rootFolderId]);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 100,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {logoLoading ? (
                    <CircularProgress sx={{ color: 'white' }} />
                ) : logo ? (
                    <img
                        src={logo}
                        alt="KB Logo"
                        style={{
                            maxWidth: '100%',
                            maxHeight: 80,
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #fff, #e0e0ff)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Bee KB
                    </Typography>
                )}
            </Box>

            {/* Search Field */}
            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused': {
                                background: 'rgba(255, 255, 255, 0.25)',
                            },
                        },
                    }}
                    sx={{
                        '& input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            opacity: 1,
                        },
                    }}
                />
            </Box>

            {/* Navigation Tree */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
                <NavigationTree
                    rootFolderId={rootFolderId}
                    searchQuery={searchQuery}
                    onDocumentSelect={onDocumentSelect}
                />
            </Box>

            {/* User Profile */}
            {session?.user && (
                <Box
                    sx={{
                        p: 2,
                        background: 'rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Avatar
                        src={session.user.image || undefined}
                        alt={session.user.name || 'User'}
                        sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {session.user.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                opacity: 0.8,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                            }}
                        >
                            {session.user.email}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Drawer>
    );
}
