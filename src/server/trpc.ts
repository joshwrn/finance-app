/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape }) {
    return shape
  },
})

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const { router } = t

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const { middleware } = t
export const { procedure } = t

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const { mergeRouters } = t
