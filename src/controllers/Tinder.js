import { Route, HttpGet, HttpPatch, HttpPost } from '@mbraun/koa-decorators';
import Tinder from '../../db/models/Tinder';
import a from 'axios';


const token = 'df325384-e9df-445e-a70c-c2810bd783a2';
const axios = a.create({
    baseURL: 'https://api.gotinder.com/v2',
    headers: {
        'content-type': 'application/json',
        'x-auth-token': token
    }
});

@Route('/tinder')
class TinderController {
    @HttpPost('/get')
    static async GetData(ctx) {
        const { offset, amount } = ctx.request.body;
        const r = await Tinder.knex
            .whereNot('bio', '')
            .orderBy('id')
            .limit(amount || 0)
            .offset(offset || 0);

        ctx.body = r.map(x => ({
            ...x,
            photos: x.photos.split('|')
        }));
        return ctx;
    }


    @HttpPost('/count')
    static async Count(ctx) {
        const { offset, amount } = ctx.request.body;
        const r = await Tinder.knex
            .count('id')
            .whereNot('bio', '')
            .first();

        ctx.body = r.count;
        return ctx;
    }

    @HttpPost('/like')
    static async Like(ctx) {
        const { _id, s_number } = ctx.request.body;

        const r = await axios.get(`/like/${_id}?locale=en&s_number=${s_number}`, {
            baseURL: 'https://api.gotinder.com'
        });


        await Tinder.knex
            .update({ liked: 1 })
            .where({ _id })

        ctx.body = r.data;
        return ctx;
    }
}

export default TinderController;