import { IsString } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "verifiedUser" })
export class VerifiedUser {
    @IsString()
    @PrimaryColumn()
    DiscordId: string;

    @IsString()
    @Column()
    Nickname: string;

    // prolly switch this to an enum instead
    @IsString()
    @Column()
    MuteStatus: "UNMUTED" | "MUTED";
}