import Entity from '#seedwork/domain/entity/entity';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { InMemoryRepository } from '#seedwork/domain/repository';
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';

type StubEntityProps = {
	name: string;
	price: number;
};
class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepositoy extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Tests', () => {
	let repository: StubInMemoryRepositoy;
	beforeEach(() => (repository = new StubInMemoryRepositoy()));

	it('should insert a new entity', async () => {
		const entity = new StubEntity({ name: 'price', price: 5 });
		await repository.insert(entity);
		expect(repository.items).toHaveLength(1);
		expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
	});

	it('should throws an error when entity not found', async () => {
		await expect(repository.findById('fake id')).rejects.toThrow(
			new NotFoundError('Entity Not Found using ID fake id'),
		);

		await expect(
			repository.findById(
				new UniqueEntityId('855795e2-2064-49b3-94bb-45c193cc01eb'),
			),
		).rejects.toThrow(
			new NotFoundError(
				'Entity Not Found using ID 855795e2-2064-49b3-94bb-45c193cc01eb',
			),
		);
	});

	it('should finds entity by id', async () => {
		const entity = new StubEntity({ name: 'price', price: 5 });
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should returns all ntities', async () => {
		const entity = new StubEntity({ name: 'price', price: 5 });
		await repository.insert(entity);

		const entities = await repository.findAll();
		expect(entities).toStrictEqual([entity]);
	});

	it('should throws an error on update when entity not found', () => {
		const entity = new StubEntity({ name: 'price', price: 5 });

		expect(repository.update(entity)).rejects.toThrow(
			new NotFoundError(`Entity Not Found using ID ${entity.id}`),
		);
	});

	it('should updates an entity', async () => {
		const entity = new StubEntity({ name: 'price', price: 5 });
		await repository.insert(entity);

		const entityUpdated = new StubEntity(
			{ name: 'updated', price: 1 },
			entity.uniqueEntityId,
		);
		await repository.update(entityUpdated);
		expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
	});

	it('should throws an error on delete when entity not found', () => {
		expect(repository.delete('fake id')).rejects.toThrow(
			new NotFoundError('Entity Not Found using ID fake id'),
		);

		expect(
			repository.delete(
				new UniqueEntityId('855795e2-2064-49b3-94bb-45c193cc01eb'),
			),
		).rejects.toThrow(
			new NotFoundError(
				'Entity Not Found using ID 855795e2-2064-49b3-94bb-45c193cc01eb',
			),
		);
	});

	it('should deletes an entity', async () => {
		const entity = new StubEntity({ name: 'price', price: 5 });
		await repository.insert(entity);
		await repository.delete(entity.id);
		expect(repository.items).toHaveLength(0);

		await repository.insert(entity);
		await repository.delete(entity.uniqueEntityId);
		expect(repository.items).toHaveLength(0);
	});
});
