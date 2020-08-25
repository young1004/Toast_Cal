ajaxPost('/toast_cal/ourstores/', 'json', 'POST', '1')
    .then(function(data) {
        create(calendar, data);
    })
    .catch(function(err) {
        alert(err);
    });

// 이벤트로 일정 생성하기
calendar.on('beforeCreateSchedule', function(event) {
    var start = date_to_str(event.start._date);
    var end = date_to_str(event.end._date);
    var title = event.title;
    var location = document.getElementById('tui-full-calendar-schedule-location').value; // 오류로 인해 직접 받아옴
    var isAllDay = event.isAllDay;
    var calendarClass = event.raw.class;
    var state = event.state;
    var calendarId = event.calendarId;

    //서버에 보낼 데이터 object
    var createData = newCalObj(1, calendarId, title, 'time', location, start, end,
        convertBooleanData(isAllDay), state, calendarClass);

    ajaxPost('/toast_cal/create/', 'int', 'POST', createData)
        .then(function(data) {
            var schedule = createData;
            schedule.id = data;
            schedule.isAllDay = isAllDay;
            calendar.createSchedules([schedule]);
            // 디버깅용 alert
            // alert('success!!')
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
    if (event.changes !== null) changes = event.changes;

    // public, private 값 포맷팅
    if (document.getElementsByClassName('tui-full-calendar-public').length === 1)
        isPrivate = 'public'
    else
        isPrivate = 'private';

    // CalendarId 이용 category 수정 로직 넣을 예정

    // location값 수동 설정
    changes.location = document.getElementById('tui-full-calendar-schedule-location').value;
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

    ajaxPost('/toast_cal/update/', 'int', 'POST', updateData)
        .then( /*alert('수정 완료!')*/ )
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

    ajaxPost('/toast_cal/delete/', 'int', 'POST', delData)
        .then(function(data) {
            calendar.deleteSchedule(schedule.id, schedule.calendarId);
            // alert('삭제 완료!')
        })
        .catch(function(err) {
            alert(err);
        });
});


// 사이드바 이벤트
$(document).ready(function() {
    $('input:checkbox').on('click', function() {
        var checked = {
            checked: $(this).val()
        }

        if ($(this).prop('checked')) {

            ajaxPost('/toast_cal/checked/', 'json', 'POST', checked)
                .then(function(data) {
                    create(calendar, data);
                })
                .catch(function(err) {
                    alert(err);
                });


        } else {
            ajaxPost('/toast_cal/checked/', 'json', 'POST', checked)
                .then(function(data) {

                    console.log(data)

                    var i;

                    for (i = 0; i < data.length; i++) {
                        calendar.deleteSchedule(data[i].pk, data[i].fields.calendarId);
                    }
                })
                .catch(function(err) {
                    alert(err);
                });
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