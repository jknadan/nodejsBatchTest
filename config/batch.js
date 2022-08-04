const testDao = require("../src/DAO/index");
const {pool} = require("./database");

init();

function init(){
    testInsert();
}

function release(connection){
    connection.release();
}

async function testInsert(){

    const connection = await pool.getConnection((conn)=>conn);

    let random = Math.floor(Math.random() * 100);
    let random2 = Math.random().toString(36).substr(2,11);
    let random3 = Math.random().toString(36).substr(2,11);
    let random4 = Math.random().toString(36).substr(2,11);
    // const result = await testDao.insertTestQuery(connection,[random,random2,random3,random4]);
    // console.log(result);

    release(connection);
}

module.exports = {
    start : init
}
