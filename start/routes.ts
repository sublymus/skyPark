/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.resource('/user', 'UsersController').apiOnly();
Route.resource('/account', 'AccountsController').apiOnly().except(['store']);
Route.resource('/profile', 'ProfilesController').apiOnly().except(['store']);
Route.resource('/folder', 'FoldersController').apiOnly();
Route.resource('/adress', 'AdressesController').apiOnly().except(['store']);
Route.resource('/refid', 'ReFidsController').apiOnly();