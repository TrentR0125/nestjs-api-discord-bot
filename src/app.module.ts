import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',  // or 'postgres', 'mongodb', etc.
        host: cfg.get<string>("DB_HOST"),
        port: cfg.get<number>("DB_PORT"),
        username: cfg.get<string>("DB_USERNAME"),
        password: cfg.get<string>("DB_PASSWORD"),
        database: cfg.get<string>("DB_DATABASE"),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
      })
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        token: cfg.get<string>("TOKEN"),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages
          ],
        },
      }),
    }),
    BotModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
