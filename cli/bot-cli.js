const {bot} = require('../bot.js');

(async function () {
    let session = {tags: {customer_name: "Ben Chambule"}};
    session = await bot.process({msisdn: "123456789", prompt: "@lottus"}, session);
    console.log(session.menu);

    session = await bot.process({msisdn: "123456789", prompt: "1"}, session);
    console.log(session.menu);

    session = await bot.process({msisdn: "123456789", prompt: "0"}, session);
    console.log(session.menu);

    session = await bot.process({msisdn: "123456789", prompt: "2"}, session);
    console.log(session.menu);

    // bot.debug = true;
    session = await bot.process({msisdn: "123456789", prompt: "1"}, session);
    console.log(session.menu);

    session = await bot.process({msisdn: "123456789", prompt: "Olympus has fallen"}, session);
    console.log(session.menu);
})();