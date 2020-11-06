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


// 투표가능날짜확인 버튼(pubCalendar에 있는 일정들 활용하여 투표가능 시간대를 Ava_Time으로 불러오는 기능)
$(document).on('click', '#voteTimeLoad', async function() {
    var voteCode = document.getElementById('pubcal_select').value;
    var voteStart = document.getElementById('start').value;
    var voteEnd = document.getElementById('end').value;

    let voteTimeLoad = {
        code: voteCode,
        start: voteStart,
        end: voteEnd,
    }

    let date_status_json = {
        code: "",
        date: "",
        status: "",
    }

    let flag = true;

    await ajaxPost('/toast_cal/voteTimeLoad/', 'json', 'POST', voteTimeLoad)
        .then(function(data) {
            if (data !== "공용 일정이 없습니다") {
                // console.log(data);
                // console.log(data['date'].length)
                // console.log(data['date'][0])

                // let newDate = getVoteDate(data['date']);
                let newDate = getVoteDate(data);

                // console.log(newDate)

                console.log('new date 객체', newDate);

                date_status_json = {
                    newDate
                }

                voteProBtn.click(); // 투표 관리 버튼으로 넘어가기 위해서
            } else { // 공용캘린더 DB에 데이터가 없을 때
                flag = false;
                alert(data);
            }
        })
        .catch(function(err) {
            alert(err);
        });


    console.log('date 객체 구조', date_status_json);
    // console.log("종합 데이터", date_status_json);
    if (flag === true) {
        await ajaxPost('/toast_cal/voteTimeSave/', 'json', 'POST', date_status_json)
            .then(function(data) {
                console.log(data);
            })
            .catch(function(err) {
                alert(err);
            });
    }

});