const fs = require("fs");
const {Bot} = require("lottus.js");

require('dotenv').config();

function create_bot(){
    const menus = JSON.parse(fs.readFileSync("menus.json", "utf-8"));

    let _bot = new Bot(
        {
            name: process.env.LOTTUS_BOT_NAME, 
            entrypoint: process.env.LOTTUS_BOT_ENTRYPOINT, 
            keyword: process.env.LOTTUS_BOT_KEYWORD,
            description: process.env.LOTTUS_BOT_DESCRIPTION
        }
    );

    _bot.intercept('*', async function(req){
        
        if(req.prompt === process.env.LOTTUS_BOT_EXITWORD){
            return {
                menu: {
                    "name": "quit",
                    "title": process.env.LOTTUS_BOT_NAME,
                    "message": "Thank you for using lottus bot",
                    "final": true
                }
            }
        }
    });

    _bot.addMenus(menus);

    _bot.at('main', async function(req, tags){
        tags["bot_name"] = process.env.LOTTUS_BOT_NAME;

        return {
            menu: {
                "name": "main",
                "title": "{{bot_name}}",
                "message": "Hi *{{customer_name}}*, how can we help",
                "options": [
                    {"key": "1", "label": "More information", "menu": "more_info"},
                    {"key": "2", "label": "Share something", "menu": "share"},
                    {"key": "0", "label": "Quit", "menu": "quit"}
                ],
            },
            
            tags: tags
        }
    });

    return _bot;
}

let bot = create_bot();

module.exports = {
    bot: bot
}