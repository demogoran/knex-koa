import fs from 'fs';
import a from 'axios';

import Tinder from './db/models/Tinder';

const token = 'df325384-e9df-445e-a70c-c2810bd783a2';
const axios = a.create({
    baseURL: 'https://api.gotinder.com/v2',
    headers: {
        'content-type': 'application/json',
        'x-auth-token': token
    }
});


let count = 0;
const fetchUserData = async () => {
    const r = await axios.get(`/recs/core?locale=en`);



    const newUsers = r.data.data.results.map(x => {
        const { _id, bio, birth_date, name, photos } = x.user;
        return {
            _id, bio, birth_date, name,
            photos: photos.map(x => x.url).join('|'),
            distance_mi: x.distance_mi,
            s_number: x.s_number,
            teasers: x.teasers.map(x => `${x.type}:${x.string}`).join('; '),
        }
    });

    console.log(newUsers, count);

    count += newUsers.length;

    //if (count >= 1000) return;
    await Tinder.upsert(newUsers, '_id');
    setTimeout(fetchUserData, Math.random() * 10000);
}


(async () => {
    //return;
    const r = await axios.post(`/meta?locale=en`, {
        data: JSON.stringify({
            lat: 50.4170241,
            lon: 30.538019,
            force_fetch_resources: true
        })
    });

    fetchUserData();
})();