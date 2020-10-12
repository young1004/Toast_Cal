/**
 * createSchedules API를 통해 화면에 일정 뿌려주기
 * @param {Object} calendar 스케쥴을 생성할 공유 캘린더 객체
 * @param {Object} data 서버에서 받아온 json 객체(object)
 */
function pubCreate(calendar, data) {
    var i;
    var createdData = new Array();
    console.log(data);
    
    for (i = 0; i < data.length; i++) {
        let schedule = {
            id: data[i].pk,
            calendarId: data[i].fields.calendarId,
            title: data[i].fields.title,
            category: 'time', 
            location: '미정',
            start: data[i].fields.start,
            end: data[i].fields.end, 
            isAllDay: false,
            state: 'busy',
            raw: {
                class: 'public'
            },
            attendees: [data[i].fields.attendees],
        }
        console.log(schedule);
        createdData.push(schedule);
    }
    calendar.createSchedules(createdData);
}