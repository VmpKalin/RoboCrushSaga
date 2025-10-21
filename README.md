# 🤖 RoboTon - Telegram WebGL Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![Unity WebGL](https://img.shields.io/badge/Unity-WebGL-blue.svg)](https://unity.com/)

**RoboTon** is an engaging puzzle game built with Unity WebGL and seamlessly integrated with Telegram Bot API. Players can enjoy the game directly within Telegram chats, complete with score tracking and social sharing features.

## 🎮 Features

- **🎯 Unity WebGL Game**: High-quality puzzle gameplay built with Unity
- **📱 Telegram Integration**: Play directly in Telegram without external apps
- **🏆 Score System**: Automatic score tracking and leaderboards
- **👥 Social Sharing**: Share games and compete with friends
- **📊 Real-time Updates**: Live score updates and game state synchronization
- **🔄 Progressive Web App**: Works offline with service worker support
- **📱 Mobile Optimized**: Responsive design for all device sizes

## 🚀 Demo

Try the game now: **[@YourBotName](https://t.me/YourBotName)** on Telegram

Or play directly: **[Web Version](https://vmpkalin.github.io/RoboCrushSaga/)**

## 📋 Table of Contents

- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Bot Commands](#-bot-commands)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🛠 Installation

### Prerequisites

- **Node.js** 14.0.0 or higher
- **npm** or **yarn**
- **Telegram Bot Token** (from [@BotFather](https://t.me/BotFather))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/VmpKalin/RoboCrushSaga.git
   cd RoboCrushSaga
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your bot** (see [Configuration](#-configuration))

4. **Start the server**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here
GAME_URL_BASE=https://your-domain.com/

# Server Configuration
PORT=5000
NODE_ENV=production
```

### Telegram Bot Setup

1. **Create a new bot**:
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow the instructions
   - Save your bot token securely

2. **Configure the game**:
   - Send `/newgame` to @BotFather
   - Select your bot
   - Enter game name: `roboton`
   - Upload game description and screenshot
   - Set the game URL to your deployed server

3. **Set bot commands**:
   ```
   start - Start playing RoboTon
   game - Launch the game
   help - Show help information
   ```

## 🎯 Usage

### For Players

1. **Start the bot**: Send `/start` to your bot on Telegram
2. **Play the game**: Click the "🎮 Play RoboTon" button
3. **Compete**: Share your scores and challenge friends
4. **Track progress**: View your high scores and achievements

### For Developers

```javascript
// Example: Send a game to a user
bot.sendGame(chatId, 'roboton');

// Example: Update player score
bot.setGameScore(userId, score, options);
```

## 📁 Project Structure

```
RoboCrushSaga/
├── 📄 index.html              # Main game page
├── 📄 index.js                # Unity WebGL loader & Telegram integration
├── 📄 robo_server.js          # Express server & Telegram bot logic
├── 📄 ServiceWorker.js        # PWA service worker
├── 📄 manifest.webmanifest    # PWA manifest
├── 📄 package.json            # Project dependencies
├── 📁 Build/                  # Unity WebGL build files
│   ├── Roboton.data
│   ├── Roboton.framework.js
│   ├── Roboton.loader.js
│   └── Roboton.wasm
├── 📁 StreamingAssets/        # Unity streaming assets
├── 📁 TemplateData/           # Unity template resources
│   ├── style.css
│   └── 📁 icons/
└── 📄 README.md              # This file
```

## 🔌 API Endpoints

### `GET /highscore/:score`

Updates player's high score.

**Parameters:**
- `score` (path): The new score to set
- `id` (query): Telegram callback query ID

**Response:**
```json
{
  "success": true,
  "score": 1500
}
```

**Example:**
```
GET /highscore/1500?id=callback_query_123
```

## 🤖 Bot Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/start` | Initialize bot and show welcome message | `/start` |
| `/game` | Launch the RoboTon game | `/game` |
| `/help` | Display help information and commands | `/help` |

## 🔧 Development

### Local Development

1. **Install dev dependencies**
   ```bash
   npm install --dev
   ```

2. **Run in development mode**
   ```bash
   npm run dev
   ```

3. **Access the game**
   - Local: `http://localhost:5000`
   - Telegram: Use ngrok for local testing

### Code Quality

The project follows these standards:

- **ES6+** JavaScript syntax
- **JSDoc** documentation
- **Error handling** for all async operations
- **Consistent formatting** with proper indentation
- **Modular design** with separated concerns

### Testing with ngrok

For local Telegram bot testing:

```bash
# Install ngrok globally
npm install -g ngrok

# Start your server
npm run dev

# In another terminal, expose your local server
ngrok http 5000

# Use the ngrok HTTPS URL in your bot configuration
```

## 🚀 Deployment

### Heroku

1. **Prepare for deployment**
   ```bash
   # Add Procfile
   echo "web: node robo_server.js" > Procfile
   
   # Commit changes
   git add .
   git commit -m "Prepare for Heroku deployment"
   ```

2. **Deploy to Heroku**
   ```bash
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set BOT_TOKEN=your_bot_token
   heroku config:set GAME_URL_BASE=https://your-app-name.herokuapp.com/
   
   # Deploy
   git push heroku main
   ```

### Other Platforms

- **Vercel**: Use `vercel.json` configuration
- **Railway**: Deploy directly from GitHub
- **DigitalOcean**: Use App Platform
- **AWS**: Deploy with Elastic Beanstalk

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit with descriptive messages**
   ```bash
   git commit -m "Add amazing new feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add JSDoc comments for new functions
- Include error handling for all async operations
- Test thoroughly before submitting PR
- Update documentation as needed

## 🔒 Security

- **Environment Variables**: Store sensitive data in `.env` files
- **Input Validation**: All user inputs are validated
- **Error Handling**: Proper error messages without exposing internals
- **Rate Limiting**: Consider implementing for production use

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unity Technologies** for the WebGL platform
- **Telegram** for the Bot API and WebApp platform
- **Express.js** community for the web framework
- **Node.js** ecosystem and contributors