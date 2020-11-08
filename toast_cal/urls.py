from django.urls import path

from toast_cal import views, crud

app_name = "toast_cal"

urlpatterns = [
    path("", views.calendar, name="calendar"),  # 로그인시 메인 화면
    # 캘린더 기능들
    path("ourstores/", crud.ourstores, name="ourstores"),
    path("calSetData/", crud.calSetData, name="calSetData"),
    path("create/", crud.createData, name="createData"),
    path("update/", crud.updateData, name="updateData"),
    path("delete/", crud.deleteData, name="deleteData"),
    # 우측 네비게이션
    path("dateList/", crud.dateList, name="dateList"),
    path("getWeekSchedule/", crud.getWeekSchedule, name="getWeekSchedule"),
    # 학생 기능들
    path("checked/", crud.checked, name="checked"),
    path("department/", crud.department, name="department"),  # 강의 버튼클릭시 학과 가져옴
    path("subject/", crud.subject, name="subject"),  # 학과 선택시 해당 과목 가져옴
    path("chanege_type/", crud.chanege_type, name="chanege_type"),  # 과목선택시 해당 이수구분 가져옴
    path("lecture_lookup/", crud.lecture_lookup, name="lecture_lookup"),  # 조회
    path("lecture_save/", crud.lecture_save, name="lecture_save"),  # 강의 저장
    path(
        "student_lecture_load/", crud.student_lecture_load, name="student_lecture_load"
    ),  # 학생 강의 불러오기
    path(
        "student_lecture_delete/",
        crud.student_lecture_delete,
        name="student_lecture_delete",
    ),  # 학생 강의 삭제
    path(
        "stdVoteJoinTable/", crud.stdVoteJoinTable, name="stdVoteJoinTable"
    ),  # 학생 투표 참여 데이터 불러오기
    path("joinCheck/", crud.joinCheck, name="joinCheck"),
    path(
        "stdVoteSelectData/", crud.stdVoteSelectData, name="stdVoteSelectData"
    ),  # 학생 투표 참여 페이지 상세내용 불러오기
    path(
        "takeVoteSave/", crud.takeVoteSave, name="takeVoteSave"
    ),  # 학생 투표 시간 선택 시 데이터베이스에 저장
    path("student_voteTable/", crud.student_voteTable, name="student_voteTable"),
    # vote 테이블의 아무값이나 받은 테스트 데이터
    path("voteSelectTest/", crud.voteSelectTest, name="voteSelectTest/"),
    path("getAllStudent/", crud.getAllStudent, name="getAllStudent/"),
    path("getLectureInfo/", crud.getLectureInfo, name="getLectureInfo"),  # 학생 투표 강의 정보
    # 교수 기능들
    path("voteTable/", crud.voteTable, name="voteTable"),
    path("voteChart/", crud.voteChart, name="voteChart"),
    path("makeSubject/", crud.makeSubject, name="makeSubject"),
    path(
        "pro_lecture_table/", crud.pro_lecture_table, name="pro_lecture_table"
    ),  # 교수 강의 테이블 출력
    path(
        "professor_lecture_delete/",
        crud.professor_lecture_delete,
        name="professor_lecture_delete",
    ),  # 교수 강의 삭제
    path(
        "pro_vote_update_table/",
        crud.pro_vote_update_table,
        name="pro_vote_update_table",
    ),
    path("lec_Check/", crud.lec_Check, name="lec_Check"),
    path("pro_vote_info/", crud.pro_vote_info, name="pro_vote_info"),
    # 교수 투표 관련
    path("subject_info/", crud.subject_info, name="subject_info"),
    path("create_Vote/", crud.create_Vote, name="create_Vote"),
    path("delete_Vote/", crud.delete_Vote, name="delete_Vote"),
    path("update_Vote/", crud.update_Vote, name="update_Vote"),
    path("check_Vote/", crud.check_Vote, name="check_Vote"),
    path("manageInfo/", views.manageInfo, name="manageInfo"),
    path("loginInfo/", views.loginInfo, name="loginInfo"),
    path("modifyInfo/", views.modifyInfo, name="modifyInfo"),
    path("getVoteInfo/", crud.getVoteInfo, name="getVoteInfo"),
    path("voteConfirm/", crud.voteConfirm, name="voteConfirm"),
    path("createExamData/", crud.createExamData, name="createExamData"),
    # 공통 기능들
    path("deleteCalendars/", crud.deleteCalendars, name="deleteCalendars"),
    path("makeCalendars/", crud.makeCalendars, name="makeCalendars"),
    path("signout/", views.signout, name="signout"),
    path("pubCalSave/", crud.pubCalSave, name="pubCalSave"),
    path("check_user_subject/", crud.check_user_subject, name="check_user_subject"),
    # 공용 캘린더 부분들
    path("pubCalSetData/", crud.pubCalSetData, name="pubCalSetData"),
    path("pro_lecture/", crud.pro_lecture, name="pro_lecture"),
    path("pubCalSave/", crud.pubCalSave, name="pubCalSave"),
    path("pubCalLoad/", crud.pubCalLoad, name="pubCalLoad"),
    path("voteTimeLoad/", crud.voteTimeLoad, name="voteTimeLoad"),  # 투표 가능 시간대 불러오기
    path("voteTimeSave/", crud.voteTimeSave, name="voteTimeSave"),  # 투표 가능 시간대 저장
    # [2020-11-07 06:21] 새 기능
    path(
        "renewal_vote_status/", crud.renewal_vote_status, name="renewal_vote_status"
    ),  # 투표 상태 갱신
]
