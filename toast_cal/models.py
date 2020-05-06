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
    calendarId = models.ForeignKey(
        CalID, on_delete=models.PROTECT, default="전공 필수"
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
