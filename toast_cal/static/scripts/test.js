// 캘린더 쿼리셀렉터
const container = document.getElementById('calendar');

// 옵션 오브젝트
const options = {
    defaultView: 'month',
    useCreationPopup: true,
    useDetailPopup: true
};

// 캘린더 생성
const calendar = new tui.Calendar(container, options);

// 달력 뷰를 바꾸기 위한 버튼 및 addEventListener
var nextBtn = document.getElementById("nextBtn");
var prevBtn = document.getElementById('prevBtn');
var dayViewBtn = document.getElementById('dayViewBtn');
var weekViewBtn = document.getElementById('weekViewBtn');
var monthViewBtn = document.getElementById('monthViewBtn');

nextBtn.addEventListener('click', function(event) {
    calendar.next();
});

prevBtn.addEventListener("click", function(event) {
    calendar.prev();
});

dayViewBtn.addEventListener("click", function(event) {
    calendar.changeView('day', true);
});

weekViewBtn.addEventListener("click", function(event) {
    calendar.changeView('week', true);
});

monthViewBtn.addEventListener("click", function(event) {
    calendar.changeView('month', true);
});

// 캘린더 분류 생성
calendar.setCalendars([{
        id: 'Major Subject',
        name: '전공 필수',
        color: '#ffffff',
        bgColor: '#ff5583',
        dragBgColor: '#ff5583',
        borderColor: '#ff5583'
    },
    {
        id: 'Elective Subject',
        name: '전공 선택',
        color: '#ffffff',
        bgColor: '#ffbb3b',
        dragBgColor: '#ffbb3b',
        borderColor: '#ffbb3b'
    },
    {
        id: 'General Subject',
        name: '일반 교양',
        color: '#ffffff',
        bgColor: '#03bd9e',
        dragBgColor: '#03bd9e',
        borderColor: '#03bd9e'
    }
]);

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
        state: state,
        // class: calendarClass,
        // raw: {
        //     class: calendarClass
        // }
    }
    if (typeof calendarClass === "object")
        schedule.raw = calendarClass;
    else if (typeof calendarClass === "string")
        schedule.class = calendarClass;
    return schedule;
}

/**
 * createSchedules API를 통해 화면에 일정 뿌려주기
 * @param {Object} data 서버에서 받아온 json 객체(object)
 */
function create(data) {
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
 * jquery ajax promise 이용 함수
 * @param {String} url 요청을 보낼 url 주소
 * @param {String} datatype 서버에서 받아올 데이터 타입(json, int, number ...)
 * @param {"GET"|"POST"} type 요청을 보내는 방식 only (GET, POST)
 * @param {*} data 서버에 보낼 데이터(없다면 1 입력)
 * @returns {Promise} then으로 불러낼 Promise 객체 반환
 */
function ajaxPost(url, datatype, type, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            datatype: datatype,
            data: data,
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
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

ajaxPost("/toast_cal/ourstores/", 'json', "GET", "1")
    .then(function(data) {
        create(data);
    })
    .catch(function(err) {
        alert(err);
    });

// 이벤트로 일정 생성하기
calendar.on('beforeCreateSchedule', function(event) {
    var start = date_to_str(event.start._date);
    var end = date_to_str(event.end._date);
    var title = event.title;
    var location = document.getElementById("tui-full-calendar-schedule-location").value; // 오류로 인해 직접 받아옴
    var isAllDay = event.isAllDay;
    var calendarClass = event.raw.class;
    var state = event.state;
    var calendarId = event.calendarId;

    //서버에 보낼 데이터 object
    var createData = newCalObj(1, calendarId, title, 'time', location, start, end,
        convertBooleanData(isAllDay), state, calendarClass);

    ajaxPost("/toast_cal/create/", "int", "POST", createData)
        .then(function(data) {
            var schedule = createData;
            schedule.id = data;
            schedule.isAllDay = isAllDay;
            calendar.createSchedules([schedule]);
            // 디버깅용 alert
            alert("success!!")
        })
        .catch(function(err) {
            alert(err);
        });

});

// 이벤트로 일정 수정하기 AllDay 관련 버그1
calendar.on('beforeUpdateSchedule', function(event) {
    var schedule = event.schedule;
    var changes = {};
    var isPrivate;


    // 캘린더 데이터 값 오류로 인해 넣어줘야 하는 코드들

    //event에 changes값이 있으면 넣어줌
    if (event.changes != null) changes = event.changes;

    // public, private 값 포맷팅
    if (document.getElementsByClassName("tui-full-calendar-public").length == 1)
        isPrivate = "public"
    else
        isPrivate = "private";

    // CalendarId 이용 category 수정 로직 넣을 예정

    // location값 수동 설정
    changes.location = document.getElementById("tui-full-calendar-schedule-location").value;
    changes.raw = { // public, private 상태 수동 설정
        class: isPrivate
    }
    // 오류로 인해 넣어야 하는 코드들 끝

    calendar.updateSchedule(schedule.id, schedule.calendarId, changes);

    updateData = schedule;

    // 오브젝트 붙이기
    Object.assign(updateData, changes);

    // 날짜 데이터 포맷 변경
    if (updateData.hasOwnProperty('start')) {
        updateData.start = date_to_str(updateData.start._date);
        updateData.end = date_to_str(updateData.end._date);
    }
    // boolean 데이터 포맷 변경
    if (updateData.hasOwnProperty('isAllDay')) {
        updateData.isAllDay = convertBooleanData(updateData.isAllDay);
    }
    updateData.class = isPrivate;

    ajaxPost("/toast_cal/update/", "int", "POST", updateData)
        .then(alert("수정 완료!"))
        .catch(function(err) {
            alert(err);
        });
});

// 이벤트로 일정 삭제하기
calendar.on('beforeDeleteSchedule', function(event) {
    var schedule = event.schedule;

    delData = {
        id: schedule.id
    }

    ajaxPost("/toast_cal/delete/", "int", "POST", delData)
        .then(function(data) {
            calendar.deleteSchedule(schedule.id, schedule.calendarId);
            alert("삭제 완료!")
        })
        .catch(function(err) {
            alert(err);
        });
});

/* 새로운 일정 만들기 버튼용 함수
function createNewSchedule(event) {
    var start = event.start ? new Date(event.start.getTime()) : new Date();
    var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

    if (useCreationPopup) {
        cal.openCreationPopup({
            start: start,
            end: end
        });
    }
}*/