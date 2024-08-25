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

    try{
        const msisdn = message.from.replace("@c.us", "");
        let req = {prompt: message.body.trim()};
    
        let result = await process_request(msisdn, req);

        if(result){
            await client.sendMessage(message.from, result);
        }
    }catch(e){
        console.log(e);
    }
});

client.initialize();