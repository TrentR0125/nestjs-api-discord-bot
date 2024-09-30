import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { privateDecrypt } from "crypto";
import { Client, ColorResolvable, Colors, Embed, EmbedBuilder } from "discord.js";
import { LogLevel } from "src/entities/models/LogLevel";
import { MuteStatus } from "src/entities/models/MuteStatus";
import { VerifiedUser } from "src/entities/verified-user.entity";
import { OptimisticLockCanNotBeUsedError, Repository, ViewColumn } from "typeorm";

@Injectable()
export class BotService {
    private _logger = new Logger(BotService.name);

    constructor(
        @InjectRepository(VerifiedUser) private _verifiedUsersRepository: Repository<VerifiedUser>,
        @InjectDiscordClient()
        private readonly _client: Client,
    ) {}

    async getMuted(): Promise<VerifiedUser[]> {
        const users = await this._verifiedUsersRepository.find({ where: { MuteStatus: MuteStatus.Muted } });

        if (users.length < 1) {
            throw new NotFoundException("No muted users to be found.");
        }

        return users;
    }

    getLevelName(level: LogLevel): string {
        switch (level) {
            case LogLevel.Normal:
                return "Normal";

            case LogLevel.Warning:
                return "Warning";

            case LogLevel.Severe:
                return "Severe";
        }
    }

    getLevelColor(level: LogLevel): ColorResolvable {
        switch (level) {
            case LogLevel.Normal:
                return Colors.Blue;
            
            case LogLevel.Warning:
                return Colors.Orange;

            case LogLevel.Severe:
                return Colors.Red;
        }
    }

    /**
     * Check if a word is blacklisted.
     * 
     * @returns boolean
     * @param msg 
     */
    blacklistCheck(msg: string): boolean {
        let blacklisted: string[] = [
            "nigger",
            "nigga",
            "faggot",
            "fag",
            "nig",
            "nigg",
            "nigglet",
            "niglet",
            "faggy",
            "faggi",
            "spear chucker",
            "cunt",
            "jew",
            "porch monkey",
            "ngga"
        ]

        return blacklisted.some(m => msg.toLowerCase().includes(m.toLowerCase()));
    }

    /**
     * Send a log as an embed or a normal message.
     * 
     * @param channelId 
     * @param options 
     */
    async sendLog(
        channelId: string,
        options: {
            embed?: EmbedBuilder | null, 
            level?: LogLevel | LogLevel.Normal, 
            msgContent?: string | null 
        }
    ): Promise<void> {
        const channel = this._client.channels.cache.get(channelId);

        if (channel.isTextBased() && channel.isSendable()) {
            if (options.level && (options.level === LogLevel.Warning || options.level === LogLevel.Severe)) {
                options.embed.setColor(this.getLevelColor(options.level));
                options.embed.addFields(
                    { 
                        name: "What to do", 
                        value: `If the offence is too crazy, then you can ${options.level === LogLevel.Severe ? "ban them if you have permission or mute" : "mute"} them.` 
                    }
                );
            }

            let content: string | null = null;

            if (options.msgContent && options.level) {
                content = `${options.msgContent} | ${this.getLevelName(options.level)}`;
            } else if (options.msgContent) {
                content = options.msgContent;
            } else if (options.level) {
                content = this.getLevelName(options.level);
            }

            /// TODO: if level is warning or severe, then add a button to the embed for muting the user that did such a horrible thing. Maybe a ban button for severe.

            if (content || options.embed) {
                await channel.send({ content: content ?? '', embeds: options.embed ? [options.embed] : [] });
            }
        } else {
            this._logger.error(`Could not send log in the channel requested, check the chanel type, or the permissions. ChannelId: ${channelId}`);
        }
    }
}