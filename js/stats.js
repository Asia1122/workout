/*
====================================================
stats.js
운동 통계
====================================================
*/

import {

    getWorkoutData

} from "./workout.js";

const monthStatsEl =
    document.getElementById("monthStats");

const yearStatsEl =
    document.getElementById("yearStats");

/*
------------------------------------------
이번 달 통계
------------------------------------------
*/

export function updateMonthStats() {

    const data = getWorkoutData();

    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth();

    let workoutDays = 0;

    let runDistance = 0;

    let totalDays = today.getDate();

    Object.entries(data).forEach(([date, list]) => {

        const d = new Date(date);

        if (

            d.getFullYear() !== year ||

            d.getMonth() !== month

        ) {

            return;

        }

        workoutDays++;

        list.forEach(item => {

            if (

                item.type === "Run" &&

                item.distance

            ) {

                runDistance += Number(item.distance);

            }

        });

    });

    const rate =

        ((workoutDays / totalDays) * 100)

        .toFixed(1);

    monthStatsEl.innerHTML =

`
<b>이번 달</b><br>

운동일 :
${workoutDays}일

<br>

실천률 :
${rate}%

<br>

러닝 :
${runDistance.toFixed(1)} km
`;

}

/*
------------------------------------------
올해 통계
------------------------------------------
*/

export function updateYearStats() {

    const data = getWorkoutData();

    const today = new Date();

    const year = today.getFullYear();

    let workoutDays = 0;

    let runDistance = 0;

    let aCount = 0;

    let bCount = 0;

    let runCount = 0;

    Object.entries(data).forEach(([date,list])=>{

        const d=new Date(date);

        if(d.getFullYear()!=year){

            return;

        }

        workoutDays++;

        list.forEach(item=>{

            switch(item.type){

                case "A":

                    aCount++;

                    break;

                case "B":

                    bCount++;

                    break;

                case "Run":

                    runCount++;

                    runDistance+=

                        Number(

                            item.distance||0

                        );

                    break;

            }

        });

    });

    const startOfYear=

        new Date(year,0,1);

    const totalDays=

        Math.floor(

            (today-startOfYear)/86400000

        )+1;

    const rate=

        (

            workoutDays/

            totalDays*

            100

        ).toFixed(1);

    yearStatsEl.innerHTML=

`
<b>올해</b><br>

운동일 :
${workoutDays}일

<br>

실천률 :
${rate}%

<br>

A루틴 :
${aCount}

<br>

B루틴 :
${bCount}

<br>

러닝 :
${runCount}회

<br>

거리 :
${runDistance.toFixed(1)} km
`;

}

/*
------------------------------------------
전체 통계 갱신
------------------------------------------
*/

export function refreshStats(){

    updateMonthStats();

    updateYearStats();

}
