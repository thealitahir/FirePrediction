/**
 * Created by ali on 12/8/2017.
 */
var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200']
});

client.indices.create({
    index:'vendorlocation2'
},function( err,resp,status){
    if (err) {
        console.log("Error occurred " + err);
    } else {
        console.log("create", resp);
    }
});

module.exports = client;
