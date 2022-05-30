#!/usr/bin/env node


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// cors 이슈 해결을 위한 cors 패키지 추가.
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// express 패키지를 변수에 담음 → REST API 작성 가능 (그 중에서도 HTTP 4가지 메소드를 통해 URL에 접근할 수 있게 해줌)
var app = express();

// app.use ~~ = 미들웨어 사용
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

var debug = require('debug')('nodetemplate:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

// nodeJS에서 환경 변수를 가져올 때 사용 (여기선 포트 번호를 지정)
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port); // 설정한 포트를 기반으로한 서버 실행
server.on('error', onError); // 실행 시 Error발생 = onError 함수 실행
server.on('listening', onListening); // 실행 성공 = onListening 함수 실행

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
// TODO: 서버 실행 시 로깅 = 후에 winston morgan 등 로그 라이브러리로 대체 예정
console.log(`Server - API Server Start At Port ${port}`);

module.exports = app;
