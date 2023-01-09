declare module "@ioc:Adonis/Core/HttpContext" {
  interface HttpContextContract {
    info: { [str: string]: any };
  }
}
