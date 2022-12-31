/**
 * Contract source: https://git.io/JTm6U
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */
import Env from '@ioc:Adonis/Core/Env'
declare module '@ioc:Adonis/Core/Env' {
  /*
  |--------------------------------------------------------------------------
  | Getting types for validated environment variables
  |--------------------------------------------------------------------------
  |
  | The `default` export from the "../env.ts" file exports types for the
  | validated environment variables. Here we merge them with the `EnvTypes`
  | interface so that you can enjoy intellisense when using the "Env"
  | module.
  |
  */



  type CustomTypes = typeof import('../env').default
  interface EnvTypes extends CustomTypes {
    URI_DB : string
  }
}

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  URI_DB :Env.schema.string(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  SESSION_DRIVER: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
})
