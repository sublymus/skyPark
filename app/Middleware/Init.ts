import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Init {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    let info = ctx.request.body().info;
    ctx.info = info ? (typeof info === "string" ? JSON.parse(info) : info) : {};
    await next();
  }
}
