import { Route, HttpGet, HttpPatch, HttpPost } from '@mbraun/koa-decorators';

@Route('/user')
class UserController {
    @HttpGet('/')
    static async GetUser(ctx) {
        const fields = ctx.request.query.fields.split(',');
        console.log(...fields);
        const { User } = ctx.tables;
        ctx.body = await User.knex.where({}).select(...fields);
        ctx.status = 200;

        return ctx;
    }

    @HttpPost('/')
    static async CreateUser(ctx) {
        const fields = ctx.request.body;
        const { User } = ctx.tables;
        const result = await User.knex.insert({ name: 'test' });
        ctx.body = "ok"
        ctx.status = 200;

        return ctx;
    }
}

export default UserController;