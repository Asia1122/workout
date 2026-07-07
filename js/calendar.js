/*
=================================================
calendar.js
운동 달력 렌더링
=================================================
*/

let currentDate = new Date();

let selectedDate = formatDate(new Date());

let workoutMap = {};

const calendarGrid =
    document.getElementById("calendarGrid");

const currentMonthText =
    document.getElementById("currentMonth");

const DAYS = [

    "일",

    "월",

    "화",

    "수",

    "목",

    "금",

    "토"

];

const COLORS = {

    A: "#ff6b6b",

    B: "#4ecdc4",

    Run: "#ffbe0b",

    Rest: "#a2a2a2",

    Etc: "#666"

};

/*
------------------------------------
날짜 포맷
------------------------------------
*/

export function formatDate(date){

    const y=date.getFullYear();

    const m=String(date.getMonth()+1)
        .padStart(2,"0");

    const d=String(date.getDate())
        .padStart(2,"0");

    return `${y}-${m}-${d}`;

}

/*
------------------------------------
운동 데이터 저장
------------------------------------
*/

export function setWorkoutData(data){

    workoutMap=data || {};

}

/*
------------------------------------
선택 날짜
------------------------------------
*/

export function getSelectedDate(){

    return selectedDate;

}

/*
------------------------------------
선택 변경
------------------------------------
*/

export function setSelectedDate(date){

    selectedDate=date;

}

/*
------------------------------------
이전달
------------------------------------
*/

export function prevMonth(){

    currentDate.setMonth(

        currentDate.getMonth()-1

    );

    renderCalendar();

}

/*
------------------------------------
다음달
------------------------------------
*/

export function nextMonth(){

    currentDate.setMonth(

        currentDate.getMonth()+1

    );

    renderCalendar();

}

/*
------------------------------------
달력 생성
------------------------------------
*/

export function renderCalendar(){

    calendarGrid.innerHTML="";

    DAYS.forEach(day=>{

        const div=document.createElement("div");

        div.className="day-name";

        div.textContent=day;

        calendarGrid.appendChild(div);

    });

    const year=currentDate.getFullYear();

    const month=currentDate.getMonth();

    currentMonthText.textContent=

        `${year}년 ${month+1}월`;

    const firstDay=

        new Date(year,month,1).getDay();

    const lastDate=

        new Date(year,month+1,0).getDate();

    for(let i=0;i<firstDay;i++){

        calendarGrid.appendChild(

            document.createElement("div")

        );

    }

    const today=formatDate(new Date());

    for(let day=1;day<=lastDate;day++){

        const cell=

            createDayCell(

                year,

                month,

                day,

                today

            );

        calendarGrid.appendChild(cell);

    }

}

/*
------------------------------------
셀 생성
------------------------------------
*/

function createDayCell(

    year,

    month,

    day,

    today

){

    const div=document.createElement("div");

    div.className="day";

    const date=formatDate(

        new Date(year,month,day)

    );

    if(date===today){

        div.classList.add("today");

    }

    if(date===selectedDate){

        div.classList.add("selected");

    }

    const number=document.createElement("div");

    number.textContent=day;

    div.appendChild(number);

    const dots=document.createElement("div");

    dots.className="dots";

    const items=

        workoutMap[date] || [];

    items.forEach(item=>{

        const dot=

            document.createElement("span");

        dot.className="dot";

        dot.style.background=

            COLORS[item.type] || "#999";

        dots.appendChild(dot);

    });

    div.appendChild(dots);

    div.addEventListener(

        "click",

        ()=>{

            selectedDate=date;

            renderCalendar();

            if(window.onDateSelected){

                window.onDateSelected(date);

            }

        }

    );

    return div;

}
