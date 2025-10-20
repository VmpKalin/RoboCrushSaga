/**
 * RoboTon Telegram Bot Server
 * A Node.js server that hosts a Unity WebGL game and integrates with Telegram Bot API
 */

const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN || "7074083814:AAGprA6vdyvHNbkkxlFyUcE6YHFBsYuJbE8"; // TODO: Move to environment variables
const PORT = process.env.PORT || 5005;
const GAME_NAME = "roboton";
const GAME_URL_BASE = process.env.GAME_URL_BASE || "https://vmpkalin.github.io/RoboCrushSaga/";

// Initialize Express server and Telegram bot
const app = express();
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Store callback queries for score updates
const activeQueries = {};
// Serve static files (Unity WebGL build)
app.use(express.static(path.join(__dirname)));

/**
 * Bot Command Handlers
 */

// Help command
bot.onText(/\/help/, (msg) => {
  const helpMessage = `
🤖 Welcome to RoboTon!

Commands:
/start - Start the game
/game - Play RoboTon
/help - Show this help message

Click the button below or type /game to start playing!
  `;
  bot.sendMessage(msg.chat.id, helpMessage);
});

// Start/Game commands
bot.onText(/\/start|\/game/, (msg) => {
  try {
    bot.sendGame(msg.chat.id, GAME_NAME);
  } catch (error) {
    console.error("Error sending game:", error);
    bot.sendMessage(msg.chat.id, "Sorry, there was an error starting the game. Please try again.");
  }
});
/**
 * Handle game callback queries (when users click "Play" button)
 */
bot.on("callback_query", (query) => {
  try {
    // Validate game name
    if (query.game_short_name !== GAME_NAME) {
      bot.answerCallbackQuery(query.id, {
        text: `Sorry, '${query.game_short_name}' is not available.`,
        show_alert: true
      });
      return;
    }

    // Extract user information
    const userId = query.from.id;
    const username = query.from.username || `user${userId}`;
    
    console.log(`Game started by user: ${username} (ID: ${userId})`);
    
    // Store query for potential score updates
    activeQueries[query.id] = query;
    
    // Build game URL with user parameters
    const gameUrl = `${GAME_URL_BASE}?username=${encodeURIComponent(username)}&id=${userId}`;
    
    // Open game in web browser
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameUrl
    });
    
  } catch (error) {
    console.error("Error handling callback query:", error);
    bot.answerCallbackQuery(query.id, {
      text: "Sorry, there was an error starting the game.",
      show_alert: true
    });
  }
});
/**
 * Handle inline queries (for sharing the game in chats)
 */
bot.on("inline_query", (inlineQuery) => {
  try {
    bot.answerInlineQuery(inlineQuery.id, [{
      type: "game",
      id: "0",
      game_short_name: GAME_NAME
    }]);
  } catch (error) {
    console.error("Error handling inline query:", error);
  }
});
/**
 * Handle high score updates from the game
 */
app.get("/highscore/:score", (req, res) => {
  try {
    const queryId = req.query.id;
    const score = parseInt(req.params.score);
    
    // Validate inputs
    if (!queryId || isNaN(score) || score < 0) {
      return res.status(400).json({ error: "Invalid query ID or score" });
    }
    
    // Check if we have the query stored
    if (!Object.prototype.hasOwnProperty.call(activeQueries, queryId)) {
      return res.status(404).json({ error: "Query not found" });
    }
    
    const query = activeQueries[queryId];
    
    // Prepare options for score update
    const options = query.message ? {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id
    } : {
      inline_message_id: query.inline_message_id
    };
    
    // Update game score
    bot.setGameScore(query.from.id, score, options)
      .then(() => {
        console.log(`Score updated: User ${query.from.id} scored ${score}`);
        res.json({ success: true, score });
      })
      .catch((error) => {
        console.error("Error updating score:", error);
        res.status(500).json({ error: "Failed to update score" });
      });
      
  } catch (error) {
    console.error("Error in highscore endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`🚀 RoboTon server is running on port ${PORT}`);
  console.log(`📱 Bot is active and ready to receive commands`);
});