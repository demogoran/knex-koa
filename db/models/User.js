import knex from '../connection';
import { Main } from '../main';

const User = class extends Main {
    constructor() {
        return super();
    }

    createTable() {
        return super.createTable((table) => {
            table.string('name').defaultTo('');
        });
    }
};
export default new User();