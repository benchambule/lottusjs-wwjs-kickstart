import {Message} from "lottus.js";


export {
    Option,
    Message,

    create_form_processor,
    create_options_processor,
    create_input_processor
}


class Option {
    constructor(key, label, next, params = {}){
        this.key = key;
        this.label = label;
        this.next = next;
        this.params = params;
    }
}


Message.prototype.header = "";
Message.prototype.body = "";
Message.prototype.footer = "Powered by Lottus";


Message.prototype.addOption = function addOption(option){
    if(!this.form){
        this.form = {options: new Map()};
    }

    if(!this.form.options){
        this.form.options = new Map();
    }

    let key = option.key;
    if(key === undefined || key === null){
        key = this.form.options.size + 1;
        option.key = key.toString();
    }

    this.form.options.set(key.toString(), option);
}


Object.defineProperty(Message.prototype, "next", {
    get: function getNext(){
        return this.next;
    }
})


Message.prototype.addInput = function addInput(input){
    if(!this.form){
        this.form = {input: {}}
    }

    if(!this.form.input){
        this.form.input = {};
    }

    this.form.input.push(input);
}


function create_options_processor(bot){
    async function create_options_processor(req, res){
        const options = req.form?.options;

        if(options){
            const option = options.get(req.prompt.toString());

            if(option){
                req.selected_option = option;
                let next = req.form?.next;

                if(req.selected_option.next){
                    next = req.selected_option.next;
                }

                return await bot.redirect(next, req);
            } else {
                res.error = "You selected an invalid option";
            }
        }

        return res;
    }

    return create_options_processor;
}


function create_input_processor(bot){
    async function input_processor(req, res){
        const input = req.form?.input;

        if(input){
            req.input = input;

            let next = req.form?.next;

            return await bot.redirect(next, req);
        } else {
            res.error = "You selected an invalid option";
        }

        return res;
    }

    return input_processor;
}


function create_form_processor(bot){
    async function form_processor(req, res){
        const options = req.form?.options;
        const input = req.form?.input;

        if(options){
            const option = options.get(req.prompt);

            if(option){
                req.selected_option = option;
                let next = req.form?.next;

                if(req.selected_option.next){
                    next = req.selected_option.next;
                }

                return await bot.redirect(next, req);
            } else {
                res.error = "You selected an invalid option";
            }
        }

        if(input){
            req.input = input;

            let next = req.form?.next;

            return await bot.redirect(next, req);
        }

        if(!res.error){
            res.error = "The form has no input nor options";
        }

        return res;
    }

    return form_processor;
}