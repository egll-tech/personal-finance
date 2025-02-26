import type { Context } from '@oak/oak'
import type { ResponseBody } from '@oak/oak/response'

/**
 * Simple controller that handles the request body and response body.
 * @param action The action to be performed.
 * @returns The result of the action.
 */
export const SimpleController = <TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>,
) => {
  return async (ctx: Context) => {
    const { request, response } = ctx

    if (!request.hasBody) {
      response.status = 400
      response.body = { error: 'Missing request body' }
      return
    }

    const body = await request.body.json()
    const result = await action(body)
    response.status = 200
    response.body = result as ResponseBody
  }
}
