import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

/*
──────────────────────────────
Firebase Project
──────────────────────────────

실제 배포 시 자신의 프로젝트 값으로 변경

*/
const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();

/*

Google 로그인 시
계정 선택 화면을 항상 표시

*/

provider.setCustomParameters({

    prompt: "select_account"

});

export {

    app,

    auth,

    db,

    provider

};
