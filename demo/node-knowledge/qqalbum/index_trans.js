const { transUri } = require('./transferUrl');
const userData = require('./user_data.json');

userData.forEach((val) => {
    val.photos.forEach((photo) => {
        photo.src = transUri(photo.src);
    });
});

const fs = require('fs');

var file = fs.createWriteStream('./user_data_transfered.json');
file.write(JSON.stringify(userData, null, 4));
file.close();
