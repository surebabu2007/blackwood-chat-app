/**
 * Blackwood Detective Widget - Web Integration
 * Comprehensive JavaScript library for easy integration into any web application
 * Handles all edge cases and provides fallback options
 */

class BlackwoodDetectiveWidget {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            apiUrl: 'https://blackwood-chat-app.vercel.app',
            position: 'bottom-right',
            theme: 'sepia',
            enableVoice: false,
            enableFileUpload: false,
            showCharacterSelector: true,
            autoOpen: false,
            debug: false,
            maxRetries: 3,
            retryDelay: 1000,
            requestTimeout: 30000,
            ...config
        };

        // Widget state
        this.isOpen = false;
        this.isLoading = false;
        this.currentCharacter = null;
        this.conversationHistory = [];
        this.retryCount = 0;
        this.widgetElement = null;
        this.eventListeners = new Map();

        // Character data
        this.characters = [
            {
                id: 'james-blackwood',
                name: 'James Blackwood',
                role: 'Mansion Owner',
                avatar: '/Profile images /james blackwood.png',
                description: 'The wealthy owner of Blackwood Manor'
            },
            {
                id: 'marcus-reynolds',
                name: 'Marcus Reynolds',
                role: 'Business Partner',
                avatar: '/Profile images /marcus.png',
                description: 'James\'s business associate'
            },
            {
                id: 'elena-rodriguez',
                name: 'Dr. Elena Rodriguez',
                role: 'Family Doctor',
                avatar: '/Profile images /elina.png',
                description: 'The family physician'
            },
            {
                id: 'lily-chen',
                name: 'Lily Chen',
                role: 'Art Student',
                avatar: '/Profile images /lilychen.png',
                description: 'Art student staying at the manor'
            },
            {
                id: 'thompson-butler',
                name: 'Mr. Thompson',
                role: 'Butler',
                avatar: '/Profile images /butler.png',
                description: 'The loyal family butler'
            }
        ];

        // Initialize widget
        this.init();
    }

    // Initialization
    init() {
        try {
            this.createWidget();
            this.setupEventListeners();
            this.loadConversationHistory();
            this.emit('ready');
            this.log('Widget initialized successfully');
        } catch (error) {
            this.handleError('Failed to initialize widget', error);
        }
    }

    // Widget creation
    createWidget() {
        // Create main container
        this.widgetElement = document.createElement('div');
        this.widgetElement.id = 'blackwood-detective-widget';
        this.widgetElement.className = 'blackwood-widget-container';
        this.widgetElement.style.cssText = this.getContainerStyles();

        // Create widget HTML
        this.widgetElement.innerHTML = this.getWidgetHTML();

        // Add to page
        document.body.appendChild(this.widgetElement);

        // Get references to elements
        this.elements = {
            widget: this.widgetElement,
            characterSelector: this.widgetElement.querySelector('.character-selector'),
            characterList: this.widgetElement.querySelector('.character-list'),
            characterInfo: this.widgetElement.querySelector('.character-info'),
            characterName: this.widgetElement.querySelector('#character-name'),
            characterRole: this.widgetElement.querySelector('#character-role'),
            characterAvatar: this.widgetElement.querySelector('#character-avatar'),
            chatMessages: this.widgetElement.querySelector('#chat-messages'),
            messageInput: this.widgetElement.querySelector('#message-input'),
            sendButton: this.widgetElement.querySelector('#send-button'),
            closeButton: this.widgetElement.querySelector('.close-button'),
            typingIndicator: null
        };

        // Initially hide widget
        this.hide();
    }

    getContainerStyles() {
        const positions = {
            'bottom-right': 'position: fixed; bottom: 20px; right: 20px;',
            'bottom-left': 'position: fixed; bottom: 20px; left: 20px;',
            'top-right': 'position: fixed; top: 20px; right: 20px;',
            'top-left': 'position: fixed; top: 20px; left: 20px;'
        };

        return `
            ${positions[this.config.position] || positions['bottom-right']}
            width: 400px;
            height: 600px;
            z-index: 10000;
            font-family: 'Georgia', serif;
            display: none;
        `;
    }

    getWidgetHTML() {
        return `
            <div class="detective-widget">
                <!-- Character Selector -->
                <div class="character-selector" style="display: none;">
                    <button class="selector-close" onclick="this.closest('.blackwood-widget-container').blackwoodWidget.hideCharacterSelector()">&times;</button>
                    <div class="selector-header">
                        <h3>Select a Character to Interview</h3>
                        <p>Choose who you'd like to question about the case</p>
                    </div>
                    <div class="character-list">
                        ${this.characters.map(char => `
                            <div class="character-card" data-character-id="${char.id}">
                                <img src="${char.avatar}" alt="${char.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM4QjQ1MTMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdXNwZWN0PC90ZXh0Pgo8L3N2Zz4='">
                                <h4>${char.name}</h4>
                                <p>${char.role}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Main Widget -->
                <div class="widget-header">
                    <div class="character-info" id="character-info">
                        <img src="/Profile images /james blackwood.png" alt="Detective" class="character-avatar" id="character-avatar">
                        <div class="character-details">
                            <h3 id="character-name">Detective Chat</h3>
                            <p id="character-role">Investigation Assistant</p>
                        </div>
                        <div class="online-indicator"></div>
                    </div>
                    <button class="close-button" onclick="this.closest('.blackwood-widget-container').blackwoodWidget.close()">&times;</button>
                </div>
                
                <div class="widget-chat" id="chat-messages">
                    <div class="message character-message">
                        <strong>System:</strong><br>
                        Welcome, Detective. Select a character to begin your investigation.
                    </div>
                </div>
                
                <div class="widget-input">
                    <div class="input-group">
                        <textarea 
                            class="message-input" 
                            id="message-input" 
                            placeholder="Ask about the case..."
                            rows="1"
                        ></textarea>
                        <button class="send-button" onclick="this.closest('.blackwood-widget-container').blackwoodWidget.sendMessage()" id="send-button">Send</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Event listeners setup
    setupEventListeners() {
        // Store reference to this widget on the container
        this.widgetElement.blackwoodWidget = this;

        // Character selection
        if (this.elements.characterList) {
            this.elements.characterList.addEventListener('click', (e) => {
                const characterCard = e.target.closest('.character-card');
                if (characterCard) {
                    const characterId = characterCard.dataset.characterId;
                    this.selectCharacter(characterId);
                }
            });
        }

        // Message input
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.elements.messageInput.addEventListener('input', (e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            });
        }

        // Character info click to show selector
        if (this.elements.characterInfo) {
            this.elements.characterInfo.addEventListener('click', () => {
                this.showCharacterSelector();
            });
        }

        // Window events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('beforeunload', () => this.saveConversationHistory());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

        // Network events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    // Public API Methods
    show() {
        try {
            if (this.widgetElement) {
                this.widgetElement.style.display = 'block';
                this.isOpen = true;
                this.emit('shown');
                this.log('Widget shown');
            }
        } catch (error) {
            this.handleError('Failed to show widget', error);
        }
    }

    hide() {
        try {
            if (this.widgetElement) {
                this.widgetElement.style.display = 'none';
                this.isOpen = false;
                this.emit('hidden');
                this.log('Widget hidden');
            }
        } catch (error) {
            this.handleError('Failed to hide widget', error);
        }
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    selectCharacter(characterId) {
        try {
            const character = this.characters.find(c => c.id === characterId);
            if (!character) {
                this.handleError(`Character not found: ${characterId}`);
                return;
            }

            this.currentCharacter = character;
            this.updateCharacterUI();
            this.hideCharacterSelector();
            this.emit('characterSelected', character);
            this.log(`Character selected: ${character.name}`);

            // Add welcome message
            this.addMessage(`Hello Detective. I'm ${character.name}. What would you like to know about the case?`, 'character');
        } catch (error) {
            this.handleError('Failed to select character', error);
        }
    }

    sendMessage() {
        try {
            if (!this.elements.messageInput || !this.elements.messageInput.value.trim()) {
                this.log('No message to send');
                return;
            }

            if (!this.currentCharacter) {
                this.showCharacterSelector();
                return;
            }

            const message = this.elements.messageInput.value.trim();
            this.elements.messageInput.value = '';

            this.addMessage(message, 'user');
            this.sendToAPI(message);
        } catch (error) {
            this.handleError('Failed to send message', error);
        }
    }

    showCharacterSelector() {
        try {
            if (this.elements.characterSelector) {
                this.elements.characterSelector.style.display = 'flex';
                this.emit('characterSelectorShown');
            }
        } catch (error) {
            this.handleError('Failed to show character selector', error);
        }
    }

    hideCharacterSelector() {
        try {
            if (this.elements.characterSelector) {
                this.elements.characterSelector.style.display = 'none';
                this.emit('characterSelectorHidden');
            }
        } catch (error) {
            this.handleError('Failed to hide character selector', error);
        }
    }

    clearConversation() {
        try {
            this.conversationHistory = [];
            if (this.elements.chatMessages) {
                this.elements.chatMessages.innerHTML = '<div class="message character-message"><strong>System:</strong><br>Conversation cleared. Select a character to begin your investigation.</div>';
            }
            this.saveConversationHistory();
            this.emit('conversationCleared');
            this.log('Conversation cleared');
        } catch (error) {
            this.handleError('Failed to clear conversation', error);
        }
    }

    // Private Methods
    updateCharacterUI() {
        try {
            if (!this.currentCharacter) return;

            if (this.elements.characterName) {
                this.elements.characterName.textContent = this.currentCharacter.name;
            }

            if (this.elements.characterRole) {
                this.elements.characterRole.textContent = this.currentCharacter.role;
            }

            if (this.elements.characterAvatar) {
                this.elements.characterAvatar.src = this.currentCharacter.avatar;
            }
        } catch (error) {
            this.handleError('Failed to update character UI', error);
        }
    }

    async sendToAPI(message) {
        try {
            this.showTypingIndicator();

            const requestData = {
                character: this.currentCharacter.id,
                message: message,
                conversationHistory: this.conversationHistory
            };

            const response = await this.makeRequest('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            this.hideTypingIndicator();

            if (response.success) {
                this.addMessage(response.response, 'character');
                this.retryCount = 0; // Reset retry count on success
            } else {
                this.handleAPIError(response.error || 'Unknown API error');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.handleAPIError(error.message);
        }
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.config.apiUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    handleAPIError(error) {
        if (this.retryCount < this.config.maxRetries) {
            this.retryCount++;
            this.log(`API error, retrying (${this.retryCount}/${this.config.maxRetries}): ${error}`);
            setTimeout(() => {
                // Retry logic would go here
                this.addMessage('Connection issue, retrying...', 'character');
            }, this.config.retryDelay * this.retryCount);
        } else {
            this.log(`Max retries exceeded: ${error}`);
            this.addMessage('I apologize, but I cannot respond right now. Please check your connection and try again.', 'character');
            this.retryCount = 0;
        }
    }

    addMessage(text, type) {
        try {
            if (!this.elements.chatMessages) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;

            const sender = type === 'user' ? 'You' : (this.currentCharacter?.name || 'System');
            messageDiv.innerHTML = `<strong>${sender}:</strong><br>${text}`;

            this.elements.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();

            // Add to conversation history
            this.conversationHistory.push({
                content: text,
                type: type,
                timestamp: new Date().toISOString(),
                characterId: this.currentCharacter?.id
            });

            this.saveConversationHistory();
            this.emit('messageAdded', { text, type, sender });
        } catch (error) {
            this.handleError('Failed to add message', error);
        }
    }

    showTypingIndicator() {
        try {
            if (!this.elements.chatMessages) return;

            this.elements.typingIndicator = document.createElement('div');
            this.elements.typingIndicator.className = 'typing-indicator';
            this.elements.typingIndicator.innerHTML = `
                <strong>${this.currentCharacter?.name || 'Character'}:</strong><br>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;

            this.elements.chatMessages.appendChild(this.elements.typingIndicator);
            this.scrollToBottom();
        } catch (error) {
            this.handleError('Failed to show typing indicator', error);
        }
    }

    hideTypingIndicator() {
        try {
            if (this.elements.typingIndicator) {
                this.elements.typingIndicator.remove();
                this.elements.typingIndicator = null;
            }
        } catch (error) {
            this.handleError('Failed to hide typing indicator', error);
        }
    }

    scrollToBottom() {
        try {
            if (this.elements.chatMessages) {
                this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
            }
        } catch (error) {
            this.handleError('Failed to scroll to bottom', error);
        }
    }

    saveConversationHistory() {
        try {
            localStorage.setItem('blackwood-widget-history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            this.log('Could not save conversation history');
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('blackwood-widget-history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            this.log('Could not load conversation history');
            this.conversationHistory = [];
        }
    }

    // Event handling
    handleResize() {
        this.scrollToBottom();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.saveConversationHistory();
        } else {
            this.scrollToBottom();
        }
    }

    handleOnline() {
        this.addMessage('Connection restored. You can continue your investigation.', 'character');
    }

    handleOffline() {
        this.addMessage('Connection lost. Some features may not work until connection is restored.', 'character');
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.handleError(`Event callback error for ${event}`, error);
                }
            });
        }
    }

    // Utility methods
    log(message) {
        if (this.config.debug) {
            console.log(`[BlackwoodWidget] ${message}`);
        }
    }

    handleError(message, error) {
        console.error(`[BlackwoodWidget] ${message}`, error);
        this.emit('error', { message, error });
    }

    // Public getters
    getCurrentCharacter() {
        return this.currentCharacter;
    }

    getConversationHistory() {
        return [...this.conversationHistory];
    }

    isWidgetOpen() {
        return this.isOpen;
    }

    // Cleanup
    destroy() {
        try {
            this.saveConversationHistory();
            if (this.widgetElement && this.widgetElement.parentNode) {
                this.widgetElement.parentNode.removeChild(this.widgetElement);
            }
            this.eventListeners.clear();
            this.emit('destroyed');
        } catch (error) {
            this.handleError('Failed to destroy widget', error);
        }
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
            autoOpen: widgetElement.dataset.autoOpen === 'true'
        };
        
        window.blackwoodWidget = new BlackwoodDetectiveWidget(config);
        
        if (config.autoOpen) {
            window.blackwoodWidget.show();
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlackwoodDetectiveWidget;
}

// Global access
window.BlackwoodDetectiveWidget = BlackwoodDetectiveWidget;
