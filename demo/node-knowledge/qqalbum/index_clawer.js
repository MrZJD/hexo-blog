const puppeteer = require('puppeteer');
const fs = require('fs');

const config = require('./config');

const USER_PHOTOS = [];

async function start(browser) {

    console.log('爬虫工作开始');
    var page = await browser.newPage();
    console.log('新建便签页');

    // 1. goto login
    await login(page);
    console.log('登陆成功');

    // 2. wait navi
    await page.waitForFunction(() => {
        return window.location.href === 'https://user.qzone.qq.com/390303304';
    });
    
    // 3. navi to photo
    await page.goto(config.users.photouri);
    console.log('进入空间相册');

    // 4. get albums
    await getalbums(page);
    console.log('获取所有相册信息');
    
    // 5. get photos
    // await getphotos(page, USER_PHOTOS[0]);
    for (var album of USER_PHOTOS) {
        console.log('正在读取相册：' + album.name);
        await getphotos(page, album);
    }

    // 6. save file
    var photosFile = fs.createWriteStream('./user_data.json');
    photosFile.write(JSON.stringify(USER_PHOTOS, null, 4));
    photosFile.close();

    console.log('已保存在文件中');
    browser.close();

    console.log('爬虫工作完成，退出程序');
}

async function login (page) {
    await page.goto(config.LOGIN_IFRAME_URL);

    const showInputsBtn = await page.$('#switcher_plogin');
    await showInputsBtn.click();

    const formElement = await page.$('.web_qr_login #loginform');
    const userElement = await formElement.$('.uinArea input');
    await userElement.type(config.users.name, {
        delay: config.op_delay
    });

    const pswdElement = await formElement.$('.pwdArea input');
    await pswdElement.type(config.users.pswd, {
        delay: config.op_delay
    });

    const submitElement = await formElement.$('.submit #login_button');
    await submitElement.click();
}

async function getalbums (page) {
    var iframe = await page.evaluateHandle(() => {
        return document.querySelector('iframe').contentDocument;
    });

    var items = await iframe.$$('.js-album-item');

    var album;
    for (var item of items) {
        album = await page.evaluate((item) => {
            return {
                name: item.getAttribute('data-name'),
                id: item.getAttribute('data-id'),
                photos: []
            };
        }, item);
        USER_PHOTOS.push(album);
    }
}

async function getphotos (page, album) {
    await page.goto(config.users.photouri + '/' + album.id);

    var iframe = await page.evaluateHandle(() => {
        return document.querySelector('iframe').contentDocument;
    });

    var totalnum = await iframe.$('.j-pl-albuminfo-total');
    totalnum = await page.evaluate((totalnum) => {
        return +totalnum.innerText.slice(0, -1);
    }, totalnum);

    var photoboxs = await iframe.$$('.j-pl-photoitem');
    var bodyHandle = await page.evaluateHandle(() => document.body);

    while (photoboxs.length < totalnum) {
        await bodyHandle.press('ArrowDown', {
            delay: config.op_delay
        });
        photoboxs = await iframe.$$('.j-pl-photoitem');
    }

    var src;
    for (var photo of photoboxs) {
        src = await page.evaluate((photo) => {
            var img = photo.querySelector('.j-pl-photoitem-img');
            return {
                title: photo.querySelector('.item-tit span').getAttribute('title'),
                src : img.getAttribute('src') || img.getAttribute('data-src')
            }
        }, photo);
        album.photos.push(src);
    }
}

puppeteer.launch({
    executablePath: config.executablePath
}).then(browser => {
    console.log("启动headless Chrome成功");
    start(browser);
});
