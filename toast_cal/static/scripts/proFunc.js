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


// Ava_Time 테이블에 여유있는 시간 저장 후, 투표개설 탭에 출력
async function printVoteOpenTbody(voteCode, voteStart, voteEnd, date_status_json) {
    var select_data = {
        classCode: voteCode,
    }

    var className = "";
    var lecType = "";

    await ajaxPost('/toast_cal/subject_info/', 'json', 'POST', select_data)
        .then(function (data) {
            for (var count = 0; count < data.length; count++) {
                className = data[count].fields.name;
                lecType = data[count].fields.lecture_type;
            }
        })
        .catch(function (err) {
            console.log(err);
        });

    await ajaxPost('/toast_cal/voteTimeSave/', 'json', 'POST', date_status_json)
        .then(function (data) {
            document.getElementById('start').value = voteStart;
            document.getElementById('end').value = voteEnd;

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

                var tr = $('<tr scope="row" onclick="clickTrEvent(this,\'#vote-open-tbody\', false)"><td>' + lecType + '</td>' +
                    '<td>' + className + '</td>' +
                    '<td>' + timeStatus + '</td>' +
                    '<td>' + data[count].fields.avaTime + '</td></tr>');

                $('#vote-open-tbody').append(tr);
            }
        })
        .catch(function (err) {
            alert(err);
        });
}