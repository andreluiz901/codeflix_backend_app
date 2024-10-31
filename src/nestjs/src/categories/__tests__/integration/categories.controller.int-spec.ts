import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesModule } from '../../../categories/categories.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesController } from '../../categories.controller';

describe('CategoriesController Integration tests', () => {
	let controller: CategoriesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
		}).compile();

		controller = module.get(CategoriesController);
	});

	it('xxx', () => {
		console.log(controller);
	});
});
