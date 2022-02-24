import { Controller, Get, Request } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(@Request() req): string {
    console.log(req);
    return 'Working';
  }
}
