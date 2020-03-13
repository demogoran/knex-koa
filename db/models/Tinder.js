import knex from '../connection';
import { Main } from '../main';

const Tinder = class extends Main {
    constructor() {
        return super();
    }

    createTable() {
        return super.createTable((table) => {
            table.text('bio').defaultTo('');
            table.date('birth_date').defaultTo(knex.fn.now());
            table.text('name').defaultTo('');

            table.text('photos').defaultTo('');
            table.text('_id').unique().defaultTo('');
            table.integer('distance_mi').defaultTo(0);
            table.text('s_number').defaultTo('');
            table.text('teasers').defaultTo('');

            table.integer('liked').defaultTo(0);
        });
    }

    fuzzySearch(name) {
        return knex.schema.raw(`SELECT * FROM tinder WHERE SIMILARITY(name, ?) > 0.5;`, name);
    }
};
export default new Tinder();