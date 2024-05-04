import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { env as authEnv } from '@xenous/auth/env';

export const env = createEnv({
    extends: [authEnv],
    shared: {
        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    },
    server: {},
    client: {},
    /**
     * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
     */
    experimental__runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,

        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',
});