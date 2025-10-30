# 🔧 GPT OSS Harmony Prompt Modification Guide
A complete guide to fixing GPT OSS Agent mode in OKDS AI Assistant.

## 📋 Problem Analysis

1. Current Status: Chat mode works, Agent mode does not
2. Root Cause: GPT OSS expects Harmony response format; current prompts use generic OpenAI style
3. Solution: Convert prompts to Harmony-compatible format and implement response parsing

## 🛠️ Changes Required

### 1) Update Model Capabilities
Update GPT OSS model settings in:
`src/vs/workbench/contrib/void/common/modelCapabilities.ts`

```typescript
const gptOSSModelOptions = {
  'gpt-oss-model': {
    contextWindow: 128_000,
    reservedOutputTokenSpace: 4_096,
    cost: { input: 0, output: 0 },
    downloadable: false,
    supportsFIM: true,
    supportsSystemMessage: 'separated' as const, // Harmony uses separated system
    supportsFunctionCalling: true,
    supportsImage: false,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    supportsJSONResponse: true
  }
};
```

### 2) Introduce Harmony System Prompt
Replace generic system prompts with a Harmony-aware system message builder.
File: `src/vs/workbench/contrib/void/common/harmonyEncoder.ts`

```typescript
export const DEFAULT_HARMONY_SYSTEM = `You are a helpful AI assistant.
Use channels for structure:
- analysis: internal reasoning
- commentary: outline plan/notes
- final: user-facing answer
`;

export function buildHarmonySystemMessage(toolNamespace: string = '') {
  return `${DEFAULT_HARMONY_SYSTEM}
You can use the following tools:
${toolNamespace}`;
}
```

### 3) Convert Tools → TypeScript Namespace
Harmony expects tool definitions as TS namespace declarations.

```typescript
export function toolsToTypeScriptNamespace(tools: any[]): string {
  return tools.map(t => {
    const p = t.function?.parameters?.properties || {};
    const properties = Object.entries(p).map(([k, v]: [string, any]) => `  ${k}: ${v.type}; // ${v.description || ''}`).join('\n');
    return `namespace ${t.function.name} {
${properties}
}`;
  }).join('\n\n');
}
```

### 4) Encode Messages into Harmony Format

```typescript
const TOKENS = { START: '<|start|>', END: '<|end|>', MESSAGE: '<|message|>', CHANNEL: '<|channel|>' } as const;

export function renderHarmonyMessage(role: string, content: string, channel?: string) {
  return `${TOKENS.START}${TOKENS.MESSAGE}${role}${channel ? TOKENS.CHANNEL + channel : ''}${TOKENS.END}${content}`;
}

export function encodeHarmonyConversation(messages: {role: string; content: string; channel?: string;}[]) {
  return messages.map(m => renderHarmonyMessage(m.role, m.content, m.channel)).join('\n');
}
```

### 5) Parsing Harmony Responses

```typescript
export interface ToolCall { name: string; parameters: any }
export interface Parsed { analysis?: string; commentary?: string; final?: string; toolCalls?: ToolCall[] }

export function parseHarmony(text: string): Parsed {
  const section = (ch: string) => (text.match(new RegExp(`<\\|channel\\|>${ch}<\\|end\\|>([\\s\\S]*?)(?=<\\|channel\\||$)`)) || [])[1]?.trim();
  const out: Parsed = {
    analysis: section('analysis'),
    commentary: section('commentary'),
    final: section('final')
  };
  const toolCalls: ToolCall[] = [];
  const re = /<tool_call>[\s\S]*?<tool_name>(.*?)<\/tool_name>[\s\S]*?<parameters>([\s\S]*?)<\/parameters>[\s\S]*?<\/tool_call>/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    try { toolCalls.push({ name: m[1].trim(), parameters: JSON.parse(m[2].trim()) }); } catch {}
  }
  if (toolCalls.length) out.toolCalls = toolCalls;
  return out;
}
```

### 6) Update Prompt Templates to Use Channels
Replace assistant prompts that mix reasoning/output. Ensure the model emits channels explicitly.

```typescript
const assistantPlan = renderHarmonyMessage('assistant', 'Thinking through the steps...', 'analysis');
const assistantFinal = renderHarmonyMessage('assistant', 'Here is the result:', 'final');
```

### 7) Streaming Support
Ensure `stream: true` and SSE parsing in provider.

```typescript
async function* sseStream(res: Response) {
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value);
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try { yield JSON.parse(data); } catch {}
      }
    }
  }
}
```

## ✅ QA Checklist
- [ ] System message uses Harmony format
- [ ] Tools rendered as TS namespace
- [ ] Messages encoded with <|start|><|message|> tokens
- [ ] Model returns channels: analysis, commentary, final
- [ ] Tool calls parsed correctly
- [ ] Streaming works (SSE)
- [ ] Agent mode completes multi-step tasks

## 🧪 Test Prompts
- "What time is it? Use the time tool if available."
- "Create a file hello.js with a function sayHello()."
- "Analyze repo structure and list three improvement ideas."

## 📚 Related Docs
- GPT OSS Integration Guide (GPT_OSS_Integration_Guide.md)
- GPT OSS Harmony Improvement Guide (GPT_OSS_Harmony_Improvement_Guide.md)
- GPT OSS Agent Mode Test Guide (GPT_OSS_Agent_Mode_Test_Guide.md)
- VOID Codebase Guide (VOID_CODEBASE_GUIDE.md)
