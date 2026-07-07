const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const { GoogleGenerativeAI } = require("@google/generative-ai");

/*
환경변수 설정

firebase functions:config:set gemini.key="YOUR_API_KEY"

또는

firebase functions:secrets:set GEMINI_API_KEY
*/

const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_KEY;

if (!apiKey) {

    logger.warn("Gemini API Key 없음");

}

const genAI = new GoogleGenerativeAI(apiKey);

/*
=========================================
AI Coach
=========================================
*/

exports.coachAdvice = onCall(async (request) => {

    try {

        const history = request.data.history || [];

        const prompt = createPrompt(history);

        const model = genAI.getGenerativeModel({

            model: "gemini-2.5-flash"

        });

        const result = await model.generateContent(prompt);

        const text = result.response.text();

        return {

            success: true,

            message: text

        };

    }

    catch (err) {

        logger.error(err);

        throw new HttpsError(

            "internal",

            err.message

        );

    }

});

/*
=========================================
Prompt Builder
=========================================
*/

function createPrompt(history){

    let txt =

`너는 전문 퍼스널 트레이너이다.

사용자의 최근 운동 기록을 분석하여

1. 회복상태

2. 다음 운동 추천

3. 운동 빈도

4. 부상 예방

5. 동기부여

를 5줄 정도로 설명해라.

최근 운동기록

`;

    history.forEach(day=>{

        txt +=

`\n${day.date}

`;

        if(day.workout.length===0){

            txt +=

"휴식\n";

            return;

        }

        day.workout.forEach(item=>{

            txt +=

"- " + item.text + "\n";

        });

    });

    return txt;

}
