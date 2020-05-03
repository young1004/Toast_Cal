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