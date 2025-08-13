// PWA (Progressive Web App) Registration and Management
class PWA {
  constructor() {
    this.isInstalled = false;
    this.deferredPrompt = null;
    this.swRegistration = null;
    this.init();
  }

  async init() {
    // Check if PWA is supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('PWA not supported in this browser');
      return;
    }

    // Register service worker
    await this.registerServiceWorker();
    
    // Listen for beforeinstallprompt event
    this.listenForInstallPrompt();
    
    // Check if app is already installed
    this.checkIfInstalled();
    
    // Listen for app install
    this.listenForInstall();
    
    // Setup periodic sync
    this.setupPeriodicSync();
  }

  async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/pomodoro/sw.js');
      console.log('Service Worker registered successfully:', this.swRegistration);

      // Listen for updates
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            this.showUpdateNotification();
          }
        });
      });

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
        window.location.reload();
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  listenForInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      
      // Show install button or banner
      this.showInstallPrompt();
    });
  }

  checkIfInstalled() {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('PWA is installed and running in standalone mode');
      this.onPWAInstalled();
    }
    
    // For iOS, also check if we're in a web app
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      if (window.navigator.standalone === true) {
        this.isInstalled = true;
        console.log('PWA is installed on iOS');
        this.onPWAInstalled();
      }
    }
  }

  listenForInstall() {
    window.addEventListener('appinstalled', (evt) => {
      this.isInstalled = true;
      console.log('PWA was installed');
      this.onPWAInstalled();
      
      // Clear the deferredPrompt
      this.deferredPrompt = null;
      
      // Hide install prompt
      this.hideInstallPrompt();
    });
  }

  showInstallPrompt() {
    // Create install banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner">
        <div class="pwa-banner-content">
          <div class="pwa-banner-icon">🍅</div>
          <div class="pwa-banner-text">
            <h3>Install Pomodoro Timer</h3>
            <p>Add to home screen for quick access and offline use</p>
          </div>
          <div class="pwa-banner-actions">
            <button class="pwa-install-btn" onclick="pwa.install()">Install</button>
            <button class="pwa-dismiss-btn" onclick="pwa.hideInstallPrompt()">Not Now</button>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .pwa-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }
      .pwa-banner.show {
        transform: translateY(0);
      }
      .pwa-banner-content {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 16px;
      }
      .pwa-banner-icon {
        font-size: 32px;
        flex-shrink: 0;
      }
      .pwa-banner-text {
        flex: 1;
      }
      .pwa-banner-text h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
      }
      .pwa-banner-text p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }
      .pwa-banner-actions {
        display: flex;
        gap: 8px;
      }
      .pwa-install-btn, .pwa-dismiss-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .pwa-install-btn {
        background: #10b981;
        color: white;
      }
      .pwa-install-btn:hover {
        background: #059669;
      }
      .pwa-dismiss-btn {
        background: transparent;
        color: #666;
        border: 1px solid #ddd;
      }
      .pwa-dismiss-btn:hover {
        background: #f5f5f5;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(banner);
    
    // Show banner with animation
    setTimeout(() => {
      banner.classList.add('show');
    }, 100);
  }

  hideInstallPrompt() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  async install() {
    if (!this.deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      this.deferredPrompt = null;
      
      // Hide the install banner
      this.hideInstallPrompt();
      
    } catch (error) {
      console.error('Error during install:', error);
    }
  }

  onPWAInstalled() {
    // Add installed class to body
    document.body.classList.add('pwa-installed');
    
    // Show success message
    this.showMessage('Pomodoro Timer installed successfully! 🎉', 'success');
    
    // Enable offline features
    this.enableOfflineFeatures();
  }

  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `pwa-message pwa-message-${type}`;
    messageEl.textContent = message;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .pwa-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }
      .pwa-message.show {
        transform: translateX(0);
      }
      .pwa-message-success {
        background: #10b981;
      }
      .pwa-message-info {
        background: #3b82f6;
      }
      .pwa-message-error {
        background: #ef4444;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(messageEl);
    
    // Show message
    setTimeout(() => {
      messageEl.classList.add('show');
    }, 100);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      messageEl.classList.remove('show');
      setTimeout(() => {
        messageEl.remove();
      }, 300);
    }, 3000);
  }

  enableOfflineFeatures() {
    // Add offline indicator
    this.addOfflineIndicator();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.updateOfflineStatus(false);
    });
    
    window.addEventListener('offline', () => {
      this.updateOfflineStatus(true);
    });
  }

  addOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.innerHTML = `
      <div class="offline-status">
        <span class="offline-icon">📶</span>
        <span class="offline-text">Offline Mode</span>
      </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .offline-status {
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        display: none;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(10px);
      }
      .offline-status.show {
        display: flex;
      }
      .offline-icon {
        font-size: 16px;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(indicator);
  }

  updateOfflineStatus(isOffline) {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      if (isOffline) {
        indicator.classList.add('show');
        this.showMessage('You are now offline. Timer will continue working!', 'info');
      } else {
        indicator.classList.remove('show');
        this.showMessage('Back online! Sync in progress...', 'success');
      }
    }
  }

  setupPeriodicSync() {
    if ('periodicSync' in navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.periodicSync.register('background-sync', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        });
      });
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Send notification
  sendNotification(title, body, options = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/pomodoro/icons/icon-192x192.svg',
        badge: '/pomodoro/icons/icon-192x192.svg',
        ...options
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      return notification;
    }
  }

  // Check for updates
  checkForUpdates() {
    if (this.swRegistration) {
      this.swRegistration.update();
    }
  }
}

// Initialize PWA and make it globally accessible
const pwa = new PWA();
window.pwa = pwa; // Make it globally accessible for onclick handlers

// Export for use in other modules
export default pwa;
