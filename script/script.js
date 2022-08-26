const MProb = 1;
const LProb = 6.2;
middleCounts = 0;

totalNormalCounts = 0;
totalHighCounts = 0;

// 불꽃상자: h, m, n, r
// 희귀도 중: a, e, i, l, o, s, w
// 희귀도 하: 나머지
normalBoxWeights = [MProb, LProb, LProb, LProb, MProb,
                    LProb, LProb, 0, MProb, LProb,
                    LProb, MProb, 0, 0, MProb,
                    LProb, LProb, 0, MProb, LProb,
                    LProb, LProb, MProb, LProb, LProb, LProb];
highBoxWeights = [0, 0, 0, 0, 0,
                    0, 0, 25, 0, 0,
                    0, 0, 25, 25, 0,
                    0, 0, 25, 0, 0,
                    0, 0, 0, 0, 0, 0];
boxTotalCounts = Array(26).fill(0);

function showProbabilities() {
    const probString = "<일반 상자 확률 정보>\n\n" + 
    "희귀도 중 (a, e, i, l, o, s, w): 알파벳 하나당 " + MProb + "%\n" +
    "희귀도 하: 알파벳 하나당 " + LProb + "%\n\n" +
    "임의로 정해진 확률입니다. 인게임 확률과 다를 수 있습니다.";
    alert(probString);
}

function testFunction() {
    randAlpha = randomAlphabet(normalBoxWeights);
    document.getElementById("resultsAlpha").innerText = "알파벳 " + randAlpha + "가 나왔습니다!";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    if (['A', 'E', 'I', 'L', 'O', 'S', 'W'].includes(randAlpha)) {
        middleCounts += 1;
        document.getElementById("resultsAlpha").innerText += " (희귀도 중)"
    }
    totalNormalCounts += 1;
    document.getElementById("middleCounts").innerText = "희귀도 중 횟수: " + middleCounts;
    document.getElementById("totalNormalCounts").innerText = "일반 상자 총 시행횟수: " + totalNormalCounts;
    showTotal();
}

function testFunction2() {
    randAlpha = randomAlphabet(highBoxWeights);
    document.getElementById("resultsAlpha").innerText = "알파벳 " + randAlpha + "가 나왔습니다!";
    boxTotalCounts[randAlpha.charCodeAt(0) - 'A'.charCodeAt(0)] += 1;
    totalHighCounts += 1;
    document.getElementById("totalHighCounts").innerText = "불꽃 상자 총 시행횟수: " + totalHighCounts;
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
    document.getElementById("results").style.display = "block";
    document.getElementById("total").innerText = "";
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 3; j++) {
            idx = j * 12 + i
            if (idx <= 25) {
                document.getElementById("total").innerHTML += String.fromCharCode(idx + 'A'.charCodeAt(0)) + ": " + boxTotalCounts[idx] + "회&emsp;&emsp;&emsp;";
            }
        } 
        document.getElementById("total").innerText += '\n';
    }
}