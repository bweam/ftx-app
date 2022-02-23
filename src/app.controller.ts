import { Controller, Get } from '@nestjs/common';
import { Dictionary } from 'ccxt';
import internal from 'stream';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }
  
  @Get('trades') //localhost:3000/trades
  getTrades(): any {
    return this.appService.getTrades();
  }

  @Get('rebalance') //localhost:3000/rebalance
  getRebalance(): any {
    return this.appService.getRebalance();
  }

  @Get('tryRebalance') //localhost:3000/tryRebalance
  getTryRebalance(): any {
    return this.appService.checkOpenOrder();
  }
}
