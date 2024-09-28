import { InjectDiscordClient, On, Once } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { Client, Events, Message } from "discord.js";
import { BotService } from "./bot.service";

@Injectable()
export class BotGateway {
    private _logger = new Logger(BotGateway.name);

    constructor(
        @InjectDiscordClient()
        private readonly _client: Client,
        private readonly _botService: BotService
    ) {}

    @Once(Events.ClientReady)
    onReady() {
        this._logger.log(`NestJS Discord bot ${this._client.user.tag} is ready.`);
    }

    @On(Events.MessageCreate)
    async onMessage(msg: Message): Promise<void> {
        if (msg.channelId === "1226830619045138503" && this._botService.blacklistCheck(msg.content)) {
            /// TODO: make the message with blacklisted word in it log into a channel with the clients info

            await msg.reply({ content: `<@${msg.author.id}> Warning! You cannot say this word as it is a blacklisted word.` });
            await msg.delete();
        }
    }
}