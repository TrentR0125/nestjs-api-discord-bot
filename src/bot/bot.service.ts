import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { privateDecrypt } from "crypto";
import { VerifiedUser } from "src/entities/verified-user.entity";
import { Repository } from "typeorm";

@Injectable()
export class BotService {
    constructor(
        @InjectRepository(VerifiedUser) private _verifiedUsersRepository: Repository<VerifiedUser>
    ) {}

    async getMuted(): Promise<VerifiedUser[]> {
        const users = await this._verifiedUsersRepository.find({ where: { MuteStatus: "MUTED" } });

        if (users.length < 1) {
            throw new NotFoundException("No muted users to be found.");
        }

        return users;
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
            "spear chucker"
        ]

        return blacklisted.some(m => msg.toLowerCase().includes(m.toLowerCase()));
    }
}