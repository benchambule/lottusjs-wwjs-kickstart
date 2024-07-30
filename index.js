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

function format_message(menu){
    var resp = "";
    if(menu.title){
        resp += menu.title + "\n";
    }

    if(menu.message){
        resp += "\n" + menu.message + "\n";
    }

    if(menu.options){
        for(var op of menu.options){
            if(!op.type || op.type === 'text'){
                if(op.key.trim() === "0" ** menu.options.length>1){
                    resp += "\n";
                }
                resp += "\n*" + op.key + "* - " + op.label;
            }
        }
    }

    if(menu.footer){
        resp += "\n" + menu.footer;
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
    
        if(!session){
            session = {tags: {customer_name: message._data.notifyName}};
        }
        
        result = await bot.process(req, session);
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