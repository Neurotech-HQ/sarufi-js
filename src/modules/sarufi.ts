import axios, { AxiosError } from 'axios';
import { sanitizeErrorResponse } from '../shared/helpers/error.helper';
import { LoginResponse } from '../shared/interfaces/auth.interface';
import {
  BotRequest,
  BotResponse,
  BotsResponse,
} from '../shared/interfaces/bot.interface';
import { ErrorResponse } from '../shared/interfaces/shared.interface';

declare let global: { token: string | undefined; url: string | undefined };

export class Sarufi {
  constructor(private url?: string) {
    global.url = this.url;
  }
  private BASE_DOMAIN = global.url || 'https://api.sarufi.io';
  login = async (
    username: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse> => {
    try {
      const data: LoginResponse = (
        await axios.post(`${this.BASE_DOMAIN}/users/login`, {
          username,
          password,
        })
      ).data;
      if (global) {
        global.token = data.token;
      }
      return { ...data, success: true };
    } catch (error) {
      return sanitizeErrorResponse(error as AxiosError);
    }
  };
  createBot = async (bot: BotRequest): Promise<BotResponse | ErrorResponse> => {
    if (global?.token) {
      return await this.createUserBot(bot, global?.token);
    }
    return { success: false, bot: undefined, message: 'Unauthorized' };
  };
  geBots = async (): Promise<ErrorResponse | BotsResponse> => {
    if (global?.token) {
      return await this.getUserBots(global?.token);
    }
    return { success: false, bots: [], message: 'Unauthorized' };
  };

  geBot = async (id: number): Promise<ErrorResponse | BotResponse> => {
    if (global?.token && id) {
      return await this.getUserBot(global?.token, id);
    }
    return {
      success: false,
      bots: undefined,
      message: global?.token ? 'Unauthorized' : 'Bot ID not supplied',
    };
  };

  private getUserBots = async (
    token: string
  ): Promise<ErrorResponse | BotsResponse> => {
    try {
      const bots = (
        await axios.get(`${this.BASE_DOMAIN}/chatbots`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;
      return { success: true, bots };
    } catch (e) {
      return sanitizeErrorResponse(e as AxiosError);
    }
  };
  private getUserBot = async (
    token: string,
    id: number
  ): Promise<ErrorResponse | BotResponse> => {
    try {
      const bot = (
        await axios.get(`${this.BASE_DOMAIN}/chatbot/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;
      return { success: true, bot };
    } catch (e) {
      return sanitizeErrorResponse(e as AxiosError);
    }
  };
  private createUserBot = async (
    bot: BotRequest,
    token: string
  ): Promise<BotResponse | ErrorResponse> => {
    try {
      const createdBot = (
        await axios.post(`${this.BASE_DOMAIN}/chatbot`, bot, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;
      return { success: true, bot: createdBot };
    } catch (e) {
      return sanitizeErrorResponse(e as AxiosError);
    }
  };
}
