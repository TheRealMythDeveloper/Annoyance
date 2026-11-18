
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
        <span class="wc-version">v3.0</span>
    </div>

    <div class="wc-status">SYSTEM STABLE</div>

    <label>Chaos level
    <select id="wc-level">
        <option value="1">Mild</option>
        <option value="2" selected>Unstable</option>
        <option value="3">Severe</option>
        <option value="4">Total Chaos</option>
    </select>
</label>
          
<label>Chaos preset
    <select id="wc-preset">
        <option value="CUSTOM">Custom</option>
        <option value="GLITCHCORE">Glitchcore</option>
        <option value="NIGHTMARE">Nightmare</option>
        <option value="BROKEN">Broken Internet</option>
        <option value="MINIMAL">Minimal Chaos</option>
        <option value="TOTAL">Everything Everywhere</option>
    </select>
</label>
    <div class="wc-selection-title">
        EFFECT SELECTION
        <div class="wc-select-buttons">
            <button id="wc-all">ALL</button>
            <button id="wc-none">NONE</button>
        </div>
    </div>

    <div id="wc-effect-list"></div>

    <label class="wc-toggle">
        <input type="checkbox" id="wc-progressive" checked>
        Progressive corruption
    </label>

    <label class="wc-toggle">
        <input type="checkbox" id="wc-living" checked>
        Living chaos
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
            /* FLOATING CORRUPTION */

.wc-floating-message {
    position: fixed !important;
    z-index: 2147483001 !important;
    pointer-events: none !important;
    font: bold 13px monospace !important;
    color: #ff3333 !important;
    text-shadow: 2px 2px black !important;
    animation: wc-message-in 0.25s ease-out;
}

@keyframes wc-message-in {
    from {
        opacity: 0;
        transform: scale(1.5);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.wc-corrupt-fragment {
    position: fixed !important;
    pointer-events: none !important;
    z-index: 2147483000 !important;
    background: #ff003344 !important;
    border: 1px solid #ff0033 !important;
    animation: wc-fragment 0.3s steps(2) infinite;
}

@keyframes wc-fragment {
    0% { transform: translate(0,0); }
    50% { transform: translate(4px,-3px); }
    100% { transform: translate(-3px,3px); }
}

/* EFFECT SELECTOR */

#wc-effect-list {
    max-height: 220px;
    overflow-y: auto;
    margin: 8px 0;
    padding: 5px;
    background: #111;
    border: 1px solid #333;
}

.wc-effect-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px;
    color: #ddd;
    font: 11px monospace;
}

.wc-effect-option:hover {
    background: #222;
    color: #00ff9c;
}

.wc-effect-option input {
    accent-color: #00ff9c;
}

.wc-selection-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    margin-top: 12px;
}

.wc-select-buttons {
    display: flex;
    gap: 4px;
}

.wc-select-buttons button {
    background: #222;
    color: #00ff9c;
    border: 1px solid #00ff9c;
    padding: 4px 6px;
    font: 10px monospace;
    cursor: pointer;
}

.wc-toggle {
    display: flex !important;
    align-items: center;
    gap: 6px;
    margin: 8px 0 !important;
    font-size: 11px;
}

.wc-toggle input {
    accent-color: #00ff9c;
}
    /* CATEGORY GROUPS */

.wc-effect-category {
    margin-bottom: 6px;
    border: 1px solid #333;
    background: #090909;
}

.wc-effect-category summary {
    cursor: pointer;
    padding: 8px;
    color: #00ff9c;
    font: bold 11px monospace;
    background: #151515;
    user-select: none;
    transition: background 0.2s;
}

.wc-effect-category summary:hover {
    background: #242424;
    color: white;
}

.wc-effect-category[open] summary {
    border-bottom: 1px solid #333;
}

.wc-category-effects {
    padding: 3px;

}

.wc-effect-category summary::marker {
    color: #ff0033;
}
    /* CATEGORY COUNTERS */

.wc-category-count {
    margin-left: auto;
    margin-right: 8px;
    color: #888;
    font-size: 10px;
}

.wc-category-active {
    color: #00ff9c !important;
    border-color: #00ff9c !important;
}

.wc-category-toggle {
    background: #111;
    color: #00ff9c;
    border: 1px solid #333;
    padding: 3px 7px;
    font-size: 9px;
    font-family: monospace;
    cursor: pointer;
}

.wc-category-toggle:hover {
    background: #00ff9c;
    color: #000;
}

.wc-effect-category summary {
    display: flex;
    align-items: center;
    gap: 6px;
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

            const available = getEnabledEffects().filter(effect =>
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

// LIVING CHAOS ENGINE

const chaosMessages = [
    "SIGNAL LOST",
    "WHY IS THIS HAPPENING",
    "ERROR 0x0000",
    "REALITY NOT FOUND",
    "CONNECTION UNSTABLE",
    "DO NOT TRUST THE DISPLAY",
    "SYSTEM BREACH",
    "WHO MOVED THAT",
    "MEMORY CORRUPTED",
    "RECALCULATING...",
    "???",
    "PLEASE WAIT",
    "UNEXPECTED BEHAVIOR",
    "NOTHING IS WRONG",
    "ARE YOU STILL THERE?"
];

function createChaosMessage() {
    const msg = document.createElement("div");
    msg.className = "wc-floating-message";
    msg.textContent = pick(chaosMessages);

    msg.style.left = random(5, 85) + "vw";
    msg.style.top = random(5, 85) + "vh";
    msg.style.fontSize = random(12, 26) + "px";
    msg.style.opacity = random(50, 100) / 100;

    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), random(1200, 4000));
}

function createFragment() {
    const fragment = document.createElement("div");
    fragment.className = "wc-corrupt-fragment";

    fragment.style.left = random(0, 95) + "vw";
    fragment.style.top = random(0, 95) + "vh";
    fragment.style.width = random(20, 180) + "px";
    fragment.style.height = random(2, 50) + "px";

    document.body.appendChild(fragment);

    setTimeout(() => fragment.remove(), random(300, 1500));
}

function twitchElements() {
    const candidates = elements();
    if (!candidates.length) return;

    for (let i = 0; i < Math.min(4, candidates.length); i++) {
        const el = pick(candidates);

        el.animate(
            [
                { transform: "translate(0,0)" },
                { transform: `translate(${random(-8,8)}px,${random(-8,8)}px)` },
                { transform: "translate(0,0)" }
            ],
            {
                duration: random(150, 500),
                iterations: 1
            }
        );
    }
}

function startLivingChaos() {
    let count = 0;

    const chaosInterval = setInterval(() => {
        count++;

        createChaosMessage();  

        if (Math.random() < 0.7) createFragment();
        if (Math.random() < 0.6) twitchElements();

        console.log(`[WEB CHAOS] Disturbance ${count}`);

        // Escalate visual activity over time
        if (count > 10 && Math.random() < 0.3) {
            document.documentElement.style.filter =
                `hue-rotate(${random(0,360)}deg)`;
        }

        if (count >= 20) {
            clearInterval(chaosInterval);
        }
    }, 1800);
}
// EFFECT SELECTION SYSTEM

const effectList = document.getElementById("wc-effect-list");

const categories = {
    "VISUAL DISTORTION": [
        "COLOR INVERSION",
        "GRAYSCALE",
        "HYPERSATURATION",
        "HUE COLLAPSE",
        "DEEP FRIED",
        "BLUR",
        "LOW QUALITY REALITY"
    ],

    "TYPOGRAPHY": [
        "TYPOGRAPHIC CHAOS",
        "FONT DISASTER",
        "TEXT SHADOW",
        "REVERSE READING",
        "AFTERIMAGE"
    ],

    "MOTION & ANIMATION": [
        "EARTHQUAKE",
        "RAINBOW",
        "PULSE",
        "FLOAT",
        "WOBBLE",
        "GLITCH",
        "BLINK",
        "SPIN",
        "TILT",
        "SKEW"
    ],

    "LAYOUT DISASTER": [
        "BIG MODE",
        "TINY MODE",
        "MISALIGNMENT",
        "GRAVITY",
        "MIRROR WORLD",
        "SPACING MELTDOWN",
        "BORDER EXPLOSION",
        "RANDOM SIZING",
        "RANDOM ALIGNMENT",
        "WINDOW PANIC"
    ],

    "SCREEN EFFECTS": [
        "SCANLINES",
        "SCREEN FLASH",
        "OUTLINE EVERYTHING",
        "ELEMENT DISAPPEARANCE"
    ]
};
// CREATE CATEGORY GROUPS

Object.entries(categories).forEach(([category, names]) => {
    const group = document.createElement("details");
    group.className = "wc-effect-category";
    group.open = true;

    const heading = document.createElement("summary");

    const title = document.createElement("span");
    title.textContent = category;

    const count = document.createElement("span");
    count.className = "wc-category-count";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = "ALL";
    toggle.className = "wc-category-toggle";

    heading.appendChild(title);
    heading.appendChild(count);
    heading.appendChild(toggle);

    group.appendChild(heading);

    const list = document.createElement("div");
    list.className = "wc-category-effects";

    names.forEach(name => {
        const index = effects.findIndex(effect => effect.name === name);

        if (index === -1) {
            console.warn("[WEB CHAOS] Missing effect:", name);
            return;
        }

        const label = document.createElement("label");
        label.className = "wc-effect-option";

        label.innerHTML = `
            <input type="checkbox"
                   checked
                   data-effect-index="${index}">
            <span>${name}</span>
        `;

        list.appendChild(label);
    });

    group.appendChild(list);
    effectList.appendChild(group);

    const checkboxes = [...list.querySelectorAll("input")];

    function updateCount() {
        const enabled = checkboxes.filter(cb => cb.checked).length;

        count.textContent = `${enabled}/${checkboxes.length}`;

        toggle.textContent =
            enabled === checkboxes.length ? "NONE" : "ALL";

        toggle.classList.toggle(
            "wc-category-active",
            enabled === checkboxes.length
        );
    }

    toggle.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        const allEnabled = checkboxes.every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allEnabled;
        });

        updateCount();
    });

    checkboxes.forEach(cb => {
        cb.addEventListener("change", updateCount);
    });

    updateCount();
});

// Get enabled effects
function getEnabledEffects() {
    const checkboxes = [
        ...effectList.querySelectorAll("input[type=checkbox]")
    ];

    return effects.filter((effect, index) =>
        checkboxes.some(cb =>
            Number(cb.dataset.effectIndex) === index && cb.checked
        )
    );
}

// SELECT ALL
document.getElementById("wc-all").onclick = () => {
    effectList.querySelectorAll("input").forEach(cb => {
        cb.checked = true;
        cb.dispatchEvent(new Event("change"));
    });
};

// SELECT NONE
document.getElementById("wc-none").onclick = () => {
    effectList.querySelectorAll("input").forEach(cb => {
        cb.checked = false;
        cb.dispatchEvent(new Event("change"));
    });
};

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

        const enabledEffects = getEnabledEffects();

if (enabledEffects.length === 0) {
    alert("Select at least one chaos effect.");
    return;
}

const shuffled = [...enabledEffects].sort(() => Math.random() - .5);
const selected = shuffled.slice(0, Math.min(amount, shuffled.length));

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


