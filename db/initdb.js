import fs from 'fs';

(async () => {
    const files = fs.readdirSync(`./db/models`);
    const awaitList = files.map(async x => {
        const currentTable = (await import(`./models/${x}`)).default;

        await currentTable.dropTable();
        await currentTable.createTable()
    });
    await Promise.all(awaitList);

    console.log('Created');
    process.exit();
})();