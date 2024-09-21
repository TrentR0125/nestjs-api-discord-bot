import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

@Injectable()
export class AppService implements OnModuleInit {
  private _client: Client;
  private _logger: Logger = new Logger(AppService.name);

  async onModuleInit() {
    this._logger.log(`were ready.`);
  }
}
