var calStdBtn = document.getElementById('calStdBtn');
var subjectBtn = document.getElementById('subjectBtn');
var subjectLoad = document.getElementById('subjectLoad');
var voteMenuBtn = document.getElementById('voteMenuBtn');


calStdBtn.addEventListener('click', function(event) {
    changeContents('calendar-common', 'lecture', 'studentLectureLoad', 'votemenu');
    changeContents('sidebar');
});

// 강의 수강
subjectBtn.addEventListener('click', function(event) {
    changeContents('lecture', 'calendar-common', 'studentLectureLoad', 'sidebar', 'votemenu');


    ajaxPost('/toast_cal/department/', 'json', 'POST', 1)
        .then(function(data) {
            $('#department').empty(); //기존 옵션 값 삭제
            $('#department').find('option').end().append('<option value="전체">전체</option>');
            $('#subject').empty();
            $('#lecture_type').empty();

            for (var count = 0; count < data.length; count++) {
                var option = $('<option>' + data[count].pk + '</option>');
                $('#department').append(option);
            }
        })
        .catch(function(err) {
            alert(err);
        });
});

// 과목 조회 바뀌어야 함
subjectLoad.addEventListener('click', function(event) {
    changeContents('studentLectureLoad', 'lecture', 'calendar-common', 'sidebar', 'votemenu');

    ajaxPost('/toast_cal/student_lecture_load/', 'json', 'POST', 1)
        .then(function(data) {
            $('#lecture_load_tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr scope="row" onclick="clickTrEvent(this, \'#lecture_load_tbody\', false)"><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.codeClass + '</td>' + '<td>' + data[count].fields.department + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.professor + '</td>' + '<td>' + data[count].fields.period + '</td></tr>');
                $('#lecture_load_tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err);
        });
});


// 투표 메뉴 
voteMenuBtn.addEventListener('click', async function(event) {
    var check_subject;

    await ajaxPost('/toast_cal/check_user_subject/', 'json', 'POST', 1)
        .then(function(data) {
            check_subject = data;
            console.log(data)
        })
        .catch(function(err) {
            alert(err);
        });

    if (check_subject === "강의 있음") {
        changeContents('votemenu', 'lecture', 'calendar-common', 'studentLectureLoad', 'sidebar');
        $('#vote-join-tab-btn').trigger('click');
    } else {
        alert("교수님의 강의가 없습니다. 강의를 개설해주세요.")
    }

})

//강의 수강 저장 버튼
$('#lecture_save_btn').click(async function() {
    var tr = $('#lecture_tbody').children();
    var flag = '';
    var obj = {};

    let scheduleData;

    for (var i = 0; i < tr.length; i++) {

        if (tr[i].style.backgroundColor === 'rgb(177, 179, 182)') { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            var td = tr[i].children;
            obj.code = td[0].innerText;
            obj.codeClass = td[1].innerText;
            obj.department = td[2].innerText;
            obj.lecture_type = td[3].innerText;
            obj.name = td[4].innerText;
            obj.professor = td[5].innerText;
            obj.period = td[6].innerText;

            await ajaxPost('/toast_cal/lecture_save/', 'json', 'POST', obj)
                .then(function(data) {
                    if (data === '저장 성공') {
                        var timeData = periodSplit(obj.period);
                        var convData = periodConvert(timeData);
                        var calData = [];

                        for (var i = 0; i < 15; i++) {
                            var dateArr = getTimeData(convData, '-09-01', i * 7);

                            for (var j = 0; j < 2; j++) {
                                var calobj = {};

                                calobj = newCalObj(1, obj.lecture_type,
                                    obj.name, 'time', '미정', dateArr[j].startDate,
                                    dateArr[j].endDate, convertBooleanData(false),
                                    'busy', 'public');
                                calData.push(calobj);
                            }
                        }
                        scheduleData = calData;
                        flag = '일정 생성됨';
                    } else if (data === '수강 인원이 초과된 과목입니다.') {
                        flag = '수강인원 초과';
                        alert(data)
                    } else {
                        flag = '중복된 데이터';
                        alert(data)
                    }
                })
                .catch(function(err) {
                    alert(err);
                });

            if (flag === '일정 생성됨') {
                scheduleData = {
                    scheduleData
                };
                await ajaxPost('/toast_cal/makeCalendars/', 'json', 'POST', scheduleData)
                    .then(function(data) {})
                    .catch(function(err) {
                        alert(err);
                    });

                ajaxPost('/toast_cal/ourstores/', 'json', 'POST', '1')
                    .then(function(data) {
                        calendar.clear();
                        create(calendar, data);
                        window.location.reload();
                    })
                    .catch(function(err) {
                        alert(err);
                    });
            }
        }
    }
    if (flag === '') alert('과목을 선택하세요');
});

//강의 삭제 버튼
$('#lecture_delete_btn').click(async function() {

    var tr = $('#lecture_load_tbody').children();
    var array = [];
    var husks = {};

    for (var i = 0; i < tr.length; i++) {
        if (tr[i].style.backgroundColor === 'rgb(177, 179, 182)') { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
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
    if (array.length !== 0) { //과목 선택을 했을때
        husks.array = array;
        ajaxPost('/toast_cal/student_lecture_delete/', 'json', 'POST', husks)
            .then(function(data) {
                $('#lecture_load_tbody').empty();

                for (var count = 0; count < data.length; count++) {
                    var tr = $('<tr scope="row" onclick="clickTrEvent(this, \'#lecture_load_tbody\', false)"><td>' + data[count].fields.code + '</td>' +
                        '<td>' + data[count].fields.codeClass + '</td>' + '<td>' + data[count].fields.department + '</td>' +
                        '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                        '<td>' + data[count].fields.professor + '</td>' + '<td>' + data[count].fields.period + '</td></tr>');
                    $('#lecture_load_tbody').append(tr);
                }
            })
            .catch(function(err) {
                alert(err);
            });

        var json = {};
        json.array = array;
        console.log(json);
        await ajaxPost('/toast_cal/deleteCalendars/', 'json', 'POST', json)
            .then(function(data) {
                alert(data);
            })
            .catch(function(err) {
                alert(err);
            });

        ajaxPost('/toast_cal/ourstores/', 'json', 'POST', '1')
            .then(function(data) {
                calendar.clear();
                create(calendar, data);
                window.location.reload();
            })
            .catch(function(err) {
                alert(err);
            });
    } else {
        alert('선택된 강의가 없습니다.');
    }
});

// 투표기능 탭 관련 변수 및 함수들
var voteJoinTabBtn = document.getElementById('vote-join-tab-btn');
var voteStatusStudentBtn = document.getElementById('vote-status-student-btn');

// 투표 참여 탭 버튼
voteJoinTabBtn.addEventListener('click', function(event) {
    changeContents('studentVote', 'lecture-class-student-tab');

    $('#voteTableBtn').trigger('click');
});

// 투표 현황 탭 버튼
voteStatusStudentBtn.addEventListener('click', function(event) {
    changeContents('lecture-class-student-tab', 'studentVote');

    $('#voteTableBtn-student').trigger('click');
});

// 투표 참여 관련 변수
var voteTableBtn = document.getElementById('voteTableBtn');

//투표 참여 선택 버튼
voteTableBtn.addEventListener('click', async function(event) {

    // 서버에서 filter를 적용할 투표 페이지 관련 데이터 object
    let voteData = {
        lecture_type: '전체',
    }
    voteData.lecture_type = document.getElementById('lecture-class').value;

    // console.log(voteData.lecture_type);

    await ajaxPost('/toast_cal/stdVoteJoinTable/', 'json', 'POST', voteData)
        .then(function(data) {
            $('#vote-info').empty();

            for (let cnt = 0; cnt < data.length; cnt++) {
                let tr = $('<tr><td>' + data[cnt].fields.lecType + '</td>' +
                    '<td>' + data[cnt].fields.classCode + '</td>' +
                    '<td>' + data[cnt].fields.className + '</td>' +
                    '<td>' + data[cnt].fields.voteStatus + '</td>' +
                    '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn">투표하기</button></td></tr>');
                // var tr = $('<tr><td>' + data[count].fields.code + '</td>' +
                //     '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                //     '<td>' + data[count].fields.vote_status + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn_student">상세</button></td>');
                $('#vote-info').append(tr);
            }
            // console.log(data);

        })
        .catch(function(err) {
            console.log(err);
        })
});

//학생 투표 현황 관련 변수 및 함수들
var voteTableBtnStu = document.getElementById('voteTableBtn-student');

// 학생 투표 현황 선택 버튼
voteTableBtnStu.addEventListener('click', function(event) {

    // 서버에서 filter를 적용할 투표 페이지 관련 데이터 object : 현재 하드 코딩
    let voteData_Stu = {
        lecture_type: '전공 필수',
        vote_status: '투표중'
    }

    // voteData_Stu.lecture_type = voteClassStu.value;
    // voteData_Stu.vote_status = voteStatusStu.value;

    // console.log(voteData);
    ajaxPost('/toast_cal/voteTable/', 'json', 'POST', voteData_Stu).then(function(data) {
            $('#vote-info-student').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.vote_status + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn_student">상세</button></td>');
                $('#vote-info-student').append(tr);
            }

        })
        .catch(function(err) {
            console.log(err);
        })
});

// let voteJoinCode; // 참여할 투표에 대한 코드값을 저장할 변수
let voteJoinId; // 참여할 투표의 기본 키 값을 저장할 변수

// 투표 리스트 투표 참여버튼 누를 시 동작하는 로직
$(document).on('click', '.voteBtn', function() {

    $('#select_head').empty();
    $('#select_info').empty();

    var voteBtn = $(this);

    var tr = voteBtn.parent().parent();
    var td = tr.children();

    var chartData = {
        code: td.eq(1).text()
    }
    // console.log(chartData);

    // voteJoinCode = td.eq(1).text();

    headStr = td.eq(2).text() + '(' + td.eq(1).text() + ')' + ' 과목 투표 정보'
    document.getElementById('select_head').innerHTML = headStr;
    document.getElementById('stdVoteComment').value = "";


    ajaxPost('/toast_cal/stdVoteSelectData/', 'json', 'POST', chartData)
        .then(function(data) {

            let time = [data[0].fields.choice1_Title, data[0].fields.choice2_Title, data[0].fields.choice3_Title, data[0].fields.choice4_Title]

            voteJoinId = data[0].pk;

            for (let i = 0; i < time.length; i++) {
                if (time[i] === 'False')
                    continue;
                var timeTr = $('<tr scope="row" onclick="clickTrEvent(this, \'#select_head\', false)" class="select_line"><td class="select_area">' +
                    time[i] + '</td></tr>');

                $('#select_info').append(timeTr);
            }
        })
        .catch(function(err) {
            console.log(err);
        })

});

$(document).on('click', '#takeVote', function() {
    // console.log('동작 확인');

    let tr = $('#select_info').children();
    let array = [];
    let obj = {};

    for (let i = 0; i < tr.length; i++) {
        if (tr[i].style.backgroundColor === 'rgb(177, 179, 182)') { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            let obj = {};
            let td = tr[i].children;
            obj.id = voteJoinId;
            // obj.code = voteJoinCode;
            obj.time = td[0].innerText;
            array[i] = obj;
            // array.push(obj);
        }
    }

    if (array.length !== 0 || document.getElementById('stdVoteComment').value !== '') {

        for (let i = 0; i < tr.length; i++) {
            if (tr[i].style.backgroundColor !== 'rgb(177, 179, 182)') { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
                let obj = {};
                obj.id = voteJoinId;
                // obj.code = voteJoinCode;
                obj.time = "False";
                array[i] = obj;
                // array.push(obj);
            }
        }

        for (let i = tr.length; i < 4; i++) {
            let obj = {};
            obj.id = voteJoinId;
            // obj.code = voteJoinCode;
            obj.time = "False";
            array[i] = obj;
        }

        array.push({
            id: voteJoinId,
            // code: voteJoinCode,
            comment: document.getElementById('stdVoteComment').value
        });

        // console.log(obj);

        obj.array = array;
        // console.log(obj);
        ajaxPost('/toast_cal/takeVoteSave/', 'json', 'POST', obj)
            .then(function(data) {
                alert(data);
            })
            .catch(function(err) {
                alert(err);
            });
        // $('#select_head').empty();
        // $('#select_info').empty();
    }
});

// 투표 상세?버튼
$(document).on('click', '.voteBtn_student', function() {

    // 학생 투표 현황 상세 차트 ※ 변수 겹치면 우선 탐색
    var chart = null;

    // 도넛 차트 생성
    if (chart !== null) chart.destroy();
    var voteBtn_student = $(this);

    var tr = voteBtn_student.parent().parent();
    var td = tr.children();

    var chartData = {
        code: td.eq(0).text()
    }

    ajaxPost('/toast_cal/voteChart/', 'json', 'POST', chartData).then(function(data) {
            // console.log(data.length);
            // console.log(data);
            if (data.length > 0) {
                //toast UI Chart 세팅
                var doughnut = document.getElementById('chart-area-student');
                var doughnutData = {
                    categories: ['투표 현황'],
                    series: [{
                            name: '찬성',
                            data: data[0].fields.agree_votes
                        },
                        {
                            name: '반대',
                            data: data[0].fields.reject_votes
                        },
                        {
                            name: '투표안함',
                            data: data[0].fields.all_students - data[0].fields.agree_votes - data[0].fields.reject_votes
                        }
                    ]
                };

                var theme = {
                    series: {
                        colors: [
                            '#87CE00', '#FF4848', '#BDBDBD'
                        ],
                        label: {
                            color: '#000000',
                            fontFamily: 'sans-serif'
                        }
                    }
                };

                tui.chart.registerTheme('myTheme', theme);


                var doughnutOption = {
                    chart: {
                        width: 400,
                        height: 250,
                        title: data[0].fields.name + '(' + data[0].fields.code + ') 시험 투표',
                        format: function(value, chartType, areaType, valuetype, legendName) {
                            if (areaType === 'makingSeriesLabel') {
                                value = value;
                            }

                            return value;
                        }
                    },
                    series: {
                        radiusRange: ['60%', '100%'],
                        showLabel: true,
                        showLegend: true,
                        allowSelect: true,
                        startAngle: true,
                        endAngle: false,
                        labelAlign: 'center'
                    },
                    legend: {
                        align: 'right'
                    },
                    theme: 'myTheme'
                };


                chart = tui.chart.pieChart(doughnut, doughnutData, doughnutOption);
            }

        })
        .catch(function(err) {
            console.log(err);
        });

    // 선택한 투표의 강의 정보
    $('#lec-info-student').empty();

    var voteBtn_student = $(this);

    var tr = voteBtn_student.parent().parent();
    var td = tr.children();

    var lec_info = {
        code: td.eq(0).text()
    }

    ajaxPost('/toast_cal/getLectureInfo/', 'json', 'POST', lec_info)
        .then(function(data) {
            console.log(data);
            for (i = 0; i < data.length; i++) {
                var testText = $(
                    '<div id = "lec-info-wrap">' +
                    '<div class = "lec-info-area">' +
                    '<table>' +
                    '<thead>' +
                    '<tr>' +
                    '<th>' + '강의정보' + '</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody class = sub_info >' +
                    '<tr>' +
                    '<th>' + '강의명' + '</th>' +
                    '<td>' + data[i].fields.name + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<th>' + '강의코드' + '</th>' +
                    '<td>' + data[i].fields.code + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<th>' + '강의분류' + '</th>' +
                    '<td>' + data[i].fields.lecture_type + '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</div>' +
                    '</div>'
                )
                $('#lec-info-student').append(testText)
            }
        })
});