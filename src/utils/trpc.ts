import type { TRPCClientErrorLike } from '@trpc/client'
import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import type { inferReactQueryProcedureOptions } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import SuperJSON from 'superjson'

import { getBaseUrl } from './getBaseUrl'
import type { AppRouter } from '../server/routers/_app'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>
export type RouterError = TRPCClientErrorLike<AppRouter>

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      transformer: SuperJSON,
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
})
