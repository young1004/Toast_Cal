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
var a = 1;



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


$.ajax({
    url: "/toast_cal/ourstores/",
    datatype: 'json',
    headers: {
        'X-CSRFToken': '{{ csrf_token }}'
    },
    type: 'GET',
    success: function(data) {
        create(data);
        alert("일정 불러오기 완료");
    }
});


function create(data) {
    var i;

    for (i = 0; i < data.length; i++) {
        calendar.createSchedules([{
            calendarId: data[i].fields.calendar,
            title: data[i].fields.title,
            category: "time", // 일반 일정
            start: data[i].fields.start_date,
            end: data[i].fields.end_date
        }]);
    }
}

// 이벤트로 일정 생성하기
calendar.on('beforeCreateSchedule', function(event) {
    var startTime = event.start;
    var endTime = event.end;
    var title = event.title;
    var calendarId = event.calendarId;
    var schedule;

    var create = {
        //id: a,
        calendar: calendarId,
        title: document.getElementById("tui-full-calendar-schedule-title").value,
        location: document.getElementById("tui-full-calendar-schedule-location").value,
        start_date: document.getElementById("tui-full-calendar-schedule-start-date").value,
        end_date: document.getElementById("tui-full-calendar-schedule-end-date").value,
    };

    console.log(create);

    $.ajax({
        url: "/toast_cal/create/",
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        },
        type: 'POST',
        data: create,
        success: function(data) {
            alert("success!!")
        }
    });
    alert('일정이 등록되었습니다.')
    schedule = {
        id: a,
        calendarId: calendarId,
        title: title,
        category: 'time', // 일반 일정
        start: startTime,
        end: endTime
    };
    calendar.createSchedules([schedule]);
});

// 이벤트로 일정 수정하기
calendar.on('beforeUpdateSchedule', function(event) {
    var schedule = event.schedule;
    var changes = event.changes;

    console.log(changes);

    calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
});


// 이벤트로 일정 삭제하기
calendar.on('beforeDeleteSchedule', function(event) {
    var schedule = event.schedule;

    alert('스케줄이 삭제되었습니다.', schedule);

    calendar.deleteSchedule(schedule.id, schedule.calendarId);
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