import upsert from 'knex-upsert';
import knex from './connection';

export class Main {
    constructor() {
        this.tableName = this.constructor.name.toLowerCase();
    }

    get knex() {
        return knex(this.tableName);
    }

    createTable(addFields = () => { }) {
        return knex.schema.createTable(this.tableName, (table) => {
            table.increments();

            addFields(table);

            table.timestamp('created').defaultTo(knex.fn.now());
            table.timestamp('updated').defaultTo(knex.fn.now());
        });
    }

    dropTable() {
        return knex.schema.raw(`DROP TABLE IF EXISTS "${this.tableName}" CASCADE`);
    };

    truncateTable() {
        return knex.schema.raw(`TRUNCATE TABLE "${this.tableName}" CASCADE`);
    };



    upsert(datatosave, interField = '_id') {
        return Promise.all(datatosave.map(item => {
            return upsert({
                db: knex,
                table: this.tableName,
                object: item,
                key: interField,
            })
        }));
    }
}