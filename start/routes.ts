import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/login', 'AuthController.login')
Route.post('/signup', 'AuthController.signup')

Route.group(()=>{
  Route.resource('/user', 'UsersController').only(['show' , 'destroy']);
}).middleware(['auth']);

Route.group(()=>{
  Route.resource('/account', 'AccountsController').only([ 'update']);
  Route.resource('/profile', 'ProfilesController').only(['update']);
  Route.resource('/favorites', 'FavoritesController').only(['show' , 'destroy']);
  Route.resource('/folder', 'FoldersController').only(['store','show', 'update' , 'destroy']);
  Route.resource('/adress', 'AdressesController').only(['update']);

}).middleware(['access']);


