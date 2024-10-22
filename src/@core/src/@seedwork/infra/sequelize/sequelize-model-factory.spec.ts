import _chance from 'chance';
import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { validate as uuidValidate } from 'uuid';
import { SetupSequelize } from '../testing/helpers/db';
import { SequelizeModelFactory } from './sequelize-model-factory';

const chance = _chance();

@Table({})
class StubModel extends Model {
	@PrimaryKey
	@Column({ type: DataType.UUID })
	declare id;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	declare name;

	static readonly mockFactory = jest.fn(() => ({
		id: chance.guid({ version: 4 }),
		name: chance.word(),
	}));

	static factory() {
		return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
			StubModel,
			StubModel.mockFactory,
		);
	}
}

describe('SequelizeModelFactory Unit tests', () => {
	SetupSequelize({ models: [StubModel] });

	test('create method', async () => {
		let model = await StubModel.factory().create();
		expect(uuidValidate(model.id)).toBeTruthy();
		expect(model.id).not.toBeNull();
		expect(model.name).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalled();

		let modelFound = await StubModel.findByPk(model.id);
		expect(model.id).toBe(modelFound.id);

		model = await StubModel.factory().create({
			id: '36527b97-179e-4f41-9992-3f0d4f612528',
			name: 'test',
		});

		expect(model.id).toBe('36527b97-179e-4f41-9992-3f0d4f612528');
		expect(model.name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

		modelFound = await StubModel.findByPk(model.id);
		expect(model.id).toBe(modelFound.id);
	});

	test('make method', async () => {
		let model = StubModel.factory().make();
		expect(uuidValidate(model.id)).toBeTruthy();
		expect(model.name).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalled();

		model = StubModel.factory().make({
			id: '36527b97-179e-4f41-9992-3f0d4f612528',
			name: 'test',
		});
		expect(model.id).toBe('36527b97-179e-4f41-9992-3f0d4f612528');
		expect(model.name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
	});

	test('bulk create method using count = 1', async () => {
		let models = await StubModel.factory().bulkCreate();
		expect(models).toHaveLength(1);
		expect(models[0].id).not.toBeNull();
		expect(models[0].name).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalled();

		let modelFound = await StubModel.findByPk(models[0].id);
		expect(models[0].id).toBe(modelFound.id);
		expect(models[0].name).toBe(modelFound.name);

		models = await StubModel.factory().bulkCreate(() => ({
			id: '36527b97-179e-4f41-9992-3f0d4f612528',
			name: 'test',
		}));

		expect(models[0].id).toBe('36527b97-179e-4f41-9992-3f0d4f612528');
		expect(models[0].name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

		modelFound = await StubModel.findByPk(models[0].id);
		expect(models[0].id).toBe(modelFound.id);
		expect(models[0].name).toBe(modelFound.name);
	});

	test('bulk create method using count > 1', async () => {
		let models = await StubModel.factory().count(2).bulkCreate();
		expect(models).toHaveLength(2);
		expect(models[0].id).not.toBeNull();
		expect(models[0].name).not.toBeNull();
		expect(models[1].id).not.toBeNull();
		expect(models[1].name).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

		const modelFound1 = await StubModel.findByPk(models[0].id);
		expect(models[0].id).toBe(modelFound1.id);
		expect(models[0].name).toBe(modelFound1.name);

		const modelFound2 = await StubModel.findByPk(models[1].id);
		expect(models[1].id).toBe(modelFound2.id);
		expect(models[1].name).toBe(modelFound2.name);

		models = await StubModel.factory()
			.count(2)
			.bulkCreate(() => ({
				id: chance.guid({ version: 4 }),
				name: 'test',
			}));

		expect(models[0].id).not.toBe(models[1].id);
		expect(models[0].name).toBe('test');
		expect(models[1].name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
	});

	test('bulkMake method using count = 1', async () => {
		let models = StubModel.factory().bulkMake();

		expect(models).toHaveLength(1);
		expect(models[0].id).not.toBeNull();
		expect(models[0].name).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

		models = StubModel.factory().bulkMake(() => ({
			id: '5490020a-e866-4229-9adc-aa44b83234c4',
			name: 'test',
		}));

		expect(models).toHaveLength(1);
		expect(models[0].id).toBe('5490020a-e866-4229-9adc-aa44b83234c4');
		expect(models[0].name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
	});

	test('bulkMake method using count > 1', async () => {
		let models = StubModel.factory().count(2).bulkMake();

		expect(models).toHaveLength(2);
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
		expect(models[0].id).not.toBeNull();
		expect(models[0].name).not.toBeNull();
		expect(models[1].id).not.toBeNull();
		expect(models[1].name).not.toBeNull();
		expect(models[0].id).not.toBe(models[1].name);

		models = StubModel.factory()
			.count(2)
			.bulkMake(() => ({
				id: chance.guid({ version: 4 }),
				name: 'test',
			}));

		expect(models).toHaveLength(2);
		expect(models[0].id).not.toBe(models[1].id);
		expect(models[0].name).toBe('test');
		expect(models[1].name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
	});
});
