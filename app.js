var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
