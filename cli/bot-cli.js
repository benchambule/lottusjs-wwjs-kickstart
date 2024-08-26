import { process_request } from "../bot.js";

(async function () {
    let input = ["", "1", "0", "2"];

    for(const i of input){
        const identifier = "841234567";

        console.log(await process_request(identifier, {prompt: i}));
    }

    input = ["", "2", "0", "1", "1", "1", "0"];

    for(const i of input){
        const identifier = "841234568";

        console.log(await process_request(identifier, {prompt: i}));
    }
})();