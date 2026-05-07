import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import * as vscode from 'vscode';
import { ConfigurationManager, ResolvedProviderProfile } from './config';
import { createOpenAIClient } from './api-utils';

export async function resolveOpenAIProfile(resourceUri?: vscode.Uri): Promise<ResolvedProviderProfile> {
  const configManager = ConfigurationManager.getInstance();
  const resolved = await configManager.getActiveProviderProfile(resourceUri);

  if (resolved.profile.type !== 'openai-compatible') {
    throw new Error(`Active profile "${resolved.profile.name}" is not an OpenAI-compatible profile`);
  }

  return resolved;
}

export async function createOpenAIApi(resourceUri?: vscode.Uri): Promise<OpenAI> {
  const { profile, apiKey } = await resolveOpenAIProfile(resourceUri);
  return createOpenAIClient(profile, apiKey);
}

export async function ChatGPTAPI(
  messages: ChatCompletionMessageParam[],
  resourceUri?: vscode.Uri
) {
  const openai = await createOpenAIApi(resourceUri);
  const { profile } = await resolveOpenAIProfile(resourceUri);
  const temperature = profile.temperature ?? 0.7;

  const completion = await openai.chat.completions.create({
    model: profile.model,
    messages,
    temperature
  });

  return completion.choices[0]!.message?.content;
}
