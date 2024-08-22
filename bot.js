import { Lottus } from "lottus.js";
import { Message, Option, create_form_processor } from "./processors.js";


export {
    bot
}


const main = new Message("main");
main.addOption(new Option(1, "Home", "home"));
main.addOption(new Option(2, "About", "about"));
main.body = "You are on the main message";
main.header = "Main";

const home = new Message("home");
home.addOption(new Option(0, "Main", "main"));
home.body = "You selected home";
home.header = "Home";

const about = new Message("about");
about.addOption(new Option(0, "Main", "main"));
about.body = "You selected home";
about.header = "About";


function create_bot(){
    let bot = new Lottus();

    bot.info("main", main);
    bot.form("main", create_form_processor(bot));

    bot.at("home", home, create_form_processor(bot));

    bot.at("about", about, create_form_processor(bot));
    
    return bot;
}


const bot = create_bot();