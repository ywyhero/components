const CONFIG = {
    localhost: {
        api: 'https://online-classroom-dev.peilian.com/online-classroom',
        assetsRoot: 'https://tests001.pnlyy.com', // 静态资源域名
    },
    dev: {
        api: 'https://online-classroom-dev.peilian.com/online-classroom',
        assetsRoot: 'https://tests001.pnlyy.com', // 静态资源域名
    },
    pre: {
        api: 'https://online-classroom-pre.peilian.com/online-classroom',
        assetsRoot: 'https://mall-static.peilian.com'
    },
    prod: {
        api: 'https://online-classroom.peilian.com/online-classroom',
        assetsRoot: 'https://mall-static.peilian.com'
    }
}

const host = window.location.host;
if (host.includes('cloud-admin-dev.peilian')) {
    global.apiUrl = CONFIG.dev
} else if (host.includes('cloud-admin-pre.peilian.com')) {
    global.apiUrl = CONFIG.pre
} else if (host.includes('cloud-admin.peilian.com')) {
    global.apiUrl = CONFIG.prod
} else {
    global.apiUrl = CONFIG.localhost
}

export default global.apiUrl