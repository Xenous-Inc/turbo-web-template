import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { env as dbEnv } from '@xenous/db/env';

export const env = createEnv({
    extends: [dbEnv],
    server: {
        NEXTAUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().min(1).optional(),
    },
    client: {},
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
