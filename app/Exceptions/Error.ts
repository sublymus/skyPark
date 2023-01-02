import HttpContext , {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Log from "sublymus_logger";
import Message from "./Message";


const Error ={
    BAD_AUTH :async (ctx : HttpContextContract  )=> {
        const status = 405;
        const code = 'BAD_AUTH';
        const message  = await Message(ctx ,code);
        ctx.response.status(status)
        Log('auth', 'res : ',ctx.response.getStatus())
        const result =  {  error : code, message,  status };
        Log('auth',result);
        return result
    },
    BAD_AUTH_SOUCIES : 't\'as quel soucies' 
}; 

export default Error;