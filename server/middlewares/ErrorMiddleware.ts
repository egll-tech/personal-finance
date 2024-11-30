import type { Context } from "@oak/oak"

export const errorMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.response.status = 500
    ctx.response.body = { error: "Internal Server Error" }
  }
}
