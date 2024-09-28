
import { Controller, Get } from '@nestjs/common';
import { VerifiedUser } from 'src/entities/verified-user.entity';
import { BotService } from './bot.service';

@Controller('Bot')
export class BotController {
    constructor(private _userService: BotService) {}

    @Get("Muted")
    getMutedUsers(): Promise<VerifiedUser[]> {
        return this._userService.getMuted();
    }
}