var calStdBtn = document.getElementById('calStdBtn');
var subjectBtn = document.getElementById('subjectBtn');
var etcBtn = document.getElementById('etcBtn');

calStdBtn.addEventListener('click', function(event) {
    changeContents('calendar-common', 'lecture', 'studentEtc');
    changeContents('sidebar');
});

subjectBtn.addEventListener('click', function(event) {
    changeContents('lecture', 'calendar-common', 'studentEtc', 'sidebar');


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

etcBtn.addEventListener('click', function(event) {
    changeContents('studentEtc', 'lecture', 'calendar-common', 'sidebar');


});

// 학과 선택시 해당 과목 옵션 출력
function change_subject(department, subject, lecture_type) {
    var department = {
        name: document.getElementById(department).value
    }
    var subject = "#" + subject // 제이쿼리에 id값을 넣어주기 위해 # 붙임
    var lecture_type = "#" + lecture_type

    ajaxPost("/toast_cal/subject/", "json", "POST", department)
        .then(function(data) {
            $(subject).empty();
            $(subject).find("option").end().append("<option value='전체'>전체</option>");
            $(lecture_type).empty();
            $(lecture_type).find("option").end().append("<option value='전체'>전체</option>");

            var array = new Array();

            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        array.push(JSON.stringify(data[i].fields.name).replace(/"/g, ""));
                    } else if (JSON.stringify(data[i].fields.name) != JSON.stringify(data[i - 1].fields.name)) {
                        array.push(JSON.stringify(data[i].fields.name).replace(/"/g, ""));
                    }
                }

                for (var count = 0; count < array.length; count++) {
                    var option = $("<option>" + array[count] + "</option>");
                    $(subject).append(option);
                }
            }

            if (department.name == "일반교양") { //교양 선택시 이수구분 따로 표시
                $(lecture_type).empty();
                $(lecture_type).append("<option>일반 교양</option>");
            } else if (department.name == "전체") {
                $(subject).empty();
                $(lecture_type).empty();
            } else {
                $(lecture_type).empty();
                $(lecture_type).find("option").end().append("<option value='전체'>전체</option>");
                $(lecture_type).append("<option>전공 필수</option>");
                $(lecture_type).append("<option>전공 선택</option>");
            }
        })
        .catch(function(err) {
            alert(err);
        });
}

// 과목 선택시 이수구분
function change_type(subject, lecture_type) {
    var data = {
        name: document.getElementById(subject).value
    }
    var subject = "#" + subject
    var lecture_type = "#" + lecture_type

    if (data.name == "전체") {
        $(lecture_type).empty();
        $(lecture_type).find("option").end().append("<option value='전체'>전체</option>");
    } else {
        ajaxPost("/toast_cal/chanege_type/", "json", "POST", data)
            .then(function(data) {
                $(lecture_type).empty();
                $(lecture_type).append("<option>" + data[0].fields.lecture_type + "</option>");
            })
            .catch(function(err) {
                alert(err);
            });
    }
}

// 강의 조회 버튼
function lecture_lookup() {
    var department = document.getElementById("department").value;
    var subject = document.getElementById("subject").value;
    var lecture_type = document.getElementById("lecture_type").value;
    data = {
        department: department,
        subject: subject,
        lecture_type: lecture_type
    }
    if (department == "전체") { //전체 학과 선택시
        alert("학과를 선택하세요.");
    } else {
        ajaxPost("/toast_cal/lecture_lookup/", "json", "POST", data)
            .then(function(data) {
                $('#lecture_tbody').empty(); //table 초기화

                for (var count = 0; count < data.length; count++) {
                    var tr = $("<tr scope='row' onclick='clickTrEvent(this)'><td>" + data[count].pk + "</td>" +
                        "<td>" + data[count].fields.department + "</td>" + "<td>" + data[count].fields.lecture_type + "</td>" +
                        "<td>" + data[count].fields.name + "</td>" + "<td>" + data[count].fields.professor + "</td>" +
                        "<td>" + data[count].fields.period + "</td></tr>");
                    $('#lecture_tbody').append(tr);
                }
            })
            .catch(function(err) {
                alert(err);
            });
    }
}

function clickTrEvent(tr) { //tr tag
    if (tr.style.backgroundColor == "") {
        tr.style.backgroundColor = '#b1b3b6';
    } else {
        tr.style.backgroundColor = "";
    }
    var tdArr = new Array();
    var td = $(tr).children();

    td.each(function(i) {
        tdArr.push(td.eq(i).text());
    });
}


// 저장 버튼
$("#lecture_save_btn").click(function() {
    var tr = $("tr");
    var data = [];
    var husks = {};

    for (var i = 0; i < tr.length; i++) {
        if (tr[i].style.backgroundColor == "rgb(177, 179, 182)") { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            var obj = {};
            var td = tr[i].children;
            obj.code = td[0].innerText;
            obj.department = td[1].innerText;
            obj.lecture_type = td[2].innerText;
            obj.name = td[3].innerText;
            obj.professor = td[4].innerText;
            obj.period = td[5].innerText;
            data.push(obj);
        }
    }
    if (data.length != 0) { //과목 선택을 했으면 데이터 저장
        husks.data = data;
        ajaxPost("/toast_cal/lecture_save/", "json", "POST", husks)
            .then(function(data) {
                alert(data);
            })
            .catch(function(err) {
                alert(err);
            });
    } else {
        alert("과목을 선택하세요.");
    }
});