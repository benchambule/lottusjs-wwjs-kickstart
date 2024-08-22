const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const {bot} = require('./bot.js');

let sessions = {};

const client = new Client(
    {
        authStrategy: new LocalAuth({
            dataPath: './whatsapp'
        }),
        puppeteer: {
            args: ['--no-sandbox'],
        }
    }
);

function format_message(message){
    var resp = "";
    if(message.title){
        resp += message.title + "\n";
    }

    if(message.text){
        resp += "\n" + message.text + "\n";
    }

    if(message.form.options){
        for(var op of message.form.options){
            if(!op.type || op.type === 'text'){
                if(op.key.trim() === "0" ** message.options.length > 1){
                    resp += "\n";
                }
                resp += "\n*" + op.key + "* - " + op.label;
            }
        }
    }

    if(message.footer){
        resp += "\n" + message.footer;
    }

    return resp;
}

client.on('ready', async () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message', async(message) => {
    if(!message.from.endsWith("@c.us")){
        return;
    }

    let result = null;

    try{
        let req = {
            msisdn: message.from.replace("@c.us", ""),
            prompt: message.body,
            client: {
                name:  message._data.notifyName
            }
        }
    
        var session = null;
        if(sessions[req.msisdn]){
            session = sessions[req.msisdn];
            if(session.final){
                delete session[req.msisdn];
            }
        }
    
        let current_message;
        if(session){
            current_message = session.message;
        }
        
        current_message = await bot.process(req, current_message);
        if(!session){
            session = {message: current_message};
        }else{
            session.current_message = current_message;
        }
    }catch(e){
        console.log(e);
    }

    if (!result){
        return;
    }

    const whatstext = format_message(result);

    console.log("Message sent " + whatstext + " to " + message.from);
    await client.sendMessage(message.from, whatstext);
});

client.initialize();