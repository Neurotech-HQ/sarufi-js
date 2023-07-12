import { Login, LoginResponse } from '../shared/interfaces/auth.interface';
import {
  BotResponse,
  BotsResponse,
  CreateBot,
  DeleteBot,
  GetBot,
  GetBots,
  UpdateBot,
} from '../shared/interfaces/bot.interface';
import {
  ChatInput,
  ConversationResponse,
  WhatsappConversationResponse,
} from '../shared/interfaces/conversation.interface';
import { ErrorResponse } from '../shared/interfaces/shared.interface';
import { Sarufi } from './sarufi';

/**
 *
 * @param data payload to login you in and interact with your bot, an api key from sarufi dashboard and an optional url
 */
export const login = async (
  data: Login
): Promise<LoginResponse | ErrorResponse> => {
  const sarufi = new Sarufi(data.url);
  return await sarufi.login({
    api_key: data.api_key,
  });
};

/**
 * A method to create a new bot
 *
 * @param data payload to create a bot with bot property as the DTO, an optional url and an optional token
 */

export const createBot = async (
  data: CreateBot
): Promise<BotResponse | ErrorResponse> => {
  const sarufi = new Sarufi(data?.url, data?.api_key);
  return await sarufi.createBot(data.bot);
};

export const getBots = async (
  data?: GetBots
): Promise<ErrorResponse | BotsResponse> => {
  const sarufi = new Sarufi(data?.url, data?.api_key);
  return await sarufi.getBots();
};

export const getBot = async (
  data: GetBot
): Promise<ErrorResponse | BotResponse> => {
  const sarufi = new Sarufi(data?.url, data?.api_key);
  return await sarufi.getBot(data.id);
};

export const updateBot = async (
  data: UpdateBot
): Promise<ErrorResponse | BotResponse> => {
  const sarufi = new Sarufi(data?.url, data?.api_key);
  return await sarufi.updateBot(data.id, data.bot);
};

export const deleteBot = async (
  data: GetBot
): Promise<ErrorResponse | DeleteBot> => {
  const sarufi = new Sarufi(data?.url, data?.api_key);
  return await sarufi.deleteBot(data.id);
};

export const chat = async (
  data: ChatInput
): Promise<
  ErrorResponse | ConversationResponse | WhatsappConversationResponse
> => {
  const sarufi = new Sarufi(data?.url, data?.api_key);
  return await sarufi.chat({
    message: data.message,
    bot_id: data.bot_id,
    chat_id: data.chat_id,
    channel: data.channel ?? 'general',
  });
};
