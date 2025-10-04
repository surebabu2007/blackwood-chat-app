using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Text;
using Newtonsoft.Json;

/// <summary>
/// Blackwood Detective Widget Integration for Unity
/// Handles all edge cases and provides comprehensive error handling
/// </summary>
public class BlackwoodDetectiveWidget : MonoBehaviour
{
    [Header("Widget Configuration")]
    [SerializeField] private string apiUrl = "https://blackwood-chat-app.vercel.app";
    [SerializeField] private bool enableDebugLogging = true;
    [SerializeField] private float requestTimeout = 30f;
    [SerializeField] private int maxRetries = 3;
    [SerializeField] private float retryDelay = 1f;

    [Header("Character Settings")]
    [SerializeField] private string defaultCharacterId = "james-blackwood";
    [SerializeField] private bool autoSelectCharacter = true;

    [Header("UI References")]
    [SerializeField] private GameObject widgetUI;
    [SerializeField] private UnityEngine.UI.Text characterNameText;
    [SerializeField] private UnityEngine.UI.Text characterRoleText;
    [SerializeField] private UnityEngine.UI.Image characterAvatarImage;
    [SerializeField] private UnityEngine.UI.InputField messageInput;
    [SerializeField] private UnityEngine.UI.Button sendButton;
    [SerializeField] private UnityEngine.UI.Button closeButton;
    [SerializeField] private UnityEngine.UI.ScrollRect chatScrollRect;
    [SerializeField] private Transform messageContainer;
    [SerializeField] private GameObject messagePrefab;
    [SerializeField] private GameObject typingIndicatorPrefab;

    [Header("Character Data")]
    [SerializeField] private CharacterData[] characters = new CharacterData[]
    {
        new CharacterData
        {
            id = "james-blackwood",
            name = "James Blackwood",
            role = "Mansion Owner",
            avatarUrl = "/Profile images /james blackwood.png",
            description = "The wealthy owner of Blackwood Manor"
        },
        new CharacterData
        {
            id = "marcus-reynolds",
            name = "Marcus Reynolds",
            role = "Business Partner",
            avatarUrl = "/Profile images /marcus.png",
            description = "James's business associate"
        },
        new CharacterData
        {
            id = "elena-rodriguez",
            name = "Dr. Elena Rodriguez",
            role = "Family Doctor",
            avatarUrl = "/Profile images /elina.png",
            description = "The family physician"
        },
        new CharacterData
        {
            id = "lily-chen",
            name = "Lily Chen",
            role = "Art Student",
            avatarUrl = "/Profile images /lilychen.png",
            description = "Art student staying at the manor"
        },
        new CharacterData
        {
            id = "thompson-butler",
            name = "Mr. Thompson",
            role = "Butler",
            avatarUrl = "/Profile images /butler.png",
            description = "The loyal family butler"
        }
    };

    // Private fields
    private CharacterData currentCharacter;
    private List<ChatMessage> conversationHistory = new List<ChatMessage>();
    private bool isTyping = false;
    private int retryCount = 0;
    private Coroutine typingCoroutine;
    private bool isWidgetOpen = false;

    // Events
    public System.Action<CharacterData> OnCharacterSelected;
    public System.Action<ChatMessage> OnMessageReceived;
    public System.Action<ChatMessage> OnMessageSent;
    public System.Action<string> OnError;
    public System.Action OnWidgetOpened;
    public System.Action OnWidgetClosed;

    // Data structures
    [System.Serializable]
    public class CharacterData
    {
        public string id;
        public string name;
        public string role;
        public string avatarUrl;
        public string description;
    }

    [System.Serializable]
    public class ChatMessage
    {
        public string id;
        public string content;
        public string type; // "user" or "character"
        public string timestamp;
        public string characterId;
    }

    [System.Serializable]
    public class ChatRequest
    {
        public string character;
        public string message;
        public List<ChatMessage> conversationHistory;
    }

    [System.Serializable]
    public class ChatResponse
    {
        public bool success;
        public string response;
        public string error;
    }

    // Unity lifecycle
    void Start()
    {
        InitializeWidget();
        SetupEventListeners();
        LoadConversationHistory();
    }

    void OnDestroy()
    {
        SaveConversationHistory();
    }

    void OnApplicationPause(bool pauseStatus)
    {
        if (pauseStatus)
        {
            SaveConversationHistory();
        }
    }

    void OnApplicationFocus(bool hasFocus)
    {
        if (!hasFocus)
        {
            SaveConversationHistory();
        }
    }

    // Initialization
    private void InitializeWidget()
    {
        try
        {
            if (widgetUI != null)
            {
                widgetUI.SetActive(false);
            }

            if (autoSelectCharacter && !string.IsNullOrEmpty(defaultCharacterId))
            {
                SelectCharacter(defaultCharacterId);
            }

            LogDebug("Detective Widget initialized successfully");
        }
        catch (System.Exception e)
        {
            LogError($"Failed to initialize widget: {e.Message}");
        }
    }

    private void SetupEventListeners()
    {
        try
        {
            if (sendButton != null)
            {
                sendButton.onClick.AddListener(SendMessage);
            }

            if (closeButton != null)
            {
                closeButton.onClick.AddListener(CloseWidget);
            }

            if (messageInput != null)
            {
                messageInput.onEndEdit.AddListener(OnMessageInputEndEdit);
            }

            LogDebug("Event listeners setup complete");
        }
        catch (System.Exception e)
        {
            LogError($"Failed to setup event listeners: {e.Message}");
        }
    }

    // Public API Methods
    public void ShowWidget()
    {
        try
        {
            if (widgetUI != null)
            {
                widgetUI.SetActive(true);
                isWidgetOpen = true;
                OnWidgetOpened?.Invoke();
                LogDebug("Widget shown");
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to show widget: {e.Message}");
        }
    }

    public void HideWidget()
    {
        try
        {
            if (widgetUI != null)
            {
                widgetUI.SetActive(false);
                isWidgetOpen = false;
                OnWidgetClosed?.Invoke();
                LogDebug("Widget hidden");
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to hide widget: {e.Message}");
        }
    }

    public void ToggleWidget()
    {
        if (isWidgetOpen)
        {
            HideWidget();
        }
        else
        {
            ShowWidget();
        }
    }

    public void SelectCharacter(string characterId)
    {
        try
        {
            var character = System.Array.Find(characters, c => c.id == characterId);
            if (character == null)
            {
                LogError($"Character not found: {characterId}");
                return;
            }

            currentCharacter = character;
            UpdateCharacterUI();
            OnCharacterSelected?.Invoke(character);
            LogDebug($"Character selected: {character.name}");
        }
        catch (System.Exception e)
        {
            LogError($"Failed to select character: {e.Message}");
        }
    }

    public void SendMessage()
    {
        try
        {
            if (messageInput == null || string.IsNullOrEmpty(messageInput.text))
            {
                LogDebug("No message to send");
                return;
            }

            if (currentCharacter == null)
            {
                LogError("No character selected");
                return;
            }

            string messageText = messageInput.text.Trim();
            messageInput.text = "";

            var message = new ChatMessage
            {
                id = System.Guid.NewGuid().ToString(),
                content = messageText,
                type = "user",
                timestamp = System.DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                characterId = currentCharacter.id
            };

            AddMessageToUI(message);
            conversationHistory.Add(message);
            OnMessageSent?.Invoke(message);

            StartCoroutine(SendMessageToAPI(message));
        }
        catch (System.Exception e)
        {
            LogError($"Failed to send message: {e.Message}");
        }
    }

    public void ClearConversation()
    {
        try
        {
            conversationHistory.Clear();
            if (messageContainer != null)
            {
                foreach (Transform child in messageContainer)
                {
                    Destroy(child.gameObject);
                }
            }
            LogDebug("Conversation cleared");
        }
        catch (System.Exception e)
        {
            LogError($"Failed to clear conversation: {e.Message}");
        }
    }

    // Private Methods
    private void UpdateCharacterUI()
    {
        try
        {
            if (currentCharacter == null) return;

            if (characterNameText != null)
            {
                characterNameText.text = currentCharacter.name;
            }

            if (characterRoleText != null)
            {
                characterRoleText.text = currentCharacter.role;
            }

            if (characterAvatarImage != null && !string.IsNullOrEmpty(currentCharacter.avatarUrl))
            {
                StartCoroutine(LoadCharacterAvatar(currentCharacter.avatarUrl));
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to update character UI: {e.Message}");
        }
    }

    private IEnumerator LoadCharacterAvatar(string avatarUrl)
    {
        try
        {
            string fullUrl = apiUrl + avatarUrl;
            using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(fullUrl))
            {
                request.timeout = (int)requestTimeout;
                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    Texture2D texture = DownloadHandlerTexture.GetContent(request);
                    Sprite sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f));
                    characterAvatarImage.sprite = sprite;
                }
                else
                {
                    LogError($"Failed to load avatar: {request.error}");
                }
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to load character avatar: {e.Message}");
        }
    }

    private IEnumerator SendMessageToAPI(ChatMessage message)
    {
        try
        {
            ShowTypingIndicator();

            var requestData = new ChatRequest
            {
                character = currentCharacter.id,
                message = message.content,
                conversationHistory = conversationHistory
            };

            string jsonData = JsonConvert.SerializeObject(requestData);
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);

            using (UnityWebRequest request = new UnityWebRequest($"{apiUrl}/api/chat", "POST"))
            {
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");
                request.timeout = (int)requestTimeout;

                yield return request.SendWebRequest();

                HideTypingIndicator();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    try
                    {
                        var response = JsonConvert.DeserializeObject<ChatResponse>(request.downloadHandler.text);
                        
                        if (response.success)
                        {
                            var characterMessage = new ChatMessage
                            {
                                id = System.Guid.NewGuid().ToString(),
                                content = response.response,
                                type = "character",
                                timestamp = System.DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                                characterId = currentCharacter.id
                            };

                            AddMessageToUI(characterMessage);
                            conversationHistory.Add(characterMessage);
                            OnMessageReceived?.Invoke(characterMessage);
                            retryCount = 0; // Reset retry count on success
                        }
                        else
                        {
                            HandleAPIError(response.error ?? "Unknown API error");
                        }
                    }
                    catch (System.Exception e)
                    {
                        LogError($"Failed to parse API response: {e.Message}");
                        HandleAPIError("Failed to parse response");
                    }
                }
                else
                {
                    HandleAPIError($"Network error: {request.error}");
                }
            }
        }
        catch (System.Exception e)
        {
            HideTypingIndicator();
            LogError($"Failed to send message to API: {e.Message}");
            HandleAPIError("Failed to send message");
        }
    }

    private void HandleAPIError(string error)
    {
        if (retryCount < maxRetries)
        {
            retryCount++;
            LogDebug($"API error, retrying ({retryCount}/{maxRetries}): {error}");
            StartCoroutine(RetryAfterDelay());
        }
        else
        {
            LogError($"Max retries exceeded: {error}");
            OnError?.Invoke($"Connection failed after {maxRetries} attempts. Please check your internet connection.");
            retryCount = 0;
        }
    }

    private IEnumerator RetryAfterDelay()
    {
        yield return new WaitForSeconds(retryDelay * retryCount);
        // The retry logic would need to be implemented based on the specific error
        // For now, we'll just show an error message
        OnError?.Invoke("Connection issue. Please try again.");
    }

    private void AddMessageToUI(ChatMessage message)
    {
        try
        {
            if (messageContainer == null || messagePrefab == null) return;

            GameObject messageObj = Instantiate(messagePrefab, messageContainer);
            
            // Configure message UI based on message type
            var messageText = messageObj.GetComponentInChildren<UnityEngine.UI.Text>();
            if (messageText != null)
            {
                messageText.text = $"{message.type == "user" ? "You" : currentCharacter?.name}: {message.content}";
            }

            // Scroll to bottom
            if (chatScrollRect != null)
            {
                StartCoroutine(ScrollToBottom());
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to add message to UI: {e.Message}");
        }
    }

    private void ShowTypingIndicator()
    {
        try
        {
            if (typingIndicatorPrefab != null && messageContainer != null)
            {
                GameObject typingObj = Instantiate(typingIndicatorPrefab, messageContainer);
                typingObj.name = "TypingIndicator";
                isTyping = true;
                
                if (typingCoroutine != null)
                {
                    StopCoroutine(typingCoroutine);
                }
                typingCoroutine = StartCoroutine(ScrollToBottom());
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to show typing indicator: {e.Message}");
        }
    }

    private void HideTypingIndicator()
    {
        try
        {
            if (messageContainer != null)
            {
                Transform typingIndicator = messageContainer.Find("TypingIndicator");
                if (typingIndicator != null)
                {
                    Destroy(typingIndicator.gameObject);
                }
            }
            isTyping = false;
        }
        catch (System.Exception e)
        {
            LogError($"Failed to hide typing indicator: {e.Message}");
        }
    }

    private IEnumerator ScrollToBottom()
    {
        yield return new WaitForEndOfFrame();
        if (chatScrollRect != null)
        {
            chatScrollRect.verticalNormalizedPosition = 0f;
        }
    }

    private void OnMessageInputEndEdit(string text)
    {
        if (Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.KeypadEnter))
        {
            SendMessage();
        }
    }

    private void SaveConversationHistory()
    {
        try
        {
            string json = JsonConvert.SerializeObject(conversationHistory);
            PlayerPrefs.SetString("DetectiveWidget_ConversationHistory", json);
            PlayerPrefs.Save();
            LogDebug("Conversation history saved");
        }
        catch (System.Exception e)
        {
            LogError($"Failed to save conversation history: {e.Message}");
        }
    }

    private void LoadConversationHistory()
    {
        try
        {
            string json = PlayerPrefs.GetString("DetectiveWidget_ConversationHistory", "");
            if (!string.IsNullOrEmpty(json))
            {
                conversationHistory = JsonConvert.DeserializeObject<List<ChatMessage>>(json) ?? new List<ChatMessage>();
                LogDebug($"Loaded {conversationHistory.Count} messages from history");
            }
        }
        catch (System.Exception e)
        {
            LogError($"Failed to load conversation history: {e.Message}");
            conversationHistory = new List<ChatMessage>();
        }
    }

    // Utility Methods
    private void LogDebug(string message)
    {
        if (enableDebugLogging)
        {
            Debug.Log($"[DetectiveWidget] {message}");
        }
    }

    private void LogError(string message)
    {
        Debug.LogError($"[DetectiveWidget] {message}");
        OnError?.Invoke(message);
    }

    // Public getters
    public CharacterData GetCurrentCharacter() => currentCharacter;
    public List<ChatMessage> GetConversationHistory() => new List<ChatMessage>(conversationHistory);
    public bool IsWidgetOpen() => isWidgetOpen;
    public bool IsTyping() => isTyping;

    // Static utility methods for easy integration
    public static BlackwoodDetectiveWidget FindOrCreate()
    {
        BlackwoodDetectiveWidget widget = FindObjectOfType<BlackwoodDetectiveWidget>();
        if (widget == null)
        {
            GameObject widgetObj = new GameObject("DetectiveWidget");
            widget = widgetObj.AddComponent<BlackwoodDetectiveWidget>();
        }
        return widget;
    }

    // Example integration methods
    public void StartInvestigation(string characterId)
    {
        SelectCharacter(characterId);
        ShowWidget();
    }

    public void EndInvestigation()
    {
        HideWidget();
        ClearConversation();
    }

    public void SetCharacterByRoom(string roomId)
    {
        // Map rooms to characters
        string characterId = roomId switch
        {
            "study" => "james-blackwood",
            "office" => "marcus-reynolds",
            "library" => "elena-rodriguez",
            "art_studio" => "lily-chen",
            "kitchen" => "thompson-butler",
            _ => defaultCharacterId
        };

        SelectCharacter(characterId);
    }
}
