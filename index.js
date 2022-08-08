#!/usr/bin/env node

let express = require('express');
const app = require('./config/app');
const logger = require('loglevel');
const schedule = require('./config/scheduler');

let http = require('http');
let server = http.createServer(app);
let port = 3001;

app.set('port', port);

server.listen(port); // 설정한 포트를 기반으로한 서버 실행


// TODO: 서버 실행 시 로깅 = 후에 winston morgan 등 로그 라이브러리로 대체 예정
// → log level library를 채택. 그러나 level 등 기본 설정 공부 필요
logger.warn(`Server - API Server Start At Port ${port}`);

schedule.start();
// console.log();
