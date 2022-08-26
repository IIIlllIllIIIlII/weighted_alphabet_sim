const rarityMiddleProb = 0.05 / 100;
const rarityLowProb = 6.6643 / 100;

normalBoxWeights = [0.05];

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showProbabilities() {
    const probString = "<일반 상자 확률 정보>\n\n" + 
    "희귀도 중 (a, e, i, l, o, s, w): 알파벳 하나당 " + (rarityMiddleProb * 100).toFixed(2) + "%\n" +
    "희귀도 하: 알파벳 하나당 " + (rarityLowProb * 100).toFixed(2) + "%\n\n" +
    "통계적 확률과 체감 확률을 바탕으로 임의로 정해진 확률입니다.\n" +
    "인게임 확률과 다를 수 있습니다.\n\n";
    alert(probString);
}

function testFunction() {
    randAlphaNum = getRandomIntInclusive("A".charCodeAt(0), "Z".charCodeAt(0));
    randAlpha = String.fromCharCode(randAlphaNum);
    document.getElementById("randomAlpha").innerText = randAlpha;
    document.getElementById("resultsAlpha").innerText += randAlpha;
}

function testFunction2() {
    rand = Math.random().toFixed(2)
    document.getElementById("randomNum").innerText = rand;
}