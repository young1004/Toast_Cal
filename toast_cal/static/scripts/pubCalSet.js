const pubContainer = document.getElementById('pubCalendar');

// 옵션 오브젝트
const pubOptions = {
    defaultView: 'week',
    isReadOnly: true,
    // useCreationPopup: true,
    useDetailPopup: true
};

// 캘린더 생성
const pubCalendar = new tui.Calendar(pubContainer, pubOptions);

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

var pubCalSaveBtn = document.getElementById('pubCalSaveBtn');

pubCalSaveBtn.addEventListener('click', function() {
    var saveCode = document.getElementById('pubcal_select').value
    var saveStart = document.getElementById('start').value
    var saveEnd = document.getElementById('end').value

    let codeData = {
        code: saveCode,
        start: saveStart,
        end: saveEnd,
    }
    // console.log(data)
    ajaxPost('/toast_cal/pubCalSave/', 'json', 'POST', codeData)
        .then(function(data) {
            console.log(data);
        })
        .catch(function(err) {
            alert(err);
        });
})

var pubCalLoadBtn = document.getElementById('pubCalLoadBtn');

pubCalLoadBtn.addEventListener('click', function() {
    var loadCode = document.getElementById('pubcal_select').value
    var loadStart = document.getElementById('start').value
    var loadEnd = document.getElementById('end').value

    let pubLoadData = {
        code: loadCode,
        start: loadStart,
        end: loadEnd,
    }

    if (start !== '' || end !== '') {
        ajaxPost('/toast_cal/pubCalLoad/', 'json', 'POST', pubLoadData)
            .then(function(data) {
                // console.log(data);
                pubCalendar.clear();
                pubCreate(pubCalendar, data);
            })
            .catch(function(err) {
                alert(err);
            });
    } else {
        alert('날짜를 선택하세오.')
    }
});