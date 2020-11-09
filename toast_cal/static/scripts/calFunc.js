/**
 * boolean 데이터를 django 데이터베이스에 맞게 변환해주는 함수
 * @param {Boolean} data django에 맞게 true, False값을 변환할 boolean 데이터
 * @returns {String} 'True' 혹은 'False' 문자열
 */
function convertBooleanData(data) {
    if (data === true) {
        return 'True'
    } else if (data === false) {
        return 'False'
    } else {
        return undefined;
    }
}


/**
 * Date 객체를 문자열로 변환해주는 함수
 * @param {Date} data 문자열로 변환할 Date() 객체
 * @returns {String} database 형식에 맞게 수정된 yy:mm:dd:hh:mm 데이터
 */
function date_to_str(data) {

    var year = data.getFullYear();
    var month = data.getMonth() + 1;
    var date = data.getDate();
    var hour = data.getHours();
    var min = data.getMinutes();

    if (month < 10) month = '0' + month;
    if (date < 10) date = '0' + date;
    if (hour < 10) hour = '0' + hour;
    if (min < 10) min = '0' + min;

    return year + '-' + month + '-' + date + ' ' + hour + ':' + min;

}

/** 이번주 시작날짜부터 끝나는 날짜까지 배열로 반환 (일~토)
 * @returns {Array} 이번주 시작날짜부터 끝나는 날짜까지 들어있는 배열 데이터
 */
function getThisWeek() {
    var currentDay = new Date();
    var theYear = currentDay.getFullYear();
    var theMonth = currentDay.getMonth();
    var theDate = currentDay.getDate();
    var theDayOfWeek = currentDay.getDay();

    var thisWeek = [];

    for (var i = 0; i < 7; i++) {
        var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek));
        var yyyy = resultDay.getFullYear();
        var mm = Number(resultDay.getMonth()) + 1;
        var dd = resultDay.getDate();

        mm = String(mm).length === 1 ? '0' + mm : mm;
        dd = String(dd).length === 1 ? '0' + dd : dd;

        thisWeek[i] = yyyy + '-' + mm + '-' + dd;
    }
    return thisWeek;
}

/**
 * 캘린더의 년, 월 정보를 받아 출력하는 함수
 * @param {*} year 캘린더에 표시할 년도 값
 * @param {*} month 캘린더에 표시할 월 값
 * @param {*} calendar 년도와 월 값을 표시할 calendar 객체
 */
function getYearMonth(year, month, calendar) {
    year.innerHTML = calendar.getDate()._date.getFullYear();
    month.innerHTML = calendar.getDate()._date.getMonth() + 1;
}

/**
 * 
 * @param {int} flag 줘야하는 플래그(0,1)
 * @param {int} value 현재날짜에서 더할 숫자
 * @returns {String} 뽑아낸 날짜의 String
 */
function getDate(flag, value) {
    var now = new Date();
    var nowDayOfWeek = now.getDay();
    var nowDay = now.getDate();
    var nowMonth = now.getMonth();
    var nowYear = now.getFullYear();

    if (flag === 0)
        var DayOfWeek = value - nowDayOfWeek;
    else if (flag === 1)
        var DayOfWeek = value + (6 - nowDayOfWeek);

    var weekDate = new Date(nowYear, nowMonth, nowDay + DayOfWeek);

    var newDate = weekDate.getFullYear() + '-' + (weekDate.getMonth() + 1) + '-' + weekDate.getDate();

    return newDate;
}

/**
 * 특정 날짜를 주면 그 주의 특정 요일의 날짜를 반환하는 함수
 * @param {-mm-dd} monthday 시작할 달과 날짜
 * @param {int} value 특정 요일의 날짜를 계산하기 위한 숫자(0~6 + a)
 */
function getDayDate(monthday, value) {
    var nowYear = new Date();
    var now = new Date(nowYear.getFullYear() + monthday); // 들어온 monthday를 기준으로 잡음
    var day = now.getDay(); // 들어온 monthday의 요일값을 저장
    var nowDay = now.getDate(); // 들어온 monthday의 날짜를 저장
    var nowMonth = now.getMonth(); // 들어온 monthday의 달을 저장
    var nowYear = now.getFullYear(); // 현재의 년도를 저장

    /* 만약 3월 2일이 화요일이면, day의 값은 2, 이를 value값으로 보정하여 특정 날짜 뽑기*/
    var DayOfWeek = value - day; //들어온 값에서 0~6의 값을 뺌

    var weekDate = new Date(nowYear, nowMonth, nowDay + DayOfWeek);

    var newMonth = weekDate.getMonth() + 1;
    var newDate = weekDate.getDate();

    if (newMonth < 10) newMonth = '0' + newMonth;
    if (newDate < 10) newDate = '0' + newDate;

    var newDate = weekDate.getFullYear() + '-' + newMonth + '-' + newDate;

    return newDate;
}

/**
 * 특정 강의의 교시 정보를 요일과 교시로 잘라 배열로 반환하는 함수
 * @param {String} period 특정 강의 교시 정보(ex.월78 월910)
 * @returns {Array} 입력된 강의 정보를 잘라 담아놓은 배열
 */
function periodSplit(period) {
    var cutDataArray = [];
    var firstCutData = period.split(' ');

    var theDay;
    var stdClass;

    for (var i = 0; i < firstCutData.length; i++) {
        // console.log(firstCutData[i]);
        theDay = firstCutData[i].substring(0, 1);
        stdClass = firstCutData[i].substring(1);
        cutDataArray.push(theDay);
        cutDataArray.push(stdClass);
    }

    return cutDataArray;
}

/**
 * 들어온 요일 문자열을 해당하는 요일의 숫자값으로 반환하는 함수
 * @param {String} day 변환되기전 요일값
 * @returns 각 요일의 숫자값
 */
function dayConvert(day) {

    if (day === '일') return 0;
    if (day === '월') return 1;
    if (day === '화') return 2;
    if (day === '수') return 3;
    if (day === '목') return 4;
    if (day === '금') return 5;
    if (day === '토') return 6;
}

/**
 * 들어온 교시값에 따라 시간을 반환하는 함수
 * @param {String} time 시간으로 변환할 교시값 문자열
 * @returns {Array} 시간으로 변환된 시작시간과 끝시간이 담긴 배열
 */
function timeConvert(time) {
    if (time === '12') return ['09:30', '10:45'];
    if (time === '34') return ['11:00', '12:15'];
    if (time === '78') return ['13:00', '14:15'];
    if (time === '910') return ['14:30', '15:45'];
    if (time === '1112') return ['16:00', '17:15'];
    if (time === '1314') return ['17:30', '18:45'];
}

/**
 * periodSplit으로 반환된 교시값의 데이터 배열을 변환해주는 함수
 * @param {Array} period 변환이 되기전 잘라져서 들어올 데이터
 * @returns {Array} 변환이 완료된 데이터의 배열
 */
function periodConvert(period) {
    var convertedData = []
    for (var i = 0; i < period.length; i++) {
        if (i % 2 === 0) convertedData.push(dayConvert(period[i]));
        else if (i % 2 !== 0) convertedData.push(timeConvert(period[i]));
    }
    return convertedData;
}

/**
 * periodConvert로 변환한 데이터를 yyyy-mm-dd hh:mm 형식으로 반환하는 함수
 * @param {Array} convertedData periodConvert로 변환된 데이터 배열
 * @param {-mm-dd} monthday 시작할 달과 날짜
 * @param {int} day 특정 요일의 날짜를 계산하기 위한 숫자(0~6 + a)
 * @returns {Array} 시작시간과 끝시간이 담겨있는 오브젝트들을 담은 배열
 */
function getTimeData(convertedData, monthday, day) {
    var dateData = [];
    for (var j = 0; j < 2; j++) {
        var tmpobj = {};
        var date = getDayDate(monthday, convertedData[2 * j] + day);
        var startDate = date + ' ' + convertedData[1 + 2 * j][0];
        var endDate = date + ' ' + convertedData[1 + 2 * j][1];
        tmpobj.startDate = startDate;
        tmpobj.endDate = endDate;
        dateData.push(tmpobj);
    }
    return dateData;
}

/**
 * 서버에서 주고받는 데이터를 통일해서 생성하기 위한 함수(총 10개의 파라미터)
 * @param {String|Number} id 캘린더의 scheduleID(database 키 값) ※ 1로 줄것!
 * @param {String} calendarId 캘린더의 setCalendars로 지정된 값(ex. 'Major Subject')
 * @param {String} title 제목
 * @param {String} category 일정의 종류 ('milestone', 'task', 'allday', 'time' 4가지 속성)
 * @param {String} location 일정 장소
 * @param {String|Date} start 시작 시간
 * @param {String|Date} end 종료 시간
 * @param {String|Boolean} isAllDay 하루 종일인지 설정
 * @param {'busy'|'free'} state 일정의 상태 
 * @param {String|{class:''}} calendarClass 공개/비공개 설정('private', 'public', {class: ''})
 * @returns {Object} calendar 생성을 위한 Object 데이터 
 */
function newCalObj(id, calendarId, title, category, location, start, end, isAllDay, state, calendarClass) {

    var schedule = {
        id: id,
        calendarId: calendarId,
        title: title,
        category: category,
        location: location,
        start: start,
        end: end,
        isAllDay: isAllDay,
        state: state
    }
    if (typeof calendarClass === 'object')
        schedule.raw = calendarClass;
    else if (typeof calendarClass === 'string')
        schedule.class = calendarClass;
    return schedule;
}

/**
 * createSchedules API를 통해 화면에 일정 뿌려주기
 * @param {Object} calendar 스케쥴을 생성할 캘린더 객체
 * @param {Object} data 서버에서 받아온 json 객체(object)
 */
function create(calendar, data) {
    var i;
    for (i = 0; i < data.length; i++) {
        let schedule = newCalObj(
            data[i].pk,
            data[i].fields.calendarId,
            data[i].fields.title,
            'time',
            data[i].fields.location,
            data[i].fields.start,
            data[i].fields.end,
            data[i].fields.isAllDay,
            data[i].fields.state, {
                class: data[i].fields.calendarClass
            });
        // console.log(schedule);
        calendar.createSchedules([schedule]);
    }

    // 디버깅용 코드
    // console.log('일정 불러오기 완료')
}

/**
 * name 값을 이용해 쿠키값을 리턴해주는 함수
 * @param {String} name 쿠키를 받아올 html dom의 이름
 * @returns {String} 받아올 쿠키값의 문자열
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * jquery ajax promise 이용 함수
 * @param {String} url 요청을 보낼 url 주소
 * @param {String} datatype 서버에서 받아올 데이터 타입(json, int, number ...)
 * @param {'GET'|'POST'} type 요청을 보내는 방식 only (GET, POST)
 * @param {*} data 서버에 보낼 데이터(없다면 1 입력)
 * @returns {Promise} 성공, 실패 상태를 나눠 처리할 Promise 객체 반환
 */
function ajaxPost(url, datatype, type, data) {
    var csrftoken = getCookie('csrftoken');

    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            datatype: datatype,
            data: data,
            headers: {
                'X-CSRFToken': csrftoken
            },
            type: type,
            success: function(data) {
                if (data) {
                    resolve(data);
                }
                reject(new Error('데이터 받아오기 실패!'));

            }
        });
    })
}

/**
 * HTML DOM을 조작하여 첫번째 속성만 display block으로 변경하는 함수
 * @param {String} id1 display 속성을 block으로 설정할 id 값
 * @param  {...String} args display 속성을 none으로 설정할 id값들
 */
function changeContents(id1, ...args) {
    var setDisplay = document.getElementById(id1);

    setDisplay.style.display = 'block';

    for (let i = 0; i < args.length; i++) {
        setDisplay = document.getElementById(args[i]);
        setDisplay.style.display = 'none';
    }
}



/**
 * HTML 표를 조작하여 표의 특정 열을 선택 시 색깔이 바뀌도록 해주는 함수
 * @param {} tr 클릭시 색상이 바뀌도록 할 표의 tr 요소 
 * @param {String} id 색상이 바뀔 대상 tbody의 id값 (#id) 
 * @param {Boolean} option true : 한개의 행만 선택 가능 / false : 여러개의 행 선택 가능
 */
function clickTrEvent(tr, id, option) { //tr tag
    if (tr.style.backgroundColor === '') {
        if (option === true) {
            var tbody_tr = $(id).children();
            for (var i = 0; i < tbody_tr.length; i++) {
                tbody_tr[i].style.backgroundColor = '';
            }
        }

        tr.style.backgroundColor = '#b1b3b6';
    } else {
        tr.style.backgroundColor = '';
    }
    var tdArr = new Array();
    var td = $(tr).children();

    td.each(function(i) {
        tdArr.push(td.eq(i).text());
    });
}

/**
 * 한개 이상의 id 값을 입력하면 입력한 id값에 해당하는 인터페이스들을 비활성화하는 함수
 * @param  {...String} ids 비활성화 할 버튼의 id값 문자열들
 */
function uiLock(...ids) {

    for (let i = 0; i < ids.length; i++) {
        id = ids[i].trim();
        $(id).attr('disabled', true);
        // let setLock = document.getElementById(id);
        // setLock.disabled = true;
    }
}

/**
 * 한개 이상의 id 값을 입력하면 id값에 해당하는 인터페이스들을 활성화하는 함수
 * @param  {...String} ids 활성화 할 버튼의 id값 문자열들
 */
function uiUnLock(...ids) {

    for (let i = 0; i < ids.length; i++) {
        id = ids[i].trim();
        $(id).attr('disabled', false);
        // let setLock = document.getElementById(id);
        // setLock.disabled = false;
    }
}