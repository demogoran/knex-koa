import knex from '../connection';
import { Main } from '../main';

const Serials = class extends Main {
    constructor() {
        return super();
    }

    createTable() {
        return super.createTable((table) => {
            table.integer('serialid').defaultTo(0);
            table.string('href').defaultTo('');
            table.text('name').defaultTo('');
        });
    }

    fuzzySearch(name) {
        return knex.schema.raw(`SELECT * FROM serials WHERE SIMILARITY(name, ?) > 0.5;`, name);
    }
};
export default new Serials();