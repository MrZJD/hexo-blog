const CHROME_CANARY_EXE = 'C:\\Users\\MrZebra\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe';

const LOGIN_URL = 'https://user.qzone.qq.com';
const LOGIN_IFRAME_URL = 'https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=549000912&s_url=https%3A%2F%2Fqzone.qq.com';

module.exports = {
    executablePath: CHROME_CANARY_EXE,
    LOGIN_URL: LOGIN_URL,
    LOGIN_IFRAME_URL: LOGIN_IFRAME_URL,
    users: {
        name: "{qq号}",
        pswd: "{qq密码}",
        photouri: `${LOGIN_URL}/{qq号}/photo`
    },
    op_delay: 0
};