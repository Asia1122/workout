import {

    auth,

    provider

} from "./firebase.js";

import {

    signInWithPopup,

    signOut,

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

let currentUser = null;

/*
-----------------------------------------
Google Login
-----------------------------------------
*/

async function login() {

    try {

        await signInWithPopup(auth, provider);

    }

    catch (err) {

        console.error(err);

        alert(
            "로그인 실패\n\n" +
            (err.message || err)
        );

    }

}

/*
-----------------------------------------
Logout
-----------------------------------------
*/

async function logout() {

    try {

        await signOut(auth);

    }

    catch (err) {

        console.error(err);

    }

}

/*
-----------------------------------------
로그인 상태 변경
-----------------------------------------
*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        currentUser = null;

        userName.textContent = "로그인 안됨";

        loginBtn.classList.remove("hidden");

        logoutBtn.classList.add("hidden");

        return;

    }

    currentUser = user;

    userName.textContent =
        user.displayName || user.email;

    loginBtn.classList.add("hidden");

    logoutBtn.classList.remove("hidden");

    /*
    로그인 후 앱 초기화
    */

    if (window.initializeWorkoutApp) {

        await window.initializeWorkoutApp(user);

    }

});

/*
-----------------------------------------
Event
-----------------------------------------
*/

loginBtn.addEventListener(

    "click",

    login

);

logoutBtn.addEventListener(

    "click",

    logout

);

/*
-----------------------------------------
Getter
-----------------------------------------
*/

export function getCurrentUser() {

    return currentUser;

}
