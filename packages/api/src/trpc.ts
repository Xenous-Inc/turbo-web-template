import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import type { Session } from '@acme/auth';
import { db } from '@acme/db';

export const createTRPCContext = (opts: { headers: Headers; session: Session | null }) => {
    const session = opts.session;
    const source = opts.headers.get('x-trpc-source') ?? 'unknown';

    console.log('>>> tRPC Request from', source, 'by', session?.user);

    return {
        session,
        db,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter: ({ shape, error }) => ({
        ...shape,
        data: {
            ...shape.data,
            zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
    }),
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});
