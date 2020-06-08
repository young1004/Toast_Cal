use caldb;

-- ※실행시 테이블의 모든 데이터가 지워짐! -- 
truncate professor;

INSERT INTO professor
VALUES("sung", "컴퓨터공학부", "최석준", "test111@test.com", "pbkdf2_sha256$180000$riS9yMTbwjJp$FOalF8nsvA689zN3r68498w/xa51zX/TnRR/G5N/3g8=", "010-0000-0010");
INSERT INTO professor
VALUES("jong", "컴퓨터공학부", "이종욱", "test112@test.com", "pbkdf2_sha256$180000$riS9yMTbwjJp$FOalF8nsvA689zN3r68498w/xa51zX/TnRR/G5N/3g8=", "010-0000-0020");
INSERT INTO professor
VALUES("chang", "컴퓨터공학부", "조창훈", "test113@test.com", "pbkdf2_sha256$180000$riS9yMTbwjJp$FOalF8nsvA689zN3r68498w/xa51zX/TnRR/G5N/3g8=", "010-0000-0030");