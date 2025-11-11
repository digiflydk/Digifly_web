'use client';
import TestsPanel from '@/components/dadmin/tests/TestsPanel';

export const dynamic = 'force-dynamic';

export default function PredeployCheckPage() {
    return (
        <div>
            <p className="mb-4 text-sm text-muted-foreground">
                Run automated smoke tests and static checks to ensure the site is stable before deploying to production.
                This is a manual gate and does not block CI/CD builds.
            </p>
            <TestsPanel />
        </div>
    );
}
