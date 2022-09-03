let mProb;
let lProb;

let middleCounts = 0;

let totalNormalCounts = 0;
let totalHighCounts = 0;

// 불꽃상자: h, m, n, r
// 희귀도 중: a, e, i, l, o, s, w
// 희귀도 하: 나머지

const middleAlphas = ['A', 'E', 'I', 'L', 'O', 'S', 'W'];
const highAlphas = ['H', 'M', 'N', 'R'];

const normalBoxAlphas = ['A', 'B', 'C', 'D', 'E',
                        'F', 'G', 'I', 'J', 'K',
                        'L', 'O', 'P', 'Q', 'S',
                        'T', 'U', 'V', 'W', 'X',
                        'Y', 'Z']

let normalBoxWeights;
const highBoxWeights = [25, 25, 25, 25];

let boxTotalCounts = Array(26).fill(0);

const resultsAlphaElement = document.getElementById("resultsAlpha");
let choice = null;

// 실행 초기에 호출

/**
 * 확률, input element 초기화
 */
function initialize() {
    const radioBtns = document.querySelectorAll("input[name='radioButtons']");
    const numberInputElement = document.getElementById("numberInput");
    const probInputElements = document.getElementsByClassName("probInput");

    setProbabilities(3/7, 97/15);

    middleCounts = 0;
    totalNormalCounts = 0;
    totalHighCounts = 0;

    boxTotalCounts = Array(26).fill(0);

    choice = null;

    for (const radioBtn of radioBtns) {
        radioBtn.checked = false;
    }
    numberInputElement.value = null;
    
    probInputElements[0].value = 0.43;
    probInputElements[1].value = 6.47;

    resultsAlphaElement.innerHTML = "알파벳을 뽑아보세요!";

    showTotal();
}

/**
 * 확률, 가중치 설정
 * @param {Number} prob1 희귀도 중 알파벳 확률 
 * @param {Number} prob2 희귀도 하 알파벳 확률
 */
function setProbabilities(prob1, prob2) {
    mProb = prob1;
    lProb = prob2;
    normalBoxWeights = [mProb, lProb, lProb, lProb, mProb,
                        lProb, lProb, mProb, lProb, lProb,
                        mProb, mProb, lProb, lProb, mProb,
                        lProb, lProb, lProb, mProb, lProb,
                        lProb, lProb];
}

/**
 * 버튼, 라디오 버튼 등의 커맨드 설정 
 */
 function setButtonCommands() {
    const normalBoxBtn = document.getElementById("normalBox");
    const highBoxBtn = document.getElementById("highBox");
    const probBtn = document.getElementById("prob");
    const radioBtns = document.querySelectorAll("input[name='radioButtons']");
    const numberInputElement = document.getElementById("numberInput");
    const repeatBtn = document.getElementById("repeat");
    const initializeBtn = document.getElementById("initialize");
    const inputProbs = document.getElementsByClassName("probInput");
    const probSetBtn = document.getElementById("probSet");

    normalBoxBtn.addEventListener("click", normalBoxSimulate);
    highBoxBtn.addEventListener("click", highBoxSimulate);
    probBtn.addEventListener("click", showProbabilities);

    for (const radioBtn of radioBtns) {
        radioBtn.addEventListener("click", function() {
            choice = radioBtn.value;
        })
    }

    repeatBtn.addEventListener("click", function() {
        let times = Number(numberInputElement.value);

        if (checkValidRepetition(choice, times)) {
            repeat(choice, times);
        }
    });
    initializeBtn.addEventListener("click", initialize);

    const lenArray = [7, 15];

    for (let i = 0; i < inputProbs.length; i++) {
        let counterIdx = 1 - i;
        let inputProb = inputProbs[i];
        let counterProb = inputProbs[counterIdx]
        
        inputProb.addEventListener("change", function() {
            let inputProbValue = Number(Number(inputProb.value).toFixed(2));
            inputProb.value = inputProbValue;

            if (!(checkValidProbInput(inputProbValue, lenArray[i]))) {
                inputProb.value = null;
                return;
            }
            let counterProbValue = ((100 - (inputProbValue * lenArray[i])) / lenArray[counterIdx]).toFixed(2);
            counterProb.value = counterProbValue;
        })
    }

    probSetBtn.addEventListener("click", function() {
        let prob1 = Number(inputProbs[0].value);
        let prob2 = Number(inputProbs[1].value);

        setProbabilities(prob1, prob2);
    });
}

// 유효성 검사

/**
 * 확률 설정이 유효한지 검사
 * @param {Number} inputValue 희귀도에 따른 확률
 * @param {Number} multipleTimes 희귀도 알파벳 개수
 * @returns {Boolean} 검사 결과
 */
function checkValidProbInput(inputValue, multipleTimes) {
    let result = null;

    if (inputValue * multipleTimes > 100) {
        alert("총합이 100%보다 큽니다!");
        result = false;
    } else if (inputValue < 0) {
        alert('0% 이상으로 입력하세요.');
        result = false;
    } else {
        result = true;
    }
    return result;
}

/**
 * 반복과 관련한 설정이 유효한지 검사하여 결과를 반환
 * @param {String} choice 선택
 * @param {Number} times 횟수
 * @returns {Boolean} 검사 결과
 */
 function checkValidRepetition(choice, times) {
    let result = null;
    
    if (choice == null) {
        alert("상자 종류를 선택해주세요!")
        result = false;
    } else if (!(Number.isInteger(times) && times > 0)) {
        alert("반복 횟수는 자연수만 가능합니다.");
        result = false;
    } else {
        result = true;
    }

    return result;
}

// 버튼 커맨드, 기타 함수

/**
 * 확률 정보를 alert로 표시
 */
function showProbabilities() {
    const probString = "현재 설정된 확률입니다.\n\n" +
    "<일반 상자 확률 정보>\n\n" + 
    "희귀도 중 (a, e, i, l, o, s, w): 알파벳 하나당 약 " + (mProb.toFixed(2)) + "%\n" +
    "희귀도 하: 알파벳 하나당 약 " + (lProb.toFixed(2)) + "%\n\n" +
    "임의로 정해진 확률입니다. 인게임 확률과 다를 수 있습니다.\n\n" + 
    "제작: 인벤 Illllilllli";
    alert(probString);
}

/**
 * 가중치에 따라 알파벳 상자에서 알파벳 하나를 뽑아서 반환
 * @param {Number[]} alphasArray 알파벳 상자
 * @param {Number[]} weightsArray 알파벳 상자의 가중치 정보
 * @returns {String} 알파벳 하나
 */
 function randomAlphabet(alphasArray, weightsArray) {
    let rand = math.pickRandom(alphasArray, weightsArray);
    return rand;
}

/**
 * 일반 상자 시뮬레이션
 */
function normalBoxSimulate() {
    let randAlpha = randomAlphabet(normalBoxAlphas, normalBoxWeights);
    resultsAlphaElement.innerHTML = "알파벳 <strong>" + randAlpha + "</strong>가 나왔습니다!";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    if (middleAlphas.includes(randAlpha)) {
        middleCounts += 1;
        resultsAlphaElement.innerHTML += " <strong id='middle'>(희귀도 중)</strong>";
    }
    totalNormalCounts += 1;
    
    showTotal();
}

/**
 * 불꽃 상자 시뮬레이션
 */
function highBoxSimulate() {
    randAlpha = randomAlphabet(highAlphas, highBoxWeights);
    resultsAlphaElement.innerHTML = "알파벳 <strong>" + randAlpha + "</strong>가 나왔습니다! <strong id='high'>(희귀도 상)</strong>";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    totalHighCounts += 1;
    
    showTotal();
}

/**
 * 선택한 상자와 입력된 횟수에 따라 반복
 * @param {String} choice 선택
 * @param {Number} times 횟수
 */
function repeat(choice, times) {
    for (let i=0; i < times; i++) {
        eval(choice + "BoxSimulate();");
    }
}

/**
 * A부터 Z까지의 알파벳 보유 상황 표를 생성
 */
function writeTotalTable() {
    const totalElement = document.getElementById("total");
    let htmlString = "<table><tbody>";
    let charAlpha;

    for (let i = 0; i < 12; i++) {
        htmlString += "<tr>";
        for (let j = 0; j < 3; j++) {
            let idx = j * 12 + i;
            if (idx <= 25) {
                charAlpha = String.fromCharCode(idx + 'A'.charCodeAt(0));
                tmpString = charAlpha + ": " + boxTotalCounts[idx] + "개";
                if (middleAlphas.includes(charAlpha)) {
                    htmlString += "<td><strong id='middle'>" + tmpString + "</strong></td>";
                } else if (highAlphas.includes(charAlpha)) {
                    htmlString += "<td><strong id='high'>" + tmpString + "</strong></td>";
                } else {
                    htmlString += "<td>" + tmpString + "</td>";
                }
            }
        } 
        htmlString += "</tr>";
    }
    htmlString += "</tbody></table>";
    totalElement.innerHTML = htmlString;
}

/**
 * 전체 결과를 출력
 */
function showTotal() {
    document.getElementById("middleCounts").innerHTML = "희귀도 중 횟수: " + middleCounts;
    document.getElementById("totalNormalCounts").innerHTML = "일반 상자 총 시행 횟수: " + totalNormalCounts;
    document.getElementById("totalHighCounts").innerHTML = "불꽃 상자 총 시행 횟수: " + totalHighCounts;

    writeTotalTable();
}

initialize();
setButtonCommands();