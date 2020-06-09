const pubContainer = document.getElementById('pubCalendar');

// 옵션 오브젝트
const pubOptions = {
    defaultView: 'month',
    useCreationPopup: true,
    useDetailPopup: true
};

// 캘린더 생성
const pubCalendar = new tui.Calendar(pubContainer, pubOptions);

ajaxPost("/toast_cal/pubCalSetData/", 'json', "POST", "1").then(function(data) {
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