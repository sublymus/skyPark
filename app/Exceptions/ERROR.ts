import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Message from "./Message";
type OptionShema = {
  target?: string;
  log?: (error: any) => void;
};

const ERROR = {
  async BAD_AUTH(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildError(ctx, this.BAD_AUTH, 405, option);
  },
  async BAD_AUTH_SOUCIES(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildError(ctx, this.BAD_AUTH_SOUCIES, 405, option);
  },
  async NOT_DELETED(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildError(ctx, this.NOT_DELETED, 201, option);
  },
  async NOT_FOUND(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildError(ctx, this.NOT_FOUND, 404, option);
  },
};

async function BuildError(
  ctx: HttpContextContract,
  code: string | Function,
  status: number,
  option?: OptionShema
) {
  code = typeof code === "string" ? code : code.name;
  let message = await Message(ctx, code);
  message = (option?.target ? option?.target + " " : "") + message;
  ctx.response.status(status);
  const error = { error: code, message, status };
  option?.log?.(error);
  return error;
}
export default ERROR;
