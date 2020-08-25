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
var nextBtn = document.getElementById('nextBtn');
var prevBtn = document.getElementById('prevBtn');
var change_day = document.getElementById('change_day');
var todayBtn = document.getElementById('today');
var year = document.getElementById('year');
var month = document.getElementById('month');

getYearMonth(year, month, calendar);

nextBtn.addEventListener('click', function(event) {
    calendar.next();
    getYearMonth(year, month, calendar);
});

prevBtn.addEventListener('click', function(event) {
    calendar.prev();
    getYearMonth(year, month, calendar);
});

todayBtn.addEventListener('click', function(event) {
    calendar.today();
    getYearMonth(year, month, calendar);
});

change_day.addEventListener('change', (event) => {
    if (change_day.value === 'day') {
        calendar.changeView('day', true);
    } else if (change_day.value === 'week') {
        calendar.changeView('week', true);
    } else {
        calendar.changeView('month', true);
    }
});

ajaxPost('/toast_cal/calSetData/', 'json', 'POST', '1').then(function(data) {
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
        calendar.setCalendars(calSetData);

    })
    .catch(function(err) {
        console.log(err);
    });