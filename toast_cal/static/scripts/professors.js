// 교수용 페이지 버튼과 이벤트리스너
var calProBtn = document.getElementById('calProBtn');
var subProBtn = document.getElementById('subProBtn');
var voteProBtn = document.getElementById('voteProBtn');
var shareProBtn = document.getElementById('shareProBtn');

// 교수 캘린더 버튼 리스너
calProBtn.addEventListener('click', function(event) {
    changeContents('calendar-common', 'professor1', 'professor2', 'professor3', 'pubcal_vote_info');
    changeContents('sidebar');
    changeContents('tab_box');
});

// 교수 강의 개설 버튼 리스너
subProBtn.addEventListener('click', async function(event) {
    changeContents('professor1', 'calendar-common', 'professor2', 'sidebar', 'professor3', 'pubcal_vote_info');
    changeContents('tab_box');

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
voteProBtn.addEventListener('click', async function(event) {

    $('#vote-open-tbody').empty();

    var check_subject;
    await ajaxPost('/toast_cal/check_user_subject/', 'json', 'POST', 1)
        .then(function(data) {
            check_subject = data;
        })
        .catch(function(err) {
            alert(err);
        });

    if (check_subject === "강의 있음") {

        changeContents('professor2', 'calendar-common', 'professor1', 'sidebar', 'professor3', 'pubcal_vote_info');
        changeContents('tab_box');

        // 공유 캘린더 날짜 셋팅
        var dateValue = getThisWeek();
        var todayValue = new Date()

        ty = todayValue.getFullYear();
        tm = todayValue.getMonth() + 1;
        td = todayValue.getDate();

        td_end = td + 14;

        if (td < 10) {
            td = "0" + td;
        }

        tv_start = ty + "-" + tm + "-" + td;
        tv_end = ty + "-" + tm + "-" + td_end;

        document.getElementById('start').value = dateValue[0];
        document.getElementById('end').value = dateValue[6];

        document.getElementById('voteStart').value = tv_start;
        document.getElementById('voteEnd').value = tv_end;

        // select options 셋팅
        await ajaxPost('/toast_cal/pro_lecture/', 'json', 'POST', 1)
            .then(function(data) {
                $('#class_select').empty(); //기존 옵션 값 삭제

                for (var count = 0; count < data.length; count++) {
                    var option = $('<option>' + data[count].fields.name + " (" + data[count].fields.code + ")" + '</option>');
                    $('#class_select').append(option);
                }
            })
            .catch(function(err) {
                alert(err);
            });

        $('#vote-open-tab-btn').trigger('click');


    } else {
        alert("교수님의 강의가 없습니다. 강의를 개설해주세요.")
    }

    // document.getElementById('vote-open-period').value = new Date().toISOString().substring(0, 10);
});

// 투표 개설 선택 버튼
$(document).on("click", "#vote-ava-time", async function() {
    // var select_val = $("#class_select option:selected").val();

    var voteCode = getSubCode(document.getElementById('class_select').value)
    var voteStart = document.getElementById('start').value;
    var voteEnd = document.getElementById('end').value;
    var voteOpen = document.getElementById('vote-open-btn');
    var lec_check = 0;

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

    let startString = voteStart;
    let endString = voteEnd;

    let arrayStart = startString.split("-");
    let arrayEnd = endString.split("-");

    let objStart = new Date(arrayStart[0], Number(arrayStart[1]) - 1, arrayStart[2]);
    let objEnd = new Date(arrayEnd[0], Number(arrayEnd[1]) - 1, arrayEnd[2]);
    let objToday = new Date();

    let betweenStartEnd = (objEnd.getTime() - objStart.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 끝 날짜와의 차이
    let betweenTodayStart = (objStart.getTime() - objToday.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 오늘 날짜의 차이

    // console.log(betweenStartEnd);
    // console.log(betweenTodayStart);

    if (voteOpen.disabled == true) {
        voteOpen.disabled = false;
    }

    await ajaxPost('/toast_cal/lec_Check/', 'json', 'POST', voteTimeLoad)
        .then(function(data) {
            for (var count = 0; count < data.length; count++) {
                lec_check += 1;
            }
        })
        .catch(function(err) {
            alert(err);
        });

    console.log("lec_check : " + lec_check);

    if (lec_check > 0) {
        if (betweenTodayStart < -1) { // 시작날짜가 오늘 이전의 날짜가 입력됬을때
            $('#vote-open-tbody').empty();
            alert("시작 날짜를 오늘 이후의 날짜로 입력해주세요.")
        } else if (betweenStartEnd < 0) { // 끝 날짜가 시작 날짜보다 크게 입력됬을때
            $('#vote-open-tbody').empty();
            alert("마지막 날짜의 입력이 잘못 되었습니다.")
        } else {
            await ajaxPost('/toast_cal/pubCalSave/', 'json', 'POST', voteTimeLoad)
                .then(function(data) {
                    // console.log(data);
                })
                .catch(function(err) {
                    alert(err);
                });

            await ajaxPost('/toast_cal/voteTimeLoad/', 'json', 'POST', voteTimeLoad)
                .then(function(data) {
                    if (data !== "공용 일정이 없습니다") {
                        let newDate = getVoteDate(data);

                        date_status_json = {
                            newDate
                        }

                    } else { // 공용캘린더 DB에 데이터가 없을 때
                        alert(data);
                    }
                })
                .catch(function(err) {
                    alert(err);
                });

            printVoteOpenTbody(voteCode, voteStart, voteEnd, date_status_json)
        }
    } else {
        alert("강의를 수강중인 학생이 없습니다.");
        lec_check = 0;
        voteOpen.disabled = true;
    }

});

// 공용 캘린더 버튼 리스너
shareProBtn.addEventListener('click', async function(event) {
    pubCalendar.clear();

    var check_subject;
    await ajaxPost('/toast_cal/check_user_subject/', 'json', 'POST', 1)
        .then(function(data) {
            check_subject = data;
        })
        .catch(function(err) {
            alert(err);
        });

    if (check_subject === "강의 있음") {
        changeContents('professor3', 'professor2', 'calendar-common', 'sidebar', 'professor1', 'tab_box');
        changeContents('pubcal_vote_info');

        //select 박스 교수강의 불러오기
        await ajaxPost('/toast_cal/pro_lecture/', 'json', 'POST', 1)
            .then(function(data) {
                $('#pubcal_select').empty(); //기존 옵션 값 삭제

                for (var count = 0; count < data.length; count++) {
                    var option = $('<option>' + data[count].fields.name + ' (' + data[count].fields.code + ')</option>');
                    $('#pubcal_select').append(option);
                }
            })
            .catch(function(err) {
                alert(err);
            });

        $('#pub_today').trigger('click'); // 캘린더 크기 잡아주기 위한 트리거

        // 공유 캘린더 날짜 셋팅
        var dateValue = getThisWeek();

        document.getElementById('pubStart').value = dateValue[0];
        document.getElementById('pubEnd').value = dateValue[6];


        // 공유 캘린더 하단 학생 정보 표시
        var select_val = $('#pubcal_select option:selected').val();
        let subData = $('#pubcal_select option:selected').val();

        select_val = getSubCode(select_val);
        // console.log(select_val);

        var test_data = {
            code: select_val,
        }


        // 해당 강의 수강 중인 학생 목록 출력하는 부분
        await ajaxPost('/toast_cal/getAllStudent/', 'json', 'POST', test_data).then(function(data) {
                // console.log(data)

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
            });

        // 공유캘린더 우측 right_nav위치에 나타낼 해당 과목에 대한 투표정보
        ajaxPost('/toast_cal/getVoteInfo/', 'json', 'POST', test_data).then(function(data) {
            // console.log(data)

            $('#pubcal_vote_info').empty();

            // 개설된 강의가 존재하면 투표정보에 대한 타이틀을 띄워줌
            var pubcal_vote_info_title =
                $('<ul class = "vote_info_title_area">' +
                    '<li class = "vote_info_title">' +
                    '<span>' +
                    subData + '에 대한 투표정보' +
                    '</span>' +
                    '</li>' +
                    '</ul>');
            $('#pubcal_vote_info').append(pubcal_vote_info_title);

            // 투표 테이블에 강의코드와 맞는 투표항목이 없을경우 투표개설하도록 띄워줌
            if (data.length == 0) {
                var vote_data_null =
                    $('<div class = "vote_info_tab_null">' +
                        '<div class = "vote_info_area">' +
                        '<span class = "vote_infomation">' +
                        '해당 과목에 대한 투표내역이 없습니다.' +
                        '</span>' + '</br>' +
                        '<input type = "button" id = "portal_to_making_vote" value = "투표개설하기">' +
                        '</div>' +
                        '</div>'
                    );
                $('#pubcal_vote_info').append(vote_data_null);
            }

            // 투표테이블에 해당강의코드에 맞는 투표항목들을 반복생성
            for (var count = 0; count < data.length; count++) {

                // 날짜 데이터
                var vote_date_start = data[count].fields.start;
                var vote_date_end = data[count].fields.end;

                // 날짜출력
                var startMonth = vote_date_start.substr(5, 2); //시작 월
                var startDay = vote_date_start.substr(8, 2); //시작 일
                var endMonth = vote_date_end.substr(5, 2); // 끝 월
                var endDay = vote_date_end.substr(8, 2); // 끝 일

                // 시간출력
                // 시작 출력
                var startHour = vote_date_start.substr(11, 2);
                var startMin = vote_date_start.substr(14, 2);
                // 끝 출력
                var endHour = vote_date_end.substr(11, 2);
                var endMin = vote_date_end.substr(14, 2);

                // 투표제목 출력을 위함.
                var choice_title1 = data[count].fields.choice1_Title;
                var choice_title2 = data[count].fields.choice2_Title;
                var choice_title3 = data[count].fields.choice3_Title;
                var choice_title4 = data[count].fields.choice4_Title;

                var choice1 = choice_title1.substr(10);
                var choice2 = choice_title2.substr(10);
                var choice3 = choice_title3.substr(10);
                var choice4 = choice_title4.substr(10);
                // 투표수 카운팅
                // 2가지 선택을 받았을때
                if (data[count].fields.choice3 == null && data[count].fields.choice4 == null) {
                    var countVote_Choice =
                        data[count].fields.choice1 + data[count].fields.choice2;
                }
                // 4가지를 모두 받을때
                else {
                    var countVote_Choice =
                        data[count].fields.choice1 + data[count].fields.choice2 + data[count].fields.choice3 + data[count].fields.choice4;
                }
                var vote_data =
                    $('<div class = "vote_info_tab">' +
                        '<div class = "vote_info_area">' +
                        '<div class = "vote_infomation">' +
                        '<div class = "class_name_title_data">' +
                        '<span class = "class_name_title">' + '과목명 </span>' +
                        '</div>' +
                        '<div class = "class_name_data">' +
                        '<span class = "class_name">' + data[count].fields.className + '</span>' +
                        '</div>' +
                        '<div class = "vote_date_title_data">' +
                        '<span class = "vote_date_title">' + '투표기한' + '</span>' + '<br>' +
                        '</div>' +
                        '<div class = "vote_date_data">' +
                        '<span class = "vote_date">' +
                        startMonth + '월 ' + startDay + '일 ' + startHour + '시 ' + startMin + '분' + '<br>' +
                        ' ~ ' + '<br>' +
                        endMonth + '월 ' + endDay + '일 ' + endHour + '시 ' + endMin + '분' +
                        '</span>' + '</div>' +
                        '<div class = "vote_status_title_data">' +
                        '<span class = "vote_status_title">' + '상태' + '</span>' +
                        '</div>' +
                        '<div class = "vote_status_data">' +
                        '<span class = "vote_status">' + data[count].fields.voteStatus + '</span>' +
                        '</div>' +
                        '<div class = "vote_choice_title_data">' +
                        '<span class = "vote_choice_title">' + '투표현황' + '</span>' +
                        '</div>' +
                        '<div class = "vote_choice_data">' +
                        '<div id = "basic_vote_list">' +
                        '<span class = "vote_choice">' + choice1 + ': </span>' +
                        '<span class = "vote_choice_count">' + data[count].fields.choice1 + '표 / ' +
                        '<span class = "vote_choice">' + choice2 + ': </span>' +
                        '<span class = "vote_choice_count">' + data[count].fields.choice2 + '표 ' + '<br>' +
                        '</div>' +
                        '<span class = "total_count_vote">전체 ' + data[count].fields.totalCount + '명 중 ' +
                        countVote_Choice + '명 투표</span>' +
                        '</div>' +
                        '<input type = "button" id = "portal_to_correct_vote" value = "투표관리하기">' +
                        '<input type = "button" id = "delete_vote" value = "투표삭제하기">' +
                        '</div>' +
                        '</div>'
                    );
                $('#pubcal_vote_info').append(vote_data);

                // 투표선택지가 다중일경우 + 수정
                if (data[count].fields.choice4_Title === "False" && data[count].fields.choice3_Title !== "False") {
                    var choice3_info =
                        $(
                            '<span class = "vote_choice">' + choice3 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice3 + '표  ' + '</span>'
                        );
                    $('#basic_vote_list').append(choice3_info);
                }
                if (data[count].fields.choice3_Title === "False" && data[count].fields.choice4_Title !== "False") {
                    var choice4_info =
                        $(
                            '<span class = "vote_choice">' + choice4 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice4 + '표  ' + '</span>'
                        );
                    $('#basic_vote_list').append(choice4_info);
                }
                if (data[count].fields.choice3_Title !== "False" && data[count].fields.choice4_Title !== "False") {
                    var choice3_and4_info =
                        $(
                            '<span class = "vote_choice">' + choice3 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice3 + '표  ' + '</span>' +
                            '<span class = "vote_choice">' + choice4 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice4 + '표  ' + '</span>'
                        );
                    $('#basic_vote_list').append(choice3_and4_info);
                }
            }
        })

    } else {
        alert("교수님의 강의가 없습니다. 강의를 개설해주세요.")
    }


});

// 공유캘린더 과목코드 변경시 즉시 right_nav위치의 투표정보를 바꿔주는 함수
$('#pubcal_select').on('change', function() {
    pubCalendar.clear();

    var select_val = getSubCode($("#pubcal_select option:selected").val());
    let subData = $("#pubcal_select option:selected").val();


    var test_data = {
        code: select_val,
    }

    ajaxPost('/toast_cal/getVoteInfo/', 'json', 'POST', test_data).then(function(data) {
            console.log(data)

            $('#pubcal_vote_info').empty();

            // 개설된 강의가 존재하면 투표정보에 대한 타이틀을 띄워줌
            var pubcal_vote_info_title =
                $('<ul class = "vote_info_title_area">' +
                    '<li class = "vote_info_title">' +
                    '<span>' +
                    subData + '에 대한 투표정보' +
                    '</span>' +
                    '</li>' +
                    '</ul>');
            $('#pubcal_vote_info').append(pubcal_vote_info_title);

            // 투표 테이블에 강의코드와 맞는 투표항목이 없을경우 투표개설하도록 띄워줌
            if (data.length == 0) {
                var vote_data_null =
                    $('<div class = "vote_info_tab_null">' +
                        '<div class = "vote_info_area">' +
                        '<span class = "vote_infomation">' +
                        '해당 과목에 대한 투표내역이 없습니다.' +
                        '</span>' + '<br>' +
                        '<input type = "button" id = "portal_to_making_vote" value = "투표개설하기">' +
                        '</div>' +
                        '</div>'
                    );
                $('#pubcal_vote_info').append(vote_data_null);
            }


            // 투표테이블에 해당강의코드에 맞는 투표항목들을 반복생성
            for (var count = 0; count < data.length; count++) {

                // 날짜 데이터
                var vote_date_start = data[count].fields.start;
                var vote_date_end = data[count].fields.end;

                // 날짜출력
                var startMonth = vote_date_start.substr(5, 2); //시작 월
                var startDay = vote_date_start.substr(8, 2); //시작 일
                var endMonth = vote_date_end.substr(5, 2); // 끝 월
                var endDay = vote_date_end.substr(8, 2); // 끝 일

                // 시간출력
                // 시작 출력
                var startHour = vote_date_start.substr(11, 2);
                var startMin = vote_date_start.substr(14, 2);
                // 끝 출력
                var endHour = vote_date_end.substr(11, 2);
                var endMin = vote_date_end.substr(14, 2);

                // 투표제목 출력을 위함.
                var choice_title1 = data[count].fields.choice1_Title;
                var choice_title2 = data[count].fields.choice2_Title;
                var choice_title3 = data[count].fields.choice3_Title;
                var choice_title4 = data[count].fields.choice4_Title;

                var choice1 = choice_title1.substr(10);
                var choice2 = choice_title2.substr(10);
                var choice3 = choice_title3.substr(10);
                var choice4 = choice_title4.substr(10);

                // 투표수 카운팅
                // 2가지 선택을 받았을때
                if (data[count].fields.choice3 == null && data[count].fields.choice4 == null) {
                    var countVote_Choice =
                        data[count].fields.choice1 + data[count].fields.choice2;
                }
                // 4가지를 모두 받을때
                else {
                    var countVote_Choice =
                        data[count].fields.choice1 + data[count].fields.choice2 + data[count].fields.choice3 + data[count].fields.choice4;
                }
                var vote_data =
                    $('<div class = "vote_info_tab">' +
                        '<div class = "vote_info_area">' +
                        '<div class = "vote_infomation">' +
                        '<div class = "class_name_title_data">' +
                        '<span class = "class_name_title">' + '과목명 </span>' +
                        '</div>' +
                        '<div class = "class_name_data">' +
                        '<span class = "class_name">' + data[count].fields.className + '</span>' +
                        '</div>' +
                        '<div class = "vote_date_title_data">' +
                        '<span class = "vote_date_title">' + '투표기한' + '</span>' + '<br>' +
                        '</div>' +
                        '<div class = "vote_date_data">' +
                        '<span class = "vote_date">' +
                        startMonth + '월 ' + startDay + '일 ' + startHour + '시 ' + startMin + '분' + '<br>' +
                        ' ~ ' + '<br>' +
                        endMonth + '월 ' + endDay + '일 ' + endHour + '시 ' + endMin + '분' +
                        '</span>' + '</div>' +
                        '<div class = "vote_status_title_data">' +
                        '<span class = "vote_status_title">' + '상태' + '</span>' +
                        '</div>' +
                        '<div class = "vote_status_data">' +
                        '<span class = "vote_status">' + data[count].fields.voteStatus + '</span>' +
                        '</div>' +
                        '<div class = "vote_choice_title_data">' +
                        '<span class = "vote_choice_title">' + '투표현황' + '</span>' +
                        '</div>' +
                        '<div class = "vote_choice_data">' +
                        '<div id = "basic_vote_list">' +
                        '<span class = "vote_choice">' + choice1 + ': </span>' +
                        '<span class = "vote_choice_count">' + data[count].fields.choice1 + '표 / ' +
                        '<span class = "vote_choice">' + choice2 + ': </span>' +
                        '<span class = "vote_choice_count">' + data[count].fields.choice2 + '표 ' + '<br>' +
                        '</div>' +
                        '<span class = "total_count_vote">전체 ' + data[count].fields.totalCount + '명 중 ' +
                        countVote_Choice + '명 투표</span>' + '<br>' +
                        '</div>' +
                        '<input type = "button" id = "portal_to_correct_vote" value = "투표관리하기">' +
                        '<input type = "button" id = "delete_vote" value = "투표삭제하기">' +
                        '</div>' +
                        '</div>'
                    );
                $('#pubcal_vote_info').append(vote_data);

                // 투표선택지가 다중일경우 + 수정
                if (data[count].fields.choice4_Title === "False" && data[count].fields.choice3_Title !== "False") {
                    var choice3_info =
                        $(
                            '<span class = "vote_choice">' + choice3 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice3 + '표  ' + '</span>'
                        );
                    $('#basic_vote_list').append(choice3_info);
                }
                if (data[count].fields.choice3_Title === "False" && data[count].fields.choice4_Title !== "False") {
                    var choice4_info =
                        $(
                            '<span class = "vote_choice">' + choice4 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice4 + '표  ' + '</span>'
                        );
                    $('#basic_vote_list').append(choice4_info);
                }
                if (data[count].fields.choice3_Title !== "False" && data[count].fields.choice4_Title !== "False") {
                    var choice3_and4_info =
                        $(
                            '<span class = "vote_choice">' + choice3 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice3 + '표  ' + '</span>' +
                            '<span class = "vote_choice">' + choice4 + ': </span>' +
                            '<span class = "vote_choice_count">' + data[count].fields.choice4 + '표  ' + '</span>'
                        );
                    $('#basic_vote_list').append(choice3_and4_info);
                }
            }
        })
        .catch(function(err) {
            console.log(err);
        });

    ajaxPost('/toast_cal/getAllStudent/', 'json', 'POST', test_data).then(function(data) {
            // console.log(data)

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
        });
});

// 투표정보가 있을경우
// 투표정보에 대한 투표수정으로 가는 링크 버튼
$(document).on("click", "#portal_to_correct_vote", function() {
    changeContents('professor2', 'professor3', 'calendar-common', 'sidebar', 'professor1', 'pubcal_vote_info');
    changeContents('tab_box');
    changeContents('professor-vote-status', 'professor-vote-open', 'professor-vote-update');

    let pubcal_select = getSubCode(document.getElementById('pubcal_select').value);

    var test_data = {
        code: pubcal_select,
    }

    exist_code = "true";
    $('#vote-status-tab-btn').trigger('click');

    ajaxPost('/toast_cal/getVoteInfo/', 'json', 'POST', test_data).then(function(data) {
            $('#vote-info').empty();

            var tr = $('<tr><td>' + data[0].fields.classCode + '</td>' +
                '<td>' + data[0].fields.lecType + '</td>' + '<td>' + data[0].fields.className + '</td>' +
                '<td>' + data[0].fields.voteStatus + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn">상세</button> <button type="button" class="btn btn-outline-dark voteDelete">삭제</button></td>');
            $('#vote-info').append(tr);

            document.getElementById("vote-info").children[0].children[4].children[0].click()
        })
        .catch(function(err) {
            console.log(err);
        })
});

// 투표정보에 대한 투표삭제 버튼
$(document).on("click", "#delete_vote", function() {
    if (confirm("해당 투표를 삭제 하시겠습니까?") == true) {

        // 추가된 코드
        // 강의코드 받아오기.
        var select_val = $("#pubcal_select option:selected").val();

        let subData = $("#pubcal_select option:selected").val();
        select_val = getSubCode(select_val);

        var val_data = {
            code: select_val,
        }

        // vote테이블에서 삭제후 vote테이블 검색
        ajaxPost('/toast_cal/delete_Vote/', 'json', 'POST', val_data).then(function(data) {
            $('#pubcal_vote_info').empty();

            var vote_data_null =
                $('<div class = "vote_info_tab_null">' +
                    '<div class = "vote_info_area">' +
                    '<span class = "vote_infomation">' +
                    '해당 과목에 대한 투표내역이 없습니다.' +
                    '</span>' + '</br>' +
                    '<input type = "button" id = "portal_to_making_vote" value = "투표개설하기">' +
                    '</div>' +
                    '</div>'
                );
            $('#pubcal_vote_info').append(vote_data_null);
        }).catch(function(err) {
            alert(err);
        })
        alert("해당 투표가 삭제되었습니다.");
    } else {
        return;
    }
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
    changeContents('professor-vote-open', 'professor-vote-status', 'professor-vote-update');

});

let exist_code = "false"

// 투표 현황 탭 버튼
voteStatusTabBtn.addEventListener('click', function(event) {
    changeContents('professor-vote-status', 'professor-vote-open', 'professor-vote-update');

    if (exist_code === "false") {
        $('#voteTableBtn').trigger('click');

        if (chart !== null /* && comment_div !== null*/ ) {
            $('#chart-area').empty();
            // comment_div = null;
            $('#comment').remove();
            $('#voteConfirmBtn').remove();
            $('#correctBtn').remove();
            $('.classCode').remove();
        }
    } else {
        exist_code = "false";
    }
});

// 투표 개설 버튼 ajax 부분 미완
$('#vote-open-btn').click(async function() {
    var voteStart = document.getElementById('voteStart').value;
    var voteEnd = document.getElementById('voteEnd').value;

    let startString = voteStart;
    let endString = voteEnd;

    let arrayStart = startString.split("-");
    let arrayEnd = endString.split("-");

    let objStart = new Date(arrayStart[0], Number(arrayStart[1]) - 1, arrayStart[2]);
    let objEnd = new Date(arrayEnd[0], Number(arrayEnd[1]) - 1, arrayEnd[2]);
    let objToday = new Date();

    let betweenStartEnd = (objEnd.getTime() - objStart.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 끝 날짜와의 차이
    let betweenTodayStart = (objStart.getTime() - objToday.getTime()) / 1000 / 60 / 60 / 24; // 시작 날짜와 오늘 날짜의 차이


    var tr = $('#vote-open-tbody').children();

    var classCode = getSubCode($("#class_select option:selected").val());
    var array = [];
    var husks = {};
    var check = 0;


    for (var i = 0; i < tr.length; i++) {
        if (tr[i].style.backgroundColor === 'rgb(177, 179, 182)') { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            var obj = {};
            var td = tr[i].children;
            obj.lecType = td[0].innerText;
            obj.className = td[1].innerText;
            obj.status = td[2].innerText;
            obj.ava_Time = td[3].innerText;
            array.push(obj);
        }
    }


    if (betweenTodayStart < -1) { // 시작날짜가 오늘 이전의 날짜가 입력됬을때
        alert("시작 날짜를 오늘 이후의 날짜로 입력해주세요.")
    } else if (betweenStartEnd < 0) { // 끝 날짜가 시작 날짜보다 크게 입력됬을때
        alert("마지막 날짜의 입력이 잘못 되었습니다.")
    } else if (array.length == 0) {
        alert("투표 목록을 선택해주세요.")
    } else {
        ajaxPost('/toast_cal/check_Vote/', 'json', 'POST', husks)
            .then(function(data) {
                for (var count = 0; count < data.length; count++) {
                    if (classCode == data[count].fields.classCode) {
                        check = 1;
                        className = data[count].fields.className;
                    }
                }

                if (check == 1) {
                    alert(className + " 강의의 투표가 존재합니다.");
                    check = 0;
                } else if (check == 0) {
                    if (array.length >= 2 && array.length <= 4 && check == 0) { //과목 선택을 했을때
                        let today_data_vote = new Date();

                        let get_year_vote = today_data_vote.getFullYear();
                        let get_month_vote = today_data_vote.getMonth() + 1;
                        let get_day_vote = today_data_vote.getDate();
                        let get_hour_vote = today_data_vote.getHours();
                        let get_min_vote = today_data_vote.getMinutes();
                        let get_sec_vote = today_data_vote.getSeconds();
                        let get_mil_vote = today_data_vote.getMilliseconds();

                        if (get_month_vote < 10) get_month_vote = '0' + get_month_vote;
                        if (get_day_vote < 10) get_day_vote = '0' + get_day_vote;

                        let today_data_vote_status =
                            get_year_vote + '-' + get_month_vote + '-' + get_day_vote + ' ' +
                            get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;

                        let start_data_vote_status = $('#voteStart').val() + ' ' +
                            // get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;
                            '00:00:00.000000'

                        let end_data_vote_status = $('#voteEnd').val() + ' ' +
                            // get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;
                            '00:00:00.000000'

                        husks = {
                            select_Array: array,
                            classCode: classCode,
                            today: today_data_vote_status,
                            start: start_data_vote_status,
                            end: end_data_vote_status,
                        }

                        ajaxPost('/toast_cal/create_Vote/', 'json', 'POST', husks)
                            .then(function(data) {
                                alert('투표가 개설되었습니다.');
                                $('#vote-status-tab-btn').trigger('click');
                            })
                            .catch(function(err) {
                                alert(err);
                            });
                    } else if (array.length >= 5) {
                        alert('4개까지 선택 가능합니다.');
                    } else if (array.length <= 1) {
                        alert('2개 이상 선택해야 합니다.');
                    }
                }
            })
            .catch(function(err) {
                alert(err);
            });
    }
});

// 서버에서 filter를 적용할 투표 페이지 관련 데이터 object
var voteData = {
    lecture_type: '전공 필수',
    vote_status: '투표 중'
}

// 투표 현황 option 오른쪽의 선택버튼 
voteTableBtn.addEventListener('click', function(event) {
    voteData.lecture_type = voteClass.value;
    voteData.vote_status = voteStatus.value;

    // console.log(voteData);
    ajaxPost('/toast_cal/voteTable/', 'json', 'POST', voteData).then(function(data) {
            $('#vote-info').empty();

            for (var count = 0; count < data.length; count++) {
                var tr = $('<tr><td>' + data[count].fields.classCode + '</td>' +
                    '<td>' + data[count].fields.lecType + '</td>' + '<td>' + data[count].fields.className + '</td>' +
                    '<td>' + data[count].fields.voteStatus + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn">상세</button> <button type="button" class="btn btn-outline-dark voteDelete">삭제</button></td>');
                $('#vote-info').append(tr);
            }
        })
        .catch(function(err) {
            console.log(err);
        });

});

// chart 표시하기 위한 데이터
var chart = null;

let confirmCode; // 투표 확정을 위한 데이터 

// 투표 상세보기 버튼
$(document).on('click', '.voteBtn', function() {

    if (chart !== null)
        $('#chart-area').empty();

    var voteBtn = $(this);

    var tr = voteBtn.parent().parent();
    var td = tr.children();

    var chartData = {
        code: td.eq(0).text()
    }
    confirmCode = td.eq(0).text(); // 투표 확정 버튼에서 사용할 code값

    let voteStat = td.eq(3).text(); // 투표 상태를 통한 버튼 disabled용 변수


    ajaxPost('/toast_cal/voteChart/', 'json', 'POST', chartData).then(function(data) {
            // console.log(data.length);
            // console.log(data);
            if (data.length > 0) {
                //toast UI Chart 세팅
                var doughnut = document.getElementById('chart-area');

                var doughnutData = {
                    categories: ['투표 현황'],
                    series: []
                };

                var theme = {
                    series: {
                        colors: [],
                        label: {
                            color: '#000000',
                            fontFamily: 'sans-serif'
                        }
                    }
                };

                if (data[0].fields.choice2_Title != "False") {
                    doughnutData.series = [{
                            name: data[0].fields.choice1_Title,
                            data: data[0].fields.choice1
                        },
                        {
                            name: data[0].fields.choice2_Title,
                            data: data[0].fields.choice2
                        },
                        {
                            name: '투표안함',
                            data: data[0].fields.totalCount - data[0].fields.choice1 - data[0].fields.choice2
                        }
                    ]

                    theme.series.colors = ['#F15F5F', '#E5D85C', '#BDBDBD']
                }

                if (data[0].fields.choice3_Title != "False") {
                    doughnutData.series = [{
                            name: data[0].fields.choice1_Title,
                            data: data[0].fields.choice1
                        },
                        {
                            name: data[0].fields.choice2_Title,
                            data: data[0].fields.choice2
                        },
                        {
                            name: data[0].fields.choice3_Title,
                            data: data[0].fields.choice3
                        },
                        {
                            name: '투표안함',
                            data: data[0].fields.totalCount - data[0].fields.choice1 - data[0].fields.choice2 -
                                data[0].fields.choice3
                        }
                    ]

                    theme.series.colors = ['#F15F5F', '#E5D85C', '#86E57F', '#BDBDBD']
                }

                if (data[0].fields.choice4_Title != "False") {
                    doughnutData.series = [{
                            name: data[0].fields.choice1_Title,
                            data: data[0].fields.choice1
                        },
                        {
                            name: data[0].fields.choice2_Title,
                            data: data[0].fields.choice2
                        },
                        {
                            name: data[0].fields.choice3_Title,
                            data: data[0].fields.choice3
                        },
                        {
                            name: data[0].fields.choice4_Title,
                            data: data[0].fields.choice4
                        },
                        {
                            name: '투표안함',
                            data: data[0].fields.totalCount - data[0].fields.choice1 - data[0].fields.choice2 -
                                data[0].fields.choice3 - data[0].fields.choice4
                        }
                    ]

                    theme.series.colors = ['#F15F5F', '#E5D85C', '#86E57F', '#6799FF', '#BDBDBD']
                }

                tui.chart.registerTheme('myTheme', theme);


                var doughnutOption = {
                    chart: {
                        width: 400,
                        height: 250,
                        title: data[0].fields.className + '(' + data[0].fields.classCode + ') 시험 투표',
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

    $('#comment').remove();
    $('#voteConfirmBtn').remove();
    $('#correctBtn').remove();
    $('.classCode').remove();

    let comment = $('<div id="comment"><table id="comment_table"><thead><tr><th>댓글</th></tr></thead><tbody id="comment_tbody"></tbody></table></div>');
    $('#professor-vote-status').append(comment);

    // for (var count = 0; count < 10; count++) {
    //     var comment_tr = $('<tr><td>이종욱</td><td class="comment_td"><a href="javascript:void(0);" onclick="show_comment(\'투표 방식에 이의가 있어 글을 남깁니다. 다시 재투표 해주세요. 빠른 시일 내에 수정해주시길 바랍니다.\')">투표 방식에 이의가 있어 글을 남깁니다. 다시 재투표 해주세요. 빠른 시일 내에 수정해주시길 바랍니다.</a></td></tr>');
    //     $('#comment_tbody').append(comment_tr);
    // }

    // 댓글 데이터 가져와서 댓글 보여주는 부분
    ajaxPost('/toast_cal/bring_Comment/', 'json', 'POST', chartData).then(function(data) {
        if (data.length == 0) {
            var comment_tr = $(
                '<span class = "nothing-comment">-등록된 의견이 없습니다.-</span>'
            );
            $('#comment_tbody').append(comment_tr);
        }

        for (var count = 0; count < data.length; count++) {
            if (data[count].fields.comment != "") {
                var comment_tr = $(
                    '<tr><td>' + data[count].fields.studentID + '</td><td class="comment_td">' +
                    '<a href="javascript:void(0);" onclick="show_comment(\'' + data[count].fields.comment + '\')">' +
                    data[count].fields.comment + '</a></td></tr>');
            }
            $('#comment_tbody').append(comment_tr);
        }

    });

    var voteConfirmBtn = $('<button type="button" class="btn btn-outline-dark voteConfirmBtn" id="voteConfirmBtn">투표 확정</button>');
    var correct_btn = $('<button type="button" class="btn btn-outline-dark correctBtn" id="correctBtn">투표 수정</button>');
    var code = $('<a class="classCode" style="display: none;">' + td.eq(0).text() + '<a>');
    $('#professor-vote-status').append(voteConfirmBtn);
    $('#professor-vote-status').append(correct_btn);
    $('#professor-vote-status').append(code);


    // 투표 상태에 따라, 투표 마감인 경우만 투표 확정 버튼 누를 수 있도록 처리
    if (voteStat !== '투표 마감')
        document.getElementById('voteConfirmBtn').disabled = true;

    if (voteStat === '투표 마감')
        document.getElementById('voteConfirmBtn').disabled = false;


});

// 투표 확정 버튼
$(document).on('click', '#voteConfirmBtn', async function() {

    var confirmData = {
        code: confirmCode
    }

    let scheduleData;

    if (confirm("해당 투표를 확정하시겠습니까? 확정 후 되돌릴 수 없습니다!.") === true) {
        // 가장 많이 선택된 시간대를 받아옴
        await ajaxPost('/toast_cal/voteConfirm/', 'json', 'POST', confirmData)
            .then(function(data) {
                scheduleData = data;

            })
            .catch(function(err) {
                console.log(err);
            });

        // ajax로 보낼 일정 데이터에 필요한 변수 선언
        let subTitle;
        let startTime;
        let endTime;
        let splitData = scheduleData.split(','); // 강의코드, 강의 제목, 시간 데이터
        

        subTitle = splitData[1] + '(' + splitData[0] + ')' + ' 시험'; // 제목 문자열 포맷팅
        let timeData = splitData[2]; // 시간 데이터 저장
        let yymmdd = timeData.split(' ')[0]; // 년월일 데이터
        
        if (scheduleData.indexOf('~') === -1) { // 정규 시간 데이터일 시 (정규 데이터는 ~가 없음)
            

            let periodData = periodSplit(timeData.split(' ')[1])[1]; // 시간 데이터에서 교시 데이터만 빼냄 (월78 등등)
            periodData = timeConvert(periodData);

            startTime = yymmdd + ' ' + periodData[0];
            endTime = yymmdd + ' ' + periodData[1];


            console.log(examData);
        } else { // 오후 7시 이후 데이터일 시

            startTime = yymmdd + ' 19:00'
            endTime = yymmdd  + ' 20:15'

        }

        examData = newCalObj(1, '시험 일정', subTitle, 'milestone', '', startTime, endTime, 'False', 'busy', 'public')

        // 함수 테스트
        ajaxPost('/toast_cal/createExamData/', 'int', 'POST', examData)
            .then(function(data) {
                alert(data);
                window.location.reload();
            })
            .catch(function(err) {
                alert(err);
            });
    } else {
        return;
    }

})

$(document).on('click', '.voteDelete', function() {
    var deleteBtn = $(this);

    var tr = deleteBtn.parent().parent();
    var td = tr.children();

    var delete_Data = {
        code: td.eq(0).text()
    }
    // 표시!
    ajaxPost('/toast_cal/delete_Vote/', 'json', 'POST', delete_Data)
        .then(function(data) {
            // console.log(data)
            alert("투표가 삭제되었습니다.");

            if (chart !== null)
                $('#chart-area').empty();
            // chart.destroy();

            // if (comment_div !== null) {
            $('#comment').remove();
            $('#voteConfirmBtn').remove();
            $('#correctBtn').remove();
            $('.classCode').remove();
            // }

            voteData.lecture_type = voteClass.value;
            voteData.vote_status = voteStatus.value;

            // console.log(voteData);
            ajaxPost('/toast_cal/voteTable/', 'json', 'POST', voteData).then(function(data) {
                    $('#vote-info').empty();

                    for (var count = 0; count < data.length; count++) {
                        var tr = $('<tr><td>' + data[count].fields.classCode + '</td>' +
                            '<td>' + data[count].fields.lecType + '</td>' + '<td>' + data[count].fields.className + '</td>' +
                            '<td>' + data[count].fields.voteStatus + '</td>' + '<td><button type="button" class="btn btn-outline-dark voteBtn">상세</button> <button type="button" class="btn btn-outline-dark voteDelete">삭제</button></td>');
                        $('#vote-info').append(tr);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
        })
        .catch(function(err) {
            console.log(err);
        })
});

$(document).on('click', '.correctBtn', async function() {
    changeContents('professor-vote-update', 'professor-vote-open', 'professor-vote-status');

    var title1, title2, title3, title4 = "";

    class_data = {
        classCode: $('.classCode').text(),
    }

    if (chart !== null)
        $('#chart-area').empty();

    // if (comment_div !== null) {
    $('#comment').remove();
    $('#voteConfirmBtn').remove();
    $('#correctBtn').remove();
    $('.classCode').remove();
    // }


    await ajaxPost('/toast_cal/pro_vote_info/', 'json', 'POST', class_data)
        .then(function(data) {
            var vote_update_start = data[0].fields.start;
            var vote_update_end = data[0].fields.end;

            // 날짜출력
            var update_start = vote_update_start.substr(0, 10);
            var update_end = vote_update_end.substr(0, 10);

            //console.log(update_start + " ~ " +update_end)

            $('#vote-update-period').empty();

            var vote_period = $('<span>투표 기간 : </span>' +
                '<input type="date" id="vote-update-Start" value="' + update_start + '">' +
                '<span> ~ </span>' +
                '<input type="date" id="vote-update-End" value="' + update_end + '">');

            $('#vote-update-period').append(vote_period)

            title1 = data[0].fields.choice1_Title;
            title2 = data[0].fields.choice2_Title;
            title3 = data[0].fields.choice3_Title;
            title4 = data[0].fields.choice4_Title;
        })
        .catch(function(err) {
            console.log(err);
        });

    await ajaxPost('/toast_cal/subject_info/', 'json', 'POST', class_data)
        .then(function(data) {
            className = data[0].fields.name;
            lecType = data[0].fields.lecture_type;
        })
        .catch(function(err) {
            console.log(err);
        });

    ajaxPost('/toast_cal/pro_vote_update_table/', 'json', 'POST', class_data)
        .then(function(data) {
            $('#vote-update-tbody').empty();

            for (var count = 0; count < data.length; count++) {
                var status = data[count].fields.status;
                var timeStatus = "";

                if (status < 0.3) {
                    timeStatus = "선택불가";
                } else if (status < 0.5) {
                    timeStatus = "혼잡";
                } else {
                    timeStatus = "원활";
                }

                var tr = $('<tr scope="row" onclick="clickTrEvent(this,\'#vote-update-tbody\', false)"><td>' + lecType + '</td>' +
                    '<td>' + className + '</td>' +
                    '<td>' + timeStatus + '</td>' +
                    '<td>' + data[count].fields.avaTime + '</td></tr>');

                $('#vote-update-tbody').append(tr);

                tr = $('#vote-update-tbody').children();

                if (data[count].fields.avaTime == title1 || data[count].fields.avaTime == title2 ||
                    data[count].fields.avaTime == title3 || data[count].fields.avaTime == title4) {
                    tr[count].style.backgroundColor = '#b1b3b6';
                }
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

$('#vote-update-btn').click(function() {
    var tr = $('#vote-update-tbody').children();
    var td = tr.children();
    var array = [];

    for (var i = 0; i < tr.length; i++) {
        if (tr[i].style.backgroundColor === 'rgb(177, 179, 182)') { // #b1b3b6 선택된 tr 색 값이 안먹히는 것 같음...
            var obj = {};
            var td = tr[i].children;
            obj.lecType = td[0].innerText;
            obj.className = td[1].innerText;
            obj.status = td[2].innerText;
            obj.ava_Time = td[3].innerText;
            array.push(obj);
        }
    }

    if (array.length >= 2 && array.length <= 4) {
        if (confirm("투표를 수정하면 이전의 데이터가 삭제됩니다.\n정말 삭제하시겠습니까?") == true) {

            let today_data_vote = new Date();

            let get_year_vote = today_data_vote.getFullYear();
            let get_month_vote = today_data_vote.getMonth() + 1;
            let get_day_vote = today_data_vote.getDate();
            let get_hour_vote = today_data_vote.getHours();
            let get_min_vote = today_data_vote.getMinutes();
            let get_sec_vote = today_data_vote.getSeconds();
            let get_mil_vote = today_data_vote.getMilliseconds();

            if (get_month_vote < 10) get_month_vote = '0' + get_month_vote;
            if (get_day_vote < 10) get_day_vote = '0' + get_day_vote;

            let today_data_vote_status =
                get_year_vote + '-' + get_month_vote + '-' + get_day_vote + ' ' +
                get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;

            let start_data_vote_status = $('#vote-update-Start').val() + ' ' +
                // get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;
                '00:00:00.000000'

            let end_data_vote_status = $('#vote-update-End').val() + ' ' +
                // get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;
                '00:00:00.000000'

            class_data = {
                select_Array: array,
                lecType: td[0].innerText,
                className: td[1].innerText,
                start: start_data_vote_status,
                end: end_data_vote_status,
                today: today_data_vote_status,
            }

            ajaxPost('/toast_cal/update_Vote/', 'json', 'POST', class_data)
                .then(function(data) {
                    alert("투표가 수정되었습니다.");
                    $('#vote-status-tab-btn').trigger('click');
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            return;
        }
    } else if (array.length >= 5) {
        alert('4개까지 선택 가능합니다.');
    } else if (array.length <= 1) {
        alert('2개 이상 선택해야 합니다.');
    }
});

// 투표상태 갱신을 위함.
window.addEventListener('load', function() {
    let today_data_vote = new Date();

    let get_year_vote = today_data_vote.getFullYear();
    let get_month_vote = today_data_vote.getMonth() + 1;
    let get_day_vote = today_data_vote.getDate();
    let get_hour_vote = today_data_vote.getHours();
    let get_min_vote = today_data_vote.getMinutes();
    let get_sec_vote = today_data_vote.getSeconds();
    let get_mil_vote = today_data_vote.getMilliseconds();

    if (get_month_vote < 10) get_month_vote = '0' + get_month_vote;
    if (get_day_vote < 10) get_day_vote = '0' + get_day_vote;

    let today_data_vote_status =
        get_year_vote + '-' + get_month_vote + '-' + get_day_vote + ' ' +
        get_hour_vote + ':' + get_min_vote + ':' + get_sec_vote + '.' + get_mil_vote;

    test_data = {
        today: today_data_vote_status,
    }

    // 투표테이블 정보를 가져옴
    ajaxPost('/toast_cal/renewal_vote_status/', 'json', 'POST', test_data)
        .then(function(data) {
            // console.log(data);
        })
        .catch(function(err) {
            console.log(err);
        });
});

// 투표 관리의 과목을 변경했을 때 테이블데이터를 지워줌
$('#class_select').on('change', function() {
    $('#vote-open-tbody').empty();
});

// 투표가능날짜확인 버튼(pubCalendar에 있는 일정들 활용하여 투표가능 시간대를 Ava_Time으로 불러오는 기능)
$(document).on('click', '#portal_to_making_vote', async function() {
    changeContents('professor2', 'professor3', 'calendar-common', 'sidebar', 'professor1', 'pubcal_vote_info');
    changeContents('tab_box');
    changeContents('professor-vote-open', 'professor-vote-status');

    var voteCode = document.getElementById('pubcal_select').value;
    var voteStart = document.getElementById('pubStart').value;
    var voteEnd = document.getElementById('pubEnd').value;

    let voteCodeData = document.getElementById('pubcal_select').value;
    voteCode = getSubCode(voteCode);

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
                let newDate = getVoteDate(data);

                date_status_json = {
                    newDate
                }

            } else { // 공용캘린더 DB에 데이터가 없을 때
                flag = false;

                var dateValue = getThisWeek();
                var todayValue = new Date()

                ty = todayValue.getFullYear();
                tm = todayValue.getMonth() + 1;
                td = todayValue.getDate();

                td_end = td + 14;

                if (td < 10) {
                    td = "0" + td;
                }

                tv_start = ty + "-" + tm + "-" + td;
                tv_end = ty + "-" + tm + "-" + td_end;

                document.getElementById('start').value = dateValue[0];
                document.getElementById('end').value = dateValue[6];

                document.getElementById('voteStart').value = tv_start;
                document.getElementById('voteEnd').value = tv_end;

                alert(data);
            }
        })
        .catch(function(err) {
            alert(err);
        });

    await ajaxPost('/toast_cal/pro_lecture/', 'json', 'POST', 1)
        .then(function(data) {
            $('#class_select').empty(); //기존 옵션 값 삭제

            for (var count = 0; count < data.length; count++) {
                var option = $('<option>' + data[count].fields.name + ' (' + data[count].fields.code + ')</option>');
                $('#class_select').append(option);
            }
            $("#class_select").val(voteCodeData);
        })
        .catch(function(err) {
            alert(err);
        });

    // console.log("종합 데이터", date_status_json);
    if (flag === true) {
        printVoteOpenTbody(voteCode, voteStart, voteEnd, date_status_json)
    }
});