import OpenAI from 'openai';
import { ProviderProfile } from './config';

export function createOpenAIClient(profile: ProviderProfile, apiKey: string): OpenAI {
  const config: {
    apiKey: string;
    baseURL?: string;
    defaultQuery?: { 'api-version': string };
    defaultHeaders?: { 'api-key': string };
  } = {
    apiKey
  };

  if (profile.baseURL) {
    config.baseURL = profile.baseURL;
  }

  if (profile.azureApiVersion) {
    config.defaultQuery = { 'api-version': profile.azureApiVersion };
    config.defaultHeaders = { 'api-key': apiKey };
  }

  return new OpenAI(config);
}
