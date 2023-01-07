import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "sublymus_logger";
import Error from "../Exceptions/STATUS";

export default class Access {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx;
    const token = request.encryptedCookie("token");

    if (!token) {
      const rest = await Error.BAD_AUTH(ctx);
      Log("acessBad", { rest });
      return response.send(rest);
    }
    let u = ctx.params.token = token;

    Log("ctx", { body: u });
    await next();
  }
}
