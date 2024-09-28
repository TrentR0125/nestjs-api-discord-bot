
import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { DiscordModule } from '@discord-nestjs/core';
import { BotService } from './bot.service';
import { BotGateway } from './bot.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifiedUser } from 'src/entities/verified-user.entity';
import { VerifyCommand } from './commands/verify.command';

@Module({
    controllers: [BotController],
    imports: [
        DiscordModule.forFeature(),
        TypeOrmModule.forFeature(
            [
                VerifiedUser
            ]
        )
    ],
    providers: [
        BotService, 
        BotGateway,
        VerifyCommand
    ],
})
export class BotModule {}