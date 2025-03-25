let seciliItem;
let seciliItemIndex;
let gameData;
let partStartDate;
let currentLevelKey = "";

const envanter = {
    can: 0,
    hit: 0,
    score: 0,
    level: 0,
    star: 0
}

function envanterUpdate(name, value, esitle = false) {

    if (esitle) {
        envanter[name] = value;
    } else {
        envanter[name] += value;
    }

    document.querySelector(`#envanter-${name} .envanter-value`).innerHTML = envanter[name]
}



function eventsInit() {
    const gameSvg = document.querySelector(".map-svg svg");
    const hoverTitle = document.querySelector(".hover-title");
    const gamePaths = gameSvg ? gameSvg.querySelectorAll("path") : [];


    gamePaths.forEach((pathItem) => {

        pathItem.addEventListener("mouseout", () => {
            hoverTitle.classList.add("hide")
        })

        pathItem.addEventListener("mouseover", () => {
            if (pathItem.classList.contains("bulundu")) {
                const title = pathItem.getAttribute("title");
                hoverTitle.innerText = title;
                hoverTitle.classList.remove("hide")
            } else {
                hoverTitle.classList.add("hide")
            }

        });

        pathItem.addEventListener("click", () => {
            const dataCode = Number(pathItem.getAttribute("data-code"));

            if (pathItem.classList.contains("bulundu")) {
                // ses efekti.
                AudioManager.playSound("clickNone");


                return;
            }

            if (dataCode === seciliItem.code) {
                //alert("Buldun!");
                // todo: sonraki oyundan devam et                
                pathItem.classList.add("bulundu");
                pathItem.setAttribute("title", seciliItem.name);
                hoverTitle.innerText = seciliItem.name;
                hoverTitle.classList.remove("hide")
                envanterUpdate("score", 10);

                AudioManager.playSound("collectPoints")


                nextGuess();
            } else {
                envanterUpdate("can", -1);

                AudioManager.playSound("clickFail");

                pathItem.classList.add("yanlis");
                setTimeout(() => {
                    pathItem.classList.remove("yanlis");
                }, 1000)
                if (envanter.can === 0) {
                    ///alert("Bölümü yeniden oynayacaksın!")

                    AudioManager.playSound("gameFail");
                    stopTimerProgress();

                    cuteAlert({
                        type: "error",
                        title: "Can Hakkın Bitti.",
                        message: "Bölümü yeniden oynamalısın!",
                        buttonText: "Tamam"
                    }).then(() => {

                        AudioManager.playSound("newGamePart");
                        LevelManager.restart();
                    });

                    return;
                }
            }


        })
    })
}


async function loadData(name) {
    const response = await fetch(`maps/${name}/data.json`);
    return await response.json();
}

async function loadMap(name) {
    const response = await fetch(`maps/${name}/map.svg`);
    return await response.text();
}

let gameTimerRef = null;

function startTimerProgress() {
    const gameTimer = document.querySelector(".game-timer");
    const startTime = Date.now();

    if (gameTimerRef) {
        clearInterval(gameTimerRef);
    }

    gameTimer.innerText = "00:00";

    gameTimerRef = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);


        const min = Math.floor(seconds / 60);
        const sec = seconds - (min * 60)

        gameTimer.innerText = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }, 1000)
}


function stopTimerProgress() {
    if (gameTimerRef) {
        clearInterval(gameTimerRef);
    }
}


function clearTimerProgress() {
    const gameTimer = document.querySelector(".game-timer");
    gameTimer.innerText = "00:00";
}


function nextGuess() {

    const gameProgress = document.querySelector(".game-progress");

    gameProgress.innerText = (gameData.items.length - ((gameData.randomItems || gameData.items).length)) + " / " + gameData.items.length;



    if (gameData.randomItems && gameData.randomItems.length === 0) {
        const totalMs = Date.now() - partStartDate
        const totalSec = Math.floor(totalMs / 1000);


        AudioManager.playSound("partCompleted");
        stopTimerProgress();

        cuteAlert({
            type: "success",
            title: "Tebrikler",
            message: `Bölümü ${totalSec} saniyede bitirdin.`,
            buttonText: "Devam Et"
        }).then(() => {
            LevelManager.next();
            AudioManager.playSound("newGamePart");
        })

        return;
    }


    const randomList = gameData.randomItems ? gameData.randomItems :
        [...gameData.items].sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
            .sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)

    gameData.randomItems = randomList;




    seciliItem = gameData.randomItems.pop();

    const levelQuestion = document.getElementById("level-question");
    const grupName = gameData.name;
    const groupType = gameData.type;

    let groupTypeText;

    switch (groupType) {
        case "city": groupTypeText = "ilçelerinden"; break;
        case "country": groupTypeText = "şehirlerinden"; break;
        case "continent": groupTypeText = "ülkelerinden"; break;
    }

    const nextQuestion = `${grupName} ${groupTypeText} "${seciliItem.name}" neredeydi?`;
    levelQuestion.classList.add("fade-out");
    setTimeout(() => {
        levelQuestion.innerText = nextQuestion;
        levelQuestion.classList.remove("fade-out");
    }, 500)
}


function useHit() {

    if (envanter.hit > 0) {
        envanterUpdate("hit", -1);

        const gameSvg = document.querySelector(".map-svg svg");
        const gamePaths = gameSvg ? gameSvg.querySelectorAll("path") : [];

        gamePaths.forEach((pathItem) => {
            const dataCode = Number(pathItem.getAttribute("data-code"));
            if (dataCode === seciliItem.code) {
                pathItem.classList.add("bulundu");
                pathItem.setAttribute("title", seciliItem.name);
                envanterUpdate("score", 10);
                AudioManager.playSound("achievement")
                return;
            }
        });

        nextGuess();


    } else {
        //  alert("Başka iksirin kalmadı!")
        cuteAlert({
            type: "error",
            title: "Hiç iksirin kalmadı!",
            message: `Artık iksirsiz devam etmen gerek`,
            buttonText: "Devam Et"
        });
    }
}


async function createBolum(name) {

    currentLevelKey = name;
    gameData = await loadData(name);

    partStartDate = Date.now();

    nextGuess(gameData);

    const gameMap = await loadMap(name);
    const mapSvg = document.querySelector(".map-svg");
    mapSvg.innerHTML = gameMap;
    eventsInit();
    startTimerProgress();
}
document.getElementById("use-hit-button").addEventListener("click", useHit)



///createBolum("usak");
LevelManager.start();


const gameMapSvg = document.querySelector(".map-svg");
const cursorDiv = document.querySelector(".game-cursor");
const cursorX = document.querySelector(".cursor-x");
const cursorY = document.querySelector(".cursor-y");
const hoverTitle = document.querySelector(".hover-title");




document.body.addEventListener("mousemove", (e) => {
    const wrapperRect = cursorDiv.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    cursorX.style.left = clientX - wrapperRect.x + "px";
    cursorY.style.top = clientY - wrapperRect.y + "px";

    let cursorRateX = (clientX - wrapperRect.x) / wrapperRect.width
    let cursorRateY = (clientY - wrapperRect.y) / wrapperRect.height

    cursorRateX = cursorRateX * 2 - 0.5;
    cursorRateY = cursorRateY * 2 - 0.5;




    const originXY = `${cursorRateX * 100}% ${cursorRateY * 100}%`;

    if( wrapperRect.width > 400) {
        gameMapSvg.style.transformOrigin = originXY;
    }
});



const bolumModal = document.getElementById("bolum-modal");
const bolumButon = document.getElementById("bolum-sec-btn");

const bolumListesi = document.querySelector(".bolum-listesi");


LevelManager.levels.forEach((level) => {

    level.keys.forEach((levelKey) => {

        const button = document.createElement("button");
        button.innerText = levelKey;

        button.addEventListener("click", () => {
            envanterUpdate("level", 0, true);
            envanterUpdate("hit", 3, true);
            envanterUpdate("can", 3, true);
            createBolum(levelKey);
            bolumModal.classList.add("hide");
        })

        bolumListesi.appendChild(button)

    })
})

bolumButon.addEventListener("click", () => {
    if (bolumModal.classList.contains("hide")) {
        bolumModal.classList.remove("hide");
    } else {
        bolumModal.classList.add("hide");

    }
});





