import knex from '../connection';
import { Main } from '../main';

const Badoo = class extends Main {
    constructor() {
        return super();
    }

    createTable() {
        return super.createTable((table) => {
            table.text('user_id').unique().defaultTo('');
            table.integer('age').defaultTo(0);
            table.string('name').defaultTo('');
            table.string('has_user_voted').defaultTo(0);
            table.integer('their_vote').defaultTo(0);
            table.integer('access_level').defaultTo(0);

            table.specificType('photos', 'text[]');
            table.specificType('info', 'text[]');
            table.specificType('networks', 'text[]');

            table.integer('liked').defaultTo(0);
        });
    }

    fuzzySearch(name) {
        return knex.schema.raw(`SELECT * FROM tinder WHERE SIMILARITY(name, ?) > 0.5;`, name);
    }
};
export default new Badoo();