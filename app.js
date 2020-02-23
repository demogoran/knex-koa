import fs from 'fs';
import Koa from 'koa';
import Router from 'koa-router';
import KoaBody from 'koa-body';
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();

(async () => {
    // Autoimport models to .ctx
    app.context.tables = {};

    const models = fs.readdirSync(`./db/models`);
    await Promise.all(models
        .filter(x => !x.startsWith('_'))
        .map(async x => app.context.tables[x.replace('.js', '')] = (await import(`./db/models/${x}`)).default));


    // Autoimport controllers routes
    const { createRoutes } = await import('@mbraun/koa-decorators');

    const controllers = fs.readdirSync(`./src/controllers`);
    await Promise.all(controllers
        .map(async x => createRoutes(router, (await import(`./src/controllers/${x}`)).default)));

    app
        .use(KoaBody())
        .use(cors())
        .use(router.routes())
        .use(router.allowedMethods());

    app.listen(3000);
    console.log("Listen on 3000");
})();
