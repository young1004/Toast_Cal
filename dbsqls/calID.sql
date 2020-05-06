use caldb;

delete from calid where id="전공 필수";
delete from calid where id="전공 선택";
delete from calid where id="일반 교양";

INSERT INTO calid
VALUES("전공 필수", "전공 필수", "#ffffff", "#ff5583", "#ff5583", "#ff5583");

INSERT INTO calid
VALUES("전공 선택", "전공 선택", "#ffffff", "#ffbb3b", "#ffbb3b", "#ffbb3b");

INSERT INTO calid
VALUES("일반 교양", "일반 교양", "#ffffff", "#03bd9e", "#03bd9e", "#03bd9e");