var date = new Date();

var getYear = date.getFullYear();
var getMonth = date.getMonth() + 1;
var getDay = date.getDate();


if (getMonth < 10) getMonth = "0" + getMonth;
if (getDay < 10) getDay = "0" + getDay;

var getToday = getYear + "-" + getMonth + "-" + getDay;

var todayData = {
    todayData: getToday
};


ajaxPost("/toast_cal/dateList/", 'json', 'POST', todayData)
    .then(function(data) {
        // console.log(data);

        for (i = 0; i < data.length; i++) {

            var start = data[i].fields.start
            var end = data[i].fields.end

            // substr함수 사용(start,end테이블 index 자르기)
            var startTime = start.substr(11, 5);
            var endTime = end.substr(11, 5);

            var task = $("<div class='first_tab_area'><div id='today_list_argu'><span class='sub'>" +
                data[i].fields.calendarId + " | </span><span class='con'> " +
                data[i].fields.title + " | </span><span class='start'>" + startTime +
                "</span>~<span class='end'>" + endTime + "</span></div></div>")

            $("#first_tab").append(task)
        }
    })
    .catch(function(err) {
        alert(err);
    });