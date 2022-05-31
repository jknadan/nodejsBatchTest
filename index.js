#!/usr/bin/env node

let express = require('express');
const app = require('./config/app');

let http = require('http');
let server = http.createServer(app);
let port = 3000;

app.set('port', port);

server.listen(port); // 설정한 포트를 기반으로한 서버 실행


// TODO: 서버 실행 시 로깅 = 후에 winston morgan 등 로그 라이브러리로 대체 예정
console.log(`Server - API Server Start At Port ${port}`);