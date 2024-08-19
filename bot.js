import { Lottus } from "lottus.js";
import { Message, Option, create_options_processor } from "./processors.js";


export {
    bot
}


const main = new Message("main");
main.addOption(new Option(1, "Home", "home"));
main.addOption(new Option(2, "About", "about"));
main.body = "You are on the main message";

const home = new Message("home");
home.addOption(new Option(0, "Main", "main"));
home.body = "You selected home";

const about = new Message("about");
about.addOption(new Option(0, "Main", "main"));
about.body = "You selected home";


function create_bot(){
    let bot = new Lottus();

    bot.info("main", main);
    bot.form("main", create_options_processor(bot));

    bot.at("home", home, create_options_processor(bot));

    bot.at("about", about, create_options_processor(bot));
    
    return bot;
}


const bot = create_bot();