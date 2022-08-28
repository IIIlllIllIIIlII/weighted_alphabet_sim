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

let normalBoxWeights = [mProb, lProb, lProb, lProb, mProb,
                        lProb, lProb, mProb, lProb, lProb,
                        mProb, mProb, lProb, lProb, mProb,
                        lProb, lProb, lProb, mProb, lProb,
                        lProb, lProb];
const highBoxWeights = [25, 25, 25, 25];

let boxTotalCounts = Array(26).fill(0);

const resultsAlphaElement = document.getElementById("resultsAlpha");
let choice = null;

function initialize() {
    const radioBtns = document.querySelectorAll("input[name='radioButtons']");
    const numberInputElement = document.getElementById("numberInput");
    const probInputElements = document.getElementsByClassName("probInput");

    mProb = 3 / 7;
    lProb = 97 / 15;

    middleCounts = 0;
    totalNormalCounts = 0;
    totalHighCounts = 0;

    normalBoxWeights = [mProb, lProb, lProb, lProb, mProb,
                        lProb, lProb, mProb, lProb, lProb,
                        mProb, mProb, lProb, lProb, mProb,
                        lProb, lProb, lProb, mProb, lProb,
                        lProb, lProb];

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

function setProbabilities() {
    const inputProbs = document.getElementsByClassName("probInput");
    let tmp = Array(2)

    for (let i = 0; i < inputProbs.length; i++) {
        if (!inputProbs[i].value) {
            alert("확률을 입력하세요!");
            return;
        }
        tmp[i] = inputProbs[i].value;
    }

    mProb = Number(tmp[0]);
    lProb = Number(tmp[1]);

    normalBoxWeights = [mProb, lProb, lProb, lProb, mProb,
                        lProb, lProb, mProb, lProb, lProb,
                        mProb, mProb, lProb, lProb, mProb,
                        lProb, lProb, lProb, mProb, lProb,
                        lProb, lProb];
}

function setButtonCommands() {
    const normalBoxBtn = document.getElementById("normalBox");
    const highBoxBtn = document.getElementById("highBox");
    const probBtn = document.getElementById("prob");
    const radioBtns = document.querySelectorAll("input[name='radioButtons']");
    const repeatBtn = document.getElementById("repeat")
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

    repeatBtn.addEventListener("click", repeat);
    initializeBtn.addEventListener("click", initialize);

    const lenArray = [7, 15];

    for (let i = 0; i < inputProbs.length; i++) {
        let counterIdx = 1 - i;
        let inputProb = inputProbs[i];
        let counterProb = inputProbs[counterIdx]
        
        inputProb.addEventListener("change", function() {
            let inputProbValue = Number(Number(inputProb.value).toFixed(2));
            inputProb.value = inputProbValue;

            if (inputProbValue * lenArray[i] > 100) {
                alert("총합이 100%보다 큽니다!");
                inputProb.value = null;
                return;
            } else if (inputProbValue < 0) {
                alert('0% 이상으로 입력하세요.');
                inputProb.value = null;
                return;
            }
            let counterProbValue = ((100 - (inputProbValue * lenArray[i])) / lenArray[counterIdx]).toFixed(2);
            counterProb.value = counterProbValue;
        })
    }

    probSetBtn.addEventListener("click", setProbabilities);
}

function showProbabilities() {
    const probString = "현재 설정된 확률입니다.\n\n" +
    "<일반 상자 확률 정보>\n\n" + 
    "희귀도 중 (a, e, i, l, o, s, w): 알파벳 하나당 약 " + (mProb.toFixed(2)) + "%\n" +
    "희귀도 하: 알파벳 하나당 약 " + (lProb.toFixed(2)) + "%\n\n" +
    "임의로 정해진 확률입니다. 인게임 확률과 다를 수 있습니다.\n\n" + 
    "제작: 인벤 Illllilllli";
    alert(probString);
}

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

function highBoxSimulate() {
    randAlpha = randomAlphabet(highAlphas, highBoxWeights);
    resultsAlphaElement.innerHTML = "알파벳 <strong>" + randAlpha + "</strong>가 나왔습니다! <strong id='high'>(희귀도 상)</strong>";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    totalHighCounts += 1;
    
    showTotal();
}

function randomAlphabet(alphasArray, weightsArray) {
    let rand = math.pickRandom(alphasArray, weightsArray);
    return rand;
}

function repeat() {
    if (choice == null) {
        alert("상자 종류를 선택해주세요!")
        return;
    }

    const numberInputElement = document.getElementById("numberInput");
    let times = Number(numberInputElement.value);

    if (Number.isInteger(times) && times > 0) {
        for (let i=0; i < times; i++) {
            eval(choice + "BoxSimulate();");
        }
    } else {
        alert("반복 횟수는 자연수만 가능합니다.");
        return;
    }
}

function showTotal() {
    const totalElement = document.getElementById("total");
    let htmlString = "<table><tbody>";
    let charAlpha;

    document.getElementById("middleCounts").innerHTML = "희귀도 중 횟수: " + middleCounts;
    document.getElementById("totalNormalCounts").innerHTML = "일반 상자 총 시행 횟수: " + totalNormalCounts;
    document.getElementById("totalHighCounts").innerHTML = "불꽃 상자 총 시행 횟수: " + totalHighCounts;


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

initialize();
setButtonCommands();