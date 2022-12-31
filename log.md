diff --git a/app/Controllers/Http/AccountsController.ts b/app/Controllers/Http/AccountsController.ts
index a27e18f..41a2c44 100644
--- a/app/Controllers/Http/AccountsController.ts
+++ b/app/Controllers/Http/AccountsController.ts
@@ -17,6 +17,8 @@ export default class AccountsController {
       profile: info.profileId,
       adress:  info.adressId,
       favorites:  info.favoritesId,
+      createdDate : Date.now(),
+      updatedDate : Date.now(),
     });
 
     await new Promise((resolve, reject) => {
diff --git a/app/Controllers/Http/AdressesController.ts b/app/Controllers/Http/AdressesController.ts
index 723688f..13d5697 100644
--- a/app/Controllers/Http/AdressesController.ts
+++ b/app/Controllers/Http/AdressesController.ts
@@ -15,6 +15,7 @@ export default class AdressesController {
       location: info.location,
       home: info.home,
       description: info.location_decription,
+      updatedDate: Date.now()
     });
 
     await new Promise((resolve, reject) => {
diff --git a/app/Controllers/Http/FavoritesController.ts b/app/Controllers/Http/FavoritesController.ts
index 9c77952..378d33a 100644
--- a/app/Controllers/Http/FavoritesController.ts
+++ b/app/Controllers/Http/FavoritesController.ts
@@ -1,4 +1,5 @@
 import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
+import mongoose from "mongoose";
 import Log from "sublymus_logger";
 import FavoritesModel from "../../Model/FavoritesModel";
 import FoldersController from "./FoldersController";
@@ -9,14 +10,13 @@ export default class FavoritesController {
   //public async create({}: HttpContextContract) {}
 
   public async store(ctx: HttpContextContract) {
-  const info = ctx.request.body().info;
-  
-  info.folderName = "mes préférences";
-  Log('user', 'info : ',info);
+    const info = ctx.request.body().info;
+
+    info.folderName = "mes préférences";
+    Log("user", "info : ", info);
 
-   const folderID = await new FoldersController().store(ctx);
     const favorites = new FavoritesModel({
-      folders: [folderID],
+      folders: [],
     });
     await new Promise((resolve, reject) => {
       FavoritesModel.create(favorites, (err) => {
@@ -26,10 +26,31 @@ export default class FavoritesController {
         // reject({ err: "error", message: err.message });
       });
     });
+
+    info.favoritesID = favorites.id
+    await new FoldersController().store(ctx);
+
     return favorites.id;
   }
 
-  public async show({}: HttpContextContract) {}
+  public async show({ request }: HttpContextContract) {
+    Log("favorites", "show");
+    const id = request.params().id;
+
+    Log("favorites", "show", id);
+
+    let favorites = await FavoritesModel.findOne({
+      _id: new mongoose.Types.ObjectId(id)._id,
+    });
+    if (!favorites) return { status: 404, message: "favorite(s) don't exist" };
+    await favorites.populate({
+      path: "folders",
+      model: "folder",
+      select : "-refIds -__v"
+    });
+
+    return favorites;
+  }
 
   // public async edit({}: HttpContextContract) {}
 
diff --git a/app/Controllers/Http/FoldersController.ts b/app/Controllers/Http/FoldersController.ts
index 38dda5c..ea54856 100644
--- a/app/Controllers/Http/FoldersController.ts
+++ b/app/Controllers/Http/FoldersController.ts
@@ -1,90 +1,105 @@
-import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
-import Log from 'sublymus_logger';
-import FavoritesModel from '../../Model/FavoritesModel';
-import FolderModel from '../../Model/FolderModel';
+import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
+import mongoose from "mongoose";
+import Log from "sublymus_logger";
+import FavoritesModel from "../../Model/FavoritesModel";
+import FolderModel from "../../Model/FolderModel";
 
 export default class FoldersController {
   public async index({}: HttpContextContract) {}
 
-//  public async create({}: HttpContextContract) {}
+  //  public async create({}: HttpContextContract) {}
 
-  public async store({request, response}: HttpContextContract) {
-    let info ={folderName : 'mes préférées',favoritesID : '' }
-    if(typeof request.body().info == 'string'){
-      Log('folder', ' string : ', true);
-       info = request.body().info = JSON.parse(request.body().info);
+  public async store({ request, response }: HttpContextContract) {
+    let info : any;
+    if (typeof request.body().info == "string") {
+      Log("folder", " string : ", true);
+      info = request.body().info = JSON.parse(request.body().info);
+    } else {
+      info = request.body().info;
     }
-
+    Log("folder","favoritesId" ,info.favoritesID);
     const favorites = await FavoritesModel.findOne({
-      _id : info.favoritesID
+      _id: info.favoritesID,
     });
 
-    if(!favorites)return response.status(404).send('');
-   
-  Log('user', info)
+    if (!favorites) return response.status(404).send("favorites not found");
+
+    Log("user", info);
     const folder = new FolderModel({
       folderName: info.folderName,
       refIds: {},
     });
     await new Promise((resolve, reject) => {
       FolderModel.create(folder, async (err) => {
-        if (err) return reject({  err});
+        if (err) return reject({ err });
         Log("user", "folder cree ");
         favorites.folders.push(folder.id);
         await favorites.save();
         resolve(folder);
-        
       });
     });
     return folder.id;
-
   }
 
-  public async show({}: HttpContextContract) {}
+  public async show({ request }: HttpContextContract) {
+    const id = request.params().id;
 
-//  public async edit({}: HttpContextContract) {}
+    let folder = await FolderModel.findOne({
+      _id: new mongoose.Types.ObjectId(id)._id,
+    });
+    if (!folder) return { status: 404, message: "folder don't exist" };
+    //  await folder.populate({
+    //     path: "folderName",
+    //     model: "folder",
+    //   });
+
+    return folder;
+  }
 
-  public async update({request}: HttpContextContract) {
-    const info = request.body().info = JSON.parse(request.body().info);
-    Log('folder', info)
+  //  public async edit({}: HttpContextContract) {}
+
+  public async update({ request }: HttpContextContract) {
+    const info = (request.body().info = JSON.parse(request.body().info));
     const folder = await FolderModel.findOne({
-      _id :request.params().id
+      _id: request.params().id,
     });
 
-    if(!folder)return {};
-    
+    if (!folder) return {};
+
     let changed = false;
 
-    if(info.folderName){
-      folder.folderName =info.folderName;
+    if (info.folderName) {
+      folder.folderName = info.folderName;
       changed = true;
     }
 
-    if((info.refID != undefined) && (info.model != undefined)) {
-      if(folder.refIds == undefined){
-        folder.refIds= {};
+    if (info.refID != undefined && info.model != undefined) {
+      if (folder.refIds == undefined) {
+        folder.refIds = {};
       }
-     
-      folder.refIds = { 
-        ...folder.refIds, 
-        [info.refID] : {  
-          model : info.model
-        }
+
+      folder.refIds = {
+        ...folder.refIds,
+        [info.refID]: {
+          model: info.model,
+          createdDate: Date.now(),
+        },
       };
       changed = true;
     }
-    
-    if(info.removeRefID) {
-     delete folder.refIds[info.refID]
-     changed = true;
+
+    if (info.removeRefID) {
+      delete folder.refIds[info.refID];
+      changed = true;
     }
 
     if (changed) {
-      const a = await folder.save()
-      Log('folder', 'saved ',a)
+      const a = await folder.save();
+      Log("folder", "saved ", a);
     }
-    return {status:202} ;
+    Log("folder", folder);
 
+    return { status: 202 };
   }
 
   public async destroy({}: HttpContextContract) {}
diff --git a/app/Controllers/Http/ProfilesController.ts b/app/Controllers/Http/ProfilesController.ts
index 2f95034..13b56a9 100644
--- a/app/Controllers/Http/ProfilesController.ts
+++ b/app/Controllers/Http/ProfilesController.ts
@@ -15,6 +15,7 @@ export default class ProfilesController {
       message: info.profile_message,
       imgProfile: request.file("img-profile")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
       banner: request.file("banner")?.clientName, // il faus definire le path et stoker user avant de sauvegarder le file
+      updatedDate: Date.now()
     });
 
     await new Promise((resolve, reject) => {
diff --git a/app/Controllers/Http/UsersController.ts b/app/Controllers/Http/UsersController.ts
index 6042e7b..278496e 100644
--- a/app/Controllers/Http/UsersController.ts
+++ b/app/Controllers/Http/UsersController.ts
@@ -1,4 +1,5 @@
 import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
+import mongoose from "mongoose";
 import Log from "sublymus_logger";
 import UserModel from "../../Model/UserModel";
 import AccountsController from "./AccountsController";
@@ -16,30 +17,36 @@ export default class UsersController {
 
   public async store(ctx: HttpContextContract) {
     const { request, response } = ctx;
-    const info = request.body().info = JSON.parse(request.body().info);
+    Log("user", "info : ", request.body());
+    const info = (request.body().info = JSON.parse(request.body().info));
 
     Log("user", "info : ", info);
-    let  user ;
+    let user;
     let mail: string;
+
     try {
+
       const profileId = await new ProfilesController().store(ctx);
+
       info.profileId = profileId;
       const favoritesId = await new FavoritesController().store(ctx);
+
       info.favoritesId = favoritesId;
       const adressId = await new AdressesController().store(ctx);
+
       info.adressId = adressId;
-      info.email = adressId + "@gmail.com";
-      const {accountId, email } = await new AccountsController().store(ctx);
-      mail = email
+      info.email = Date.now().toString() + "@gmail.com";
+      const { accountId, email } = await new AccountsController().store(ctx);
+      mail = email;
       user = new UserModel({
-      account: (accountId as string),
-    });
-
+        account: accountId as string,
+      });
     } catch (e) {
+
       Log("user", "err: ", e);
     }
 
-    if (!user) return response
+    if (!user) return response.status(404).send("operation not completed");
 
     try {
       await new Promise((resolve, reject) => {
@@ -52,14 +59,42 @@ export default class UsersController {
           resolve(user);
         });
       });
-    }catch(e){
-      Log('user', 'creation err : ', e.message );
+    } catch (e) {
+      Log("user", "creation err : ", e.message);
     }
-    response.send(request.body());
+     response.send(request.body());
   }
 
-  public async show({}: HttpContextContract) {
-    Log("user", "show");
+  public async show(ctx: HttpContextContract) {
+    const { request } = ctx;
+    const id = request.params().id;
+
+    const user = await UserModel.findOne(
+      {
+        _id: new mongoose.Types.ObjectId(id)._id,
+      },
+      {
+        __v: 0,
+      }
+    );
+    Log("user", "show", user);
+    if (!user) return { status: 404, message: "user not found" };
+    await user.populate({
+      path: "account",
+      select: "-__v -password",
+      populate: [
+        {
+          path: "adress",
+          select: "-__v",
+        },
+        {
+          path: "profile",
+          select: "-__v",
+        },
+      ],
+    });
+
+    return user;
   }
 
   public async edit({}: HttpContextContract) {
diff --git a/app/Model/AccountModel.ts b/app/Model/AccountModel.ts
index 7b1c1c0..4fdf6fb 100644
--- a/app/Model/AccountModel.ts
+++ b/app/Model/AccountModel.ts
@@ -28,16 +28,18 @@ let accountSchema = new Schema({
   },
   adress: {
     type:Schema.Types.ObjectId,
-    refPath :AdressModel.modelName
+    ref :AdressModel.modelName
   },
   favorites: {
     type:Schema.Types.ObjectId,
-    refPath : FavoritesModel.modelName
+    ref : FavoritesModel.modelName
   },
   profile: {
     type:Schema.Types.ObjectId,
-    refPath : ProfileModel.modelName
+    ref : ProfileModel.modelName
   },
+  createdDate: Number,
+  updatedDate: Number
 });
 
 accountSchema.add(mongoose_unique_validation);
diff --git a/app/Model/AdressModel.ts b/app/Model/AdressModel.ts
index 6978756..84cc58f 100644
--- a/app/Model/AdressModel.ts
+++ b/app/Model/AdressModel.ts
@@ -11,6 +11,7 @@ let adressSchema = new Schema({
     required: true,
   },
   description: String,
+  updatedDate: Number
 });
 
 
diff --git a/app/Model/FolderModel.ts b/app/Model/FolderModel.ts
index 7435e03..368f200 100644
--- a/app/Model/FolderModel.ts
+++ b/app/Model/FolderModel.ts
@@ -1,14 +1,6 @@
 import mongoose, { Schema } from "mongoose";
 import mongoose_unique_validation from "mongoose-unique-validation";
 
-type a = {
-  [k: string]: {
-    model : string,
-  }
-}
-const A: a = {
-
-}
 
 let folderSchema = new Schema({
   refIds : {
@@ -18,7 +10,9 @@ let folderSchema = new Schema({
   folderName : {
     type : String,
     required : true
-  }
+  },
+  createdDate: Number
+
 });
 
 folderSchema.add(mongoose_unique_validation);
diff --git a/app/Model/ProfileModel.ts b/app/Model/ProfileModel.ts
index 78da563..886655d 100644
--- a/app/Model/ProfileModel.ts
+++ b/app/Model/ProfileModel.ts
@@ -11,6 +11,8 @@ let profileSchema = new Schema({
     required : true
   },
   message: String,
+  updatedDate: Number
+
 });
 
 profileSchema.add(mongoose_unique_validation);
diff --git a/app/Model/UserModel.ts b/app/Model/UserModel.ts
index 498bd57..f4cd41b 100644
--- a/app/Model/UserModel.ts
+++ b/app/Model/UserModel.ts
@@ -1,14 +1,15 @@
 import mongoose, { Schema } from "mongoose";
 import mongoose_unique_validation from "mongoose-unique-validation";
+import Log from "sublymus_logger";
 import AccountModel from "./AccountModel";
 
 let userSchema = new Schema({
-  account : {
-    type : Schema.Types.ObjectId,
-    refPath : AccountModel.modelName
-  }
+  account: {
+    type: Schema.Types.ObjectId,
+    ref: AccountModel.modelName,
+  },
 });
-
+Log("usercontroller", AccountModel.modelName);
 userSchema.add(mongoose_unique_validation);
 
 const UserModel = mongoose.model("user", userSchema);
diff --git a/app/Model/refIDModel.ts b/app/Model/refIDModel.ts
deleted file mode 100644
index d9abd66..0000000
--- a/app/Model/refIDModel.ts
+++ /dev/null
@@ -1,13 +0,0 @@
-import mongoose, { Schema } from "mongoose";
-import mongoose_unique_validation from "mongoose-unique-validation";
-
-let refIDSchema = new Schema({
-  targetID : Schema.Types.ObjectId,
-  model : String
-});
-
-refIDSchema.add(mongoose_unique_validation);
-
-const RefIDModel= mongoose.model("refid", refIDSchema);
-
-export default RefIDModel;
diff --git a/server.ts b/server.ts
index 27f5bda..9439aed 100644
--- a/server.ts
+++ b/server.ts
@@ -9,19 +9,20 @@
 | by AdonisJs service providers for custom code.
 |
 */
-import { Ignitor } from '@adonisjs/core/build/standalone'
-import mongoose from 'mongoose'
-import 'reflect-metadata'
-import sourceMapSupport from 'source-map-support'
+import { Ignitor } from "@adonisjs/core/build/standalone";
+import mongoose from "mongoose";
+import "reflect-metadata";
+import sourceMapSupport from "source-map-support";
+import Log from "sublymus_logger";
 //import Log from 'sublymus_logger'
 
+let uri = "mongodb://localhost:27017/skypark";
 
-let uri = 'mongodb://localhost:27017/skypark'
-mongoose.set('strictQuery', false)
-mongoose.connect(uri)
+mongoose.set("strictQuery", false);
+mongoose.connect(uri, () => {
+  Log("connect", "successfully mongodb connection.....");
+});
 
-sourceMapSupport.install({ handleUncaughtExceptions: false })
+sourceMapSupport.install({ handleUncaughtExceptions: false });
 
-new Ignitor(__dirname)
-  .httpServer()
-  .start()
+new Ignitor(__dirname).httpServer().start();
diff --git a/start/routes.ts b/start/routes.ts
index d320a5d..775201a 100644
--- a/start/routes.ts
+++ b/start/routes.ts
@@ -27,6 +27,7 @@ Route.get('/', async () => {
 Route.resource('/user', 'UsersController').apiOnly();
 Route.resource('/account', 'AccountsController').apiOnly().except(['store']);
 Route.resource('/profile', 'ProfilesController').apiOnly().except(['store']);
+Route.resource('/favorites', 'FavoritesController').apiOnly().except(['store']);
 Route.resource('/folder', 'FoldersController').apiOnly();
 Route.resource('/adress', 'AdressesController').apiOnly().except(['store']);
-Route.resource('/refid', 'ReFidsController').apiOnly().except(['update']);;
\ No newline at end of file
+Route.resource('/refid', 'ReFidsController').apiOnly().except(['update']);;
