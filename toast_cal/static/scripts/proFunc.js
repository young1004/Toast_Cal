// 댓글 확대보기 관련 함수와 이벤트리스너
function show_comment(text) {
    if (document.getElementById('show_text')) {
        $('#show_text').remove();
    }
    var element = $('<div id="show_text"><div><p>' + text + '</p><button class="btn btn-outline-dark" id="close_comment">닫기</button></div></div>');
    $('#professor-vote-status').append(element);
}
// 닫기 버튼
$(document).on('click', '#close_comment', function() {
    $('#show_text').remove();
});

/**
 * HTML 표 tr요소의 값과 날짜를 비교하여 date 필드를 변경해주는 함수
 * @param {String} tr 날짜 데이터를 비교할 tr 요소 id (#id)
 * @param {String} id 날짜 데이터를 비교하여 바꿀 date 객체의 id
 */
function getClickTrData(tr, id) {
    let trdata = $(tr);
    
    if (tr.style.backgroundColor === 'rgb(177, 179, 182)') {
        td = trdata.children();

        let checkTime = (td.eq(3).text()).split(" ")[0]; // 새롭게 선택된 데이터
        let beforeTime = document.getElementById(id).value
        if (checkTime < beforeTime)
            document.getElementById(id).value = checkTime;
    }

}


// Ava_Time 테이블에 여유있는 시간 저장 후, 투표개설 탭에 출력
async function printVoteOpenTbody(voteCode, voteStart, voteEnd, date_status_json) {
    var select_data = {
        classCode: voteCode,
    }

    var className = "";
    var lecType = "";

    await ajaxPost('/toast_cal/subject_info/', 'json', 'POST', select_data)
        .then(function(data) {
            for (var count = 0; count < data.length; count++) {
                className = data[count].fields.name;
                lecType = data[count].fields.lecture_type;
            }
        })
        .catch(function(err) {
            console.log(err);
        });

    await ajaxPost('/toast_cal/voteTimeSave/', 'json', 'POST', date_status_json)
        .then(function(data) {
            document.getElementById('start').value = voteStart;
            document.getElementById('end').value = voteEnd;
            document.getElementById('voteStart').value = voteStart;
            document.getElementById('voteEnd').value = voteEnd;


            $('#vote-open-tbody').empty();

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
                // 11111
                var tr = $('<tr scope="row" onclick="javascript:clickTrEvent(this,\'#vote-open-tbody\', false); getClickTrData(this, \'voteEnd\');"><td>' + lecType + '</td>' +
                    '<td>' + className + '</td>' +
                    '<td>' + timeStatus + '</td>' +
                    '<td>' + data[count].fields.avaTime + '</td></tr>');

                $('#vote-open-tbody').append(tr);
            }
        })
        .catch(function(err) {
            alert(err);
        });
}

/**
 * select 태그 옵션이 '과목명 (학수번호)'인 경우 '학수번호'를 반환하는 함수
 * @param {String} str 학수번호를 반환받고 싶은 문자열
 * @returns {String} 입력한 데이터에 해당하는 학수번호
 */
function getSubCode(str) {
    let code;

    let idx = str.indexOf('(');

    code = str.substring(idx + 1, str.length - 1);

    return code;
}