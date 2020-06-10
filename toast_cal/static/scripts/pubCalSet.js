const pubContainer = document.getElementById('pubCalendar');

// 옵션 오브젝트
const pubOptions = {
    defaultView: 'month',
    useCreationPopup: true,
    useDetailPopup: true
};

// 캘린더 생성
const pubCalendar = new tui.Calendar(pubContainer, pubOptions);

// 공유 캘린더 toast UI 캘린더의 Calendar ID값 셋팅
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

var pubCalSaveBtn = document.getElementById("pubCalSaveBtn");

pubCalSaveBtn.addEventListener('click', function() {
    let codeData = {
        code: document.getElementById("pubcal_select").value
    }
    // console.log(data)
    ajaxPost("/toast_cal/pubCalSave/", 'json', "POST", codeData)
        .then(function(data) {
            console.log(data);
        })
        .catch(function(err) {
            alert(err);
        });
})

var pubCalLoadBtn = document.getElementById("pubCalLoadBtn");

pubCalLoadBtn.addEventListener('click', function() {
    var code = document.getElementById("pubcal_select").value
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value

    let pubLoadData = {
        code: code,
        start: start,
        end: end,
    }

    if (start != "" || end != "") {
        ajaxPost("/toast_cal/pubCalLoad/", 'json', "POST", pubLoadData)
            .then(function(data) {
                console.log(data);
                pubCalendar.clear();
                pubCreate(pubCalendar, data);
            })
            .catch(function(err) {
                alert(err);
            });
    } else {
        alert("날짜를 선택하세오.")
    }
});