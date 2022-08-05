const busFunction = require('../function/bus');
const { pool } = require("../../config/database");
const { response, errResponse } = require("../../config/response");
const baseResponse = require("../../config/baseResponseDict");
const logger = require("loglevel");
const busDao = require("../DAO/bus");
const axios = require("axios");
const haversine = require("haversine");
const dateUtils = require("date-utils");
const url = require("url");
const moment = require("moment");
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

exports.getBusList = async function(req,res){
    let regionNm = req.query.regionNm;
    let terminalNm = req.query.terminalNm;

    const temp = [regionNm, terminalNm];
    const busInfoParams = temp.filter(
        (element) => element !== undefined && element !== ""
    );

    if (regionNm === "") {
        regionNm = undefined;
    } else if (terminalNm === "") {
        terminalNm = undefined;
    }
    let sql;

    if (regionNm !== undefined && terminalNm !== undefined) {
        sql =
            ` where cityRegion = ` +
            "'" +
            regionNm +
            "'" +
            `and TERMINAL.terminalName like '%` +
            terminalNm +
            `%' `;
    } else if (regionNm === undefined && terminalNm !== undefined) {
        sql = ` where TERMINAL.terminalName like '%` + terminalNm + `%' `;
    } else if (regionNm !== undefined && terminalNm === undefined) {
        sql = ` where cityRegion = ` + "'" + regionNm + "'" + ` `;
    } else {
        sql = ` `;
    }

    const connection = await pool.getConnection((conn) => conn);

    try {
        const resultRow = await busDao.getBusList(connection, busInfoParams, sql);

        connection.release();

        return res.send(
            response(baseResponse.SUCCESS("성공하였습니다."), resultRow)
        );
    } catch (err) {
        logger.warn(err + "에러 발생");
        connection.release();
        return res.send(errResponse(baseResponse.FAIL));
    }

}

exports.selectMyBus = async function(req,res){
    let type = req.query.type;
    let terminalNm = req.query.terminalNm;
    let region = req.query.region;
    let arrivalNm = req.query.arrivalNm;

    if (type !== "s" && type !== "a")
        return res.send(errResponse(baseResponse.URL_TYPE_ERROR));

    const itemName = type === "s" ? "arrival" : "departure";

    if (terminalNm === undefined) {
        terminalNm = "";
    }

    const resultRow = await busFunction.getDepartArrival(type,terminalNm,region,itemName);

    return res.send(response(baseResponse.SUCCESS("성공입니다."),resultRow));


}

exports.getDepartArrival = async function(req,res){

    let routeId = req.params.routeId;

    let now = new Date();
    let date = req.query.date;
    let time = req.query.time;

    if (!date) {
        date = now.toFormat("YYYYMMDD");
    } else if (parseInt(date) > parseInt(moment().add(30,"days").format("YYYYMMDD"))) {
        return res.send(errResponse(baseResponse.OUT_RANGE_DATE));
    }

    if (!time) {
        time = now.toFormat("HH24MI");
    }

    console.log("설정 날짜 : " + date);
    console.log("설정 시간 : " + time);

    if (!routeId) {
        return res.send(errResponse(baseResponse.PARAM_EMPTY));
    }

    const resultRow = await busFunction.getRouteSchedule(date,time,routeId);

    return res.send(resultRow);

}

exports.getSeatList = async function (req, res) {

    const { routeId,date,time } = req.query;

    if(!routeId || !date || !time)
        return res.send(errResponse(baseResponse.PARAM_EMPTY));

    let now = new Date();
    let present = now.toFormat("HH24MI");

    if(parseInt(date) < parseInt(moment().format("YYYYMMDD")))
        return res.send(errResponse(baseResponse.OUT_RANGE_DATE));

    if(parseInt(present) > parseInt(time))
        return res.send(errResponse(baseResponse.WRONG_TIME_PAST));

    const resultRow = await busFunction.getSeatInfo(routeId,date,time);

    return res.send(resultRow);

};

exports.getNearestTer = async function(req,res){

    let distance, resultRow;
    const type = 'a';
    const itemName = 'departure'

    const terminalNm = req.query.terminalNm; // 가고 싶은 터미널 이름

    const user = {
        latitude: Number(req.query.latitude),
        longitude: Number(req.query.longitude),
    };

    if (
        user.latitude > 90 ||
        user.latitude < -90 ||
        user.longitude > 180 ||
        user.longitude < -180
    ) {
        return res.send(errResponse(baseResponse.LAT_LONG_WRONG));
    }

    const temp = await busFunction.getDepartArrival(type,terminalNm,undefined,itemName);
    const arrival = await busFunction.determineArrival(temp);
    let list = arrival.departure

    const exist = await busFunction.checkExistRoute(list);

    for(let i in exist){
        const end = {
            latitude: Number(exist[i].latitude),
            longitude: Number(exist[i].longitude),
        }

        if (i === "0") {
            distance = haversine(user, end, { unit: "mile" });
            resultRow = {
                DepartureTerName: exist[i].departTerName,
                DepartureTerId: exist[i].departTerId,
            };
        } else if (distance >= haversine(user, end, { unit: "mile" })) {
            distance = haversine(user, end, { unit: "mile" });

            resultRow = {
                DepartureTerName: exist[i].departTerName,
                DepartureTerId: exist[i].departTerId,
            };
        }


    }
    console.log(resultRow);

    return res.send(response(baseResponse.SUCCESS("현재 위치에서 출발할 수 있는 가장 가까운 터미널 정보입니다."),resultRow));

}

exports.getNearestTerTwo = async function(req,res){

    let distance;
    const type = 'a';
    const itemName = 'departure'

    const terminalNm = req.query.terminalNm; // 가고 싶은 터미널 이름

    const user = {
        latitude: Number(req.query.latitude),
        longitude: Number(req.query.longitude),
    };

    if (
        user.latitude > 90 ||
        user.latitude < -90 ||
        user.longitude > 180 ||
        user.longitude < -180
    ) {
        return res.send(errResponse(baseResponse.LAT_LONG_WRONG));
    }

    const temp = await busFunction.getDepartArrival(type,terminalNm,undefined,itemName);
    console.log(temp[0].departure);

    const resultRow = await busFunction.getNearestTerminal(temp,user);

}
