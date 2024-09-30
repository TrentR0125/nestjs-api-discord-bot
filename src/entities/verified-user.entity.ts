import { IsInt, IsString } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { MuteStatus } from "./models/MuteStatus";

@Entity({ name: "verifiedUser" })
export class VerifiedUser {
    @IsString()
    @PrimaryColumn()
    DiscordId: string;

    @IsString()
    @Column()
    Nickname: string;

    @IsInt()
    @Column()
    MuteStatus: MuteStatus.Unmuted | MuteStatus.Muted;
}