'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MainApp from '@/components/MainApp';

export default function HomePage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return null;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return <MainApp />;
}
