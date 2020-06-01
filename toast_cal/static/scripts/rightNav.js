var get_date = new Date();

var get_year = get_date.getFullYear();
var get_month = get_date.getMonth() + 1;
var get_day = get_date.getDate();


if (get_month < 10) get_month = "0" + get_month;
if (get_day < 10) get_day = "0" + get_day;

var today = get_year + "-" + get_month + "-" + get_day;
var todayData = {
    todayData: today
};

var NowRange = {
    StartDate: getDate(0, 1),
    EndDate: getDate(1, 2)
};

var PreviousRange = {
    StartDate: getDate(0, -6),
    EndDate: getDate(1, -5)
};

var thisWeek = document.getElementById("thisweek");
var lastWeek = document.getElementById("lastweek");

function loadToday() {
    $("#first_tab").empty();
    document.querySelector('#first_tab').style.display = 'block';
    $("#second_tab").empty();
    document.querySelector('#second_tab').style.display = 'none';
    $("#third_tab").empty();
    document.querySelector('#third_tab').style.display = 'none';

    ajaxPost("/toast_cal/dateList/", 'json', 'POST', todayData)
        .then(function(data) {

            for (i = 0; i < data.length; i++) {

                var start = data[i].fields.start
                var end = data[i].fields.end

                // substr함수 사용(start,end테이블 index 자르기)
                // 시간출력
                var startTime = start.substr(11, 5);
                var endTime = end.substr(11, 5);

                // 날짜출력
                var startMonth = start.substr(5, 2); //시작 월
                var startDay = start.substr(8, 2); //시작 일
                var endMonth = end.substr(5, 2); // 끝 월
                var endDay = end.substr(8, 2); // 끝 일


                var longStringDay = startTime + " ~ " + endTime;

                var task = $("<div class='first_tab_area'>" +
                    "<div id='today_list_argu'>" +
                    "<span class='sub'>" +
                    data[i].fields.calendarId +
                    " | </span>" +
                    "<span class='con'> " +
                    data[i].fields.title +
                    " | </span>" +
                    "<span class='dayString'>" +
                    longStringDay +
                    "</span>" +
                    "</div>" +
                    "</div>")
                $("#first_tab").append(task)
            }
        })
        .catch(function(err) {
            alert(err);
        });
};

loadToday();

$(document).on('click', '#today', function() {
    loadToday();
})

thisWeek.addEventListener('click', function(event) {
    ajaxPost("/toast_cal/getWeekSchedule/", 'json', 'POST', NowRange)
        .then(function(data) {
            $("#first_tab").empty();
            document.querySelector('#first_tab').style.display = 'none';
            $("#second_tab").empty();
            document.querySelector('#second_tab').style.display = 'block';
            $("#third_tab").empty();
            document.querySelector('#third_tab').style.display = 'none';


            for (i = 0; i < data.length; i++) {

                var start = data[i].fields.start
                var end = data[i].fields.end

                // substr함수 사용(start,end테이블 index 자르기)
                // 시간 출력
                // var startTime = start.substr(11, 5);
                // var endTime = end.substr(11, 5);
                //날짜 출력
                var startMonth = start.substr(5, 2); //시작 월
                var startDay = start.substr(8, 2); //시작 일
                var endMonth = end.substr(5, 2); // 끝 월
                var endDay = end.substr(8, 2); // 끝 일

                // var startData = startMonth + "월" + startDay + "일";
                // var endData = endMonth + "월" + endDay + "일";

                if (startMonth != endMonth || startDay != endDay) {
                    var longStringDay = startMonth + "월" + startDay + "일 ~ " + endMonth + "월" + endDay + "일";
                } else {
                    var longStringDay = startMonth + "월" + startDay + "일";
                }

                var task = $("<div class='second_tab_area'>" +
                    "<div id='thisweek_list_argu'>" +
                    "<span class=''>" +
                    "<span class='sub'>" +
                    data[i].fields.calendarId +
                    " | </span>" +
                    "<span class='con'> " +
                    data[i].fields.title +
                    " | </span>" +
                    "<span class='dayString'>" +
                    longStringDay +
                    "</span>" +
                    "</div>" +
                    "</div>")
                $("#second_tab").append(task)
            }
        })
        .catch(function(err) {
            alert(err);
        });
});

lastWeek.addEventListener('click', function(event) {
    ajaxPost("/toast_cal/getWeekSchedule/", 'json', 'POST', PreviousRange)
        .then(function(data) {
            $("#first_tab").empty();
            document.querySelector('#first_tab').style.display = 'none';
            $("#second_tab").empty();
            document.querySelector('#second_tab').style.display = 'none';
            $("#third_tab").empty();
            document.querySelector('#third_tab').style.display = 'block';

            for (i = 0; i < data.length; i++) {

                var start = data[i].fields.start
                var end = data[i].fields.end

                // substr함수 사용(start,end테이블 index 자르기)
                // 시간 출력
                // var startTime = start.substr(11, 5);
                // var endTime = end.substr(11, 5);

                //날짜 출력
                var startMonth = start.substr(5, 2); //시작 월
                var startDay = start.substr(8, 2); //시작 일
                var endMonth = end.substr(5, 2); // 끝 월
                var endDay = end.substr(8, 2); // 끝 일

                // var startData = startMonth + "월" + startDay + "일";
                // var endData = endMonth + "월" + endDay + "일";

                if (startMonth != endMonth || startDay != endDay) {
                    var longStringDay = startMonth + "월" + startDay + "일 ~ " + endMonth + "월" + endDay + "일";
                } else {
                    var longStringDay = startMonth + "월" + startDay + "일";
                }
                var task = $("<div class='second_tab_area'>" +
                    "<div id='thisweek_list_argu'>" +
                    "<span class='sub'>" +
                    data[i].fields.calendarId +
                    " | </span>" +
                    "<span class='con'> " +
                    data[i].fields.title +
                    " | </span>" +
                    "<span class='dayString'>" +
                    longStringDay +
                    "</span>" +
                    "</div>" +
                    "</div>")
                $("#third_tab").append(task)
            }

            console.log("StartDate: " + getDate(0, -7));
            console.log("EndDate: " + getDate(1, -7));
        })
        .catch(function(err) {
            alert(err);
        });
});