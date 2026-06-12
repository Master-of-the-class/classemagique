let params = new URLSearchParams(window.location.search);
let className = params.get("name") || "Classe";

let raw = JSON.parse(
    localStorage.getItem("class_" + className)
);
let selectedStudentLocked = null;
let students = [];
let usedStudents = [];
const statusContainer = document.getElementById("statusContainer");
const manaShop = document.getElementById("manaShop");
const spellContainer = document.getElementById("spellContainer");
const popupImg = document.getElementById("popupImg");
const popupName = document.getElementById("popupName");
const popupStats = document.getElementById("popupStats");
const overlay = document.getElementById("overlay");
if(Array.isArray(raw)){
    students = raw; // anciennes classes
}
else if(raw){
    students = raw.students || [];
}
let spells = JSON.parse(localStorage.getItem(className + "_spells")) || [];

let boss = {hearts:3,xp:150,gold:5,mana:0,escape:3};
let wrongCount = 0;
let currentStudent = null;
let fightEnded = false;

function shakeBoss(){
    const bossImg = document.getElementById("bossImage");

    bossImg.classList.add("shake", "hit");

    setTimeout(()=>{
        bossImg.classList.remove("shake", "hit");
    }, 300);
}

function startFight(){

    let randomIndex = Math.floor(Math.random()*20)+1;
    document.getElementById("bossImage").src = "boss"+randomIndex+".png";

    boss.hearts = parseInt(bossHearts.value)||3;
    boss.xp = parseInt(bossXP.value)||150;
    boss.gold = parseInt(bossGold.value)||5;
    boss.mana = parseInt(bossMana.value)||0;
    boss.escape = parseInt(bossEscape.value)||3;

    wrongCount = 0;
    fightEnded = false;

    document.getElementById("setupDiv").style.display="none";
    document.getElementById("fightDiv").style.display="block";
    usedStudents = [];
    currentStudent = null;
    renderSelectedStudentBar();
    updateBoss();
}

function skipTurn(){
    if(fightEnded) return;



    alert("Tour passé !");
clearSelectedStudent();
}

function updateBoss(){
    let c = document.getElementById("heartsContainer");
    c.innerHTML = "";
    for(let i=0;i<boss.hearts;i++) c.innerHTML += "❤️";

    // affichage fuite
    let remaining = boss.escape - wrongCount;

    document.getElementById("statusContainer").innerHTML =
        `⏳ Tentatives restantes : ${remaining}`;
}

function bossFlees(){
    fightEnded = true;

    statusContainer.innerHTML =
        `<div class="victoryText">💨 Le boss s'est enfui !</div>`;

    let btn = document.createElement("button");
    btn.innerText = "🏫 Retourner à la classe";
    btn.onclick = () => {
        window.location.href = "class.html?name=" + encodeURIComponent(className);
    };

    statusContainer.appendChild(document.createElement("br"));
    statusContainer.appendChild(btn);
}
function renderSelectedStudentBar(){
    const bar = document.getElementById("currentStudentBar");

    if(!currentStudent){
        bar.innerHTML = "";
        return;
    }

    bar.innerHTML = `
        <div class="studentCard" onclick="reopenStudentPopup()">

            ${currentStudent.image ? `
                <img src="${currentStudent.image}">
            ` : ""}

            <div><b>${currentStudent.name}</b></div>

            <div class="studentStats">
                ❤️ ${currentStudent.hearts || 0}<br>
                🔮 ${currentStudent.mana || 0}<br>
                🪙 ${currentStudent.gold || 0}<br>
                ⭐ XP ${currentStudent.xp || 0}
            </div>

        </div>
    `;
}

function updateStudentCard(){
    renderSelectedStudentBar();
}



function showRandomStudent(){
    if(fightEnded){
        alert("Le combat est terminé !");
        return;
    }

    closeAll();

    let alive = students.filter(s => (s.hearts || 0) > 0);

    // ❌ on retire ceux déjà utilisés dans ce cycle
    let available = alive.filter(s => !usedStudents.includes(s));

    // 🔁 si tout le monde a déjà joué → on reset le cycle
    if(available.length === 0){
        usedStudents = [];
        available = alive;

        alert("🔄 Tous les élèves ont joué ! Nouveau cycle !");
    }

    if(available.length === 0){
        alert("Aucun élève vivant !");
        return;
    }

    let s = available[Math.floor(Math.random() * available.length)];
    currentStudent = s;

    usedStudents.push(s);

    const img = document.getElementById("popupImg");

    if(s.image){
        img.src = s.image;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }

    document.getElementById("popupName").innerText = s.name;

    updatePopup();

    document.getElementById("overlay").style.display = "block";
    document.getElementById("studentPopup").style.display = "block";

    renderSelectedStudentBar();
}

function clearSelectedStudent(){
    currentStudent = null;
    renderSelectedStudentBar();
}

function reopenStudentPopup(){
    if(!currentStudent) return;

    const img = document.getElementById("popupImg");

    if(currentStudent.image){
        img.src = currentStudent.image;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }

    document.getElementById("popupName").innerText = currentStudent.name;

    updatePopup();

    document.getElementById("overlay").style.display = "block";
    document.getElementById("studentPopup").style.display = "block";
}



function updatePopup(){
    if(!currentStudent) return;

    document.getElementById("popupStats").innerHTML =
        "❤️ "+(currentStudent.hearts||0)+"/10<br>"+
        "🪙 "+(currentStudent.gold||0)+"<br>"+
        "🔮 "+(currentStudent.mana||0)+"<br>"+
        "⭐ XP "+(currentStudent.xp||0);
updateStudentCard();
}

function closePopup(){
    document.getElementById("studentPopup").style.display="none";
    document.getElementById("overlay").style.display="none";
    document.getElementById("manaShop").style.display="none";
}


function changeMana(v){
    if(!currentStudent) return;
    currentStudent.mana = Math.max(0,(currentStudent.mana||0)+v);
    updatePopup();
updateStudentCard();
}



function openManaShop(){
    manaShop.style.display="block";
    renderSpellsShop();
}

function closeManaShop(){
    manaShop.style.display="none";
}

function renderSpellsShop(){

    let div = spellContainer;
    div.innerHTML = "";

    spells.forEach(spell=>{
        let btn = document.createElement("button");
        btn.innerText = `${spell.name} (${spell.cost})`;
        btn.onclick = () => useSpell(spell);
        div.appendChild(btn);
        div.appendChild(document.createElement("br"));
    });
}

function useSpell(spell){

    if(!currentStudent || fightEnded) return;

    if((currentStudent.mana||0) < spell.cost){
        alert("Pas assez de mana !");
        return;
    }

    currentStudent.mana -= spell.cost;
    boss.hearts -= spell.damage;

    if(boss.hearts < 0) boss.hearts = 0;

    updateBoss();
    updatePopup();
    closeManaShop();
updateStudentCard();

    if(boss.hearts === 0){
        victory();
    }
}



function goodAnswer(){
    if(fightEnded) return;

    boss.hearts--;
    shakeBoss(); 
    updateBoss();
clearSelectedStudent();
    if(boss.hearts <= 0){
        victory();

    }
}

function wrongAnswer(){
    if(fightEnded) return;

    wrongCount++;
clearSelectedStudent();
    if(wrongCount >= boss.escape){
        bossFlees();
        return;

    }
updateBoss();
}



function victory(){

    fightEnded = true;

    let btn = document.createElement("button");
    btn.innerText = "🎁 Récupérer les récompenses";
    btn.onclick = claimRewards;

    statusContainer.innerHTML =
        '<div class="victoryText">🏆 BOSS VAINCU ! 🏆</div>';

    statusContainer.appendChild(document.createElement("br"));
    statusContainer.appendChild(btn);
}

function claimRewards(){

    students.forEach((s,index)=>{

        if(s.hearts <= 0)
            return;

        const oldGold = s.gold;
        const oldMana = s.mana;
        const oldXP = s.xp;
		const oldLevel = s.level;

        s.gold += boss.gold;
        s.mana += boss.mana;

       console.log(
    "Avant XP :",
    s.name,
    s.xp
);

addXP(
    s,
    boss.xp
);

console.log(
    "Après XP :",
    s.name,
    s.xp
);

        addHistory({
            studentIndex:index,
            studentName:s.name,
            type:"gold",
            amount:boss.gold,
            before:oldGold,
            after:s.gold,
            source:"boss",
            date:Date.now()
        });

        addHistory({
            studentIndex:index,
            studentName:s.name,
            type:"mana",
            amount:boss.mana,
            before:oldMana,
            after:s.mana,
            source:"boss",
            date:Date.now()
        });

      addHistory({

    studentIndex:index,
    studentName:s.name,

    type:"xp",

    amount:boss.xp,

    before:oldXP,
    after:s.xp,

    beforeLevel:oldLevel,
    afterLevel:s.level,

    source:"boss",

    date:Date.now()
});

    });

    saveData();

    alert("Récompenses distribuées !");

    window.location.href =
        "class.html?name=" +
        encodeURIComponent(className);
}



function endFight(){
    fightEnded = true;
}


function addXP(s, amount){

    s.xp = (s.xp||0) + amount;
    if(!s.level) s.level = 1;

    while(s.xp >= 1000){
        s.xp -= 1000;
        s.level++;
    }
}

function closeAll(){
    document.getElementById("studentPopup").style.display="none";
    document.getElementById("overlay").style.display="none";
    document.getElementById("manaShop").style.display="none";
}