const host = 'http://localhost:3000';

const request = (url, options) => fetch(`${host}${url}`, {
    method: 'POST',
    ...options
}).then(x => x.json());

export default {
    Serials: {
        search: (str) => request(`/serials/search`, { body: str }),
        seasons: (url) => request(`/serials/seasons`, { body: url }),
        series: (url) => request(`/serials/series`, { body: url }),
    }
}