import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '#seedwork/infra/sequelize/sequelize-model-factory';

type CategoryModelProperties = {
	id: string;
	name: string;
	description: string | null;
	isActive: boolean;
	createdAt: Date;
};

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProperties> {
	@PrimaryKey
	@Column({ type: DataType.UUID })
	declare id: string;

	@Column({ allowNull: false, type: DataType.STRING(255) })
	declare name: string;

	@Column({ allowNull: true, type: DataType.TEXT })
	declare description: string | null;

	@Column({ allowNull: false, type: DataType.BOOLEAN, field: 'is_active' })
	declare isActive: boolean;

	@Column({ allowNull: false, type: DataType.DATE(), field: 'created_at' })
	declare createdAt: Date;

	static factory() {
		const chance: Chance.Chance = require('chance')();

		return new SequelizeModelFactory<CategoryModel, CategoryModelProperties>(
			CategoryModel,
			() => ({
				id: chance.guid({ version: 4 }),
				name: chance.word(),
				description: chance.paragraph(),
				isActive: true,
				createdAt: chance.date(),
			}),
		);
	}
}
