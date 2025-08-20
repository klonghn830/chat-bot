/**
 * ABM Chatbot Widget - CDN Version
 * Embeddable chatbot widget with n8n webhook integration
 * Usage: <script src="https://your-cdn.com/abm-chatbot.js"></script>
 */

(function() {
    'use strict';
    
    // Prevent multiple initialization
    if (window.ABMChatbot) {
        return;
    }

    // Inject CSS styles
    const styles = `
        /* ABM Chatbot Styles */
        #abm-chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #abm-chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #E31E24 0%, #B71C1C 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(227, 30, 36, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        #abm-chatbot-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(227, 30, 36, 0.6);
        }

        #abm-chatbot-toggle svg {
            color: white;
            transition: transform 0.3s ease;
        }

        #abm-chatbot-toggle.open svg {
            transform: rotate(180deg);
        }

        /* Notification badge */
        #abm-chatbot-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: none;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        #abm-chatbot-container {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            transform: scale(0) translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        #abm-chatbot-container.show {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .abm-chat-header {
            background: linear-gradient(135deg, #E31E24 0%, #B71C1C 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .abm-brand-info h3 {
            margin: 0;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .abm-brand-info p {
            margin: 0;
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .abm-status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #4CAF50;
            animation: abm-pulse 2s infinite;
        }

        @keyframes abm-pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }

        .abm-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }

        .abm-message {
            margin-bottom: 15px;
            display: flex;
            animation: abm-slideIn 0.3s ease;
        }

        @keyframes abm-slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .abm-message.user {
            justify-content: flex-end;
        }

        .abm-message.bot {
            justify-content: flex-start;
        }

        .abm-message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            position: relative;
            word-wrap: break-word;
            line-height: 1.5;
            white-space: normal;
        }

        .abm-message.bot .abm-message-bubble {
            background: white;
            color: #333;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid #e0e0e0;
        }

        .abm-message.user .abm-message-bubble {
            background: linear-gradient(135deg, #E31E24 0%, #B71C1C 100%);
            color: white;
            box-shadow: 0 2px 12px rgba(227, 30, 36, 0.3);
        }

        .abm-message-time {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 5px;
            text-align: right;
        }

        .abm-typing-indicator {
            display: none;
            margin-bottom: 15px;
        }

        .abm-typing-indicator.show {
            display: block;
        }

        .abm-typing-dots {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: white;
            border-radius: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid #e0e0e0;
            width: fit-content;
        }

        .abm-typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #E31E24;
            margin: 0 2px;
            animation: abm-typing 1.4s infinite ease-in-out;
        }

        .abm-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .abm-typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .abm-typing-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes abm-typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        .abm-chat-input {
            padding: 20px;
            background: white;
            border-top: 1px solid #e0e0e0;
        }

        .abm-input-wrapper {
            display: flex;
            align-items: flex-end;
            background: #f5f5f5;
            border-radius: 25px;
            padding: 5px;
            transition: all 0.3s ease;
        }

        .abm-input-wrapper:focus-within {
            background: white;
            box-shadow: 0 0 0 2px rgba(227, 30, 36, 0.2);
        }

        .abm-input-wrapper textarea {
            flex: 1;
            border: none;
            background: transparent;
            padding: 12px 16px;
            font-size: 14px;
            outline: none;
            resize: none;
            max-height: 100px;
            font-family: inherit;
            color: #000;
        }

        .abm-input-wrapper textarea::placeholder {
            color: #999;
        }

        .abm-send-btn {
            width: 40px;
            height: 40px;
            border: none;
            background: linear-gradient(135deg, #E31E24 0%, #B71C1C 100%);
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-right: 5px;
        }

        .abm-send-btn:hover:not(:disabled) {
            transform: scale(1.05);
        }

        .abm-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .abm-welcome {
            text-align: center;
            color: #666;
            padding: 20px;
            font-style: italic;
        }

        .abm-connection-status {
            padding: 0 20px 10px;
            text-align: right;
            font-size: 11px;
            opacity: 0.7;
        }

        .abm-connection-status.connected { color: #4CAF50; }
        .abm-connection-status.disconnected { color: #f44336; }

        /* Mobile responsive */
        @media (max-width: 480px) {
            #abm-chatbot-widget {
                bottom: 10px;
                right: 10px;
            }
            
            #abm-chatbot-container {
                width: calc(100vw - 20px);
                height: calc(100vh - 100px);
                right: -10px;
                bottom: 70px;
            }
        }

        /* Scroll styling */
        .abm-chat-messages::-webkit-scrollbar {
            width: 4px;
        }
        
        .abm-chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .abm-chat-messages::-webkit-scrollbar-thumb {
            background: rgba(227, 30, 36, 0.3);
            border-radius: 2px;
        }
    `;

    // Configuration
    const ABM_CHATBOT_CONFIG = {
        webhookUrl: 'https://abm.hocn8n.com/webhook/86de9261-be70-4524-9638-e92b37a5575a/chat', // Thay bằng URL thực tế
        brandName: 'ABM - AI BUSINESS MASTER',
        brandSubtitle: 'Assistant Bot',
        welcomeMessage: 'Xin chào! Tôi là ABM AI Assistant. Tôi có thể giúp gì cho bạn hôm nay?',
        placeholder: 'Nhập tin nhắn của bạn...',
        position: 'bottom-right', // bottom-right, bottom-left
        testMode: false // BẬT TEST MODE TẠI ĐÂY
    };

    let isOpen = false;
    let isTyping = false;
    let isConnected = true;
    let messages = [];
    let sessionId = null;

    // Generate session ID
    function generateSessionId() {
        if (!sessionId) {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, 9);
            sessionId = `${timestamp}-${random}`;
        }
        return sessionId;
    }

    // Inject styles into page
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Create widget HTML
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'abm-chatbot-widget';
        
        widget.innerHTML = `
            <button id="abm-chatbot-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
                </svg>
                <div id="abm-chatbot-badge">1</div>
            </button>
            
            <div id="abm-chatbot-container">
                <div class="abm-chat-header">
                    <div class="abm-brand-info">
                        <h3>${ABM_CHATBOT_CONFIG.brandName}</h3>
                        <p>${ABM_CHATBOT_CONFIG.brandSubtitle}</p>
                    </div>
                    <div class="abm-status-dot"></div>
                </div>
                
                <div class="abm-chat-messages" id="abm-chat-messages">
                    <div class="abm-welcome">${ABM_CHATBOT_CONFIG.welcomeMessage}</div>
                </div>
                
                <div class="abm-typing-indicator" id="abm-typing-indicator">
                    <div class="abm-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <div class="abm-chat-input">
                    <div class="abm-input-wrapper">
                        <textarea id="abm-chat-textarea" placeholder="${ABM_CHATBOT_CONFIG.placeholder}" rows="1" maxlength="500"></textarea>
                        <button id="abm-send-btn" class="abm-send-btn" disabled>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="abm-connection-status connected" id="abm-connection-status">
                    Đã kết nối
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        return widget;
    }

    // Initialize event listeners
    function initEventListeners() {
        const widget = document.getElementById('abm-chatbot-widget');
        const toggle = document.getElementById('abm-chatbot-toggle');
        const container = document.getElementById('abm-chatbot-container');
        const textarea = document.getElementById('abm-chat-textarea');
        const sendBtn = document.getElementById('abm-send-btn');

        toggle.addEventListener('click', toggleChat);
        sendBtn.addEventListener('click', sendMessage);
        textarea.addEventListener('input', handleTextareaInput);
        textarea.addEventListener('keypress', handleKeyPress);

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!widget.contains(e.target) && isOpen) {
                toggleChat();
            }
        });
    }

    // Toggle chat visibility
    function toggleChat() {
        const toggle = document.getElementById('abm-chatbot-toggle');
        const container = document.getElementById('abm-chatbot-container');
        const badge = document.getElementById('abm-chatbot-badge');
        
        isOpen = !isOpen;
        toggle.classList.toggle('open', isOpen);
        container.classList.toggle('show', isOpen);
        
        if (isOpen) {
            badge.style.display = 'none';
            document.getElementById('abm-chat-textarea').focus();
        }
    }

    // Handle textarea input
    function handleTextareaInput(e) {
        const textarea = e.target;
        const sendBtn = document.getElementById('abm-send-btn');
        
        // Auto resize
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
        
        // Enable/disable send button
        sendBtn.disabled = textarea.value.trim() === '' || isTyping;
    }

    // Handle key press
    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    // Send message
    async function sendMessage() {
        const textarea = document.getElementById('abm-chat-textarea');
        const message = textarea.value.trim();
        
        if (!message || isTyping) return;

        // Add user message
        addMessage(message, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';
        document.getElementById('abm-send-btn').disabled = true;

        // Show typing
        showTyping();

        // Check if webhook URL is configured
        if (ABM_CHATBOT_CONFIG.webhookUrl === 'YOUR_N8N_WEBHOOK_URL_HERE' || !ABM_CHATBOT_CONFIG.webhookUrl) {
            hideTyping();
            addMessage('⚠️ Webhook URL chưa được cấu hình. Vui lòng liên hệ admin để setup n8n webhook.', 'bot');
            updateConnectionStatus(false);
            textarea.focus();
            return;
        }

        // Test mode - return mock response
        if (ABM_CHATBOT_CONFIG.testMode) {
            hideTyping();
            const testResponse = `Đây là response test cho tin nhắn: "${message}"\n\nCác tính năng:\n• Xuống dòng hoạt động\n• Format text đẹp\n• Session ID: ${generateSessionId()}`;
            addMessage(testResponse, 'bot');
            updateConnectionStatus(true);
            textarea.focus();
            return;
        }

        try {
            // Prepare data in the format n8n expects
            const payload = {
                action: 'sendMessage',
                sessionId: generateSessionId(),
                chatInput: message
            };

            console.log('🚀 Sending payload to n8n:', payload);
            console.log('📡 Webhook URL:', ABM_CHATBOT_CONFIG.webhookUrl);

            const response = await fetch(ABM_CHATBOT_CONFIG.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
                mode: 'cors', // Enable CORS
                credentials: 'omit' // Don't send cookies
            });

            console.log('📊 Response status:', response.status);
            console.log('📋 Response headers:', [...response.headers.entries()]);

            if (response.ok) {
                // Check content type
                const contentType = response.headers.get('content-type') || '';
                console.log('📄 Content-Type:', contentType);

                let data;
                
                if (contentType.includes('application/json')) {
                    try {
                        data = await response.json();
                        console.log('✅ JSON Response:', data);
                    } catch (jsonError) {
                        console.error('❌ JSON Parse Error:', jsonError);
                        const textResponse = await response.text();
                        console.log('📝 Raw response:', textResponse);
                        data = { response: 'Server trả về dữ liệu không hợp lệ.' };
                    }
                } else {
                    // If not JSON, try to get as text
                    const textResponse = await response.text();
                    console.log('📝 Text response:', textResponse.substring(0, 200) + '...');
                    
                    // Try to parse as JSON anyway (sometimes content-type is wrong)
                    try {
                        data = JSON.parse(textResponse);
                        console.log('✅ Parsed JSON from text:', data);
                    } catch (e) {
                        console.log('❌ Not JSON, treating as text');
                        // If it's HTML error page, show friendly message
                        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
                            data = { response: 'Server trả về trang web thay vì dữ liệu. Vui lòng kiểm tra cấu hình webhook.' };
                        } else {
                            data = { response: textResponse };
                        }
                    }
                }
                
                hideTyping();
                
                // Handle different response formats from n8n
                let botMessage;
                if (data.response) {
                    botMessage = data.response;
                } else if (data.message) {
                    botMessage = data.message;
                } else if (data.output) {
                    botMessage = data.output;
                } else if (data.text) {
                    botMessage = data.text;
                } else if (typeof data === 'string') {
                    botMessage = data;
                } else {
                    console.log('⚠️ Unexpected response format:', data);
                    botMessage = 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
                }
                
                console.log('💬 Bot message before formatting:', JSON.stringify(botMessage));
                addMessage(botMessage, 'bot');
                updateConnectionStatus(true);
            } else {
                // Handle HTTP errors
                const errorText = await response.text();
                console.error('❌ HTTP Error:', response.status, response.statusText);
                console.error('❌ Error body:', errorText.substring(0, 500));
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('💥 ABM Chatbot error:', error);
            hideTyping();
            
            // More specific error messages
            let errorMessage = 'Xin lỗi, có lỗi xảy ra khi kết nối. Vui lòng thử lại sau.';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = '🔌 Không thể kết nối đến server. Vui lòng kiểm tra:\n• URL webhook có đúng không?\n• N8N có đang chạy không?\n• Có vấn đề mạng không?';
            } else if (error.message.includes('JSON')) {
                errorMessage = '📄 Server trả về dữ liệu không hợp lệ. Vui lòng liên hệ admin kiểm tra cấu hình n8n.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = `🚨 Lỗi server: ${error.message}\n\nVui lòng kiểm tra:\n• N8N workflow có hoạt động không?\n• Webhook endpoint có đúng không?`;
            } else if (error.message.includes('CORS')) {
                errorMessage = '🚫 Lỗi CORS. N8N cần cấu hình để chấp nhận requests từ domain này.';
            }
            
            addMessage(errorMessage, 'bot');
            updateConnectionStatus(false);
        }

        textarea.focus();
    }

    // Format text with line breaks
    function formatMessageText(text) {
        if (!text) return '';
        
        console.log('Formatting text:', JSON.stringify(text));
        
        // Convert various line break formats to HTML
        let formatted = text
            .replace(/\r\n/g, '\n')  // Normalize Windows line breaks
            .replace(/\r/g, '\n')    // Normalize Mac line breaks
            .replace(/\\n/g, '\n')   // Convert escaped \n to actual line breaks
            .replace(/\n/g, '<br>')  // Convert to HTML breaks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>'); // Italic (not part of **)
        
        console.log('Formatted text:', formatted);
        return formatted;
    }

    // Add message
    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('abm-chat-messages');
        const welcome = messagesContainer.querySelector('.abm-welcome');
        
        if (welcome) {
            welcome.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `abm-message ${sender}`;
        
        const time = new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const formattedText = formatMessageText(text);

        messageDiv.innerHTML = `
            <div class="abm-message-bubble">
                ${formattedText}
                <div class="abm-message-time">${time}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        messages.push({ text, sender, time, sessionId: generateSessionId() });

        // Show notification if chat is closed
        if (!isOpen && sender === 'bot') {
            showNotification();
        }
    }

    // Show/hide typing
    function showTyping() {
        isTyping = true;
        document.getElementById('abm-typing-indicator').classList.add('show');
        document.getElementById('abm-chat-messages').scrollTop = document.getElementById('abm-chat-messages').scrollHeight;
    }

    function hideTyping() {
        isTyping = false;
        document.getElementById('abm-typing-indicator').classList.remove('show');
    }

    // Update connection status
    function updateConnectionStatus(connected) {
        isConnected = connected;
        const status = document.getElementById('abm-connection-status');
        const dot = document.querySelector('.abm-status-dot');
        
        if (status && dot) {
            if (connected) {
                status.textContent = 'Đã kết nối';
                status.className = 'abm-connection-status connected';
                dot.style.background = '#4CAF50';
            } else {
                status.textContent = 'Mất kết nối';
                status.className = 'abm-connection-status disconnected';
                dot.style.background = '#f44336';
            }
        }
    }

    // Show notification
    function showNotification() {
        const badge = document.getElementById('abm-chatbot-badge');
        if (badge) {
            badge.style.display = 'flex';
        }
    }

    // Test connection periodically
    function startConnectionTest() {
        if (ABM_CHATBOT_CONFIG.webhookUrl !== 'https://abm.hocn8n.com/webhook/86de9261-be70-4524-9638-e92b37a5575a/chat') {
            setInterval(async () => {
                try {
                    const response = await fetch(ABM_CHATBOT_CONFIG.webhookUrl, {
                        method: 'HEAD'
                    });
                    updateConnectionStatus(response.ok);
                } catch (error) {
                    updateConnectionStatus(false);
                }
            }, 30000);
        }
    }

    // Initialize widget
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Prevent multiple initialization
        if (document.getElementById('abm-chatbot-widget')) {
            return;
        }

        injectStyles();
        createWidget();
        initEventListeners();
        startConnectionTest();

        // Global API
        window.ABMChatbot = {
            open: () => !isOpen && toggleChat(),
            close: () => isOpen && toggleChat(),
            toggle: toggleChat,
            sendMessage: (msg) => {
                if (msg && typeof msg === 'string') {
                    document.getElementById('abm-chat-textarea').value = msg;
                    sendMessage();
                }
            },
            config: ABM_CHATBOT_CONFIG,
            updateConfig: (newConfig) => {
                Object.assign(ABM_CHATBOT_CONFIG, newConfig);
                console.log('✅ Config updated:', ABM_CHATBOT_CONFIG);
            },
            enableTestMode: () => {
                ABM_CHATBOT_CONFIG.testMode = true;
                console.log('🧪 Test mode enabled');
            },
            disableTestMode: () => {
                ABM_CHATBOT_CONFIG.testMode = false;
                console.log('🧪 Test mode disabled');
            },
            getSessionId: () => generateSessionId(),
            getMessages: () => messages
        };

        console.log('✅ ABM Chatbot Widget loaded successfully');
        console.log('📧 Session ID:', generateSessionId());
    }

    // Auto-initialize
    init();

})();

