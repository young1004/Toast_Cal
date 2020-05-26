use caldb;

-- ※실행시 테이블의 모든 데이터가 지워짐! -- 
truncate calendar;

-- 테스트할 날짜에 따라서 변경하여 데이터 사용! --
INSERT INTO calendar VALUES(1, "sung", "일반 교양", "동아시아의 평화", "time", "18013", "2020-05-18 09:30:00.000000", "2020-05-18 10:30:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(2, "sung", "일반 교양", "미디어와 사회", "time", "18013", "2020-05-18 10:45:00.000000", "2020-05-18 11:45:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(3, "sung", "일반 교양", "언어와 문화", "time", "18013", "2020-05-18 12:00:00.000000", "2020-05-18 13:00:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(4, "sung", "전공 필수", "빅데이터", "time", "18013", "2020-05-18 13:10:00.000000", "2020-05-18 14:10:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(5, "sung", "전공 필수", "알고리즘", "time", "18013", "2020-05-18 14:20:00.000000", "2020-05-18 15:20:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(6, "sung", "일반 교양", "1인 미디어", "time", "18013", "2020-05-18 15:30:00.000000", "2020-05-18 16:30:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(7, "sung", "전공 필수", "캡스톤 디자인1", "time", "18013", "2020-05-18 16:40:00.000000", "2020-05-18 17:40:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(8, "sung", "일반 교양", "우주의 한마음", "time", "18013", "2020-05-18 17:50:00.000000", "2020-05-18 18:50:00.000000", 0, "Busy", "public");

INSERT INTO calendar VALUES(9, "young", "일반 교양", "동아시아의 평화", "time", "18013", "2020-05-18 09:30:00.000000", "2020-05-18 10:30:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(10, "young", "일반 교양", "미디어와 사회", "time", "18013", "2020-05-18 10:45:00.000000", "2020-05-18 11:45:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(11, "young", "일반 교양", "언어와 문화", "time", "18013", "2020-05-18 12:00:00.000000", "2020-05-18 13:00:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(12, "young", "전공 필수", "빅데이터", "time", "18013", "2020-05-18 13:10:00.000000", "2020-05-18 14:10:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(13, "young", "전공 필수", "알고리즘", "time", "18013", "2020-05-18 14:20:00.000000", "2020-05-18 15:20:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(14, "young", "일반 교양", "1인 미디어", "time", "18013", "2020-05-18 15:30:00.000000", "2020-05-18 16:30:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(15, "young", "전공 필수", "캡스톤 디자인1", "time", "18013", "2020-05-18 16:40:00.000000", "2020-05-18 17:40:00.000000", 0, "Busy", "public");
INSERT INTO calendar VALUES(16, "young", "일반 교양", "우주의 한마음", "time", "18013", "2020-05-18 17:50:00.000000", "2020-05-18 18:50:00.000000", 0, "Busy", "public");