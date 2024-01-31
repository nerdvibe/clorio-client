import Knex, {Knex as KnexTypes} from 'knex';
import { initDb } from './initClorioDb';

const config: KnexTypes.Config = {
    client: 'pg',
    connection: process.env.POSTGRES_URI
}

export const db = Knex(config);
export { Knex };
