import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})



Route.post('/login', 'AuthController.login')
Route.post('/signup', 'AuthController.signup')

// Route.group(()=>{
// }).middleware(['auth']);
Route.resource('/user', 'UsersController').apiOnly().only(['show' , 'destroy']);
Route.resource('/account', 'AccountsController').apiOnly().only([ 'update','destroy']);
Route.resource('/profile', 'ProfilesController').apiOnly().only(['update']);
Route.resource('/favorites', 'FavoritesController').apiOnly().only(['show']);
Route.resource('/folder', 'FoldersController').apiOnly().only(['store', 'update' , 'destroy']);
Route.resource('/adress', 'AdressesController').apiOnly().only(['update']);
