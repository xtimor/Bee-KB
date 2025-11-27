'use client';

import React, { useState, useEffect } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { Box, CircularProgress, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface FolderStructure {
    id: string;
    name: string;
    type: 'folder' | 'document';
    children?: FolderStructure[];
}

interface NavigationTreeProps {
    rootFolderId: string;
    refreshKey: number;
    searchQuery: string;
    onDocumentSelect: (documentId: string, documentName: string) => void;
}

export default function NavigationTree({
    rootFolderId,
    refreshKey,
    searchQuery,
    onDocumentSelect,
}: NavigationTreeProps) {
    const [tree, setTree] = useState<FolderStructure | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/drive/tree', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folderId: rootFolderId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch folder tree');
                }

                const data = await response.json();
                setTree(data.tree);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, [rootFolderId, refreshKey]);

    const renderTree = (node: FolderStructure) => {
        const isDocument = node.type === 'document';
        const matchesSearch =
            !searchQuery ||
            node.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch && isDocument) {
            return null;
        }

        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={node.name}
                icon={
                    isDocument ? (
                        <DescriptionIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    ) : (
                        <FolderIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    )
                }
                onClick={
                    isDocument
                        ? () => onDocumentSelect(node.id, node.name)
                        : undefined
                }
                sx={{
                    '& .MuiTreeItem-content': {
                        color: 'white',
                        borderRadius: 1,
                        mb: 0.5,
                        padding: '8px 12px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.15)',
                        },
                        '&.Mui-selected': {
                            background: 'rgba(255, 255, 255, 0.25) !important',
                            backdropFilter: 'blur(10px)',
                        },
                    },
                    '& .MuiTreeItem-label': {
                        fontSize: '0.9rem',
                        fontWeight: isDocument ? 400 : 600,
                    },
                }}
            >
                {node.children?.map((child) => renderTree(child))}
            </TreeItem>
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    if (!tree) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    No folder structure found
                </Typography>
            </Box>
        );
    }

    return (
        <TreeView
            defaultCollapseIcon={
                <ExpandMoreIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            }
            defaultExpandIcon={
                <ChevronRightIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            }
            sx={{
                color: 'white',
                '& .MuiTreeItem-iconContainer': {
                    marginRight: 1,
                },
            }}
        >
            {renderTree(tree)}
        </TreeView>
    );
}
