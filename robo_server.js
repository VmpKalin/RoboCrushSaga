const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "7074083814:AAGprA6vdyvHNbkkxlFyUcE6YHFBsYuJbE8";
const server = express();
const bot = new TelegramBot(TOKEN, {
    polling: true
});
const port = process.env.PORT || 5000;
const gameName = "roboton";
const queries = {};
server.use(express.static(path.join(__dirname, 'RoboCrushSaga')));
bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));
bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));
bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        let username = "";
        let id = "";
        console.log(JSON.stringify(query));
        if (query.message) {
            id = query.from.id;
            username = query.from.username
        }
        
        queries[query.id] = query;
        let gameurl = "https://vmpkalin.github.io/RoboCrushSaga/?username="+username+"&id="+id;
        
        // let chatId = query.message.chat.id;
        // console.log("Chat id: "+chatId)
        // const menuButtonWebApp = {
        //     type: "web_app",
        //     text: "Play in RoboTon",
        //     web_app: {
        //         url: gameurl
        //     }
        // };
        
        // bot.setChatMenuButton({chat_id: chatId, menu_button: menuButtonWebApp});

        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});
bot.on("inline_query", function (iq) {
    bot.answerInlineQuery(iq.id, [{
        type: "game",
        id: "0",
        game_short_name: gameName
    }]);
});
server.get("/highscore/:score", function (req, res, next) {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = queries[req.query.id];
    let options;
    if (query.message) {
        options = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        };
    } else {
        options = {
            inline_message_id: query.inline_message_id
        };
    }
    bot.setGameScore(query.from.id, parseInt(req.params.score), options,
        function (err, result) {});
});
server.listen(port);