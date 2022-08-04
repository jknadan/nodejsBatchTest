exports.indexTestQuery = async function(connection) {
    const query = `
    select *
    from test;
    `

    const [array] = await connection.query(query);
    return array;

}
//
// exports.insertTestQuery = async function(connection,params){
//     const sql = `
//     INSERT INTO
//         test.user(userId, name, identificationId, phoneNum)
//     VALUES (?, ?, ?, ?);
//     `;
//
//     const [array] = await connection.query(sql,params);
//     return array;
//
// }
