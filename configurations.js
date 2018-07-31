var path = require('path');
module.exports = {
    uploadDir : path.join(__dirname,'/uploads/$user'),
    predictionDir : path.join(__dirname,'/bin/predictions'),
    extensionDir : path.join(__dirname,'/public/resources/custom-operation.zip'),
    flumeDir : path.join(__dirname,'/bin/flume'),

    twitter: {
        consumer_key:         'bkQMPkqUcWBI4D1i8haBUfuKp',
        access_token:         '376086397-WwwgAcDYcATtDDIYLWSd9msNatGriy8zIqoaCU2u',
        access_token_secret:  'tgQzYcPa10cnBs5qD0T7jR9OK8xb8x60XHToaL1U9odwY'
    },
    mockaroo :{
        key : '8b05ca80'
    }
};
