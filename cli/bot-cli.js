import {bot} from "../bot.js";

(async function () {
    let current_message;
    current_message = await bot.process({}, current_message);
    console.log(current_message);

    current_message = await bot.process({prompt: 1}, current_message);
    console.log(current_message);

    current_message = await bot.process({prompt: "0"}, current_message);
    console.log(current_message);

    current_message = await bot.process({prompt: "2"}, current_message);
    console.log(current_message);

    current_message = await bot.process({prompt: "0"}, current_message);
    console.log(current_message);

    current_message = await bot.process({prompt: "1"}, current_message);
    console.log(current_message);

    current_message = await bot.process({prompt: "1"}, current_message);
    console.log(current_message);
})();