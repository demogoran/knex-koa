//const host = `http://45.33.71.175:3000`;
const host = `http://localhost:3000`;

const request = (url, body, options) => fetch(`${host}${url}`, {
    method: 'POST',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(body),
    ...options
}).then(x => x.json());

export default {
    Serials: {
        search: (str) => request(`/serials/search`, { str }),
        seasons: (url) => request(`/serials/seasons`, { url }),
        series: (url) => request(`/serials/series`, { url }),
    },
    Tinder: {
        get: (offset, amount) => request(`/tinder/get`, {
            offset, amount
        }),
        count: () => request(`/tinder/count`, {}),
        like: (_id, s_number) => request(`/tinder/like`, { _id, s_number }),
    },
    Badoo: {
        get: (offset, amount) => request(`/badoo/get`, {
            offset, amount
        }),
        count: () => request(`/badoo/count`, {}),
        like: (_id, s_number) => request(`/badoo/like`, { _id, s_number }),
    }
}