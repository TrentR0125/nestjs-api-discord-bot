import { InjectDiscordClient, On, Once } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { Client, Colors, EmbedBuilder, Events, Message } from "discord.js";
import { BotService } from "./bot.service";
import { LogLevel } from "src/entities/models/LogLevel";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BotGateway {
    private _logger = new Logger(BotGateway.name);

    constructor(
        @InjectDiscordClient()
        private readonly _client: Client,
        private readonly _configService: ConfigService, 
        private readonly _botService: BotService
    ) {}

    @Once(Events.ClientReady)
    onReady() {
        this._logger.log(`NestJS Discord bot ${this._client.user.tag} is ready.`);
        this._botService.sendLog(this._configService.get<string>("STARTUP_CHANNEL"), { msgContent: "I am now online!" });
    }

    @On(Events.MessageCreate)
    async onMessage(msg: Message): Promise<void> {
        if (this._botService.blacklistCheck(msg.content)) {
            const embed = new EmbedBuilder()
                .setTitle(`Blacklisted Word!`)
                .setDescription(`\`${msg.author.displayName} | ${msg.author.id}\` has said a blacklisted word.`)
                .addFields({ name: "Message Content", value: `${msg.content}` });

            this._botService.sendLog(this._configService.get<string>("LOG_CHANNEL"), { embed: embed, level: LogLevel.Severe, msgContent: `<#${msg.channel.id}>` });

            await msg.reply({ content: `<@${msg.author.id}> Warning! You cannot say this word as it is a blacklisted word.` });
            await msg.delete();
        }
    }
}