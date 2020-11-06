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

pubCalSaveBtn.addEventListener('click', async function() {
    var saveCode = document.getElementById('pubcal_select').value
    var saveStart = document.getElementById('pubStart').value
    var saveEnd = document.getElementById('pubEnd').value

    let codeData = {
        code: saveCode,
        start: saveStart,
        end: saveEnd,
    }
    // console.log(data)
    await ajaxPost('/toast_cal/pubCalSave/', 'json', 'POST', codeData)
        .then(function(data) {
            console.log(data);
        })
        .catch(function(err) {
            alert(err);
        });
})

var pubCalLoadBtn = document.getElementById('pubCalLoadBtn');

pubCalLoadBtn.addEventListener('click', async function() {
    var loadCode = document.getElementById('pubcal_select').value
    var loadStart = document.getElementById('pubStart').value
    var loadEnd = document.getElementById('pubEnd').value

    let dateString = loadStart;
    let thisWeekFirst = getThisWeek()[0]

    let dateArray = dateString.split("-");
    let thisWeekFirstArray = thisWeekFirst.split("-");

    let dateObj = new Date(dateArray[0], Number(dateArray[1]) - 1, dateArray[2]);
    let thisWeekFirstObj = new Date(thisWeekFirstArray[0], Number(thisWeekFirstArray[1]) - 1, thisWeekFirstArray[2]);

    let betweenDay = (dateObj.getTime() - thisWeekFirstObj.getTime()) / 1000 / 60 / 60 / 24;

    console.log(betweenDay);

    if ((betweenDay / 7) < 1) {} else if ((betweenDay / 7) < 2) {
        pubCalendar.next();
    } else if ((betweenDay / 7) < 3) {
        pubCalendar.next();
        pubCalendar.next();
    } else if ((betweenDay / 7) < 4) {
        pubCalendar.next();
        pubCalendar.next();
        pubCalendar.next();
    }

    let pubLoadData = {
        code: loadCode,
        start: loadStart,
        end: loadEnd,
    }

    if (loadStart !== '' || loadEnd !== '') {
        await ajaxPost('/toast_cal/pubCalLoad/', 'json', 'POST', pubLoadData)
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
$(document).on('click', '#portal_to_making_vote', async function () {
    changeContents('professor2', 'professor3', 'calendar-common', 'sidebar', 'professor1', 'pubcal_vote_info');
    changeContents('tab_box');
    changeContents('professor-vote-open', 'professor-vote-status');

    var voteCode = document.getElementById('pubcal_select').value;
    var voteStart = document.getElementById('pubStart').value;
    var voteEnd = document.getElementById('pubEnd').value;

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
        .then(function (data) {
            if (data !== "공용 일정이 없습니다") {
                let newDate = getVoteDate(data);

                date_status_json = {
                    newDate
                }

            } else { // 공용캘린더 DB에 데이터가 없을 때
                flag = false;
                alert(data);
            }
        })
        .catch(function (err) {
            alert(err);
        });

    await ajaxPost('/toast_cal/pro_lecture/', 'json', 'POST', 1)
        .then(function (data) {
            $('#class_select').empty(); //기존 옵션 값 삭제

            for (var count = 0; count < data.length; count++) {
                var option = $('<option>' + data[count].fields.code + '</option>');
                $('#class_select').append(option);
            }
            $("#class_select").val(voteCode);
        })
        .catch(function (err) {
            alert(err);
        });

    // console.log("종합 데이터", date_status_json);
    if (flag === true) {
        printVoteOpenTbody(voteCode, voteStart, voteEnd, date_status_json)
    }
});

// 투표가능날짜확인 버튼(pubCalendar에 있는 일정들 활용하여 투표가능 시간대를 Ava_Time으로 불러오는 기능)
// $(document).on('click', '#voteTimeLoad', async function() {
//     var voteCode = document.getElementById('pubcal_select').value;
//     var voteStart = document.getElementById('pubStart').value;
//     var voteEnd = document.getElementById('pubEnd').value;

//     let voteTimeLoad = {
//         code: voteCode,
//         start: voteStart,
//         end: voteEnd,
//     }

//     let date_status_json = {
//         code: "",
//         date: "",
//         status: "",
//     }

//     let flag = true;

//     await ajaxPost('/toast_cal/voteTimeLoad/', 'json', 'POST', voteTimeLoad)
//         .then(function(data) {
//             if (data !== "공용 일정이 없습니다") {
//                 // console.log(data);
//                 // console.log(data['date'].length)
//                 // console.log(data['date'][0])

//                 // let newDate = getVoteDate(data['date']);
//                 let newDate = getVoteDate(data);

//                 // console.log(newDate)

//                 console.log('new date 객체', newDate);

//                 date_status_json = {
//                     newDate
//                 }

//                 voteProBtn.click(); // 투표 관리 버튼으로 넘어가기 위해서
//             } else { // 공용캘린더 DB에 데이터가 없을 때
//                 flag = false;
//                 alert(data);
//             }
//         })
//         .catch(function(err) {
//             alert(err);
//         });


//     console.log('date 객체 구조', date_status_json);
//     // console.log("종합 데이터", date_status_json);
//     if (flag === true) {
//         await ajaxPost('/toast_cal/voteTimeSave/', 'json', 'POST', date_status_json)
//             .then(function(data) {
//                 console.log(data);
//             })
//             .catch(function(err) {
//                 alert(err);
//             });
//     }

// });