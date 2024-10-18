import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCategoryUseCase } from 'codeflix-backend-app/category/application'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Get()
  getHello(): string {
    console.log(CreateCategoryUseCase)
    console.log('teste')
    return this.appService.getHello();
  }
}
