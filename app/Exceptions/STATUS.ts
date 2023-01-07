import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Message from "./Message";
type OptionShema = {
  target?: string;
  log?: (Satut: any) => void;
};

const STATUS = {
  async BAD_AUTH(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildSatut(ctx, this.BAD_AUTH, 200, option);
  },
  async BAD_AUTH_SOUCIES(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildSatut(ctx, this.BAD_AUTH_SOUCIES, 200, option);
  },
  async NOT_DELETED(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildSatut(ctx, this.NOT_DELETED, 201, option);
  },
  async DELETED(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildSatut(ctx, this.DELETED, 204, option);
  },
  async NOT_FOUND(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildSatut(ctx, this.NOT_FOUND, 200, option);
  },
  async UPDATE(ctx: HttpContextContract, option?: OptionShema) {
    return await BuildSatut(ctx, this.UPDATE, 204, option);
  },
};

async function BuildSatut(
  ctx: HttpContextContract,
  code: string | Function,
  status: number,
  option?: OptionShema
) {
  code = typeof code === "string" ? code : code.name;
  let message = await Message(ctx, code);
  message = (option?.target ? option?.target + " " : "") + message;
  const Satut = { Satut: code, message, status };
  ctx.response.status(status);
  option?.log?.(Satut);
  return Satut;
}
export default STATUS;
