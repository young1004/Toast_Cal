from django.db import models

# 캘린더 분류에 대한 데이터가 저장될 데이터베이스 모델
class CalID(models.Model):
    id = models.CharField(max_length=30, primary_key=True)
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=30)
    bgColor = models.CharField(max_length=30)
    dragBgColor = models.CharField(max_length=30)
    borderColor = models.CharField(max_length=30)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "CalID"


# 일정 정보가 저장되는 데이터베이스 모델
class Calendar(models.Model):  # pk값이 별도로 지정됨
    userID = models.CharField(max_length=30, null=False)  # 유저 id의 session값
    calendarId = models.CharField(
        max_length=30, default="전공 필수"
    )  # calendar 분류(현재는 전필, 전선, 교양)
    title = models.CharField(max_length=30)
    category = models.CharField(max_length=30, default="time")
    # category : only "milestone", "task", "allday", "time"
    location = models.CharField(max_length=100, blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    isAllDay = models.BooleanField(default=False)
    state = models.CharField(max_length=20, default="Busy")
    # state : only "Busy", "Free"
    calendarClass = models.CharField(max_length=20, default="public")
    # class : only "public", "private"

    def __str__(self):
        return self.title

    class Meta:
        db_table = "Calendar"


# 학생 정보가 저장되는 데이터베이스 모델
class Student(models.Model):
    userID = models.CharField(max_length=30, primary_key=True)  # 학생의 아이디
    department = models.CharField(max_length=50)  # 학과
    studentID = models.CharField(max_length=30)  # 학번
    username = models.CharField(max_length=30)  # 유저의 이름
    email = models.CharField(max_length=50)  # 이메일
    password = models.CharField(max_length=128)  # 사용할 비밀번호
    phone = models.CharField(max_length=30)  # 휴대폰 번호

    def __str__(self):
        return self.username

    class Meta:
        db_table = "Student"


# 교수 정보가 저장되는 데이터베이스 모델
class Professor(models.Model):
    userID = models.CharField(max_length=30, primary_key=True)  # 유저가 사용할 아이디
    department = models.CharField(max_length=50)  # 학과
    username = models.CharField(max_length=30)  # 유저의 이름
    email = models.CharField(max_length=50)  # 이메일
    password = models.CharField(max_length=128)  # 사용할 비밀번호
    phone = models.CharField(max_length=30)  # 휴대폰 번호

    def __str__(self):
        return self.username

    class Meta:
        db_table = "Professor"


# 과목
class Subject(models.Model):
    name = models.CharField(max_length=30)  # 강의명
    code = models.CharField(max_length=20)  # 강의 코드
    codeClass = models.CharField(max_length=5, default="A")  # 분반
    professor = models.CharField(max_length=20)  # 담당교수
    period = models.CharField(max_length=20)  # 교시
    lecture_type = models.CharField(max_length=10)  # 이수구분
    department = models.CharField(max_length=20)  # 학과
    stdCount = models.IntegerField(default=0)  # 수강인원
    total_stdCount = models.IntegerField(default=0)  # 전체수강인원

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Subject"


# 학생 강의
class Student_lecture(models.Model):
    student_id = models.CharField(max_length=30)  # 학생ID
    name = models.CharField(max_length=30)  # 강의명
    code = models.CharField(max_length=20)  # 강의 코드
    codeClass = models.CharField(max_length=5, default="A")  # 분반
    professor = models.CharField(max_length=20)  # 담당교수
    period = models.CharField(max_length=20)  # 교시
    lecture_type = models.CharField(max_length=10)  # 이수구분
    department = models.CharField(max_length=20)  # 학과

    def __str__(self):
        return self.student_id

    class Meta:
        # unique_together = (("student_id", "code"),)
        db_table = "Student_lecture"


# 학과
class Department(models.Model):
    name = models.CharField(max_length=20, primary_key=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Department"


# 투표 테이블
class Vote(models.Model):
    classCode = models.CharField(max_length=30)  # 강의 코드
    lecType = models.CharField(max_length=30)  # 이수구분
    proName = models.CharField(max_length=30)  # 교수명
    className = models.CharField(max_length=30)  # 강의명
    voteStatus = models.CharField(max_length=30)  # 투표상태
    start = models.DateTimeField()  # 시작 시간
    end = models.DateTimeField()  # 끝 시간
    choice1 = models.IntegerField(default=0)  # 선택지1
    choice2 = models.IntegerField(default=0)  # 선택지2
    choice3 = models.IntegerField(default=0)  # 선택지3
    choice4 = models.IntegerField(default=0)  # 선택지4
    choice1_Title = models.CharField(max_length=30, default="False")  # 선택지1 내용
    choice2_Title = models.CharField(max_length=30, default="False")  # 선택지2 내용
    choice3_Title = models.CharField(max_length=30, default="False")  # 선택지3 내용
    choice4_Title = models.CharField(max_length=30, default="False")  # 선택지4 내용
    totalCount = models.IntegerField()  # 전체 인원수

    class Meta:
        db_table = "Vote"


# 투표 테이블 하위 테이블
class VoteInfo(models.Model):
    voteId = models.IntegerField()  # 투표 테이블의 Id 참조할 레이블
    studentID = models.CharField(max_length=30)  # 참여자 id
    comment = models.TextField(blank=True, null=True)  # 참여자의 댓글

    class Meta:
        db_table = "VoteInfo"


# 공용 캘린더 분류에 대한 데이터가 저장될 데이터베이스 모델
class PubCalID(models.Model):
    id = models.CharField(max_length=30, primary_key=True)
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=30)
    bgColor = models.CharField(max_length=30)
    dragBgColor = models.CharField(max_length=30)
    borderColor = models.CharField(max_length=30)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "PubCalID"


# 공용 일정 정보가 저장되는 데이터베이스 모델
class PubCalendar(models.Model):  # pk값이 별도로 지정됨
    code = models.CharField(max_length=30)  # 해당 강의 코드가 입력됨
    calendarId = models.CharField(
        max_length=30, default="낮음"
    )  # calendar 분류(시간대에 안되는 비율 : 매우높음, 높음, 낮음)
    title = models.CharField(max_length=30)  # count + 명이 이 시간에 일정이 있습니다.
    start = models.DateTimeField()
    end = models.DateTimeField()
    count = models.IntegerField()  # 일정이 겹치는 수
    countPer = models.FloatField()  # 전체 수강생에서 일정이 겹치는 수의 비율
    attendees = models.TextField(blank=True)  # 해당 시간에 일정이 있는 학생들의 이름

    def __str__(self):
        return self.title

    class Meta:
        db_table = "PubCalendar"


# 공유캘린더에서 임시로 여유일정 저장해둘 테이블
class Ava_Time(models.Model):
    classCode = models.CharField(max_length=30)  # 강의 코드
    status = models.FloatField()  # 일정의 사용빈도
    avaTime = models.CharField(max_length=30)  # 시간

    class Meta:
        db_table = "Ava_Time"

