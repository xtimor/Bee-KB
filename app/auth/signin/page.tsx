'use client';

import { signIn } from 'next-auth/react';
import { Box, Button, Paper, Typography, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignIn() {
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
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    }}
                >
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
                        Bee KB
                    </Typography>

                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: 'text.secondary',
                            mb: 4,
                            fontWeight: 400,
                        }}
                    >
                        Corporate Knowledge Base
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            mb: 4,
                        }}
                    >
                        Sign in with your Google account to access your knowledge base
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<GoogleIcon />}
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
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
                        }}
                    >
                        Sign in with Google
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
