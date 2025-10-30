# 🚀 Connecting GPT OSS to OKDS AI Assistant

GPT OSS has been successfully integrated into OKDS AI Assistant (Void-based)! You can now use GPT OSS in multiple ways.

## 📋 Connection Methods

### **Method 1: Using GPT OSS Dedicated Provider (Recommended)**

Use the newly added `gptOSS` provider.

1. **Open OKDS AI Assistant Settings**
   - Click the settings icon or press `Cmd/Ctrl + ,`

2. **Configure Provider**
   - Select "GPT OSS" from the "Local" tab
   - Enter the following information:
     ```
     Endpoint: http://localhost:8080  (Your GPT OSS server address)
     API Key: your-api-key-here      (If required)
     ```

3. **Select Model**
   - Default model: `gpt-oss-model`
   - Or use another model name provided by GPT OSS

### **Method 2: Using OpenAI Compatible Provider**

If GPT OSS provides an OpenAI API-compatible interface:

1. **Select "OpenAI Compatible" in Settings**
   - Navigate to Provider settings
   - Choose "OpenAI Compatible"

2. **Configure Base URL**
   ```
   Base URL: http://localhost:8080/v1
   API Key: (optional, depending on your server)
   Model: gpt-oss or your model name
   ```

3. **Test Connection**
   - Send a test message to verify the connection
   - Check if responses are received correctly

## 🔧 Technical Implementation Details

### **GPT OSS Provider Configuration**

The `gptOSSProvider.ts` file contains the core implementation:

```typescript
export const gptOSSProvider: AIProvider = {
  id: 'gptoss',
  name: 'GPT OSS',
  category: 'local',
  
  // Default configuration
  defaultConfig: {
    endpoint: 'http://localhost:8080',
    model: 'gpt-oss-model',
    temperature: 0.7,
    maxTokens: 2048
  },
  
  // Chat completion function
  async chat(messages, options) {
    const response = await fetch(`${options.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey || ''}`
      },
      body: JSON.stringify({
        model: options.model,
        messages: messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        stream: true
      })
    });
    
    return response;
  }
};
```

### **Harmony Format Support**

For advanced users, GPT OSS supports the OpenAI Harmony format:

```typescript
import { HarmonyEncoder } from './harmonyEncoder';

// Convert messages to Harmony format
const harmonyMessages = HarmonyEncoder.convertToHarmonyFormat(messages);

// Send to GPT OSS
const response = await gptOSSProvider.chat(harmonyMessages, options);
```

See [GPT OSS Harmony Improvement Guide](GPT_OSS_Harmony_Improvement_Guide.md) for details.

## ✨ Key Features

### ✅ **Supported Features**

- **Streaming Responses**: Real-time response display
- **Multi-turn Conversations**: Maintains conversation context
- **Tool/Function Calling**: Agent mode with tool support
- **Custom Models**: Use any GPT OSS model
- **Configurable Parameters**: Temperature, max tokens, etc.
- **Harmony Format**: Advanced message formatting (optional)

### 🔄 **Response Streaming**

GPT OSS provider supports Server-Sent Events (SSE) for streaming:

```typescript
async function* streamResponse(response: Response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          yield parsed.choices[0]?.delta?.content || '';
        } catch (e) {
          console.error('Failed to parse SSE data:', e);
        }
      }
    }
  }
}
```

## 🧰 **Testing**

### **Quick Test**

1. Start your GPT OSS server
2. Configure OKDS AI Assistant with GPT OSS provider
3. Send a simple message: "Hello!"
4. Verify you receive a response

### **Advanced Test**

Test with Agent mode:

1. Enable tools/functions in the chat interface
2. Ask: "What is the current time?"
3. Verify the tool is called and results are displayed
4. Check if multi-step tasks work correctly

See [GPT OSS Agent Mode Test Guide](GPT_OSS_Agent_Mode_Test_Guide.md) for comprehensive testing.

## 🐛 **Troubleshooting**

### **Connection Issues**

**Problem**: Cannot connect to GPT OSS server

**Solutions**:
- Verify GPT OSS server is running: `curl http://localhost:8080/health`
- Check firewall settings
- Ensure correct endpoint URL (include http:// or https://)
- Verify port number is correct

### **Authentication Issues**

**Problem**: 401 Unauthorized error

**Solutions**:
- Check if API key is required by your GPT OSS instance
- Verify API key is entered correctly
- Check authorization header format

### **Streaming Issues**

**Problem**: Responses don't stream or appear all at once

**Solutions**:
- Verify GPT OSS server supports SSE
- Check network doesn't buffer streaming responses
- Enable streaming in the request: `stream: true`

### **Model Not Found**

**Problem**: Model not available error

**Solutions**:
- Check available models: `curl http://localhost:8080/v1/models`
- Use exact model name from the list
- Verify model is loaded in GPT OSS

## 📚 **Configuration Examples**

### **Basic Configuration**

```json
{
  "provider": "gptoss",
  "endpoint": "http://localhost:8080",
  "model": "gpt-oss-model",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

### **Advanced Configuration with Harmony**

```json
{
  "provider": "gptoss",
  "endpoint": "http://localhost:8080",
  "model": "gpt-oss-model",
  "temperature": 0.7,
  "maxTokens": 4096,
  "harmonyMode": true,
  "channels": ["analysis", "commentary", "final"],
  "tools": [
    {
      "name": "get_current_time",
      "description": "Get the current time"
    }
  ]
}
```

### **OpenAI Compatible Configuration**

```json
{
  "provider": "openai-compatible",
  "baseURL": "http://localhost:8080/v1",
  "apiKey": "optional-key",
  "model": "gpt-oss",
  "temperature": 0.7
}
```

## 🚀 **Next Steps**

1. ✅ Choose your preferred connection method
2. ✅ Configure provider settings
3. ✅ Test basic chat functionality
4. ⏳ Explore Agent mode with tools
5. ⏳ Try Harmony format for advanced use cases
6. ⏳ Customize parameters for your needs

## 📚 **Related Documentation**

- [GPT OSS Harmony Improvement Guide](GPT_OSS_Harmony_Improvement_Guide.md)
- [GPT OSS Agent Mode Test Guide](GPT_OSS_Agent_Mode_Test_Guide.md)
- [GPT OSS Prompt Modification Guide](GPT_OSS_Prompt_Modification_Guide.md)
- [VOID Codebase Guide](VOID_CODEBASE_GUIDE.md)

## 🤝 **Contributing**

Found an issue or want to improve the integration? See [HOW_TO_CONTRIBUTE.md](HOW_TO_CONTRIBUTE.md)

---

**Note:** This guide assumes you have a running GPT OSS server. For GPT OSS installation and setup, refer to the GPT OSS documentation.
