import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCategoryUseCase } from 'codeflix-backend-app/category/application';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private configService: ConfigService,
	) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
