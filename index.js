/**
 * RoboTon Unity WebGL Game Loader
 * Handles Unity game initialization and Telegram WebApp integration
 */

// Global variables
let unityInstanceRef = null;
let unsubscribe = null;

// DOM elements
const container = document.querySelector("#unity-container");
const canvas = document.querySelector("#unity-canvas");
const loadingBar = document.querySelector("#unity-loading-bar");
const progressBarFull = document.querySelector("#unity-progress-bar-full");
const warningBanner = document.querySelector("#unity-warning");

/**
 * Initialize service worker when page loads
 */
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("ServiceWorker.js")
      .then(registration => {
        console.log("ServiceWorker registered successfully:", registration);
      })
      .catch(error => {
        console.error("ServiceWorker registration failed:", error);
      });
  }
});

/**
 * Display banner messages for Unity warnings and errors
 * @param {string} msg - Message to display
 * @param {string} type - Type of message: 'error', 'warning', or 'info'
 */
function unityShowBanner(msg, type = 'info') {
  /**
   * Update banner visibility based on number of children
   */
  function updateBannerVisibility() {
    warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
  }

  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = msg;
  messageDiv.style.padding = '10px';
  messageDiv.style.margin = '5px 0';
  messageDiv.style.borderRadius = '4px';

  // Set appropriate styling based on message type
  switch (type) {
    case 'error':
      messageDiv.style.background = '#ff4444';
      messageDiv.style.color = 'white';
      break;
    case 'warning':
      messageDiv.style.background = '#ffaa00';
      messageDiv.style.color = 'black';
      break;
    default:
      messageDiv.style.background = '#4444ff';
      messageDiv.style.color = 'white';
  }

  warningBanner.appendChild(messageDiv);

  // Auto-remove non-error messages after 5 seconds
  if (type !== 'error') {
    setTimeout(() => {
      if (warningBanner.contains(messageDiv)) {
        warningBanner.removeChild(messageDiv);
        updateBannerVisibility();
      }
    }, 5000);
  }

  updateBannerVisibility();
}

/**
 * Unity WebGL configuration
 */
const BUILD_URL = "Build";
const LOADER_URL = `${BUILD_URL}/Roboton.loader.js`;

const unityConfig = {
  dataUrl: `${BUILD_URL}/Roboton.data`,
  frameworkUrl: `${BUILD_URL}/Roboton.framework.js`,
  codeUrl: `${BUILD_URL}/Roboton.wasm`,
  streamingAssetsUrl: "StreamingAssets",
  companyName: "RoboComp",
  productName: "RoboTom",
  productVersion: "1.0",
  showBanner: unityShowBanner,
};

// Optional: Decouple WebGL canvas size from DOM size
// unityConfig.matchWebGLToCanvasSize = false;

/**
 * Configure mobile viewport for better mobile experience
 */
function configureMobileViewport() {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    console.log("Mobile viewport configured");
  }
}

/**
 * Initialize Telegram WebApp integration
 * @param {Object} unityInstance - Unity game instance
 */
function initializeTelegramIntegration(unityInstance) {
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Telegram WebApp detected:', window.Telegram.WebApp);
      
      // Get user data from Telegram
      const userData = window.Telegram.WebApp.initDataUnsafe.user;
      if (userData) {
        const userDataJson = JSON.stringify(userData);
        console.log("Telegram user data:", userDataJson);
        
        // Send user data to Unity game
        unityInstance.SendMessage("TelegramController", "SetWebAppUser", userDataJson);
      } else {
        console.warn("No Telegram user data available");
      }
    } else {
      console.log("Running outside Telegram WebApp environment");
    }
  } catch (error) {
    console.error('Failed to initialize Telegram integration:', error);
  }
}

// Configure mobile viewport and show loading bar
configureMobileViewport();
loadingBar.style.display = "block";

/**
 * Load and initialize Unity WebGL game
 */
function loadUnityGame() {
  const script = document.createElement("script");
  script.src = LOADER_URL;
  
  script.onload = () => {
    console.log("Unity loader script loaded successfully");
    
    // Create Unity instance with progress callback
    createUnityInstance(canvas, unityConfig, (progress) => {
      // Update loading progress bar
      progressBarFull.style.width = `${100 * progress}%`;
    })
    .then((unityInstance) => {
      console.log('Unity instance created successfully');
      
      // Store instance globally
      window.unityInstance = unityInstance;
      unityInstanceRef = unityInstance;
      
      // Initialize Telegram integration
      initializeTelegramIntegration(unityInstance);
      
      // Hide loading bar
      loadingBar.style.display = "none";
      
      console.log("Game loaded and ready to play!");
    })
    .catch((error) => {
      console.error("Failed to create Unity instance:", error);
      unityShowBanner(`Failed to load game: ${error}`, 'error');
      loadingBar.style.display = "none";
    });
  };
  
  script.onerror = () => {
    console.error("Failed to load Unity loader script");
    unityShowBanner("Failed to load game resources. Please refresh the page.", 'error');
    loadingBar.style.display = "none";
  };
  
  document.body.appendChild(script);
}

// Start loading the game
loadUnityGame();
