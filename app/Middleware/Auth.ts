import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import Error from "../Exceptions/STATUS";

export default class Auth {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx;
    const token = request.encryptedCookie("token");

    ctx.params.token = token;

    if (token?.id !== request.param("id")) {
      const rest = await Error.BAD_AUTH(ctx);
      Log("badAuht", { rest });
      return response.send(rest);
    }
    Log("context", ctx.params);
    await next();
  }
}
