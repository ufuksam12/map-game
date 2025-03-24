const LevelManager = {
    levels: [
        {
            levelName: "İlçeler",
            firstKeys: ["corum"],
            keys: ["adana", "adiyaman", "afyonkarahisar", "agri", "aksaray", "amasya", "ankara", "istanbul","antalya", "ardahan", "artvin", "aydin", "balikesir", "bartin", "batman", "bayburt", "bilecik", "bingol", "bitlis", "bolu", "burdur", "bursa", "canakkale", "cankiri", "denizli", "diyarbakir", "duzce", "edirne", "elazig", "erzincan", "erzurum", "eskisehir", "gaziantep", "giresun", "gumushane", "hakkari", "hatay", "igdir", "isparta", "izmir", "kahramanmaras", "karabuk", "karaman", "kars", "kastamonu", "kayseri", "kirikkale", "kirklareli", "kirsehir", "kilis", "kocaeli", "konya", "kutahya", "malatya", "manisa", "mardin", "mersin", "mugla", "mus", "nevsehir", "nigde", "ordu", "osmaniye", "rize", "sakarya", "samsun", "sanliurfa", "siirt", "sinop", "sivas", "sirnak", "tekirdag", "tokat", "trabzon", "tunceli", "usak", "van", "yalova", "yozgat", "zonguldak"],
            winLimit: 2,
            randomize: true,
            can: 3,
            hit: 5
        },
        {
            levelName: "Şehirler",
            keys: ["turkiye", "almanya", "ireland", "fas", "fransa", "italya"],
            winLimit: 1,
            can: 6,
            hit: 10
        },
        {
            levelName: "Ülkeler",
            keys: ["avrupa", "afrika"],// "asya"],
            winLimit: 1,
            can: 8,
            hit: 20
        }
    ],
    state: {

        levelIndex: 0,
        levelKey: "",
    },

    start: function () {

        this.state.levelIndex = 0;
        this.state.currentLevel = this.levels[this.state.levelIndex];

        this.state.nextKeys = [...this.state.currentLevel.keys];

        if (this.state.currentLevel.randomize) {
            this.state.nextKeys = this.state.nextKeys
                .sort(() => Math.random() - 0.5)
                .sort(() => Math.random() - 0.5)
                .sort(() => Math.random() - 0.5)
                .sort(() => Math.random() - 0.5);

                this.state.nextKeys = [...this.state.nextKeys, ...this.state.currentLevel.firstKeys]
                

        }
        this.state.levelKey = this.state.nextKeys.pop();

        envanterUpdate("level", this.state.levelIndex + 1, true);
        envanterUpdate("can", this.state.currentLevel.can, true);
        envanterUpdate("hit", this.state.currentLevel.hit, true);

        createBolum(this.state.levelKey);

        AudioManager.playSound("music", true);
    },

    next: function () {

        const isWin = this.state.currentLevel.winLimit && (this.state.currentLevel.keys.length - this.state.nextKeys.length) >= this.state.currentLevel.winLimit


        this.state.levelKey = this.state.nextKeys.pop();


        if (!this.state.levelKey || isWin) {
            //

            //alert("tüm bölümler bitti. level up");

            AudioManager.playSound("levelup");

            envanterUpdate("star", envanter.score);
            envanterUpdate("score", 0, true);

            cuteAlert({
                type: "success",
                title: "Tebrikler, seviye atladın.",
                message: `Sonraki bölüme geçtin!`,
                buttonText: "Devam Et"
            }).then(() => {
                AudioManager.playSound("newGamePart");
                this.nextLevel()
            })

            return;
        }

        envanterUpdate("level", this.state.levelIndex + 1, true);
        //envanterUpdate("can", this.state.currentLevel.can, true);
        envanterUpdate("hit", 2);

        createBolum(this.state.levelKey);

    },

    nextLevel: function () {
        this.state.levelIndex++;
        this.state.currentLevel = this.levels[this.state.levelIndex];
        if (!this.state.currentLevel) {
            // alert("Oyunu başarıyla tamamladın!")
            cuteAlert({
                type: "success",
                title: "Tebrikler",
                message: `Aferin. Oyunu bitirdin!`,
                buttonText: "Tekrar başla "
            });
            return;
        }

        this.state.nextKeys = [...this.state.currentLevel.keys];

        if (this.state.currentLevel.randomize) {
            this.state.nextKeys = this.state.nextKeys
                .sort(() => Math.random() - 0.5)
                .sort(() => Math.random() - 0.5)
                .sort(() => Math.random() - 0.5)
                .sort(() => Math.random() - 0.5)
        }
        this.state.levelKey = this.state.nextKeys.pop();

        envanterUpdate("level", this.state.levelIndex + 1, true);
        envanterUpdate("can", this.state.currentLevel.can, true);
        envanterUpdate("hit", this.state.currentLevel.hit, true);

        createBolum(this.state.levelKey);
    },

    restart: function () {
        envanterUpdate("level", this.state.levelIndex + 1, true);
        envanterUpdate("can", this.state.currentLevel.can, true);
        envanterUpdate("hit", this.state.currentLevel.hit, true);
        envanterUpdate("score", 0, true);
        createBolum(this.state.levelKey);
    }
}


