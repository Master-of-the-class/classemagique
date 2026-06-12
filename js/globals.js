const studentName = document.getElementById("studentName");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const settingsMenu = document.getElementById("settingsMenu");
const toolsMenu = document.getElementById("toolsMenu");
const spellEditor = document.getElementById("spellEditor");
const params = new URLSearchParams(window.location.search);
const liveHearts = document.getElementById("liveHearts");
const liveGold = document.getElementById("liveGold");
const liveMana = document.getElementById("liveMana");
const liveXP = document.getElementById("liveXP");
const redemptionPopup = document.getElementById("redemptionPopup");
const dayMapFR = {
    sun: "Dimanche",
    mon: "Lundi",
    tue: "Mardi",
    wed: "Mercredi",
    thu: "Jeudi",
    fri: "Vendredi",
    sat: "Samedi"
};
const popups = {

    student: document.getElementById("popup"),
    redemption: document.getElementById("redemptionPopup"),

    settings: document.getElementById("settingsMenu"),
    tools: document.getElementById("toolsMenu"),

    bulk: document.getElementById("bulkPopup"),
    group: document.getElementById("groupPopup"),

    spellEditor: document.getElementById("spellEditor"),
    spellShop: document.getElementById("spellShopPopup"),

    shop: document.getElementById("shopPopup"),
    shopEditor: document.getElementById("shopEditor"),

    weekly: document.getElementById("weeklyPopup"),

    levelRewards: document.getElementById("levelRewardsPopup"),

    recurring: document.getElementById("studentRecurringPopup"),

    sanctionEditor: document.getElementById("sanctionEditor"),

    sanction: document.getElementById("sanctionPopup")
};
let className = params.get("name") || "Default Class";

let weeklyRewards = JSON.parse(
    localStorage.getItem(className + "_weeklyRewards")
) || {
    hearts: { mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false },
    mana: { mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false },
    gold: { mon:false, tue:false, wed:false, thu:false, fri:false, sat:false, sun:false },
    values: {
        hearts: 0,
        mana: 0,
        gold: 0
    }
};
let redemptionIndex = null;
document.getElementById("classTitle").innerText = className;
let selectedStudents = [];
let rawData = localStorage.getItem("class_" + className);

let raw = null;

try{
    raw = rawData ? JSON.parse(rawData) : null;
}
catch(e){
    console.error("Sauvegarde invalide :", e);
    raw = null;
}

let students = [];

if (Array.isArray(raw)) {
    students = raw;
}
else if (raw && raw.students) {
    students = raw.students;
}
else {
    students = [];
}

let current = null;
let muted = localStorage.getItem("muted")==="true";
let pickedStudents = [];
let syncMinutes =
    parseInt(
        localStorage.getItem("syncMinutes")
    ) || 5;

let syncDisabled =
    localStorage.getItem("syncDisabled")
    === "true";
let today = new Date().toISOString().split("T")[0];
let lastReset = localStorage.getItem("class_" + className + "_lastReset");

if(lastReset !== today){

    students.forEach(s=>{
        s.absent = false;
    });

    localStorage.setItem("class_" + className + "_lastReset", today);
    saveData();
}
let spells = JSON.parse(localStorage.getItem(className+"_spells")) || [
    {name:"Aide d'un élève pour répondre à une question", cost:1, damage:0},
    {name:"Passer son tour", cost:2, damage:0}
];
let shopItems = JSON.parse(localStorage.getItem(className+"_shop")) || [
    {name:"Potion de soin", gold:5, mana:0, hearts:2},
    {name:"Potion de mana", gold:5, manaGain:2, hearts:0}
];

let levelRewards = JSON.parse(
    localStorage.getItem(className + "_levelRewards")
) || {
    gold: 0,
    mana: 0,
    hearts: 0
};

let sanctions = JSON.parse(localStorage.getItem(className + "_sanctions")) || [
    { name: "Bavardage", hearts: -1 },
    { name: "Devoir non fait", hearts: -2 }
];