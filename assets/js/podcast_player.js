class DurationDisplayElement extends HTMLElement {
    static observedAttributes = ["currentTime"];

    constructor() {
        super();
    }

    #durationFormat(ct) {
        const _sec = Math.floor(ct % 60);
        const _min = Math.floor(ct - _sec);
        return `${_min.toString().padStart(2, '0')}:${_sec.toString().padStart(2, '0')}`
    }

    connectedCallback() {
        this.clear();
    }

    reset() {
        this.classList.remove("no");
        this.innerText = "00:00";
    }

    clear() {
        this.classList.add("no");
        this.innerText = "";
    }

    setTime(currentTime) {
        this.innerText = this.#durationFormat(currentTime);
    }
}

customElements.define("duration-display-element", DurationDisplayElement);

class PlayIconElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setPlayIcon();
    }

    setPauseIcon() {
        this.innerHTML = "pause_circle";
    }

    setPlayIcon() {
        this.innerHTML = "play_circle";
    }
}

customElements.define("play-icon-element", PlayIconElement, { extends: "i" });

class PlayerElement extends HTMLElement {
    static observedAttributes = ["path", "duration"];

    constructor() {
        super();
    }

    connectedCallback() {
        const PATH = this.getAttribute("path");

        /** @type {HTMLAudioElement} */
        let audio;

        if (!window['$ESS']) {
            window.$ESS = new Map();
        }

        const PLAYER_BUTTON = document.createElement("button");
        PLAYER_BUTTON.classList.add("transparent");

        const DURATION_ELEMENT = new DurationDisplayElement();
        const ICON_ELEMENT = new PlayIconElement();

        PLAYER_BUTTON.addEventListener("click", function (e) {
            audio = $ESS.get(PLAYER_BUTTON);

            if (!audio) {
                audio = new Audio(PATH);
                $ESS.set(PLAYER_BUTTON, audio);

                audio.addEventListener("canplay", () => {
                    DURATION_ELEMENT.reset();
                });

                audio.addEventListener("play", () => {
                    ICON_ELEMENT.setPauseIcon();
                });

                audio.addEventListener("pause", () => ICON_ELEMENT.setPlayIcon());

                audio.addEventListener("ended", () => {
                    ICON_ELEMENT.setPlayIcon();
                });

                audio.addEventListener("timeupdate", () => {
                    DURATION_ELEMENT.setTime(audio.currentTime);
                });
            }

            if (audio.paused) {
                audio.play();

                for (const [, a] of $ESS.entries()) {
                    if (audio !== a) {
                        a.pause();
                    }
                }
            } else {
                audio.pause();
            }
        });

        PLAYER_BUTTON.append(ICON_ELEMENT, DURATION_ELEMENT);
        this.append(PLAYER_BUTTON);
    }
}

customElements.define("player-element", PlayerElement);