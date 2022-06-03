const {response,errResponse} = require('./../config/response');
const baseResponse = require('./../config/baseResponseDict');
const logger = require('loglevel');


exports.userTest = async function(req, res, next) {

    try{
        let result = {
            type : 'json',
            message : '함수 처리 결과입니다.'
        };

        res.send(response(baseResponse.SUCCESS("성공 메세지를 입력하세요"),result));

    }catch (err){
        logger.error("오류가 발생했습니다." + err);
        res.send(errResponse(baseResponse.FAIL));
    }


}
