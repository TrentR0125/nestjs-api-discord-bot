import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import * as dotenv from "dotenv"

dotenv.config();

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TOKEN,
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds
          ],
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
