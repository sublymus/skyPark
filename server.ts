/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/
import { Ignitor } from "@adonisjs/core/build/standalone";
import mongoose from "mongoose";
import "reflect-metadata";
import sourceMapSupport from "source-map-support";
import Log from "sublymus_logger";
//import Log from 'sublymus_logger'

let uri = "mongodb://localhost:27017/skypark";

mongoose.set("strictQuery", false);
mongoose.connect(uri, () => {
  Log("connect", "successfully mongodb connection.....");
});

sourceMapSupport.install({ handleUncaughtExceptions: false });

new Ignitor(__dirname).httpServer().start();
