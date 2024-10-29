import { join } from 'node:path';
import { DynamicModule, Module } from '@nestjs/common';
import {
	ConfigModuleOptions,
	ConfigModule as NestConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';

type DB_SCHEMA_TYPE = {
	DB_VENDOR: 'mysql' | 'sqlite';
	DB_HOST: string;
	DB_PORT: number;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	DB_DATABASE: string;
	DB_LOGGING: boolean;
	DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
	DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite'),
	DB_HOST: Joi.string().required(),
	DB_DATABASE: Joi.string().when('DB_VENDOR', {
		is: 'mysql',
		// biome-ignore lint/suspicious/noThenProperty: then is a property of joi.when and not a then in property
		then: Joi.required(),
	}),
	DB_USERNAME: Joi.string().when('DB_VENDOR', {
		is: 'mysql',
		// biome-ignore lint/suspicious/noThenProperty: then is a property of joi.when and not a then in property
		then: Joi.required(),
	}),
	DB_PASSWORD: Joi.string().when('DB_VENDOR', {
		is: 'mysql',
		// biome-ignore lint/suspicious/noThenProperty: then is a property of joi.when and not a then in property
		then: Joi.required(),
	}),
	DB_PORT: Joi.number().integer().when('DB_VENDOR', {
		is: 'mysql',
		// biome-ignore lint/suspicious/noThenProperty: then is a property of joi.when and not a then in property
		then: Joi.required(),
	}),
	DB_LOGGING: Joi.boolean().required(),
	DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

@Module({})
export class ConfigModule extends NestConfigModule {
	static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
		const {envFilePath, ...otherOptions} = options
		return super.forRoot({
			isGlobal: true,
			envFilePath: [
				...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
				join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
				join(__dirname, '../envs/.env'),
			],
			validationSchema: Joi.object({ ...CONFIG_DB_SCHEMA }),
			...otherOptions,
		});
	}
}
