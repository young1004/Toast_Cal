use caldb;

/* Department DB 스키마 (학과 이름 데이터)
name : 학과이름 (pk) / subject, professor, student 테이블에서 참조
*/

truncate Department;

INSERT INTO Department(name)
VALUES("컴퓨터공학부");
INSERT INTO Department(name)
VALUES("정보통신학과");
INSERT INTO Department(name)
VALUES("경제학과");
INSERT INTO Department(name)
VALUES("영어영문학과");
INSERT INTO Department(name)
VALUES("국어국문학과");
INSERT INTO Department(name)
VALUES("일반교양");
INSERT INTO Department(name)
VALUES("중국어학과");
INSERT INTO Department(name)
VALUES("신학과");
