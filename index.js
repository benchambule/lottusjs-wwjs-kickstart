const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { process_request } = require('./bot.js');

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
        const msisdn = message.from.replace("@c.us", "");
        let req = {prompt: message.body.trim()};
    
        result = await process_request(msisdn, req);
        
    }catch(e){
        console.log(e);
    }

    if (!result){
        return;
    }

    await client.sendMessage(message.from, result);
});

client.initialize();