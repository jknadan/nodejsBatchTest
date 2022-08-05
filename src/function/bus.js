const baseResponse = require("../../config/baseResponseDict");
const logger = require("loglevel");
const busDao = require("../DAO/bus");
const axios = require("axios");
const { pool } = require("../../config/database");
const { response, errResponse } = require("../../config/response");
const haversine = require("haversine");
const moment = require("moment");
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

exports.getDepartArrival = async function(type,terminalNm,region,itemName){

    const connection = await pool.getConnection((conn)=>conn);

    try{

        const busList = await busDao.searchBusKeyword(connection,terminalNm);

        let resultRow = [];

        if(type === 's'){
            for(let i in busList){
                const route = await busDao.getRouteDepart(connection,busList[i].tmoneyTerId);

                resultRow[i] = busList[i];

                if (region !== undefined) {
                    resultRow[i][itemName] = route.filter(
                        (element) => element.cityRegion === region
                    );
                }else if(region === "" || region === undefined){
                    resultRow[i][itemName] = route;
                }

            }

            connection.release();
            return resultRow;

        }else if(type === 'a'){

            for(let i in busList){
                const route = await busDao.getRouteArrival(connection,busList[i].tmoneyTerId);

                resultRow[i] = busList[i];

                if (region !== undefined) {
                    resultRow[i][itemName] = route.filter(
                        (element) => element.cityRegion === region
                    );
                }else if(region === "" || region === undefined){
                    resultRow[i][itemName] = route;
                }

            }

            connection.release();
            return resultRow;

        }else{
            return errResponse(baseResponse.WRONG_PARAM_TYPE);
        }

    }catch (err) {
        logger.warn(err + "에러 발생");
        connection.release();
        return errResponse(baseResponse.FAIL);
    }


}

exports.getRouteSchedule = async function(date,time,routeId){

    const connection = await pool.getConnection((conn)=>conn);

    try{

        const checkRouteId = await busDao.checkRouteID(connection,routeId);


        if(!checkRouteId || checkRouteId[0] === undefined)
            return errResponse(baseResponse.EMPTY_ROUTE_ID)

        const routeSchedule = await busDao.getRouteSchedule(connection,routeId,date);

        const resultRow = {
            departure : checkRouteId[0].departTerName,
            arrival : checkRouteId[0].arrivalTerName,
            LINE : routeSchedule
        }

        if(parseInt(date) === parseInt(moment().format("YYYYMMDD"))){
            resultRow["LINE"] = routeSchedule.filter(
                (element) => element.time > time
            );
        }

        connection.release();

        return response(baseResponse.SUCCESS("성공입니다."),resultRow);

    }catch (err) {

        logger.warn(err + "에러 발생");
        connection.release();
        return errResponse(baseResponse.FAIL);

    }
}

exports.getSeatInfo = async function(routeId,date,time){

    const connection = await pool.getConnection((conn)=>conn);

    try{

        const checkRouteId = await busDao.checkRouteID(connection,routeId);


        if(!checkRouteId || checkRouteId[0] === undefined)
            return errResponse(baseResponse.EMPTY_ROUTE_ID)

        console.log(checkRouteId)

        let params = await busDao.getRouteSchedule(connection,routeId,date);
        params = params.filter(
            (element) => element.time === time
        )
        console.log(params);

        let url =
            "https://apigw.tmoney.co.kr:5556/gateway/xzzIbtInfoGet/v1/ibt_info/" +
            checkRouteId[0].departTerId +
            "/" +
            checkRouteId[0].arrivalTerId +
            "/" +
            params[0].rotId +
            "/" +
            params[0].rotSqno +
            "/" +
            date +
            "/" +
            params[0].alcnSqno;

        let resultRow = await axios
            .get(url, {
                headers: {
                    "x-Gateway-APIKey": "501f3526-d732-4562-a3a9-178a75690b44",
                },
            })
            .then((result) => {

                let resultRow = {
                    TOTAL_SEAT_CNT: result.data.response.TOT_CNT,
                    REST_SEAT_CNT: result.data.response.OCC_Y_CNT,
                    SEAT_LIST: result.data.response.SEAT_LIST,
                };

                return resultRow;

            })

        return response(baseResponse.SUCCESS("성공입니다."),resultRow);

    }catch (err) {

        logger.warn(err + "에러 발생");
        connection.release();
        return errResponse(baseResponse.FAIL);

    }

}

exports.determineArrival = async function(temp){

    let index = 0;

    for (let i in temp) {
        if (temp[index].departure.length <= temp[i].departure.length) {
            index = i;
        }
    }

    return temp[index];

}

exports.checkExistRoute = async function(list){

    const connection = await pool.getConnection((conn)=>conn);

    try{
        const allRoute = await busDao.getAllRoute(connection);

        let temp = [];

        for(let i in allRoute){
            temp[i] = allRoute[i].routeId;
        }

        list = list.filter(
            (element, i) => temp.includes(element.routeId)
        )

        connection.release;

        return list;


    }catch (err) {
        logger.warn(err + "에러 발생");
        connection.release();
        return errResponse(baseResponse.FAIL);
    }
}

exports.getNearestTerminal = async function(temp,user){

    const connection = await pool.getConnection((conn)=>conn);
    let distance, resultRow;

    try{

        for(let i in temp) {

            for(let j in temp[i].departure){

                const end = {
                    latitude: Number(temp[i].departure[j].latitude),
                    longitude: Number(temp[i].departure[j].longitude),
                }

                if (i === "0") {
                    distance = haversine(user, end, {unit: "mile"});
                    resultRow = {
                        DepartureTerName: temp[i].departure[j].departTerName,
                        DepartureTerId: temp[i].departure[j].departTerId,
                        ArrivalTerName : temp[i].terminalName,
                        ArrivalTerId : temp[i].tmoneyTerId

                    };
                } else if (distance >= haversine(user, end, {unit: "mile"})) {
                    distance = haversine(user, end, {unit: "mile"});

                    resultRow = {
                        DepartureTerName: temp[i].departure[j].departTerName,
                        DepartureTerId: temp[i].departure[j].departTerId,
                        ArrivalTerName : temp[i].terminalName,
                        ArrivalTerId : temp[i].tmoneyTerId

                    };
                }
            }


        }

        return resultRow;


    }catch (err) {

        logger.warn(err + "에러 발생");
        connection.release();
        return errResponse(baseResponse.FAIL);

    }

}
