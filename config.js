var config = {
    production: {
        database : 'mongodb://localhost:27017/',
        dbo : "pfe"
    },
    default: {
        database : 'mongodb://localhost:27017/',
        dbo : "pfe"
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}

