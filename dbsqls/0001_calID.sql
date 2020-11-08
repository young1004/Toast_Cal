use caldb;

-- ※실행시 테이블의 모든 데이터가 지워짐!

/* calID DB 스키마 (toast 캘린더에 필요한 일정 분류 데이터)
id : calendar에 필요한 캘린더 ID (pk) / ※ subject, calendar, vote 테이블에서 참조
name : calendar의 분류 표시(달력에 표시되는 문자열)
color : 캘린더에 표시될 텍스트 색상
bgColor : 캘린더에 표시될 배경 색상
dragBgColor : 캘린더에 표시된 데이터를 드래그할때 변경되는 배경 색상
borderColor : 캘린더에 표시될 데이터의 테두리 색상
*/

/* 추후 수정 필요한 sql script들
truncate calendar;
delete from calid where id="전공 필수";
delete from calid where id="전공 선택";
delete from calid where id="일반 교양";
*/
truncate calid;

INSERT INTO calid
VALUES("전공 필수", "전공 필수", "#ffffff", "#ff5583", "#ff5583", "#ff5583");

INSERT INTO calid
VALUES("전공 선택", "전공 선택", "#ffffff", "#ffbb3b", "#ffbb3b", "#ffbb3b");

INSERT INTO calid
VALUES("일반 교양", "일반 교양", "#ffffff", "#03bd9e", "#03bd9e", "#03bd9e");

INSERT INTO calid
VALUES("시험 일정", "시험 일정", "#ffffff", "#ff0000", "#ff0000", "#ff0000");

