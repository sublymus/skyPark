import HttpContext , {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

const FR_MESSAGE = {
    BAD_AUTH : 'authentification non valider',
    BAD_AUTH_SOUCIES : 't\'as quel soucies' 
}
const EN_MESSAGE = {
    BAD_AUTH : 'not valid authentification ',
    BAD_AUTH_SOUCIES : 'what\'s your probleme' 
}
const RU_MESSAGE = {
    BAD_AUTH : 'недействительная аутентификация',
    BAD_AUTH_SOUCIES : 'в чем твоя проблема'
}

const ALL_MESSAGE ={
    FR_MESSAGE,
    EN_MESSAGE,
    RU_MESSAGE
}

const Message =  async (ctx: HttpContextContract ,code : string)=>{
    let language =  HttpContext.get()?.request.language(['fr', 'en', 'ru']);
    language = language? language : 'en'
    return ALL_MESSAGE[language?.toUpperCase()+'_MESSAGE'][code]
}
export default Message;