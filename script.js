const calendarGrid = document.getElementById("calendar-grid");
const currentMonth = document.getElementById("current-month");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

const noteText = document.getElementById("note-text");
const saveNoteButton = document.getElementById("save-note");

let date = new Date();

// 요일 배열 (한국어)
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

// 로컬스토리지에서 저장된 메모 가져오기
const getStoredNotes = () => JSON.parse(localStorage.getItem("notes")) || {};

// 로컬스토리지에 메모 저장하기
const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

// 선택된 날짜 키
let selectedDateKey = null;

// 저장 완료 메시지 표시 함수
function showSaveMessage() {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = "저장되었습니다!";
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "20px";
  messageDiv.style.left = "50%";
  messageDiv.style.transform = "translateX(-50%)";
  messageDiv.style.backgroundColor = "#62ab66";
  messageDiv.style.color = "white";
  messageDiv.style.padding = "10px 20px";
  messageDiv.style.borderRadius = "5px";
  messageDiv.style.fontSize = "16px";
  messageDiv.style.zIndex = "1000";
  document.body.appendChild(messageDiv);

  // 2초 후 메시지 사라지기
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 2000);
}

// 메모 저장 함수
function saveNote() {
  const storedNotes = getStoredNotes();
  const noteContent = noteText.value.trim();

  // 메모가 비어있지 않으면 저장, 비어있으면 해당 날짜의 메모를 삭제
  if (noteContent) {
    storedNotes[selectedDateKey] = noteContent;
  } else {
    delete storedNotes[selectedDateKey];
  }

  saveNotes(storedNotes);
  
  // 저장됨을 알리는 메시지 표시
  showSaveMessage();
  
  // 메모가 저장된 후, 달력을 새로 렌더링하여 즉시 반영
  renderCalendar();
}

// 날짜를 클릭했을 때 선택 상태 유지
function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();

  // 헤더 업데이트
  currentMonth.textContent = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  // 달력 그리드 초기화
  calendarGrid.innerHTML = "";

  // 첫 번째 날과 마지막 날짜
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 요일 추가 (첫 번째 행에 요일을 표시)
  weekdays.forEach((weekday) => {
    const weekdayCell = document.createElement("div");
    weekdayCell.textContent = weekday;
    weekdayCell.classList.add("weekday");
    calendarGrid.appendChild(weekdayCell);
  });

  // 첫 번째 날 이전 빈 칸 추가
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendarGrid.appendChild(emptyCell);
  }

  // 로컬스토리지에서 저장된 메모 가져오기
  const storedNotes = getStoredNotes();

  // 해당 월의 날짜 추가
  for (let i = 1; i <= lastDate; i++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = i;
    dayCell.classList.add("day");

    // 오늘 날짜 하이라이트
    const today = new Date();
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayCell.classList.add("highlight-today");
    }

    // 날짜 클릭 시 해당 날짜 메모 보여주기
    dayCell.addEventListener("click", () => {
      // 이전에 선택된 날짜에서 'selected-day' 클래스를 제거
      const previouslySelectedDay = document.querySelector(".selected-day");
      if (previouslySelectedDay) {
        previouslySelectedDay.classList.remove("selected-day");
      }

      // 클릭한 날짜에 'selected-day' 클래스 추가
      dayCell.classList.add("selected-day");

      // 선택된 날짜 저장
      selectedDateKey = `${year}-${month + 1}-${i}`;
      noteText.value = storedNotes[selectedDateKey] || ""; // 기존 메모가 있다면 입력

      // 기본 안내 문구가 사라지지 않도록 처리
      if (!noteText.value) {
        noteText.setAttribute("placeholder", "메모를 입력하세요...");
      }
    });

    // 해당 날짜에 메모가 있다면, 해당 날짜 셀에 메모 표시
    if (storedNotes[`${year}-${month + 1}-${i}`]) {
      dayCell.classList.add("has-note");  // 스타일을 추가하여 메모가 있는 날짜를 강조할 수 있습니다.
    }

    calendarGrid.appendChild(dayCell);
  }

  // 선택된 날짜가 있을 경우, 다시 선택된 날짜에 클래스를 추가
  if (selectedDateKey) {
    const selectedDayCell = Array.from(calendarGrid.children).find((cell) => {
      return cell.textContent == selectedDateKey.split("-")[2] &&
        cell.classList.contains("day");
    });

    if (selectedDayCell) {
      selectedDayCell.classList.add("selected-day");
    }
  }
}

// 이전 달로 이동
prevMonthButton.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

// 다음 달로 이동
nextMonthButton.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

// 메모 저장 버튼 클릭 이벤트
saveNoteButton.addEventListener("click", saveNote);

// 페이지 로드 시 캘린더 초기화
renderCalendar();
