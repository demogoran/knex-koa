import { Route, HttpGet, HttpPatch, HttpPost } from '@mbraun/koa-decorators';

import SerialsList from '../cron/SerialsList';

@Route('/serials')
class SerialsController {
    @HttpPost('/search')
    static async Search(ctx) {
        const r = await SerialsList.find(ctx.request.body);
        ctx.body = r;
        return ctx;
    }

    @HttpPost('/seasons')
    static async Seasons(ctx) {
        const r = await SerialsList.getSeasons(ctx.request.body);
        ctx.body = r;
        return ctx;
    }

    @HttpPost('/series')
    static async Series(ctx) {
        const r = await SerialsList.getPlaylist(ctx.request.body);
        ctx.body = r;
        return ctx;
    }
}

export default SerialsController;