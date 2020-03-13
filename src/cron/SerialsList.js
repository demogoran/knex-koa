import cron from 'node-cron';
import request from 'request-promise';
import cheerio from 'cheerio';

import Serials from '../../db/models/Serials';


class SerialsList {
    static decode(file) {
        let a = file.substr(2);

        a = a.replace("//b2xvbG8=", "")

        try {
            a = b2(a);
        } catch (e) {
            a = ""
        }

        function b2(str) {
            return decodeURIComponent(Buffer.from(str, 'base64').toString().split("").map((c) => {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""));
        }
        return a;
    }

    async getAll() {
        const result = await request('http://seasonvar.ru/index.php', {
            method: 'POST',
            form: {
                'filter[sortTo][]': 'name',
                'filter[engName]': '',
                'filter[only]': '',
                'filter[rait]': 'kp',
                'filter[hd]': '',
                'filter[sub]': '',
                'filter[block]': '',
                'filter[history]': '',
                'filter[mark]': '',
                'filter[nw]': '',
                'filter[exp]': '',
                'beforeSend': '',
            }
        });
        const $ = cheerio.load(result);

        const data = $('a').get().map(x => ({
            'serialid': $(x).attr('data-id'),
            'href': $(x).attr('href'),
            'name': $(x).text().trim(),
        }));

        await Serials.truncateTable();
        await Serials.knex.insert(data);

        console.log('inserted');
        //console.log(result);
    }

    async find(name) {
        return (await Serials.fuzzySearch(name)).rows;
    }

    async getSeasons(url) {
        const doc = await request(`http://seasonvar.ru${url}`);
        const $ = cheerio.load(doc);

        const seasonsList = $('.pgs-seaslist .act a').get().map(x => ({
            id: $(x).attr('href').split('-')[1],
            url: $(x).attr('href'),
            name: $(x).text().replace('>>>', '').trim().replace(/\s\s+/g, ' ')
        }));

        return seasonsList;
    }

    async getPlaylist(url) {
        const doc = await request({
            url: `http://seasonvar.ru${url}`,
            headers: {
                //'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            }
        });
        const $ = cheerio.load(doc);

        const json = $('script:contains(data4play)').html()
            .replace('var data4play = ', '')
            .replace(/'/g, '"')
            .trim();



        //const { secureMark } = JSON.parse(json);
        const secureMark = 'ae8fdca473817629ab6ef09387f5cc0a';
        const translate = url.split('-')[1];

        const playlistURL = `http://seasonvar.ru/playls2/${secureMark}/trans/${translate}/plist.txt?time=${Date.now()}`;
        const plJson = await request(playlistURL);
        const playlist = JSON.parse(plJson);

        return playlist.map(x => ({ ...x, file: SerialsList.decode(x.file) }));
    }
}


const serialsList = new SerialsList();
/* cron.schedule('0 * * * *', () => {
    serialsList.getAll();
});
serialsList.getAll(); */

export default serialsList;