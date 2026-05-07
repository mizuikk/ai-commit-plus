import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatCompletionMessageParam } from 'openai/resources';
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

    const model = gemini.getGenerativeModel({ model: profile.model });
    const chat = model.startChat({
      generationConfig: {
        temperature
      }
    });

    const result = await chat.sendMessage(messages.map(extractMessageContent).join('\n'));
    return result.response.text();
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}
