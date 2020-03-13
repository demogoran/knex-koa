import fs from 'fs';

import knex from './connection';

(async () => {
    const files = fs.readdirSync(`./db/models`);

    const awaitList = files.filter(x => x !== 'Tinder.js').map(async x => {
        const currentTable = (await import(`./models/${x}`)).default;

        await currentTable.dropTable();
        await currentTable.createTable()
    });
    await Promise.all(awaitList);

    try {
        await knex.schema.raw('CREATE EXTENSION pg_trgm;');
    }
    catch (ex) {

    }

    console.log('Created');
    process.exit();
})();