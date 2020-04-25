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

// ajax로 서버에서 일정 데이터 받아오기
$.ajax({
    url: "/toast_cal/ourstores/",
    datatype: 'json',
    headers: {
        'X-CSRFToken': '{{ csrf_token }}'
    },
    type: 'GET',
    success: function(data) {
        create(data);
        // 디버깅용 alert
        alert("일정 불러오기 완료");
    }
});

/**
 * createSchedules API를 통해 화면에 일정 뿌려주기
 * @param {object} data 
 */
function create(data) {
    var i;

    for (i = 0; i < data.length; i++) {
        calendar.createSchedules([{
            id: data[i].pk, //scheduleID
            calendarId: data[i].fields.calendar, // calendarId
            title: data[i].fields.title, // title
            category: "time", // only 'milestone', 'task', allday', 'time'
            start: data[i].fields.start_date, // schedule start time
            end: data[i].fields.end_date, // schedule end time
            isAllDay: data[i].fields.isAllDay, // boolean type data 
            state: data[i].fields.state, // only 'busy', 'free'
            raw: {
                class: data[i].fields.calendarClass
            }
        }]);
    }
}

/**
 * boolean 데이터를 django 데이터베이스에 맞게 변환해주는 함수
 * @param {boolean} data 
 */
function convertBooleanData(data) {
    if (data == true) {
        return "True"
    } else {
        return "False"
    }
}

// 이벤트로 일정 생성하기
calendar.on('beforeCreateSchedule', function(event) {
    var startTime = event.start;
    var endTime = event.end;
    var title = event.title;
    var location = event.location;
    var isAllDay = event.isAllDay;
    var calendarClass = event.raw.class;
    var state = event.state;
    var calendar_Id = event.calendarId;
    var schedule = {};

    //console.log(event);

    //서버에 보낼 데이터 object
    var createData = {
        calendar: calendar_Id,
        title: title,
        location: location,
        start_date: document.getElementById("tui-full-calendar-schedule-start-date").value,
        end_date: document.getElementById("tui-full-calendar-schedule-end-date").value,
        isAllDay: convertBooleanData(isAllDay),
        state: state,
        class: calendarClass
    };

    //console.log(createData);

    //ajax로 서버에 데이터 전송
    $.ajax({
        url: "/toast_cal/create/",
        datatype: "int",
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        },
        type: 'POST',
        data: createData,
        success: function(data) {
            schedule = {
                id: data,
                calendarId: calendar_Id,
                title: title,
                category: 'time', // 일반 일정
                start: startTime,
                end: endTime,
                isAllDay: isAllDay,
                state: state,
                raw: {
                    class: calendarClass
                }
            };
            calendar.createSchedules([schedule]);
            // 디버깅용 alert
            alert("success!!")
        }
    });
});

// 이벤트로 일정 수정하기
calendar.on('beforeUpdateSchedule', function(event) {
    var schedule = event.schedule;
    var changes = event.changes;

    console.log(schedule);
    console.log(changes);

});


// 이벤트로 일정 삭제하기
calendar.on('beforeDeleteSchedule', function(event) {
    var schedule = event.schedule;

    delData = {
        id: schedule.id
    }
    $.ajax({
        url: "/toast_cal/delete/",
        datatype: "int",
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        },
        type: 'POST',
        data: delData,
        success: function(data) {
            calendar.deleteSchedule(schedule.id, schedule.calendarId);
            // 디버깅용 alert
            alert("success!!");
        }
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