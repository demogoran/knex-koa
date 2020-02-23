import knex from './connection';

export class Main {
    constructor() {
        this.tableName = this.constructor.name.toLowerCase();
        this.knex = knex(this.tableName);
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
}