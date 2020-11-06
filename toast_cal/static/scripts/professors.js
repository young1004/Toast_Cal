// 교수용 페이지 버튼과 이벤트리스너
var calProBtn = document.getElementById('calProBtn');
var subProBtn = document.getElementById('subProBtn');
var voteProBtn = document.getElementById('voteProBtn');
var shareProBtn = document.getElementById('shareProBtn');

// 교수 캘린더 버튼 리스너
calProBtn.addEventListener('click', function(event) {
    changeContents('calendar-common', 'professor1', 'professor2', 'professor3');
    changeContents('sidebar');
});

// 교수 강의 개설 버튼 리스너
subProBtn.addEventListener('click', async function(event) {
    changeContents('professor1', 'calendar-common', 'professor2', 'sidebar', 'professor3');

    //교수의 강의 테이블 출력
    await ajaxPost('/toast_cal/pro_lecture_table/', 'json', 'POST', 1)
        .then(function(data) {
            $('#pro_lec_load_tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.codeClass + '</td>' + '<td>' + data[count].fields.department + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.professor + '</td>' + '<td>' + data[count].fields.period + '</td>' +
                    '<td>' + data[count].fields.stdCount + '/' + data[count].fields.total_stdCount + '</td>' +
                    '<td><button type="button" class="btn btn-outline-dark pro_lec_del_btn">삭제</button></td>');
                $('#pro_lec_load_tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err);
        });

    //select 박스 학과 불러오기
    await ajaxPost('/toast_cal/department/', 'json', 'POST', 1)
        .then(function(data) {
            $('#lec-depart').empty(); //기존 옵션 값 삭제
            // $('#lec-depart').find('option').end().append('<option value='전체'>전체</option>');

            for (var count = 0; count < data.length; count++) {
                var option = $('<option>' + data[count].pk + '</option>');
                $('#lec-depart').append(option);
            }
        })
        .catch(function(err) {
            alert(err);
        });
});

// 투표 기능 버튼 리스너
voteProBtn.addEventListener('click', function(event) {
    changeContents('professor2', 'calendar-common', 'professor1', 'sidebar', 'professor3');
    ajaxPost('/toast_cal/pro_vote_open_table/', 'json', 'POST', 1)
        .then(function(data) {
            $('#vote-open-tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr scope="row" onclick="clickTrEvent(this,\'#vote-open-tbody\', false)"><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.professor + '</td>' + '<td> 2020-test-1234 </td></tr>');
                $('#vote-open-tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err);
        });

    document.getElementById('vote-open-period').value = new Date().toISOString().substring(0, 10);
});

// 공용 캘린더 버튼 리스너
shareProBtn.addEventListener('click', async function(event) {
    $('#pubCalLoadBtn').trigger('click'); // 캘린더 크기 잡아주기 위한 트리거
    changeContents('professor3', 'professor2', 'calendar-common', 'sidebar', 'professor1');
    //select 박스 교수강의 불러오기
    await ajaxPost('/toast_cal/pro_lecture/', 'json', 'POST', 1)
        .then(function(data) {
            $('#pubcal_select').empty(); //기존 옵션 값 삭제

            for (var count = 0; count < data.length; count++) {
                var option = $('<option>' + data[count].fields.code + '</option>');
                $('#pubcal_select').append(option);
            }
        })
        .catch(function(err) {
            alert(err);
        });

    // 공유 캘린더 날짜 셋팅
    var dateValue = getThisWeek();

    document.getElementById('start').value = dateValue[0];
    document.getElementById('end').value = dateValue[6];


    // 공유 캘린더 하단 학생 정보 표시
    var select_val = $("#pubcal_select option:selected").val();

    var test_data = {
        code: select_val,
    }

    ajaxPost('/toast_cal/getAllStudent/', 'json', 'POST', test_data).then(function(data) {
            console.log(data)

            $('#vote-pub-info').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr><td>' + data[count].fields.studentID + '</td>' +
                    '<td>' + data[count].fields.username + '</td>' +
                    '<td>' + data[count].fields.department + '</td>' +
                    '</tr>'
                );

                $('#vote-pub-info').append(tr);
            }
        })
        .catch(function(err) {
            console.log(err);
        })
});

// 강의 개설 버튼
var lecMakeBtn = document.getElementById('lecMakeBtn');

// 강의 개설 버튼 eventListener
lecMakeBtn.addEventListener('click', async function(event) {
    let flag = ''
    let periodData = document.getElementById('lec-type1').value +
        document.getElementById('lec-type2').value + ' ' +
        document.getElementById('lec-type3').value +
        document.getElementById('lec-type4').value;

    let makeData = {
        name: document.getElementById('lec-name').value,
        code: document.getElementById('lec-code').value,
        codeClass: document.getElementById('lec-class').value,
        period: periodData,
        lecture_type: document.getElementById('lec-type').value,
        department: document.getElementById('lec-depart').value,
        total_count: document.getElementById('lec-count').value,
    };
    document.getElementById('make-lecture-wrap').reset();

    // console.log(makeData);
    let scheduleData;

    // 강의 개설하는 ajax통신 및 반복일정을 생성할 데이터셋 만들기
    await ajaxPost('/toast_cal/makeSubject/', 'json', 'POST', makeData)
        .then(function(data) {
            flag = data;
            if (flag !== '강의 코드가 겹치는 강의가 있습니다.' && flag !== '강의 시간이 겹치지 않게 설정해주세요') {
                console.log('과목/교시 데이터', data[0].fields.period);

                var timeData = periodSplit(data[0].fields.period);
                console.log('과목/교시를 분리한 데이터', timeData);

                var convData = periodConvert(timeData);
                console.log('분리된 데이터를 변환한 데이터', convData)

                var calData = [];
                // console.log(convData);
                for (var i = 0; i < 15; i++) {
                    var dateArr = getTimeData(convData, '-09-01', i * 7);
                    console.log('날짜/시간으로 변환한 데이터', dateArr);

                    // console.log(dateArr);
                    for (var j = 0; j < 2; j++) {
                        var calobj = {};
                        // console.log(dateArr[j].startDate);
                        // console.log(dateArr[j].endDate);
                        calobj = newCalObj(1, data[0].fields.lecture_type,
                            data[0].fields.name, 'time', '미정', dateArr[j].startDate,
                            dateArr[j].endDate, convertBooleanData(false),
                            'busy', 'public');
                        calData.push(calobj);
                    }

                }
                // console.log(calData);
                scheduleData = calData;
            } else alert(flag);

        })
        .catch(function(err) {
            alert(err);
        });

    // console.log(scheduleData);
    if (flag !== '강의 코드가 겹치는 강의가 있습니다.' && flag !== '강의 시간이 겹치지 않게 설정해주세요') {
        scheduleData = {
            scheduleData
        };
        console.log('캘린더에 일정 추가하기 위한 데이터셋중 일부', scheduleData.scheduleData[0]);

        // 캘린더 일정에 반복적으로 일정 추가
        await ajaxPost('/toast_cal/makeCalendars/', 'json', 'POST', scheduleData)
            .then(function(data) {
                // alert(data);
            })
            .catch(function(err) {
                alert(err);
            });

        // 추가된 반복일정을 캘린더에 뿌려주기
        ajaxPost('/toast_cal/ourstores/', 'json', 'POST', '1')
            .then(function(data) {
                calendar.clear();
                console.log('마지막으로 캘린더에 생성될 마지막 데이터', data[data.length - 1]);
                create(calendar, data);
                window.location.reload();
            })
            .catch(function(err) {
                alert(err);
            });
    }

});

// 교수 강의 삭제
$(document).on('click', '.pro_lec_del_btn', async function() {
    var delete_btn = $(this);

    var tr = delete_btn.parent().parent();
    var td = tr.children();

    var json = {};

    json.title = td[4].innerText;

    await ajaxPost('/toast_cal/deleteCalendars/', 'json', 'POST', json)
        .then(function(data) {
            alert(data);
        })
        .catch(function(err) {
            alert(err);
        });

    var subject = {};

    subject.code = td[0].innerText;
    subject.codeClass = td[1].innerText;

    ajaxPost('/toast_cal/professor_lecture_delete/', 'json', 'POST', subject)
        .then(function(data) {
            $('#pro_lec_load_tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.codeClass + '</td>' + '<td>' + data[count].fields.department + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.professor + '</td>' + '<td>' + data[count].fields.period + '</td>' +
                    '<td>' + data[count].fields.stdCount + '/' + data[count].fields.total_stdCount + '</td>' +
                    '<td><button type="button" class="btn btn-outline-dark pro_lec_del_btn">삭제</button></td>');
                $('#pro_lec_load_tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err)
        })

    ajaxPost('/toast_cal/ourstores/', 'json', 'POST', '1')
        .then(function(data) {
            calendar.clear();
            create(calendar, data);
            window.location.reload();
        })
        .catch(function(err) {
            alert(err);
        });
});


// 교수 투표 페이지 관련 select, button DOM
var voteClass = document.getElementById('lecture-class');
var voteStatus = document.getElementById('vote-status');
var voteTableBtn = document.getElementById('voteTableBtn');
var voteOpenTabBtn = document.getElementById('vote-open-tab-btn');
var voteStatusTabBtn = document.getElementById('vote-status-tab-btn');

// 투표 개설 탭 버튼
voteOpenTabBtn.addEventListener('click', function(event) {
    changeContents('professor-vote-open', 'professor-vote-status');

    ajaxPost('/toast_cal/pro_vote_open_table/', 'json', 'POST', 1)
        .then(function(data) {
            $('#vote-open-tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr scope="row" onclick="clickTrEvent(this,\'#vote-open-tbody\', false)"><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.professor + '</td>' + '<td> 2020-test-1234 </td></tr>');
                $('#vote-open-tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err);
        });

});

// 투표 현황 탭 버튼
voteStatusTabBtn.addEventListener('click', function(event) {
    changeContents('professor-vote-status', 'professor-vote-open');
});

// 투표 개설 버튼 ajax 부분 미완
$('#vote-open-btn').click(async function() {
    var tr = $('#vote-open-tbody').children();
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
                $('#vote-open-tbody').empty();

                for (var count = 0; count < data.length; count++) {
                    var tr = $('<tr scope="row" onclick="clickTrEvent(this,\'#vote-open-tbody\', false)"><td>' + data[count].fields.code + '</td>' +
                        '<td>' + data[count].fields.codeClass + '</td>' + '<td>' + data[count].fields.department + '</td>' +
                        '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                        '<td>' + data[count].fields.professor + '</td>' + '<td>' + data[count].fields.period + '</td></tr>');
                    $('#vote-open-tbody').append(tr);
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


// 서버에서 filter를 적용할 투표 페이지 관련 데이터 object
var voteData = {
    lecture_type: '일반 교양',
    vote_status: '투표중'
}

// 교수 투표 현황 테이블 생성 부분
ajaxPost('/toast_cal/voteTable/', 'json', 'POST', voteData).then(function(data) {
        $('#vote-info').empty();

        for (var count = 0; count < data.length; count++) {
            var tr = $('<tr><td>' + data[count].fields.code + '</td>' +
                '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                '<td>' + data[count].fields.vote_status + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn">상세</button> <button type="button" class="btn btn-outline-dark voteDelete">삭제</button></td>');
            $('#vote-info').append(tr);
        }

    })
    .catch(function(err) {
        console.log(err);
    });

// 투표 현황 option 오른쪽의 선택버튼 
voteTableBtn.addEventListener('click', function(event) {
    voteData.lecture_type = voteClass.value;
    voteData.vote_status = voteStatus.value;

    // console.log(voteData);
    ajaxPost('/toast_cal/voteTable/', 'json', 'POST', voteData).then(function(data) {
            $('#vote-info').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr><td>' + data[count].fields.code + '</td>' +
                    '<td>' + data[count].fields.lecture_type + '</td>' + '<td>' + data[count].fields.name + '</td>' +
                    '<td>' + data[count].fields.vote_status + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn">상세</button> <button type="button" class="btn btn-outline-dark voteDelete">삭제</button></td>');
                $('#vote-info').append(tr);
            }
        })
        .catch(function(err) {
            console.log(err);
        })
});

// chart 표시하기 위한 데이터
var chart = null;
var comment_div = null;

// 투표하기 버튼
$(document).on('click', '.voteBtn', function() {

    if (chart !== null) chart.destroy();
    var voteBtn = $(this);

    var tr = voteBtn.parent().parent();
    var td = tr.children();

    var chartData = {
        code: td.eq(0).text()
    }

    ajaxPost('/toast_cal/voteChart/', 'json', 'POST', chartData).then(function(data) {
            // console.log(data.length);
            // console.log(data);
            if (data.length > 0) {
                //toast UI Chart 세팅
                var doughnut = document.getElementById('chart-area');
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

    if (comment_div !== null) {
        $('#comment').destroy();
        $('#revoteBtn').destroy();
        $('#correctBtn').destroy();
    } else {
        comment_div = 1;
        let comment = $('<div id="comment"><table id="comment_table"><thead><tr><th>댓글</th></tr></thead><tbody id="comment_tbody"></tbody></table></div>');
        $('#professor-vote-status').append(comment);

        for (var count = 0; count < 10; count++) {
            var comment_tr = $('<tr><td>이종욱</td><td class="comment_td"><a href="javascript:void(0);" onclick="show_comment(\'투표 방식에 이의가 있어 글을 남깁니다. 다시 재투표 해주세요. 빠른 시일 내에 수정해주시길 바랍니다.\')">투표 방식에 이의가 있어 글을 남깁니다. 다시 재투표 해주세요. 빠른 시일 내에 수정해주시길 바랍니다.</a></td></tr>');
            $('#comment_tbody').append(comment_tr);
        }

        var revote_btn = $('<button type="button" class="btn btn-outline-dark revoteBtn" id="revoteBtn">투표 재개설</button>');
        var correct_btn = $('<button type="button" class="btn btn-outline-dark correctBtn">투표 수정</button>');
        $('#professor-vote-status').append(revote_btn);
        $('#professor-vote-status').append(correct_btn);
    }
});

// 공유캘린더 과목코드 변경시 즉시 실행되어 테이블에 수강학생 전체 목록 출력
$(function() {
    $('#pubcal_select').on('change', function() {
        var select_val = $("#pubcal_select option:selected").val();

        var test_data = {
            code: select_val,
        }

        ajaxPost('/toast_cal/getAllStudent/', 'json', 'POST', test_data).then(function(data) {
                console.log(data)

                $('#vote-pub-info').empty();

                for (var count = 0; count < data.length; count++) {
                    var tr = $('<tr><td>' + data[count].fields.studentID + '</td>' +
                        '<td>' + data[count].fields.username + '</td>' +
                        '<td>' + data[count].fields.department + '</td>' +
                        '</tr>'
                    );

                    $('#vote-pub-info').append(tr);
                }
            })
            .catch(function(err) {
                console.log(err);
            })
    });
});