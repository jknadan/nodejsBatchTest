var express = require('express');
var router = express.Router();
const response = require('./../config/response');
const baseResponse = require('./../config/baseResponseDict');

/* GET users listing. */
router.get('/', function(req, res, next) {

  let result = {
    type : 'json',
    message : '함수 처리 결과입니다.'
  };
  res.send(response.response(baseResponse.SUCCESS("성공 메세지를 입력하세요"),result));

});

module.exports = router;
