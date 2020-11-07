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

var pubCalLoadBtn = document.getElementById('pubCalLoadBtn');

// pubCalLoadBtn.addEventListener('click', async function() {
//     pubCalendar.today();

//     let btnLock = document.getElementById('shareProBtn');

//     btnLock.disabled  = true;
//     pubCalLoadBtn.disabled = true;


//     var saveCode = document.getElementById('pubcal_select').value
//     var saveStart = document.getElementById('pubStart').value
//     var saveEnd = document.getElementById('pubEnd').value

//     saveCode = getSubCode(saveCode);

//     let codeData = {
//         code: saveCode,
//         start: saveStart,
//         end: saveEnd,
//     }

//     await ajaxPost('/toast_cal/pubCalSave/', 'json', 'POST', codeData)
//         .then(function(data) {
//             // console.log(data);
//         })
//         .catch(function(err) {
//             alert(err);
//         });

//     var loadCode = document.getElementById('pubcal_select').value
//     var loadStart = document.getElementById('pubStart').value
//     var loadEnd = document.getElementById('pubEnd').value
    
//     loadCode = getSubCode(loadCode);

//     let dateString = loadStart;
//     let thisWeekFirst = getThisWeek()[0]

//     let dateArray = dateString.split("-");
//     let thisWeekFirstArray = thisWeekFirst.split("-");

//     let dateObj = new Date(dateArray[0], Number(dateArray[1]) - 1, dateArray[2]);
//     let thisWeekFirstObj = new Date(thisWeekFirstArray[0], Number(thisWeekFirstArray[1]) - 1, thisWeekFirstArray[2]);

//     let betweenDay = (dateObj.getTime() - thisWeekFirstObj.getTime()) / 1000 / 60 / 60 / 24;

//     // console.log(betweenDay);

//     if ((betweenDay / 7) < 1) {} else if ((betweenDay / 7) < 2) {
//         pubCalendar.next();
//     } else if ((betweenDay / 7) < 3) {
//         pubCalendar.next();
//         pubCalendar.next();
//     } else if ((betweenDay / 7) < 4) {
//         pubCalendar.next();
//         pubCalendar.next();
//         pubCalendar.next();
//     }

//     let pubLoadData = {
//         code: loadCode,
//         start: loadStart,
//         end: loadEnd,
//     }

//     if (loadStart !== '' || loadEnd !== '') {
//         await ajaxPost('/toast_cal/pubCalLoad/', 'json', 'POST', pubLoadData)
//             .then(function(data) {
//                 // console.log(data);
//                 pubCalendar.clear();
//                 pubCreate(pubCalendar, data);
//             })
//             .catch(function(err) {
//                 alert(err);
//             });
//     } else {
//         alert('날짜를 선택하세오.')
//     }
//     btnLock.disabled = false;
//     pubCalLoadBtn.disabled = false;
// });

pubCalLoadBtn.addEventListener('click', async function () {
    pubCalendar.today();

    let btnLock = document.getElementById('shareProBtn');

    btnLock.disabled = true;
    pubCalLoadBtn.disabled = true;


    var saveCode = document.getElementById('pubcal_select').value
    var saveStart = document.getElementById('pubStart').value
    var saveEnd = document.getElementById('pubEnd').value

    saveCode = getSubCode(saveCode);

    let codeData = {
        code: saveCode,
        start: saveStart,
        end: saveEnd,
    }

    var loadCode = document.getElementById('pubcal_select').value
    var loadStart = document.getElementById('pubStart').value
    var loadEnd = document.getElementById('pubEnd').value

    loadCode = getSubCode(loadCode);

    let startString = loadStart;
    let endString = loadEnd;
    let thisWeekFirst = getThisWeek()[0];

    let arrayStart = startString.split("-");
    let arrayEnd = endString.split("-");
    let thisWeekFirstArray = thisWeekFirst.split("-");

    let objStart = new Date(arrayStart[0], Number(arrayStart[1]) - 1, arrayStart[2]);
    let objEnd = new Date(arrayEnd[0], Number(arrayEnd[1]) - 1, arrayEnd[2]);
    let objToday = new Date();
    let thisWeekFirstObj = new Date(thisWeekFirstArray[0], Number(thisWeekFirstArray[1]) - 1, thisWeekFirstArray[2]);

    let betweenStartWeek = (objStart.getTime() - thisWeekFirstObj.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 이번주 첫 날짜와의 차이
    let betweenStartEnd = (objEnd.getTime() - objStart.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 끝 날짜와의 차이
    let betweenTodayStart = (objStart.getTime() - objToday.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 오늘 날짜의 차이

    console.log(betweenStartWeek);
    console.log(betweenStartEnd);
    console.log(betweenTodayStart);

    if (betweenTodayStart < -1) { // 시작날짜가 오늘 이전의 날짜가 입력됬을때
        pubCalendar.clear();
        alert("시작 날짜를 오늘 이후의 날짜로 입력해주세요.")
    } else if (betweenStartEnd < 0) { // 끝 날짜가 시작 날짜보다 크게 입력됬을때
        pubCalendar.clear();
        alert("마지막 날짜의 입력이 잘못 되었습니다.")
    } else {
        if ((betweenStartWeek / 7) < 1) {
        } else if ((betweenStartWeek / 7) < 2) { // 주 단위로 이동하기 위함
            pubCalendar.next();
        } else if ((betweenStartWeek / 7) < 3) {
            pubCalendar.next();
            pubCalendar.next();
        } else if ((betweenStartWeek / 7) < 4) {
            pubCalendar.next();
            pubCalendar.next();
            pubCalendar.next();
        }

        await ajaxPost('/toast_cal/pubCalSave/', 'json', 'POST', codeData)
            .then(function (data) {
                // console.log(data);
            })
            .catch(function (err) {
                alert(err);
            });

        let pubLoadData = {
            code: loadCode,
            start: loadStart,
            end: loadEnd,
        }

        await ajaxPost('/toast_cal/pubCalLoad/', 'json', 'POST', pubLoadData)
            .then(function (data) {
                // console.log(data);
                pubCalendar.clear();
                pubCreate(pubCalendar, data);
            })
            .catch(function (err) {
                alert(err);
            });
    }

    btnLock.disabled = false;
    pubCalLoadBtn.disabled = false;
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
