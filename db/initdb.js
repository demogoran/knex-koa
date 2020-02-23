import fs from 'fs';

import knex from './connection';

(async () => {
    const files = fs.readdirSync(`./db/models`);
    const awaitList = files.map(async x => {
        const currentTable = (await import(`./models/${x}`)).default;

        await currentTable.dropTable();
        await currentTable.createTable()
    });
    await Promise.all(awaitList);

    await knex.schema.raw('CREATE EXTENSION pg_trgm;');

    console.log('Created');
    process.exit();
})();