const pubContainer = document.getElementById('pubCalendar'); // 공유캘린더를 담을 변수 선언

// 캘린더 옵션 오브젝트
const pubOptions = {
    defaultView: 'week',
    isReadOnly: true,
    // useCreationPopup: true,
    useDetailPopup: true
};

const pubCalendar = new tui.Calendar(pubContainer, pubOptions); // 캘린더 생성

// 공유 캘린더 toast UI 캘린더의 Calendar ID값 셋팅
ajaxPost('/toast_cal/pubCalSetData/', 'json', 'POST', '1').then(function(data) {
        var calSetData = new Array();
        for (var i = 0; i < data.length; i++) {
            calSetData.push({
                id: data[i].pk,
                name: data[i].fields.name,
                color: data[i].fields.color,
                bgColor: data[i].fields.bgColor,
                dragBgColor: data[i].fields.dragBgColor,
                borderColor: data[i].fields.borderColor
            });
        }
        // 디버깅용 코드
        // console.log(calSetData);

        // 캘린더 분류 생성
        pubCalendar.setCalendars(calSetData);

    })
    .catch(function(err) {
        console.log(err);
    });

// 공용캘린더의 날짜 이동 버튼(이전, 오늘, 다음)
var pub_year = "";
var pub_month = "";
var pub_prevBtn = document.getElementById('pub_prevBtn');
var pub_nextBtn = document.getElementById('pub_nextBtn');
var pub_todayBtn = document.getElementById('pub_today');


pub_prevBtn.addEventListener('click', function(event) {
    pubCalendar.prev();
    getYearMonth(pub_year, pub_month, pubCalendar);
});
pub_nextBtn.addEventListener('click', function(event) {
    pubCalendar.next();
    getYearMonth(pub_year, pub_month, pubCalendar);
});
pub_todayBtn.addEventListener('click', function(event) {
    pubCalendar.today();
    getYearMonth(pub_year, pub_month, pubCalendar);
});
