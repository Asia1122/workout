/*
====================================================
app.js
Application Entry Point
====================================================
*/

import {

    renderCalendar,
    prevMonth,
    nextMonth,
    setWorkoutData,
    getSelectedDate

} from "./calendar.js";

import {

    loadWorkoutData,
    getWorkoutData,
    addWorkout,
    removeWorkout,
    updateRunDistance,
    getDay

} from "./workout.js";

import {

    refreshStats

} from "./stats.js";

import {

    scheduleAI

} from "./ai.js";

/*
----------------------------------------------------
DOM
----------------------------------------------------
*/

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const badgeArea =
    document.getElementById("badgeArea");

const saveEtcBtn =
    document.getElementById("saveEtc");

const etcInput =
    document.getElementById("etcInput");

const saveRunBtn =
    document.getElementById("saveRun");

const runInput =
    document.getElementById("runDistance");

const runBox =
    document.getElementById("runBox");

const selectedDateText =
    document.getElementById("selectedDate");

/*
----------------------------------------------------
초기화
----------------------------------------------------
*/

window.initializeWorkoutApp = async () => {

    await loadWorkoutData();

    setWorkoutData(

        getWorkoutData()

    );

    renderCalendar();

    refreshStats();

    renderSelectedDate();

};

/*
----------------------------------------------------
날짜 선택
----------------------------------------------------
*/

window.onDateSelected = () => {

    renderSelectedDate();

};

/*
----------------------------------------------------
선택 날짜 화면
----------------------------------------------------
*/

function renderSelectedDate(){

    const date = getSelectedDate();

    selectedDateText.textContent = date;

    badgeArea.innerHTML = "";

    runBox.classList.add("hidden");

    const list = getDay(date);

    list.forEach((item,index)=>{

        const badge =
            document.createElement("span");

        badge.className =
            `badge ${item.type}`;

        badge.textContent =
            item.text;

        badge.onclick = async ()=>{

            if(

                confirm("삭제할까요?")

            ){

                await removeWorkout(

                    date,

                    index

                );

                afterChange();

            }

        };

        badgeArea.appendChild(

            badge

        );

        if(item.type==="Run"){

            runBox.classList.remove(

                "hidden"

            );

            runInput.value =

                item.distance || "";

        }

    });

}

/*
----------------------------------------------------
공통 후처리
----------------------------------------------------
*/

function afterChange(){

    setWorkoutData(

        getWorkoutData()

    );

    renderCalendar();

    renderSelectedDate();

    refreshStats();

    scheduleAI();

}

/*
----------------------------------------------------
운동 버튼
----------------------------------------------------
*/

document
.querySelectorAll("[data-type]")
.forEach(btn=>{

    btn.onclick = async ()=>{

        const type =

            btn.dataset.type;

        const date =

            getSelectedDate();

        let text =

            btn.textContent.trim();

        if(type==="Run"){

            text="🏃 달리기";

        }

        await addWorkout(

            date,

            {

                type,

                text

            }

        );

        afterChange();

    };

});

/*
----------------------------------------------------
기타 운동
----------------------------------------------------
*/

saveEtcBtn.onclick = async ()=>{

    const text =

        etcInput.value.trim();

    if(!text){

        return;

    }

    await addWorkout(

        getSelectedDate(),

        {

            type:"Etc",

            text

        }

    );

    etcInput.value="";

    afterChange();

};

/*
----------------------------------------------------
러닝 거리
----------------------------------------------------
*/

saveRunBtn.onclick = async ()=>{

    await updateRunDistance(

        getSelectedDate(),

        runInput.value

    );

    afterChange();

};

/*
----------------------------------------------------
달 이동
----------------------------------------------------
*/

prevBtn.onclick = ()=>{

    prevMonth();

};

nextBtn.onclick = ()=>{

    nextMonth();

};
