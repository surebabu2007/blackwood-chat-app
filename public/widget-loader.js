/**
 * Blackwood Manor Detective Widget Loader
 * For external browser game integration
 */

class BlackwoodWidget {
  constructor(config = {}) {
    this.config = {
      apiUrl: 'https://blackwood-chat-app.vercel.app',
      position: 'bottom-right',
      theme: 'sepia',
      enableVoice: true,
      enableFileUpload: false,
      showCharacterSelector: true,
      defaultCharacter: null,
      isInterrogationMode: false,
      ...config
    };
    
    this.iframe = null;
    this.isLoaded = false;
    this.eventListeners = {};
    
    this.init();
  }

  init() {
    this.createWidget();
    this.setupEventListeners();
  }

  createWidget() {
    // Create iframe container
    this.iframe = document.createElement('iframe');
    this.iframe.src = `${this.config.apiUrl}/widget-demo?embed=true&config=${encodeURIComponent(JSON.stringify(this.config))}`;
    this.iframe.style.cssText = this.getIframeStyles();
    this.iframe.setAttribute('frameborder', '0');
    this.iframe.setAttribute('allowtransparency', 'true');
    
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.id = 'blackwood-widget-container';
    wrapper.style.cssText = this.getWrapperStyles();
    wrapper.appendChild(this.iframe);
    
    document.body.appendChild(wrapper);
    
    // Wait for iframe to load
    this.iframe.onload = () => {
      this.isLoaded = true;
      this.emit('loaded');
    };
  }

  getIframeStyles() {
    const positions = {
      'bottom-right': 'position: fixed; bottom: 20px; right: 20px;',
      'bottom-left': 'position: fixed; bottom: 20px; left: 20px;',
      'top-right': 'position: fixed; top: 20px; right: 20px;',
      'top-left': 'position: fixed; top: 20px; left: 20px;'
    };

    return `
      ${positions[this.config.position]}
      width: 400px;
      height: 600px;
      border: none;
      z-index: 9999;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      background: transparent;
    `;
  }

  getWrapperStyles() {
    return `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
    `;
  }

  setupEventListeners() {
    window.addEventListener('message', (event) => {
      if (event.origin !== this.config.apiUrl) return;
      
      const { type, data } = event.data;
      
      switch(type) {
        case 'CHARACTER_SELECTED':
          this.emit('characterSelected', data.character);
          break;
        case 'MESSAGE_SENT':
          this.emit('messageSent', data);
          break;
        case 'MESSAGE_RECEIVED':
          this.emit('messageReceived', data);
          break;
        case 'EVIDENCE_FOUND':
          this.emit('evidenceFound', data.evidence);
          break;
        case 'INVESTIGATION_PROGRESS':
          this.emit('investigationProgress', data.progress);
          break;
        case 'WIDGET_READY':
          this.emit('ready');
          break;
      }
    });
  }

  // Public API Methods
  show() {
    if (this.iframe) {
      this.iframe.style.display = 'block';
      this.emit('shown');
    }
  }

  hide() {
    if (this.iframe) {
      this.iframe.style.display = 'none';
      this.emit('hidden');
    }
  }

  selectCharacter(characterId) {
    this.sendMessage({
      type: 'SELECT_CHARACTER',
      characterId: characterId
    });
  }

  sendMessage(message) {
    this.sendMessage({
      type: 'SEND_MESSAGE',
      message: message
    });
  }

  setInterrogationMode(enabled) {
    this.sendMessage({
      type: 'SET_INTERROGATION_MODE',
      enabled: enabled
    });
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.sendMessage({
      type: 'UPDATE_CONFIG',
      config: newConfig
    });
  }

  sendMessage(message) {
    if (this.isLoaded && this.iframe) {
      this.iframe.contentWindow.postMessage(message, this.config.apiUrl);
    }
  }

  // Event system
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  destroy() {
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe.parentNode);
    }
    this.eventListeners = {};
  }
}

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', () => {
  const widgetElement = document.querySelector('[data-blackwood-widget]');
  if (widgetElement) {
    const config = {
      position: widgetElement.dataset.position || 'bottom-right',
      theme: widgetElement.dataset.theme || 'sepia',
      enableVoice: widgetElement.dataset.enableVoice === 'true',
      showCharacterSelector: widgetElement.dataset.showCharacterSelector !== 'false',
      isInterrogationMode: widgetElement.dataset.interrogationMode === 'true'
    };
    
    window.BlackwoodWidget = new BlackwoodWidget(config);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlackwoodWidget;
}

// Global access
window.BlackwoodWidget = BlackwoodWidget;
