var photoData = require('./user_data_transfered.json');
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var { EventEmitter } = require('events');

const CONTENT_TYPE2FILE = {
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

function getType (contentType) {
    return CONTENT_TYPE2FILE[contentType] || 'jpg';
}

function download (photodata, album) {
    return new Promise ((resolve, reject) => {
        var downloadData = photodata;
        var downloadObj = url.parse(downloadData.src);
        
        var opts = {
            hostname: downloadObj.hostname,
            path: downloadObj.path,
            method: 'GET'
        };
        
        var drequest = http.request(opts, (res) => {
            if (res.statusCode === 302) {
                return resolve(download({
                    title: downloadData.title,
                    src: 'http://b221.photo.store.qq.com' + downloadObj.path
                }, album));
            }

            var fileType = getType(res.headers['content-type']);
        
            var filename = `./downloads/${album}/${downloadData.title}.${fileType}`;
            var file = fs.createWriteStream(filename);
        
            res.on('data', (chunk) => {
                file.write(chunk);
            });
        
            res.on('end', (chunk) => { 
                file.close();
                console.log(`${filename} downloaded.`);   
                resolve();
            });
        }).on('error', (e) => {
            reject(e);
        });
        
        drequest.end();
    });
}

function downloadAlbum (album, downloadbox) {
    try {
        fs.mkdirSync(path.resolve(__dirname, 'downloads', album.name));
    } catch (err) {
        console.log('exists filedir');
    }

    // 1. 往下载队列中放promise
    for(let photo of album.photos) {
        downloadbox.push(() => {
            return download(photo, album.name);
        });
    }
}

class DownloadBox extends EventEmitter {
    constructor (num) {
        super();

        this.maxnum = num;
        this.line = {};
        this.waitbox = [];
        this.line.length = 0;

        return this;
    }

    push (promiseFactory) {
        promiseFactory._downloadID = Symbol();
        this.waitbox.push(promiseFactory);
    }

    toLine () {
        if (this.waitbox.length === 0) {
            return false;
        }

        var promiseFactory = this.waitbox.shift();
        promiseFactory().then((newpro) => {
            if (newpro) {
                return newpro;
            } else {
                return true;
            }
        }).then(() => {
            this.emit('loaded', promiseFactory._downloadID);
        }).catch((err) => {
            this.emit('downloaderr', promiseFactory._downloadID);
        });
        this.line.length++;
    }

    init () {
        this.on('loaded', (id) => {
            console.log(`Waiting Length: ${this.waitbox.length} --- Loading Length: ${this.line.length}`);
            // 下载完成
            this.line[id] = null;
            this.line.length--;
            this.toLine()
            if (this.line.length === 0 && this.waitbox.length === 0) {
                this.emit('finished');
            }
        });

        this.on('downloaderr', (id) => {
            console.log('Ther is a mission download error!');

            // 下载失败
            this.line[id] = null;
            this.toLine();
        });

        this.on('finished', () => {
            console.log('All Download is End!');
        });
    }

    start () {
        this.init();

        while( this.line.length < this.maxnum ){
            this.toLine();
        }
    }
}

try {
    fs.mkdirSync(path.resolve(__dirname, 'downloads'));
} catch (err) {
    console.log('exists filedir');
}

var downloadbox = new DownloadBox(3);

// photoData.forEach((albumData) => {
//     downloadAlbum(albumData, downloadbox);
// })

// downloadAlbum(photoData[2], downloadbox);
// downloadAlbum(photoData[8], downloadbox);
// downloadAlbum(photoData[9], downloadbox);
// downloadAlbum(photoData[12], downloadbox);
// downloadAlbum(photoData[13], downloadbox);
// downloadAlbum(photoData[14], downloadbox);
// downloadAlbum(photoData[15], downloadbox);
// downloadbox.start();

// download(photoData[14].photos[2], photoData[14].name);
// download(photoData[14].photos[3], photoData[14].name);
// download(photoData[5].photos[2], photoData[5].name);
