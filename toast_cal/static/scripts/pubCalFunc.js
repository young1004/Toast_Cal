/**
 * createSchedules API를 통해 화면에 일정 뿌려주기
 * @param {Object} calendar 스케쥴을 생성할 공유 캘린더 객체
 * @param {Object} data 서버에서 받아온 json 객체(object)
 */
function pubCreate(calendar, data) {
    var i;
    var createdData = new Array();
    // console.log(data);

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
        // console.log(schedule);
        createdData.push(schedule);
    }
    calendar.createSchedules(createdData);
}

/**
 * 
 * @param {*} data 
 */
function getVoteDate(data) {
    var startDate = [] // 시작 날짜를 저장할 리스트
    var endDate = [] // 끝 날짜를 저장할 리스트
    var newDate = [] // 최종적으로 반환할 데이터 리스트

    let code = data['code'];
    let obj = {};


    for (var i = 0; i < data['date'].length; i = (i + 2)) {

        startDate.push(data['date'][i]); // 시작 날짜와 끝 날짜를 각 리스트에 적재
        endDate.push(data['date'][i + 1]);

        
        let startArr = startDate[i/2].split(' ') // 년월일과 시간을 나눔, [0]은 년월일, [1]은 시간으로
        let endArr = (endDate[i/2].split(' '))[1]

        let day = convertVoteDay(startArr[0]); // 년월일로 요일을 구함
        let time = convertVoteTime(startArr[1], endArr); // 시간으로 교시를 구함

        obj = {
            code : code,
            date : startArr[0] + " " + day + time,
            status : data['status'][i/2]
        }
        newDate.push(obj);
    }

    return newDate;
}



function convertVoteDay(start_date) { // 년월일로 요일을 구하는 함수
    var week = new Array('일', '월', '화', '수', '목', '금', '토');

    return week[new Date(start_date).getDay()];
}


function convertVoteTime(start, end) { // 교시를 구하는 함수
    if (start === '09:30:00' && end === '10:45:00') return '12';
    if (start === '11:00:00' && end === '12:15:00') return '34';
    if (start === '13:00:00' && end === '14:15:00') return '78';
    if (start === '14:30:00' && end === '15:45:00') return '910';
    if (start === '16:00:00' && end === '17:15:00') return '1112';
    if (start === '17:30:00' && end === '18:45:00') return '1314';
    if (start === '19:00:00' && end === '20:15:00') return '7시~8시15분';
}