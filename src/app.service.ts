import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

@Injectable()
export class AppService implements OnModuleInit {
  private _client: Client;

  async onModuleInit() {
    
  }
}
