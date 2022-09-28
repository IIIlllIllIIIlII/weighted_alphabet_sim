// 사이트에서 사용되는 객체, 디폴트 변수

const defaultmProb = 3/7;
const defaultlProb = 97/15;
const middleAlphas = ['A', 'E', 'I', 'L', 'O', 'S', 'W'];
const highAlphas = ['H', 'M', 'N', 'R'];

/**
 * 일반 알파벳 상자
 */
class NormalAlphabetBox {
    // Private Fields
    #mProb;
    #lProb;

    constructor() {
        this.#mProb = defaultmProb;
        this.#lProb = defaultlProb;

        this.contents = ['A', 'B', 'C', 'D', 'E',
                        'F', 'G', 'I', 'J', 'K',
                        'L', 'O', 'P', 'Q', 'S',
                        'T', 'U', 'V', 'W', 'X',
                        'Y', 'Z'];
        this.weights = [this.#mProb, this.#lProb, this.#lProb, this.#lProb, this.#mProb,
                        this.#lProb, this.#lProb, this.#mProb, this.#lProb, this.#lProb,
                        this.#mProb, this.#mProb, this.#lProb, this.#lProb, this.#mProb,
                        this.#lProb, this.#lProb, this.#lProb, this.#mProb, this.#lProb,
                        this.#lProb, this.#lProb];
    }

    // Getter and Setter

    get mProb() {
        return this.#mProb;
    }
    set mProb(prob) {
        this.#mProb = prob;
    }
    get lProb() {
        return this.#lProb;
    }
    set lProb(prob) {
        this.#lProb = prob;
    }
}

/**
 * 불꽃 알파벳 상자
 */
class HighAlphabetBox {
    // Private Fields
    #hProb;

    constructor() {
        this.#hProb = 25;

        this.contents = ['H', 'M', 'N', 'R'];
        this.weights = [this.#hProb, this.#hProb, this.#hProb, this.#hProb];
    }
}

/**
 * 시뮬레이터
 */
class Simulator {
    // Private Fields
    #boxes;
    #resultObject;

    constructor() {
        this.#boxes = new Map();

        this.#boxes.set("normal", new NormalAlphabetBox());
        this.#boxes.set("high", new HighAlphabetBox());

        this.#resultObject = new SimulationResult();
    }

    /**
     * 시뮬레이션
     * @param {String} type 상자 종류(normal, high)
     */
    simulate(type) {
        /**
         * 가중치가 적용된 랜덤 알파벳을 뽑기 위한 내부 함수
         * @param {Array} contents 상자의 내용
         * @param {Array} weights 상자의 가중치 정보
         * @returns 알파벳
         */
        function _pickWeightedRandomAlphabet(contents, weights) {
            return math.pickRandom(contents, weights);
        }

        /**
         * 결과 업데이트를 위한 내부 함수
         * @param {String} alpha 알파벳 
         */
        function _updateResults(alpha) {
            let resultObject = _obj.#resultObject;
            let alphaCountsMap = resultObject.alphabetCounts;
            let alphaCount = alphaCountsMap.get(alpha);

            resultObject.increaseBoxCounts(type);
            alphaCountsMap.set(alpha, alphaCount + 1);

            HTMLElementController.updateTable(alpha, alphaCount + 1);
            HTMLElementController.updateResultTexts(alpha);

            if (middleAlphas.includes(alpha)) {
                resultObject.middleTotalCounts += 1;
            }
        }

        let _obj = this;
        let box = this.#boxes.get(type);

        let alpha = _pickWeightedRandomAlphabet(box.contents, box.weights);
        _updateResults(alpha);
    }
    repeat(type, times) {
        for (let i = 0; i < times; i++) {
            this.simulate(type, times);
        }
    }

    /**
     * 확률 설정
     * @param {Number} lProb 희귀도 하 알파벳 확률
     * @param {Number} mProb 희귀도 중 알파벳 확률
     */
    setProbabilities(lProb, mProb) {
        let normalBox = this.#boxes.get("normal");
        normalBox.mProb = mProb;
        normalBox.lProb = lProb;
    }

    // Getter (HTMLElementController에서 접근하기 위함)
    get boxes() {
        return this.#boxes;
    }
    get resultObject() {
        return this.#resultObject;
    }
}

/**
 * 시뮬레이션 결과 객체
 */
class SimulationResult {
    #normalTotalCounts;
    #middleTotalCounts;
    #highTotalCounts
    #alphabetCounts;

    constructor() {
        this.#normalTotalCounts = 0;
        this.#middleTotalCounts = 0;
        this.#highTotalCounts = 0;
        this.#alphabetCounts = new Map();

        for (let i = 0; i < 26; i++) {
            let alpha = String.fromCharCode(i + 'A'.charCodeAt(0));
            
            this.#alphabetCounts.set(alpha, 0);
        }
    }

    increaseBoxCounts(type) {
        switch (type) {
            case "normal":
                this.#normalTotalCounts += 1;
                break;
            case "high":
                this.#highTotalCounts += 1;
                break;
        }
    }
    
    // Getter and Setter
    get normalTotalCounts() {
        return this.#normalTotalCounts;
    }
    get middleTotalCounts() {
        return this.#middleTotalCounts;
    }
    set middleTotalCounts(count) {
        this.#middleTotalCounts = count;
    }
    get highTotalCounts() {
        return this.#highTotalCounts;
    }
    get alphabetCounts() {
        return this.#alphabetCounts;
    }
}

/**
 * HTML Element Controller (Static)
 */
class HTMLElementController {
    static totalTableElem = document.getElementById("total_table");
    static bodyElem = document.body;
    static tdElems = new Map();
    static probInputs = document.getElementsByClassName("input_prob")

    /**
     * 알파벳 결과 테이블 생성
     */
    static createTable() {
        let tableElem = document.createElement("table");
        let tbodyElem = document.createElement("tbody");
        for (let i = 0; i < 12; i++) {
            let trElem = document.createElement("tr");
            
            for (let j = 0; j < 3; j++) {
                let alpha = String.fromCharCode('A'.charCodeAt(0) + (j * 12) + i);

                if (alpha >= 'A' && alpha <= 'Z') {
                    let tdElem = document.createElement("td");

                    if (middleAlphas.includes(alpha)) {
                        let strongElem = document.createElement("strong");
                        strongElem.setAttribute("class", "middle");

                        strongElem.textContent = alpha + ": 0개";

                        HTMLElementController.tdElems.set(alpha, strongElem);

                        tdElem.appendChild(strongElem);
                    } else if (highAlphas.includes(alpha)) {
                        let strongElem = document.createElement("strong");
                        strongElem.setAttribute("class", "high");

                        strongElem.textContent = alpha + ": 0개";

                        HTMLElementController.tdElems.set(alpha, strongElem);

                        tdElem.appendChild(strongElem);
                    } else {
                        tdElem.innerText = alpha + ": 0개";

                        HTMLElementController.tdElems.set(alpha, tdElem);
                    }

                    trElem.appendChild(tdElem);
                }
            }

            tbodyElem.appendChild(trElem);
        }
        tableElem.appendChild(tbodyElem);
        HTMLElementController.totalTableElem.appendChild(tableElem);
    }
    /**
     * 결과 표 업데이트
     * @param {String} alpha 
     * @param {Number} count 
     */
    static updateTable(alpha, count) {
        let tdElem = HTMLElementController.tdElems.get(alpha);

        tdElem.textContent = alpha + ": " + count + "개";
    }

    static initializeTable() {
        for (let key of HTMLElementController.tdElems.keys()) {
            HTMLElementController.tdElems.get(key).textContent = key + ": 0개";
        }
    }
    static initializeResultTexts() {
        let resultsAlphaElem = document.getElementById("results_alpha");
        let middleCountsElem = document.getElementById("middle_counts");
        let totalNormalCountsElem = document.getElementById("total_normal_counts");
        let totalHighCountsElem = document.getElementById("total_high_counts");

        resultsAlphaElem.textContent = "알파벳을 뽑아보세요!";
        middleCountsElem.textContent = "희귀도 중 횟수: 0";
        totalNormalCountsElem.textContent = "일반 상자 총 시행 횟수: 0";
        totalHighCountsElem.textContent = "불꽃 상자 총 시행 횟수: 0";
    }

    static updateResultTexts(alpha) {
        function updateResultsAlpha(alpha) {
            let resultsAlphaElem = document.getElementById("results_alpha");
            let resultsAlphainnerHTML = "";
            let strongHTML = "<strong>" + alpha + "</strong>";
            let suffix = "";

            if (middleAlphas.includes(alpha)) {
                suffix = "<strong class=\"middle\">" + " (희귀도 중)" + "</strong>";
            } else if (highAlphas.includes(alpha)) {
                suffix = "<strong class=\"high\">" + " (희귀도 상)" + "</strong>";
            }

            resultsAlphainnerHTML = "알파벳 " + strongHTML + "가 나왔습니다!" + suffix;
            resultsAlphaElem.innerHTML = resultsAlphainnerHTML;
        }
        let middleCountsElem = document.getElementById("middle_counts");
        let totalNormalCountsElem = document.getElementById("total_normal_counts");
        let totalHighCountsElem = document.getElementById("total_high_counts");

        updateResultsAlpha(alpha);

        let simResultObject = simulator.resultObject;
        middleCountsElem.textContent = "희귀도 중 횟수: " + simResultObject.middleTotalCounts;
        totalNormalCountsElem.textContent = "일반 상자 총 시행 횟수: " + simResultObject.normalTotalCounts;
        totalHighCountsElem.textContent = "불꽃 상자 총 시행 횟수: " + simResultObject.highTotalCounts;
    }

    /**
     * HTML Element에 이벤트를 등록
     */
    static addEvents() {
        function showProbabilities() {
            let normalBox = simulator.boxes.get("normal")
            let mProb = normalBox.mProb;
            let lProb = normalBox.lProb;

            let probString = "현재 설정된 확률입니다.\n\n" +
            "<일반 상자 확률 정보>\n\n" + 
            "희귀도 중 (a, e, i, l, o, s, w): 알파벳 하나당 약 " + (mProb.toFixed(2)) + "%\n" +
            "희귀도 하: 알파벳 하나당 약 " + (lProb.toFixed(2)) + "%\n\n" +
            "임의로 정해진 확률입니다. 인게임 확률과 다를 수 있습니다.\n\n" + 
            "제작: 인벤 Illllilllli";
            alert(probString);
        }
        function balanceProbInputs(elem, idx, array) {
            const lenArray = [7, 15]
            let counterIdx = 1 - idx;
            let counterProb = array[counterIdx]
            
            let inputProbValue = Number(Number(elem.value).toFixed(2));
            elem.value = inputProbValue;

            if (!(isValidProbInput(inputProbValue, lenArray[idx]))) {
                elem.value = null;
                return;
            }
            let counterProbValue = ((100 - (inputProbValue * lenArray[idx])) / lenArray[counterIdx]).toFixed(2);
            counterProb.value = counterProbValue;
        }

        // 유효성 검사 내부 함수

        /**
         * 반복과 관련한 설정이 유효한지 검사하여 결과를 반환
         * @param {String} choice 선택
         * @param {Number} times 횟수
         * @returns {Boolean} 검사 결과
         */
        function isValidRepetition(choice, times) {
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
        /**
         * 확률 설정이 유효한지 검사
         * @param {Number} inputValue 희귀도에 따른 확률
         * @param {Number} multipleTimes 희귀도 알파벳 개수
         * @returns {Boolean} 검사 결과
         */
        function isValidProbInput(inputValue, multipleTimes) {
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
        
        let probBtnElem = document.getElementById("prob");
        let simBtns = document.getElementsByClassName("sim_btn");
        let repeatBtnElem = document.getElementById("repeat");
        let setProbElem = document.getElementById("set_prob");
        let initializeBtn= document.getElementById("initialize");

        simBtns[0].addEventListener("click", function() {simulator.simulate("normal");});
        simBtns[1].addEventListener("click", function() {simulator.simulate("high");});

        probBtnElem.addEventListener("click", showProbabilities);

        repeatBtnElem.addEventListener("click", function() {
            let type = null;

            try {
                type = document.querySelector("input[name='radio_buttons']:checked").value;
            } catch {
                type = null;
            }
            let times = Number(document.getElementById("input_number").value);

            if (isValidRepetition(type, times)) {
                simulator.repeat(type, times);
            }
        })

        Array.prototype.map.call(HTMLElementController.probInputs, function(elem, idx, array) {
            elem.addEventListener("change", function() {balanceProbInputs(elem, idx, array);})});
        
        setProbElem.addEventListener("click", function() {
            if (HTMLElementController.probInputs[0].value && HTMLElementController.probInputs[1].value) {
                let mProb = Number(HTMLElementController.probInputs[0].value);
                let lProb = Number(HTMLElementController.probInputs[1].value);

                simulator.setProbabilities(lProb, mProb);
            } else {
                alert("확률 설정이 잘못되었습니다.");
            }
        })

        initializeBtn.addEventListener("click", initialize);
    }
}

function initialize() {
    simulator = new Simulator();

    HTMLElementController.initializeTable();
    HTMLElementController.initializeResultTexts();
    HTMLElementController.probInputs[0].value = defaultmProb.toFixed(2);
    HTMLElementController.probInputs[1].value = defaultlProb.toFixed(2);
    document.getElementById("input_number").value = null;
}

var simulator = new Simulator();
HTMLElementController.createTable();
HTMLElementController.addEvents();
HTMLElementController.probInputs[0].value = defaultmProb.toFixed(2);
HTMLElementController.probInputs[1].value = defaultlProb.toFixed(2);