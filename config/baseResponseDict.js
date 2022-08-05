module.exports = {
    SUCCESS: function successSet(message) {
        return { isSuccess: true, code: 0, message: message };
    },

    FAIL: { isSuccess: false, code: -1, message: "실패입니다." },
    TOKEN_EMPTY: { isSuccess: false, code: -1, message: "토큰이 비어있습니다." },

    TOKEN_EXPIRED: {
        isSuccess: false,
        code: -1,
        message: "토큰이 만료되었습니다.",
    },
    ACCESS_TOKEN_EXPIRED: {
        isSuccess: false,
        code: -1,
        message: "Access Token이 만료되었습니다.",
    },
    TOKEN_VERIFICATION_FAILURE: {
        isSuccess: false,
        code: -1,
        message: "토큰 처리에 실패하였습니다.",
    },
    ROUTE_NOT_FOUND: {
        isSuccess: false,
        code: -1,
        message: "조회 가능한 버스가 없습니다.",
    },
    TERMINAL_NOT_FOUND: {
        isSuccess: false,
        code: -1,
        message: "조회 가능한 터미널 정보가 없습니다.",
    },
    PARAM_EMPTY: {
        isSuccess: false,
        code: -1,
        message: "입력 칸에 정보를 입력해주세요",
    },
    USER_RESERVATION_EMPTY: {
        isSuccess: false,
        code: -1,
        message: "예약하신 정보가 없습니다",
    },
    USER_STATUS_FAIL: {
        isSuccess: false,
        code: -1,
        message: "존재하지 않거나 탈퇴한 회원입니다.",
    },
    LAT_LONG_WRONG: {
        isSuccess: false,
        code: -1,
        message: "올바르지 못한 위도 경도 값입니다.",
    },
    OUT_RANGE_DATE : {isSuccess : false,
        code : -1 ,
        message : "해당 날짜는 정보를 제공해드릴 수 없습니다."},

    URL_TYPE_ERROR : {isSuccess : false,
        code : -1 ,
        message : "잘못된 api 요청입니다.(타입에러)"},

    EMPTY_NEAREST_TER_ROUTE : {isSuccess : false,
        code : -1 ,
        message : "현재 가장 가까운 터미널에서 목적지를 향하는 버스가 없습니다."},

    WRONG_PARAM_TYPE : {isSuccess : false,
        code : -1 ,
        message : "잘못된 함수 인자입니다."},

    EMPTY_ROUTE_ID : {isSuccess : false,
        code : -1 ,
        message : "해당하는 노선 정보가 없습니다."},

    WRONG_TIME_PAST : {isSuccess : false,
        code : -1 ,
        message : "이미 지난 시각의 좌석은 조회할 수 없습니다."},

    WRONG_TIME_PARAMS : {isSuccess : false,
        code : -1 ,
        message : "출발 시각과 도착 시각 중 하나만 말씀해주세요"},



};
