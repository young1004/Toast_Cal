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