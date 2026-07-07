/*
====================================================
ai.js
Cloud Functions 기반 AI 코치
====================================================
*/

import {

    getFunctions,

    httpsCallable

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

import {

    app

} from "./firebase.js";

import {

    getWorkoutData

} from "./workout.js";

const functions = getFunctions(app);

const aiResult = document.getElementById("aiResult");

const refreshButton = document.getElementById("refreshAI");

const askCoach = httpsCallable(

    functions,

    "coachAdvice"

);

let debounceTimer = null;

let lastResponse = "";

/*
---------------------------------------
최근 7일 데이터 생성
---------------------------------------
*/

function buildHistory(){

    const data = getWorkoutData();

    const history=[];

    for(let i=6;i>=0;i--){

        const d=new Date();

        d.setDate(

            d.getDate()-i

        );

        const key=d.toISOString()

            .slice(0,10);

        history.push({

            date:key,

            workout:data[key]||[]

        });

    }

    return history;

}

/*
---------------------------------------
AI 호출
---------------------------------------
*/

export async function refreshAI(force=false){

    if(debounceTimer && !force){

        clearTimeout(

            debounceTimer

        );

    }

    if(!force){

        debounceTimer=setTimeout(

            ()=>{

                refreshAI(true);

            },

            30000

        );

        return;

    }

    aiResult.textContent=

        "AI 분석 중...";

    try{

        const history=

            buildHistory();

        const result=

            await askCoach({

                history

            });

        lastResponse=

            result.data.message;

        aiResult.textContent=

            lastResponse;

    }

    catch(err){

        console.error(err);

        aiResult.textContent=

            "AI 서버 연결 실패";

    }

}

/*
---------------------------------------
버튼
---------------------------------------
*/

refreshButton.addEventListener(

    "click",

    ()=>{

        refreshAI(true);

    }

);

/*
---------------------------------------
자동 예약
---------------------------------------
*/

export function scheduleAI(){

    refreshAI(false);

}

/*
---------------------------------------
마지막 응답
---------------------------------------
*/

export function getLastAIResponse(){

    return lastResponse;

}
