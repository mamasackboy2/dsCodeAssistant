# 🧪 GPT OSS Agent Mode Test Guide

Test methods for GPT OSS Agent mode implemented based on the OpenAI Harmony library.

## 🎯 **Completed Implementation**

### ✅ **Newly Added Files**

1. **`harmonyEncoder.ts`**: Core logic of the OpenAI Harmony library implemented in TypeScript
2. **GPT OSS-specific Chat Function**: `sendGPTOSSHarmonyChat` fully implemented

### ✅ **Key Features**

- **Harmony Format Message Rendering**: Conversion to accurate token structure
- **Tool Definition Conversion**: Automatic XML → TypeScript namespace conversion
- **Response Parsing**: Separation of analysis, commentary, and final channels
- **Agent Mode Support**: Tool call detection and processing
- **Real-time Streaming**: Real-time response display

## 🔧 **Testing Method**

### **Step 1: Basic Configuration**

Configure GPT OSS provider in OKDS AI Assistant:

```
Provider: GPT OSS
Endpoint: http://localhost:8080  (or your GPT OSS server address)
Model: gpt-oss
API Key: (optional, depending on your server configuration)
```

### **Step 2: Enable Agent Mode**

In the chat interface:

1. Click on the tool/function icon
2. Select the tools you want to enable
3. Ensure Agent Mode is activated

### **Step 3: Send Test Messages**

Try these example prompts:

#### Example 1: Basic Query
```
What is the current time?
```

#### Example 2: Multi-step Task
```
Create a new file called 'test.js' and write a simple hello world function in it.
```

#### Example 3: Complex Analysis
```
Analyze the codebase structure and suggest improvements.
```

## 📊 **Expected Behavior**

### Message Flow:

1. **User Message** → Converted to Harmony format
2. **Analysis Channel** → Model's reasoning process (if enabled)
3. **Commentary Channel** → Model's thoughts and planning
4. **Tool Calls** → Detected and executed
5. **Final Channel** → Final response to user

### Response Format:

You should see responses structured like:

```
[Analysis] Model's internal reasoning...
[Commentary] Planning the approach...
[Tool Call] Executing: tool_name(params)
[Final] Here's the result...
```

## 🐛 **Troubleshooting**

### Issue: Connection Error

**Solution:**
- Verify GPT OSS server is running
- Check endpoint URL is correct
- Ensure no firewall blocking the connection

### Issue: Tool Calls Not Working

**Solution:**
- Confirm Agent Mode is enabled
- Verify tools are properly defined in `harmonyEncoder.ts`
- Check tool descriptions are clear and complete

### Issue: Streaming Not Working

**Solution:**
- Ensure server supports SSE (Server-Sent Events)
- Check network doesn't block streaming connections
- Verify `stream: true` is set in the request

## 🔍 **Debugging**

### Enable Debug Logs:

In `harmonyEncoder.ts`, uncomment debug statements:

```typescript
console.log('Harmony Messages:', harmonyMessages);
console.log('Tool Definitions:', toolDefinitions);
```

### Monitor Network Traffic:

Use browser DevTools Network tab to inspect:
- Request payload format
- Response structure
- Streaming chunks

## 📝 **Testing Checklist**

- [ ] Basic chat without tools works
- [ ] Agent mode activates correctly
- [ ] Tool calls are detected and formatted properly
- [ ] Streaming displays in real-time
- [ ] Multi-turn conversations maintain context
- [ ] Error handling works correctly
- [ ] All three channels (analysis, commentary, final) display properly

## 🚀 **Next Steps**

1. Test with various tool combinations
2. Verify performance with long conversations
3. Test error scenarios and edge cases
4. Gather user feedback for UX improvements
5. Optimize token usage and response times

## 📚 **Related Documentation**

- [GPT OSS Integration Guide](GPT_OSS_Integration_Guide.md)
- [GPT OSS Harmony Improvement Guide](GPT_OSS_Harmony_Improvement_Guide.md)
- [GPT OSS Prompt Modification Guide](GPT_OSS_Prompt_Modification_Guide.md)

---

**Note:** This guide is based on the OpenAI Harmony specification and GPT OSS implementation. For the latest updates, refer to the official documentation.
