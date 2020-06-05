use caldb;

-- 실행 후 schedule.sql 파일 실행할 것!--
-- truncate calendar;
-- ※실행시 테이블의 모든 데이터가 지워짐! -- 
-- delete from pubcalid where id="전공 필수";
-- delete from pubcalid where id="전공 선택";
-- delete from pubcalid where id="일반 교양";
truncate pubcalid;

INSERT INTO pubcalid
VALUES("매우 높음", "매우 높음", "#FF0000", "#FF0000", "#FF0000", "#FF0000");

INSERT INTO pubcalid
VALUES("높음", "높음", "#FFE400", "#FFE400", "#FFE400", "#FFE400");

INSERT INTO pubcalid
VALUES("낮음", "낮음", "#BDBDBD", "#BDBDBD", "#BDBDBD", "#BDBDBD");