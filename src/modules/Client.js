/* eslint-disable no-undef */
function fetch(cb) {
    return fetch('jobs/filter.json?country_code=&date[type]=null&filter_visible=&from=Oslo&north_east=&order=DESC&page=1&per_page=20&place_search_method=&polyline=&search_types=pickup,delivery&size=null,1,2,3,4,5&sort=created_at&south_west=&state=buyable&X-API-Key=66467917eb9cee742b4f4c1f38419cca', {
        accept: "application/json"
    })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}

const Client = { fetch };
export default Client;