'use client';

import React, { useState, useEffect } from 'react';
import { characters } from '@/lib/characters';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  User, 
  MessageSquare,
  Download,
  Eye,
  Settings
} from 'lucide-react';

export default function WidgetsPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [widgetConfig, setWidgetConfig] = useState({
    theme: 'sepia',
    position: 'bottom-right',
    enableVoice: true,
    showHeader: true,
    width: '400px',
    height: '600px',
    apiUrl: 'https://blackwood-chat-app.vercel.app'
  });

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateWidgetCode = (character: any) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${character.name} - Detective Widget</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
            background: #1a1a1a;
            color: #d4af37;
        }
        .widget-container {
            position: fixed;
            ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            width: ${widgetConfig.width};
            height: ${widgetConfig.height};
            background: linear-gradient(135deg, #2c1810 0%, #1a0f0a 100%);
            border: 2px solid #d4af37;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            z-index: 10000;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .widget-header {
            background: linear-gradient(90deg, #8B4513 0%, #A0522D 100%);
            padding: 15px;
            text-align: center;
            border-bottom: 2px solid #d4af37;
        }
        .character-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
        }
        .character-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #d4af37;
            object-fit: cover;
        }
        .character-details h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        }
        .character-details p {
            margin: 0;
            font-size: 12px;
            opacity: 0.8;
        }
        .widget-chat {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #1a0f0a;
        }
        .message {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
        }
        .character-message {
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            color: white;
            align-self: flex-start;
        }
        .user-message {
            background: linear-gradient(135deg, #2F4F4F 0%, #1F2F2F 100%);
            color: white;
            align-self: flex-end;
            margin-left: auto;
        }
        .widget-input {
            padding: 15px;
            border-top: 2px solid #d4af37;
            background: #2c1810;
        }
        .input-group {
            display: flex;
            gap: 10px;
        }
        .message-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #d4af37;
            border-radius: 8px;
            background: #1a0f0a;
            color: #d4af37;
            font-family: 'Georgia', serif;
        }
        .send-button {
            padding: 10px 15px;
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }
        .send-button:hover {
            background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
        }
        .online-indicator {
            width: 8px;
            height: 8px;
            background: #00ff00;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: #d4af37;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="widget-container" id="detective-widget">
        ${widgetConfig.showHeader ? `
        <div class="widget-header">
            <div class="character-info">
                <img src="${widgetConfig.apiUrl}${character.avatar}" alt="${character.name}" class="character-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdXNwZWN0PC90ZXh0Pgo8L3N2Zz4='">
                <div class="character-details">
                    <h3>${character.name}</h3>
                    <p>${character.role}</p>
                </div>
                <div class="online-indicator"></div>
            </div>
        </div>
        ` : ''}
        
        <div class="widget-chat" id="chat-messages">
            <div class="message character-message">
                <strong>${character.name}:</strong><br>
                Hello Detective. I'm ready to answer your questions about the case.
            </div>
        </div>
        
        <div class="widget-input">
            <div class="input-group">
                <input type="text" class="message-input" id="message-input" placeholder="Ask ${character.name} a question...">
                <button class="send-button" onclick="sendMessage()">Send</button>
            </div>
        </div>
        
        <button class="close-button" onclick="closeWidget()">×</button>
    </div>

    <script>
        const character = ${JSON.stringify(character)};
        const apiUrl = '${widgetConfig.apiUrl}';
        
        function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message to chat
            addMessage(message, 'user');
            input.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Send to API
            fetch(apiUrl + '/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    character: character.id,
                    message: message,
                    conversationHistory: getConversationHistory()
                })
            })
            .then(response => response.json())
            .then(data => {
                hideTypingIndicator();
                if (data.success) {
                    addMessage(data.response, 'character');
                } else {
                    addMessage('I apologize, but I cannot respond right now.', 'character');
                }
            })
            .catch(error => {
                hideTypingIndicator();
                addMessage('There was an error. Please try again.', 'character');
                console.error('Error:', error);
            });
        }
        
        function addMessage(text, type) {
            const chatMessages = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${type}-message\`;
            
            if (type === 'user') {
                messageDiv.innerHTML = \`<strong>You:</strong><br>\${text}\`;
            } else {
                messageDiv.innerHTML = \`<strong>\${character.name}:</strong><br>\${text}\`;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function showTypingIndicator() {
            const chatMessages = document.getElementById('chat-messages');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'message character-message';
            typingDiv.innerHTML = \`<strong>\${character.name}:</strong><br><em>typing...</em>\`;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        function getConversationHistory() {
            const messages = document.querySelectorAll('.message');
            const history = [];
            messages.forEach(msg => {
                const text = msg.textContent.replace(/^(You|\\${character.name}):\\s*/, '');
                const type = msg.classList.contains('user-message') ? 'user' : 'character';
                history.push({ content: text, type: type });
            });
            return history;
        }
        
        function closeWidget() {
            document.getElementById('detective-widget').style.display = 'none';
        }
        
        // Allow Enter key to send message
        document.getElementById('message-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Auto-focus input
        document.getElementById('message-input').focus();
        
        console.log('Detective Widget loaded for', character.name);
    </script>
</body>
</html>`;
  };

  const generateEmbedCode = (character: any) => {
    return `<!-- ${character.name} Detective Widget -->
<div id="blackwood-widget-${character.id}" style="position: fixed; ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'} ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'} width: ${widgetConfig.width}; height: ${widgetConfig.height}; z-index: 10000;">
    <iframe 
        src="${widgetConfig.apiUrl}/widget/${character.id}?embed=true&theme=${widgetConfig.theme}&position=${widgetConfig.position}" 
        width="100%" 
        height="100%" 
        frameborder="0"
        style="border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
    </iframe>
</div>

<script>
    // Widget control functions
    function showBlackwoodWidget() {
        document.getElementById('blackwood-widget-${character.id}').style.display = 'block';
    }
    
    function hideBlackwoodWidget() {
        document.getElementById('blackwood-widget-${character.id}').style.display = 'none';
    }
    
    function toggleBlackwoodWidget() {
        const widget = document.getElementById('blackwood-widget-${character.id}');
        widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
    }
    
    // Listen for messages from widget
    window.addEventListener('message', function(event) {
        if (event.origin !== '${widgetConfig.apiUrl}') return;
        
        if (event.data.type === 'WIDGET_CLOSE') {
            hideBlackwoodWidget();
        } else if (event.data.type === 'CHARACTER_RESPONSE') {
            console.log('${character.name} responded:', event.data.message);
            // Handle character response in your game
        }
    });
</script>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-200 to-yellow-200 border-b-2 border-amber-400 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
            🕵️ Character Widget Generator
          </h1>
          <p className="text-amber-800 text-lg">
            Generate individual character widgets for your external games
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Selection */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
              Select Character
            </h2>
            
            <div className="space-y-3">
              {characters.map((character) => (
                <motion.div
                  key={character.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedCharacter.id === character.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-amber-200 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                    />
                    <div>
                      <h3 className="font-semibold text-amber-900">{character.name}</h3>
                      <p className="text-sm text-amber-700">{character.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Widget Configuration */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
              Widget Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-amber-700 mb-2 font-medium">Position</label>
                <select 
                  value={widgetConfig.position}
                  onChange={(e) => setWidgetConfig({...widgetConfig, position: e.target.value})}
                  className="w-full p-3 border-2 border-amber-300 rounded-lg"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-700 mb-2 font-medium">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={widgetConfig.width}
                    onChange={(e) => setWidgetConfig({...widgetConfig, width: e.target.value})}
                    placeholder="Width"
                    className="p-2 border-2 border-amber-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={widgetConfig.height}
                    onChange={(e) => setWidgetConfig({...widgetConfig, height: e.target.value})}
                    placeholder="Height"
                    className="p-2 border-2 border-amber-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={widgetConfig.showHeader}
                    onChange={(e) => setWidgetConfig({...widgetConfig, showHeader: e.target.checked})}
                    className="mr-2"
                  />
                  Show Character Header
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={widgetConfig.enableVoice}
                    onChange={(e) => setWidgetConfig({...widgetConfig, enableVoice: e.target.checked})}
                    className="mr-2"
                  />
                  Enable Voice (if available)
                </label>
              </div>
            </div>
          </div>

          {/* Widget Preview & Code */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
              {selectedCharacter.name} Widget
            </h2>
            
            {/* Widget Preview */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Preview</h3>
              <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-hidden relative">
                <div className="text-green-400 text-sm font-mono">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-2">Widget Preview</span>
                  </div>
                  <div className="text-xs">
                    <div className="text-blue-400">Character: {selectedCharacter.name}</div>
                    <div className="text-blue-400">Role: {selectedCharacter.role}</div>
                    <div className="text-blue-400">Position: {widgetConfig.position}</div>
                    <div className="text-blue-400">Size: {widgetConfig.width} × {widgetConfig.height}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(generateWidgetCode(selectedCharacter), 'full')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                {copiedCode === 'full' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Full Widget Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Widget HTML</span>
                  </>
                )}
              </button>

              <button
                onClick={() => copyToClipboard(generateEmbedCode(selectedCharacter), 'embed')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {copiedCode === 'embed' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Embed Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4" />
                    <span>Copy Embed Code</span>
                  </>
                )}
              </button>

              <a
                href={`/widget/${selectedCharacter.id}?embed=true`}
                target="_blank"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Widget</span>
              </a>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 mt-6">
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">How to Use</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Full Widget HTML</h4>
              <ul className="space-y-1 text-amber-700 text-sm">
                <li>• Complete standalone widget</li>
                <li>• Includes all styling and functionality</li>
                <li>• Works in any HTML page</li>
                <li>• No dependencies required</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Embed Code</h4>
              <ul className="space-y-1 text-amber-700 text-sm">
                <li>• Lightweight iframe embed</li>
                <li>• Easy to integrate</li>
                <li>• Automatic updates</li>
                <li>• Perfect for games</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
