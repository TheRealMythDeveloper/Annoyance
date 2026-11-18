
// ==UserScript==
// @name         WEB CHAOS
// @namespace    MythosStudios
// @version     2.0
// @description  Randomized visual chaos engine for websites
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(() => {
    if (window.top !== window.self) return;
    if (document.getElementById("web-chaos-panel")) return;

    const panel = document.createElement("div");
    panel.id = "web-chaos-panel";

    panel.innerHTML = `
        <div class="wc-header">
            <span>⚠ WEB CHAOS</span>
            <span class="wc-version">v2.0</span>
        </div>

        <div class="wc-status">SYSTEM STABLE</div>

        <label>Chaos level
            <select id="wc-level">
                <option value="1">Mild</option>
                <option value="2" selected>Unstable</option>
                <option value="3">Severe</option>
                <option value="4">TOTAL CHAOS</option>
            </select>
        </label>

        <button id="wc-trigger">INJECT CHAOS</button>

        <div class="wc-footer">
            NO UNDO AVAILABLE
        </div>
    `;

    document.body.appendChild(panel);

    GM_addStyle(`
        #web-chaos-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 220px;
            padding: 14px;
            background: #080b0a;
            color: #00ff9c;
            border: 2px solid #00ff9c;
            box-shadow: 0 0 25px #00ff9c55;
            font: 13px monospace;
            z-index: 2147483647;
        }

        #web-chaos-panel * {
            box-sizing: border-box;
        }

        #web-chaos-panel .wc-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 12px;
        }

        #web-chaos-panel .wc-version {
            font-size: 10px;
            opacity: .6;
        }

        #web-chaos-panel .wc-status {
            border: 1px solid #333;
            padding: 7px;
            margin-bottom: 12px;
            text-align: center;
            color: #70ff70;
        }

        #web-chaos-panel label {
            display: block;
            margin-bottom: 12px;
        }

        #web-chaos-panel select {
            display: block;
            width: 100%;
            margin-top: 6px;
            background: #151515;
            color: #00ff9c;
            border: 1px solid #00ff9c;
            padding: 8px;
            font: inherit;
        }

        #wc-trigger {
            width: 100%;
            padding: 12px;
            border: 0;
            background: #00ff9c;
            color: black;
            font: bold 14px monospace;
            cursor: pointer;
        }

        #wc-trigger:hover {
            background: white;
        }

        #web-chaos-panel .wc-footer {
            margin-top: 10px;
            color: #777;
            font-size: 10px;
            text-align: center;
        }

        /* EFFECTS */

        .wc-shake {
            animation: wc-shake .12s infinite !important;
        }

        .wc-rainbow {
            animation: wc-rainbow 3s linear infinite !important;
        }

        .wc-pulse {
            animation: wc-pulse .5s ease-in-out infinite alternate !important;
        }

        .wc-drift {
            animation: wc-drift 3s ease-in-out infinite alternate !important;
        }

        .wc-wobble {
            animation: wc-wobble 2s ease-in-out infinite !important;
        }

        .wc-spin {
            animation: wc-spin 8s linear infinite !important;
        }

        .wc-blink {
            animation: wc-blink .8s steps(2) infinite !important;
        }

        .wc-glitch {
            animation: wc-glitch .15s steps(2) infinite !important;
        }

        .wc-float {
            animation: wc-float 2s ease-in-out infinite alternate !important;
        }

        @keyframes wc-shake {
            0% { transform: translate(0,0); }
            25% { transform: translate(4px,-3px); }
            50% { transform: translate(-4px,3px); }
            75% { transform: translate(3px,4px); }
            100% { transform: translate(-3px,-3px); }
        }

        @keyframes wc-rainbow {
            to { filter: hue-rotate(360deg); }
        }

        @keyframes wc-pulse {
            from { opacity: 1; }
            to { opacity: .2; }
        }

        @keyframes wc-drift {
            from { transform: translateX(-12px); }
            to { transform: translateX(12px); }
        }

        @keyframes wc-wobble {
            0% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
            100% { transform: rotate(-3deg); }
        }

        @keyframes wc-spin {
            to { transform: rotate(360deg); }
        }

        @keyframes wc-blink {
            50% { opacity: .15; }
        }

        @keyframes wc-glitch {
            0% { transform: translate(0); }
            25% { transform: translate(3px,-2px); }
            50% { transform: translate(-2px,3px); }
            75% { transform: translate(4px,1px); }
        }

        @keyframes wc-float {
            from { transform: translateY(-10px); }
            to { transform: translateY(10px); }
        }

        #wc-chaos-overlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 2147483000;
        }

        .wc-scanlines {
            background: repeating-linear-gradient(
                to bottom,
                transparent 0px,
                transparent 3px,
                rgba(0,0,0,.25) 4px
            );
        }

        .wc-flash {
            background: rgba(255,0,0,.08);
            animation: wc-blink .2s infinite;
        }

        .wc-error-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 2147483001;
            background: rgba(0,0,0,.18);
            font: bold 30px monospace;
            color: red;
            text-shadow: 3px 3px black;
            transform: rotate(-8deg);
        }
    `);

    const random = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const pick = array => array[Math.floor(Math.random() * array.length)];

    const elements = () =>
        [...document.querySelectorAll("body *")]
        .filter(el =>
            !el.closest("#web-chaos-panel") &&
            !["SCRIPT","STYLE","LINK","META","NOSCRIPT"].includes(el.tagName) &&
            el.children.length < 8
        );

    const addOverlay = (className = "") => {
        const overlay = document.createElement("div");
        overlay.id = "wc-chaos-overlay";
        overlay.className = className;
        document.body.appendChild(overlay);
        return overlay;
    };

    const effects = [
        {
            name: "COLOR INVERSION",
            run() {
                document.documentElement.style.filter = "invert(1)";
            }
        },

        {
            name: "GRAYSCALE",
            run() {
                document.documentElement.style.filter = "grayscale(1)";
            }
        },

        {
            name: "HYPERSATURATION",
            run() {
                document.documentElement.style.filter = "saturate(5)";
            }
        },

        {
            name: "HUE COLLAPSE",
            run() {
                document.documentElement.style.filter =
                    `hue-rotate(${random(90, 320)}deg)`;
            }
        },

        {
            name: "DEEP FRIED",
            run() {
                document.documentElement.style.filter =
                    "contrast(250%) saturate(400%)";
            }
        },

        {
            name: "BLUR",
            run() {
                document.body.style.filter =
                    `blur(${random(1, 3)}px)`;
            }
        },

        {
            name: "BIG MODE",
            run() {
                document.body.style.zoom = random(110, 140) + "%";
            }
        },

        {
            name: "TINY MODE",
            run() {
                document.body.style.zoom = random(60, 85) + "%";
            }
        },

        {
            name: "TYPOGRAPHIC CHAOS",
            run() {
                document.body.style.letterSpacing =
                    random(2, 8) + "px";
                document.body.style.wordSpacing =
                    random(5, 20) + "px";
            }
        },

        {
            name: "FONT DISASTER",
            run() {
                document.body.style.fontFamily =
                    pick([
                        "Comic Sans MS, cursive",
                        "Impact, fantasy",
                        "monospace",
                        "serif",
                        "cursive"
                    ]);
            }
        },

        {
            name: "TEXT SHADOW",
            run() {
                document.body.style.textShadow =
                    `${random(-5,5)}px ${random(-5,5)}px 3px red`;
            }
        },

        {
            name: "OUTLINE EVERYTHING",
            run() {
                elements().forEach(el => {
                    el.style.outline =
                        `${random(1,3)}px dashed ${pick(["red","lime","blue","magenta"])}`;
                });
            }
        },

        {
            name: "EARTHQUAKE",
            run() {
                document.body.classList.add("wc-shake");
            }
        },

        {
            name: "RAINBOW",
            run() {
                document.documentElement.classList.add("wc-rainbow");
            }
        },

        {
            name: "PULSE",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .25)
                        el.classList.add("wc-pulse");
                });
            }
        },

        {
            name: "FLOAT",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .2)
                        el.classList.add("wc-float");
                });
            }
        },

        {
            name: "WOBBLE",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .15)
                        el.classList.add("wc-wobble");
                });
            }
        },

        {
            name: "GLITCH",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .2)
                        el.classList.add("wc-glitch");
                });
            }
        },

        {
            name: "BLINK",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .12)
                        el.classList.add("wc-blink");
                });
            }
        },

        {
            name: "SPIN",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .08)
                        el.classList.add("wc-spin");
                });
            }
        },

        {
            name: "MISALIGNMENT",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .15) {
                        el.style.position = "relative";
                        el.style.left = random(-100, 100) + "px";
                        el.style.top = random(-60, 60) + "px";
                    }
                });
            }
        },

        {
            name: "GRAVITY",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .12) {
                        el.style.transform =
                            `translate(${random(-120,120)}px,${random(-150,150)}px)`;
                    }
                });
            }
        },
 
        {
            name: "MIRROR WORLD",
            run() {
                document.body.style.transform = "scaleX(-1)";
            }
        },

        {
            name: "TILT",
            run() {
                document.body.style.transform =
                    `rotate(${random(-4,4)}deg)`;
                document.body.style.transformOrigin = "center center";
            }
        },

        {
            name: "SKEW",
            run() {
                document.body.style.transform =
                    `skew(${random(-12,12)}deg,${random(-8,8)}deg)`;
            }
        },

        {
            name: "REVERSE READING",
            run() {
                document.body.style.direction = "rtl";
            }
        },

        {
            name: "SPACING MELTDOWN",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .2) {
                        el.style.margin = random(5,60) + "px";
                        el.style.padding = random(2,40) + "px";
                    }
                });
            }
        },

        {
            name: "BORDER EXPLOSION",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .25) {
                        el.style.border =
                            `${random(1,8)}px solid ${pick(["red","blue","lime","orange","purple"])}`;
                    }
                });
            }
        },

        {
            name: "SCANLINES",
            run() {
                addOverlay("wc-scanlines");
            }
        },

        {
            name: "SCREEN FLASH",
            run() {
                addOverlay("wc-flash");
            }
        },

        {
            name: "ELEMENT DISAPPEARANCE",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .08)
                        el.style.visibility = "hidden";
                });
            }
        },

        {
            name: "RANDOM SIZING",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .12) {
                        el.style.width = random(50, 150) + "%";
                        el.style.fontSize = random(8, 35) + "px";
                    }
                });
            }
        },

        {
            name: "LOW QUALITY REALITY",
            run() {
                document.documentElement.style.filter =
                    "blur(.4px) contrast(180%)";
                document.body.style.fontFamily = "monospace";
            }
        },

        {
            name: "AFTERIMAGE",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .15) {
                        el.style.textShadow =
                            "3px 0 red, -3px 0 cyan";
                    }
                });
            }
        },

        {
            name: "RANDOM ALIGNMENT",
            run() {
                elements().forEach(el => {
                    if (Math.random() < .2)
                        el.style.textAlign = pick(["left","right","center"]);
                });
            }
        },

        {
            name: "WINDOW PANIC",
            run() {
                document.body.style.margin =
                    random(0,150) + "px";
            }
        }
    ];
// PROGRESSIVE CORRUPTION ENGINE

const corruptionEffects = [
    "RAINBOW",
    "GLITCH",
    "EARTHQUAKE",
    "TYPOGRAPHIC CHAOS",
    "HYPERSATURATION",
    "AFTERIMAGE",
    "MISALIGNMENT",
    "WOBBLE",
    "SPACING MELTDOWN",
    "BORDER EXPLOSION",
    "RANDOM ALIGNMENT",
    "SCANLINES",
    "DEEP FRIED",
    "PULSE",
    "TILT",
    "BLINK"
];

let corruptionStage = 0;

function startCorruption() {
    const stages = [
        { delay: 5000, amount: 1, message: "ANOMALY DETECTED" },
        { delay: 10000, amount: 2, message: "LAYOUT INSTABILITY" },
        { delay: 15000, amount: 3, message: "SYSTEM CORRUPTION" },
        { delay: 20000, amount: 4, message: "REALITY BREAKDOWN" },
        { delay: 30000, amount: 5, message: "TOTAL MELTDOWN" }
    ];

    stages.forEach(stage => {
        setTimeout(() => {
            corruptionStage++;

            const available = effects.filter(effect =>
                corruptionEffects.includes(effect.name)
            );

            const chosen = [];

            while (chosen.length < stage.amount && chosen.length < available.length) {
                const effect = pick(available);

                if (!chosen.includes(effect)) {
                    chosen.push(effect);
                }
            }

            chosen.forEach(effect => {
                try {
                    effect.run();
                } catch (error) {
                    console.warn("CORRUPTION ERROR:", error);
                }
            });

            console.warn(
                `[WEB CHAOS] STAGE ${corruptionStage}: ${stage.message}`
            );

            if (corruptionStage === 5) {
                console.error("[WEB CHAOS] TOTAL MELTDOWN REACHED");
            }

        }, stage.delay);
    });
}
    const criticalFailure = () => {
        const overlay = document.createElement("div");
        overlay.className = "wc-error-overlay";
        overlay.innerHTML = `
            <div>
                <div>CRITICAL FAILURE</div>
                <div style="font-size:14px;text-align:center;margin-top:20px">
                    REALITY.EXE HAS STOPPED RESPONDING
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        setTimeout(() => overlay.remove(), 4500);
    };

    document.getElementById("wc-trigger").addEventListener("click", () => {
        const level = Number(document.getElementById("wc-level").value);

        const amount = {
            1: 2,
            2: 5,
            3: 9,
            4: 15
        }[level];

        const shuffled = [...effects].sort(() => Math.random() - .5);
        const selected = shuffled.slice(0, amount);

        // Rare event: critical failure
        const critical = Math.random() < .04;

        panel.querySelector(".wc-status").textContent = "SYSTEM FAILURE";
        panel.querySelector(".wc-status").style.color = "red";

        selected.forEach(effect => {
            try {
                effect.run();
                console.log("[WEB CHAOS]", effect.name);
            } catch (err) {
                console.warn("[WEB CHAOS] Effect failed:", effect.name, err);
            }
        });

        if (critical) {
            criticalFailure();
            console.warn("WEB CHAOS: CRITICAL FAILURE");
        }
// Begin progressive corruption
startCorruption();

        console.log(
            "WEB CHAOS ACTIVATED:",
            selected.map(e => e.name),
            critical ? "CRITICAL FAILURE" : ""
        );

        panel.remove();
    });

})();
