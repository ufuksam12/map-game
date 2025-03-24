



const AudioManager = {
    sounds: {
        "music": "sounds/game-music.mp3",
        "click": "sounds/click.mp3",
        "clickFail": "sounds/click-fail.mp3",
        "clickNone": "sounds/game_click_effect_fo.mp3",
        "gameFail": "sounds/game-click-error.mp3",
        "collectPoints": "sounds/collect-points.mp3",
        "achievement": "sounds/achievement.mp3",
        "partCompleted": "sounds/game-part-complete.mp3",
        "newGamePart": "sounds/game-start.mp3",
        "levelup": "sounds/levelup-applause.mp3"
    },

    loadAll: function () {

        /*
        // obje olarak alıyoruz.
        sounds : {
            "music":"sounds/game-music.mp3"
        },

        // Object.entries(...) yaparsak
        sounds : [
            ["music", "sounds/game-music.mp3"]
        ]

        // .map(...) arrayi dönerek içindekileri değiştirmek
        sounds : [
            ["music", new Audio("sounds/game-music.mp3")]
        ]

        // Object.fromEntries(..) arrayı yeniden objye çevirir.
        sounds : {
            "music": new Audio("sounds/game-music.mp3")
        },
        */


        this.sounds = Object.fromEntries(Object.entries(this.sounds).map(([key, path]) => {
            return [key, new Audio(path)]
        }));
    },

    playSound: function (name, loop = false) {
        this.sounds[name].currentTime = 0;

        if (loop) {
            this.sounds[name].loop = true;
        }


        const tryPlay = () => {
            this.sounds[name].play();
            document.removeEventListener("click", tryPlay);
        };

        document.addEventListener("click", tryPlay);

        this.sounds[name].play();

        setTimeout(()=>{
            if(this.sounds[name].currentTime !== 0) {
                document.removeEventListener("click", tryPlay);
            }
        }, 1200)
    }
}


AudioManager.loadAll();