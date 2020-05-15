/**
 * boolean 데이터를 django 데이터베이스에 맞게 변환해주는 함수
 * @param {Boolean} data django에 맞게 true, False값을 변환할 boolean 데이터
 * @returns {String} "True" 혹은 "False" 문자열
 */
function convertBooleanData(data) {
    if (data == true) {
        return "True"
    } else if (data == false) {
        return "False"
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

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;

    return year + "-" + month + "-" + date + " " + hour + ":" + min;

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
 * 서버에서 주고받는 데이터를 통일해서 생성하기 위한 함수(총 10개의 파라미터)
 * @param {String|Number} id 캘린더의 scheduleID(database 키 값)
 * @param {String} calendarId 캘린더의 setCalendars로 지정된 값(ex. "Major Subject")
 * @param {String} title 제목
 * @param {String} category 일정의 종류 ("milestone", "task", "allday", "time" 4가지 속성)
 * @param {String} location 일정 장소
 * @param {String|Date} start 시작 시간
 * @param {String|Date} end 종료 시간
 * @param {String|Boolean} isAllDay 하루 종일인지 설정
 * @param {"busy"|"free"} state 일정의 상태 
 * @param {String|{class:""}} calendarClass 공개/비공개 설정("private", "public", {class: ""})
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
    if (typeof calendarClass === "object")
        schedule.raw = calendarClass;
    else if (typeof calendarClass === "string")
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
        schedule = newCalObj(
            data[i].pk,
            data[i].fields.calendarId,
            data[i].fields.title,
            "time",
            data[i].fields.location,
            data[i].fields.start,
            data[i].fields.end,
            data[i].fields.isAllDay,
            data[i].fields.state, {
                class: data[i].fields.calendarClass
            })
        calendar.createSchedules([schedule]);
    }

    // 디버깅용 코드
    // console.log("일정 불러오기 완료")
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
 * @param {"GET"|"POST"} type 요청을 보내는 방식 only (GET, POST)
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
                reject(new Error("데이터 받아오기 실패!"));

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

    if (document.getElementById("test2").style.display == "block") {
        // 학과 옵션 출력
        ajaxPost("/toast_cal/department/", "json", "POST", 1)
            .then(function(data) {
                $('#department').empty(); //기존 옵션 값 삭제
                $("#department").find("option").end().append("<option value='전체'>전체</option>");
                $('#subject').empty();
                $('#lecture_type').empty();

                for (var count = 0; count < data.length; count++) {
                    var option = $("<option>" + data[count].fields.name + "</option>");
                    $('#department').append(option);
                }
            })
            .catch(function(err) {
                alert(err);
            });
    }
}