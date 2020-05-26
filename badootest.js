import fs from 'fs';
import a from 'axios';

import Badoo from './db/models/Badoo';

const token = 'df325384-e9df-445e-a70c-c2810bd783a2';
const axios = a.create({
    baseURL: 'https://badoo.com/',
    headers: {
        'Host': 'badoo.com',
        'Origin': 'https://badoo.com',
        'Referer': 'https://badoo.com/encounters',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
        'content-type': 'json',
        'X-Desktop-web': 1,
        'X-Message-type': 81,
        'Cookie': 'session_cookie_name=s1; device_id=311075e0-75e0-e0b8-b827-274da1b74ee9; s1=s1%3A694%3ASHrLvMS9KJ3VVa2riuKANKdVZ5GuahSi6RYygrB1; has_secure_session=1; aid=773172435; pid=1',
        'X-Session-id': 's1:694:SHrLvMS9KJ3VVa2riuKANKdVZ5GuahSi6RYygrB1',
        'X-User-id': 773172435
    }
});

const postBody = {
    "version": 1,
    "message_type": 81,
    "message_id": 4,
    "body": [
        {
            "message_type": 81,
            "server_get_encounters": {
                "number": 20,
                "context": 1,
                "user_field_filter": {
                    "projection": [
                        200,
                        230,
                        210,
                        301,
                        680,
                        303,
                        304,
                        290,
                        291,
                        490,
                        800,
                        330,
                        331,
                        460,
                        732,
                        370,
                        410,
                        740,
                        742,
                        311,
                        662,
                        560,
                        770,
                        870
                    ],
                    "request_albums": [
                        {
                            "album_type": 7
                        }
                    ],
                    "united_friends_filter": [
                        {
                            "count": 5,
                            "section_type": 3
                        },
                        {
                            "count": 5,
                            "section_type": 1
                        },
                        {
                            "count": 5,
                            "section_type": 2
                        }
                    ]
                }
            }
        }
    ],
    "is_background": false
};


let count = 0;
let last_person_id;
const fetchUserData = async () => {
    //return;
    if (last_person_id) {
        postBody.body[0].server_get_encounters.last_person_id = last_person_id;
    }
    const r = await axios.post(`webapi.phtml?SERVER_GET_ENCOUNTERS`, postBody);

    const err = r.data.body[0].server_error_message;
    if (err) {
        console.error('ERROR', r, err);
        return;
    }
    const body = r.data.body[0].client_encounters.results;

    const newUsers = body.map(x => {
        const { has_user_voted } = x;
        const { user_id, age, name, their_vote, access_level, albums, profile_fields, social_networks } = x.user;

        return {
            user_id, age, name, their_vote, has_user_voted, access_level,
            photos: (albums || []).map(y => y.photos.map(z => z.large_url)).flat(),
            info: (profile_fields || []).map(y => `${y.name}: ${y.display_value}`),
            networks: (social_networks || []).map(y => y.url)
        }
    });
    last_person_id = body.pop().user.user_id;

    count += newUsers.length;
    console.log(last_person_id, count);

    //if (count >= 1000) return;
    await Badoo.upsert(newUsers, 'user_id');
    setTimeout(fetchUserData, Math.random() * 500);
}


(async () => {
    //return;
    /* const r = await axios.post(`/meta?locale=en`, {
        data: JSON.stringify({
            lat: 50.4170241,
            lon: 30.538019,
            force_fetch_resources: true
        })
    }); */

    fetchUserData();
})();