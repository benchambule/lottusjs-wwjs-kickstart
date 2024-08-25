import { lottus, form_processor, InMemorySessionManager, process_w_session, format_message } from "lottus.js";


export {
    process_request
}


async function process_request(msisdn, request){
    try{
        const session = await process_w_session(bot, session_manager, msisdn, request);
        
        return format_message(session.message);
    }catch(e){
        console.log(e);
    }

    return null;
}

const session_manager = new InMemorySessionManager();

function get_main(req, res){
    res.title = "Main";
    res.addAutoOption({label: "Home", next: "home"});
    res.addAutoOption({label: "About", next: "about"});

    return res;
}


function get_about(req, res){
    res.title = "About";
    res.addOption({label: "Back to main", next:"main", key: 0});
    res.body = "You selected about";

    return res;
}

function get_home(req, res){
    res.title = "Home";
    res.addOption({label: "Back to main", next:"main", key: 0});
    res.body = "You selected home";

    return res;
}


function create_bot(){
    const bot = lottus();

    bot.get("main", get_main);
    bot.post("main", form_processor);

    //bot.at("location", get_funtion, post_funtion);
    bot.at("home", get_home, form_processor);
    bot.at("about", get_about, form_processor);
    
    return bot;
}

const bot = create_bot();