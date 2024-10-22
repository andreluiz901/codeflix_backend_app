import { Category } from '#category/domain';
import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { SetupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CategoryModelMapper } from './category-mapper';
import { CategoryModel } from './category-model';

describe('CategoryModelMapper Unit Test', () => {
	SetupSequelize({ models: [CategoryModel] });

	it('should throws error when category is invalid', () => {
		const model = CategoryModel.build({
			id: '76a2d112-00b2-4a2b-a244-e37a67cc816a',
		});
		try {
			CategoryModelMapper.toEntity(model);
			fail('The category is valid, but needs throws a LoadEntityError');
		} catch (e: any) {
			expect(e).toBeInstanceOf(LoadEntityError);
			expect(e.error).toMatchObject({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 255 characters',
				],
			});
		}
	});

	it('should throw a generic error', () => {
		const error = new Error('Generic Error');
		const spyValidate = jest
			.spyOn(Category, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = CategoryModel.build({
			id: '76a2d112-00b2-4a2b-a244-e37a67cc816a',
		});
		expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should convert a category model to a category entity', () => {
		const createdAt = new Date();
		const model = CategoryModel.build({
			id: '76a2d112-00b2-4a2b-a244-e37a67cc816a',
			name: 'some name',
			description: 'some description',
			isActive: true,
			createdAt,
		});
		const entity = CategoryModelMapper.toEntity(model);
		expect(entity.toJSON()).toStrictEqual(
			new Category(
				{
					name: 'some name',
					description: 'some description',
					isActive: true,
					createdAt,
				},
				new UniqueEntityId('76a2d112-00b2-4a2b-a244-e37a67cc816a'),
			).toJSON(),
		);
	});
});
