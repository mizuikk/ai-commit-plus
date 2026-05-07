import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import * as vscode from 'vscode';
import { ConfigurationManager } from './config';

function extractMessageContent(message: ChatCompletionMessageParam | { content?: unknown }): string {
  const content = message.content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'object' && part && 'text' in part ? String((part as { text?: unknown }).text ?? '') : ''))
      .join('');
  }

  return '';
}

async function getGeminiProfile(resourceUri?: vscode.Uri) {
  const configManager = ConfigurationManager.getInstance();
  const resolved = await configManager.getActiveProviderProfile(resourceUri);

  if (resolved.profile.type !== 'gemini') {
    throw new Error(`Active profile "${resolved.profile.name}" is not a Gemini profile`);
  }

  return resolved;
}

export async function createGeminiAPIClient(resourceUri?: vscode.Uri) {
  const { apiKey } = await getGeminiProfile(resourceUri);
  return new GoogleGenerativeAI(apiKey);
}

export async function GeminiAPI(
  messages: ChatCompletionMessageParam[],
  resourceUri?: vscode.Uri
) {
  try {
    const gemini = await createGeminiAPIClient(resourceUri);
    const { profile } = await getGeminiProfile(resourceUri);
    const temperature = profile.temperature ?? 0.7;

    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');

    const model = gemini.getGenerativeModel({
      model: profile.model,
      systemInstruction: systemMessages.map(m => extractMessageContent(m)).join('\n'),
    });

    const chat = model.startChat({
      generationConfig: {
        temperature
      }
    });

    const userContent = nonSystemMessages.map(m => extractMessageContent(m)).join('\n\n');
    const result = await chat.sendMessage(userContent);
    return result.response.text();
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message;

      if (msg.includes('API_KEY_INVALID') || msg.includes('403')) {
        throw new Error('Invalid Gemini API key');
      }
      if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
        throw new Error('Gemini rate limit exceeded. Please try again later');
      }
      if (msg.includes('SAFETY') || msg.includes('blocked')) {
        throw new Error('Response blocked by Gemini safety filters');
      }
      if (msg.includes('UNAVAILABLE') || msg.includes('503') || msg.includes('500')) {
        throw new Error('Gemini service is temporarily unavailable');
      }
    }
    throw error;
  }
}
