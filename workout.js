/*
====================================================
workout.js
운동 기록 관리
====================================================
*/

import {

    db

} from "./firebase.js";

import {

    getCurrentUser

} from "./auth.js";

import {

    collection,

    doc,

    getDocs,

    setDoc,

    deleteDoc

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

/*
----------------------------------------------------
메모리 캐시
----------------------------------------------------
*/

let workoutData = {};

/*
----------------------------------------------------
Firestore Collection
----------------------------------------------------
*/

function workoutCollection() {

    const user = getCurrentUser();

    if (!user) {

        throw new Error("로그인이 필요합니다.");

    }

    return collection(

        db,

        "users",

        user.uid,

        "workouts"

    );

}

/*
----------------------------------------------------
Document
----------------------------------------------------
*/

function workoutDocument(date) {

    const user = getCurrentUser();

    return doc(

        db,

        "users",

        user.uid,

        "workouts",

        date

    );

}

/*
----------------------------------------------------
전체 불러오기
----------------------------------------------------
*/

export async function loadWorkoutData() {

    workoutData = {};

    const snapshot =

        await getDocs(

            workoutCollection()

        );

    snapshot.forEach(docSnap => {

        workoutData[docSnap.id] =

            docSnap.data().exercises || [];

    });

    return workoutData;

}

/*
----------------------------------------------------
캐시 반환
----------------------------------------------------
*/

export function getWorkoutData() {

    return workoutData;

}

/*
----------------------------------------------------
날짜 기록 반환
----------------------------------------------------
*/

export function getDay(date) {

    return workoutData[date] || [];

}

/*
----------------------------------------------------
운동 추가
----------------------------------------------------
*/

export async function addWorkout(

    date,

    exercise

) {

    if (!workoutData[date]) {

        workoutData[date] = [];

    }

    workoutData[date].push(exercise);

    await saveDate(date);

}

/*
----------------------------------------------------
운동 삭제
----------------------------------------------------
*/

export async function removeWorkout(

    date,

    index

) {

    if (!workoutData[date]) {

        return;

    }

    workoutData[date].splice(index,1);

    await saveDate(date);

}

/*
----------------------------------------------------
러닝 거리 변경
----------------------------------------------------
*/

export async function updateRunDistance(

    date,

    km

){

    const list = workoutData[date];

    if(!list) return;

    const run =

        list.find(item => item.type==="Run");

    if(!run) return;

    run.distance = Number(km);

    run.text = `🏃 ${km} km`;

    await saveDate(date);

}

/*
----------------------------------------------------
날짜 저장
----------------------------------------------------
*/

export async function saveDate(date){

    const list =

        workoutData[date] || [];

    if(list.length===0){

        delete workoutData[date];

        await deleteDoc(

            workoutDocument(date)

        );

        return;

    }

    await setDoc(

        workoutDocument(date),

        {

            exercises:list,

            updatedAt:Date.now()

        }

    );

}

/*
----------------------------------------------------
운동 여부
----------------------------------------------------
*/

export function hasWorkout(date){

    return (

        workoutData[date] ||

        []

    ).length>0;

}

/*
----------------------------------------------------
월 운동 횟수
----------------------------------------------------
*/

export function getMonthWorkoutCount(

    year,

    month

){

    let count=0;

    Object.keys(workoutData)

        .forEach(date=>{

            const d=new Date(date);

            if(

                d.getFullYear()===year &&

                d.getMonth()===month

            ){

                count++;

            }

        });

    return count;

}

/*
----------------------------------------------------
총 운동 횟수
----------------------------------------------------
*/

export function getTotalWorkoutCount(){

    return Object.keys(

        workoutData

    ).length;

}
