// 추가/ 변경
// if (comment_div !== null) {
    // comment_div = null;
    $('#comment').remove();
    $('#revoteBtn').remove();
    $('#correctBtn').remove();
    $('.classCode').remove();

    var voteBtn = $(this);

    var tr = voteBtn.parent().parent();
    var td = tr.children();

    // var array = [];

    var chartData = {
        code: td.eq(0).text()
    }

    comment_div = 1;
    let comment = $('<div id="comment"><table id="comment_table"><thead><tr><th>댓글</th></tr></thead><tbody id="comment_tbody"></tbody></table></div>');
    $('#professor-vote-status').append(comment);

    console.log(chartData); // 강의코드 넘어옴
    // 차트 함수 위의 chartData 의 강의코드를 가져와서 CRUD로 넘김.
    ajaxPost('/toast_cal/bring_Comment/', 'json', 'POST', chartData).then(function (data) {
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

    })

    var revote_btn = $('<button type="button" class="btn btn-outline-dark revoteBtn" id="revoteBtn">투표 재개설</button>');
    var correct_btn = $('<button type="button" class="btn btn-outline-dark correctBtn" id="correctBtn">투표 수정</button>');
    var code = $('<a class="classCode" style="display: none;">' + td.eq(0).text() + '<a>');
    $('#professor-vote-status').append(revote_btn);
    $('#professor-vote-status').append(correct_btn);
    $('#professor-vote-status').append(code);
// } else {
//     comment_div = 1;
    let comment = $('<div id="comment"><table id="comment_table"><thead><tr><th>댓글</th></tr></thead><tbody id="comment_tbody"></tbody></table></div>');
    $('#professor-vote-status').append(comment);

    var voteBtn = $(this);

    var tr = voteBtn.parent().parent();
    var td = tr.children();

    var chartData = {
        code: td.eq(0).text()
    }

    ajaxPost('/toast_cal/bring_Comment/', 'json', 'POST', chartData).then(function (data) {

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
    })
    var revote_btn = $('<button type="button" class="btn btn-outline-dark revoteBtn" id="revoteBtn">투표 재개설</button>');
    var correct_btn = $('<button type="button" class="btn btn-outline-dark correctBtn" id="correctBtn">투표 수정</button>');
    var code = $('<a class="classCode" style="display: none;">' + td.eq(0).text() + '<a>');
    $('#professor-vote-status').append(revote_btn);
    $('#professor-vote-status').append(correct_btn);
    $('#professor-vote-status').append(code);
// }