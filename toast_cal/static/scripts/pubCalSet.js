const pubContainer = document.getElementById('pubCalendar');

// 옵션 오브젝트
const pubOptions = {
    defaultView: 'month',
    useCreationPopup: true,
    useDetailPopup: true
};

// 캘린더 생성
const pubCalendar = new tui.Calendar(pubContainer, pubOptions);

// getYearMonth(year, month, pubCalendar);