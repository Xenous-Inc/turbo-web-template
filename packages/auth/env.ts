// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { env as dbEnv } from '@xenous/db/env';

export const env = createEnv({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    extends: [dbEnv] as any,
    server: {
        NEXTAUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().min(1).optional(),
    },
    client: {},
    shared: {},
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
