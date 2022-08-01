const cron = require('node-cron');
const date = require('date-utils');

const batchStart = require("./batch");

function batch(){

    cron.schedule('* * * * * * ',async function(){
        console.log("배치 시작");
        batchStart.start();
    });


}

module.exports = batch
