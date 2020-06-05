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

                // 캘린더id에 따른 색상부여를 위해 넘버 지정
                var calendaridColor = 0;

                if (data[i].fields.calendarId === "전공 필수") {
                    calendaridColor = 0;
                } else if (data[i].fields.calendarId === "전공 선택") {
                    calendaridColor = 1;
                } else {
                    calendaridColor = 2;
                }

                var start = data[i].fields.start;
                var end = data[i].fields.end;

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
                    "<div class ='today_list_argu'>" +
                    "<span class='sub" + calendaridColor + "'>" +
                    " ● </span>" +
                    "<span class='con'>" +
                    data[i].fields.title +
                    "</span>" +
                    "<span class='dayStringToday'>" +
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


            var Daytmp = "";
            for (i = 0; i < data.length; i++) {

                // 캘린더id에 따른 색상부여하기
                var calendaridColor = 0;

                if (data[i].fields.calendarId === "전공 필수") {
                    calendaridColor = 0;
                } else if (data[i].fields.calendarId === "전공 선택") {
                    calendaridColor = 1;
                } else {
                    calendaridColor = 2;
                }

                var start = data[i].fields.start;
                var end = data[i].fields.end;

                // substr함수 사용(start,end테이블 index 자르기)
                // 시간 출력
                var startTime = start.substr(11, 5);
                var endTime = end.substr(11, 5);

                //날짜 출력
                var startMonth = start.substr(5, 2); //시작 월
                var startDay = start.substr(8, 2); //시작 일
                var endMonth = end.substr(5, 2); // 끝 월
                var endDay = end.substr(8, 2); // 끝 일

                // var startData = startMonth + "월" + startDay + "일";
                // var endData = endMonth + "월" + endDay + "일";

                // 월일 출력문
                if (startMonth != endMonth || startDay != endDay) {
                    var longStringDay = startMonth + "월" + startDay + "일 ~ " + endMonth + "월" + endDay + "일";
                } else {
                    var longStringDay = startMonth + "월" + startDay + "일";
                }

                var startTimeClass = startTime + " ~ " + endTime

                var task = $("<div class='second_tab_area'>" +
                    "<div class='thisweek_list_argu'>" +
                    "<div class='dayString'>" +
                    longStringDay +
                    "</div>" +
                    "<span class='sub" + calendaridColor + "'>" +
                    " ● </span>" +
                    "<span class='con'> " +
                    data[i].fields.title +
                    "</span>" +
                    "<span class='startTime'>" +
                    startTimeClass +
                    "</span>" +
                    "</div>" +
                    "</div>")
                $("#second_tab").append(task)

                if (i == 0 || Daytmp != longStringDay) {
                    Daytmp = longStringDay;
                } else {
                    $(".dayString")[i].style.display = "none";
                }
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



            var Daytmp = "";

            for (i = 0; i < data.length; i++) {

                // 캘린더id에 따른 색상부여를 위해 넘버 지정
                var calendaridColor = 0;

                if (data[i].fields.calendarId === "전공 필수") {
                    calendaridColor = 0;
                } else if (data[i].fields.calendarId === "전공 선택") {
                    calendaridColor = 1;
                } else {
                    calendaridColor = 2;
                }

                var start = data[i].fields.start
                var end = data[i].fields.end

                // substr함수 사용(start,end테이블 index 자르기)
                // 시간 출력
                var startTime = start.substr(11, 5);
                var endTime = end.substr(11, 5);

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

                var startTimeClass = startTime + " ~ " + endTime;

                var task = $("<div class='third_tab_area'>" +
                    "<div class = 'lastweek_list_argu'>" +
                    "<div class = 'dayString'>" +
                    longStringDay +
                    "</div>" +
                    "<span class='sub" + calendaridColor + "'>" +
                    " ● </span>" +
                    "<span class='con'> " +
                    data[i].fields.title +
                    "</span>" +
                    "<span class='startTime'>" +
                    startTimeClass +
                    "</span>" +
                    "</div>" +
                    "</div>")
                $("#third_tab").append(task)

                if (i == 0 || Daytmp != longStringDay) {
                    Daytmp = longStringDay;
                } else {
                    $(".dayString")[i].style.display = "none";
                }

            }

            console.log("StartDate: " + getDate(0, -7));
            console.log("EndDate: " + getDate(1, -7));
        })
        .catch(function(err) {
            alert(err);
        });
});



// 일자에 따라 주간일정 묶음표시