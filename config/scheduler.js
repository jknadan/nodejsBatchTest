const cron = require('node-cron');
const date = require('date-utils');

const batchStart = require("./batch");

function batch(){

// 매일 자정은 0 0 0 * * *
    cron.schedule('0 0 0 * * * ',async function(){
        console.log("배치 시작");
        await batchStart.start();
    });

}

module.exports = {
    start : batch
}
