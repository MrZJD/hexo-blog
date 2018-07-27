var url = require('url');
var queryString = require('querystring');

const RAW_PHOTO_HOST = 'http://r.photo.store.qq.com/psb';

function transUri(mpicURL) {
    const uriObj = url.parse(mpicURL);
    const path = uriObj.search.split('null')[0].replace('!/m', '!/r');

    return RAW_PHOTO_HOST+path;
}

module.exports = {
    transUri
};
