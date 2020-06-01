var calStdBtn = document.getElementById('calStdBtn');
var subjectBtn = document.getElementById('subjectBtn');
var subjectLoad = document.getElementById('subjectLoad');

calStdBtn.addEventListener('click', function(event) {
    changeContents('calendar-common', 'lecture', 'studentLectureLoad');
    changeContents('sidebar');
});

// 강의 수강
subjectBtn.addEventListener('click', function(event) {
    changeContents('lecture', 'calendar-common', 'studentLectureLoad', 'sidebar');


    ajaxPost("/toast_cal/department/", "json", "POST", 1)
        .then(function(data) {
            $('#department').empty(); //기존 옵션 값 삭제
            $("#department").find("option").end().append("<option value='전체'>전체</option>");
            $('#subject').empty();
            $('#lecture_type').empty();

            for (var count = 0; count < data.length; count++) {
                var option = $("<option>" + data[count].fields.name + "</option>");
                $('#department').append(option);
            }
        })
        .catch(function(err) {
            alert(err);
        });
});

// 과목 조회 바뀌어야 함
subjectLoad.addEventListener('click', function(event) {
    changeContents('studentLectureLoad', 'lecture', 'calendar-common', 'sidebar');

    ajaxPost("/toast_cal/student_lecture_load/", "json", "POST", 1)
        .then(function(data) {
            $('#lecture_load_tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $("<tr scope='row' onclick='clickTrEvent(this)'><td>" + data[count].fields.code + "</td>" +
                    "<td>" + data[count].fields.codeClass + "</td>" + "<td>" + data[count].fields.department + "</td>" +
                    "<td>" + data[count].fields.lecture_type + "</td>" + "<td>" + data[count].fields.name + "</td>" +
                    "<td>" + data[count].fields.professor + "</td>" + "<td>" + data[count].fields.period + "</td></tr>");
                $('#lecture_load_tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err);
        });
});

// 저장 버튼
$("#lecture_save_btn").click(async function () {
    var tr = $("#lecture_tbody").children();
    var flag = "";
    var obj = {};

    let scheduleData;

    for (var i = 0; i < tr.length; i++) {

        if (tr[i].style.backgroundColor == "rgb(177, 179, 182)") { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            var td = tr[i].children;
            obj.code = td[0].innerText;
            obj.codeClass = td[1].innerText;
            obj.department = td[2].innerText;
            obj.lecture_type = td[3].innerText;
            obj.name = td[4].innerText;
            obj.professor = td[5].innerText;
            obj.period = td[6].innerText;

            await ajaxPost("/toast_cal/lecture_save/", "json", "POST", obj)
                .then(function (data) {
                    if (data == "저장 성공") {
                        var timeData = periodSplit(obj.period);
                        var convData = periodConvert(timeData);
                        var calData = [];

                        for (var i = 0; i < 15; i++) {
                            var dateArr = getTimeData(convData, i * 7);

                            for (var j = 0; j < 2; j++) {
                                var calobj = {};

                                calobj = newCalObj(1, obj.lecture_type,
                                    obj.name, "time", "미정", dateArr[j].startDate,
                                    dateArr[j].endDate, convertBooleanData(false),
                                    "busy", "public");
                                calData.push(calobj);
                            }
                        }
                        scheduleData = calData;
                        flag = "일정 생성됨";
                    } else if (data == "수강 인원이 초과된 과목입니다.") {
                        flag = "수강인원 초과";
                        alert(data)
                    } else {
                        flag = "중복된 데이터";
                        alert(data)
                    }
                })
                .catch(function (err) {
                    alert(err);
                });

            if (flag == "일정 생성됨") {
                scheduleData = {
                    scheduleData
                };
                await ajaxPost("/toast_cal/makeCalendars/", "json", "POST", scheduleData)
                    .then(function (data) {})
                    .catch(function (err) {
                        alert(err);
                    });

                ajaxPost("/toast_cal/ourstores/", 'json', "POST", "1")
                    .then(function (data) {
                        calendar.clear();
                        create(calendar, data);
                        window.location.reload();
                    })
                    .catch(function (err) {
                        alert(err);
                    });
            }
        }
    }
    if (flag == "") alert('과목을 선택하세요');
});

// 삭제 버튼
$("#lecture_delete_btn").click(async function () {
    var tr = $("tr");
    var array = [];
    var husks = {};

    for (var i = 0; i < tr.length; i++) {
        if (tr[i].style.backgroundColor == "rgb(177, 179, 182)") { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            var obj = {};
            var td = tr[i].children;
            obj.code = td[0].innerText;
            obj.codeClass = td[1].innerText;
            obj.department = td[2].innerText;
            obj.lecture_type = td[3].innerText;
            obj.name = td[4].innerText;
            obj.professor = td[5].innerText;
            obj.period = td[6].innerText;
            array.push(obj);
        }
    }
    if (array.length != 0) { //과목 선택을 했을때
        husks.array = array;
        ajaxPost("/toast_cal/student_lecture_delete/", "json", "POST", husks)
            .then(function (data) {
                $('#lecture_load_tbody').empty();

                for (var count = 0; count < data.length; count++) {
                    var tr = $("<tr scope='row' onclick='clickTrEvent(this)'><td>" + data[count].fields.code + "</td>" +
                        "<td>" + data[count].fields.codeClass + "</td>" + "<td>" + data[count].fields.department + "</td>" +
                        "<td>" + data[count].fields.lecture_type + "</td>" + "<td>" + data[count].fields.name + "</td>" +
                        "<td>" + data[count].fields.professor + "</td>" + "<td>" + data[count].fields.period + "</td></tr>");
                    $('#lecture_load_tbody').append(tr);
                }
            })
            .catch(function (err) {
                alert(err);
            });

        var json = {};
        json.array = array;
        console.log(json);
        await ajaxPost("/toast_cal/deleteCalendars/", "json", "POST", json)
            .then(function (data) {
                alert(data);
            })
            .catch(function (err) {
                alert(err);
            });

        ajaxPost("/toast_cal/ourstores/", 'json', "POST", "1")
            .then(function (data) {
                calendar.clear();
                create(calendar, data);
                window.location.reload();
            })
            .catch(function (err) {
                alert(err);
            });
    } else {
        alert("선택된 강의가 없습니다.");
    }
});