const mProb = 3 / 7;
const lProb = 97 / 15;

let middleCounts = 0;

let totalNormalCounts = 0;
let totalHighCounts = 0;

// 불꽃상자: h, m, n, r
// 희귀도 중: a, e, i, l, o, s, w
// 희귀도 하: 나머지
const normalBoxWeights = [mProb, lProb, lProb, lProb, mProb,
                    lProb, lProb, 0, mProb, lProb,
                    lProb, mProb, 0, 0, mProb,
                    lProb, lProb, 0, mProb, lProb,
                    lProb, lProb, mProb, lProb, lProb, lProb];
const highBoxWeights = [0, 0, 0, 0, 0,
                    0, 0, 25, 0, 0,
                    0, 0, 25, 25, 0,
                    0, 0, 25, 0, 0,
                    0, 0, 0, 0, 0, 0];

const middleAlphas = ['A', 'E', 'I', 'L', 'O', 'S', 'W'];
const highAlphas = ['H', 'M', 'N', 'R'];

let boxTotalCounts = Array(26).fill(0);

const resultsAlphaElement = document.getElementById("resultsAlpha");

function setButtonCommands() {
    const normalBoxBtn = document.getElementById("normalBox");
    const highBoxBtn = document.getElementById("highBox");
    const probBtn = document.getElementById("prob");

    normalBoxBtn.addEventListener("click", normalBoxSimulate);
    highBoxBtn.addEventListener("click", highBoxSimulate);
    probBtn.addEventListener("click", showProbabilities);
}

function showProbabilities() {
    const probString = "<일반 상자 확률 정보>\n\n" + 
    "희귀도 중 (a, e, i, l, o, s, w): 알파벳 하나당 " + mProb.toFixed(2) + "%\n" +
    "희귀도 하: 알파벳 하나당 " + lProb.toFixed(2) + "%\n\n" +
    "임의로 정해진 확률입니다. 인게임 확률과 다를 수 있습니다.\n\n" + 
    "제작: 인벤 Illllilllli";
    alert(probString);
}

function normalBoxSimulate() {
    let randAlpha = randomAlphabet(normalBoxWeights);
    resultsAlphaElement.innerHTML = "알파벳 <strong>" + randAlpha + "</strong>가 나왔습니다!";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    if (middleAlphas.includes(randAlpha)) {
        middleCounts += 1;
        resultsAlphaElement.innerHTML += " <strong id='middle'>(희귀도 중)</strong>";
    }
    totalNormalCounts += 1;
    document.getElementById("middleCounts").innerHTML = "희귀도 중 횟수: " + middleCounts;
    document.getElementById("totalNormalCounts").innerHTML = "일반 상자 총 시행 횟수: " + totalNormalCounts;
    showTotal();
}

function highBoxSimulate() {
    randAlpha = randomAlphabet(highBoxWeights);
    resultsAlphaElement.innerHTML = "알파벳 <strong>" + randAlpha + "</strong>가 나왔습니다! <strong id='high'>(희귀도 상)</strong>";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    totalHighCounts += 1;
    document.getElementById("totalHighCounts").innerHTML = "불꽃 상자 총 시행 횟수: " + totalHighCounts;
    showTotal();
}

function randomAlphabet(array) {
    rand = Math.random() * 100;
    tmp = 0;
    for (var i = 0; i < array.length; i++) {
        tmp += array[i];
        if (rand < tmp) {
             return String.fromCharCode(i + 'A'.charCodeAt(0));
        }
    }
}

function showTotal() {
    const totalElement = document.getElementById("total");
    let htmlString = "<table><tbody>";
    let charAlpha;

    for (let i = 0; i < 12; i++) {
        htmlString += "<tr>";
        for (let j = 0; j < 3; j++) {
            let idx = j * 12 + i;
            if (idx <= 25) {
                charAlpha = String.fromCharCode(idx + 'A'.charCodeAt(0));
                tmpString = charAlpha + ": " + boxTotalCounts[idx] + "회";
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

setButtonCommands();
showTotal();