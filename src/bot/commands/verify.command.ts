import { Command, Handler, IA, UseGroup } from "@discord-nestjs/core";
import { Injectable } from "@nestjs/common";
import { CommandInteraction } from "discord.js";

// still wip - nestjs and discordjs are kinda weird but ill get used to it
@Command({
    name: "verify",
    description: "Verify a user"
})
@Injectable()
export class VerifyCommand {
    @Handler()
    onVerify(interaction: CommandInteraction): any {
        
    }
}