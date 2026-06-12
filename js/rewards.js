function openLevelRewards(){

    document.getElementById("levelGold").value =
        levelRewards.gold;

    document.getElementById("levelMana").value =
        levelRewards.mana;

    document.getElementById("levelHearts").value =
        levelRewards.hearts;

    overlay.style.display = "block";
    document.getElementById("levelRewardsPopup").style.display = "block";
}

function closeLevelRewards(){

    document.getElementById("levelRewardsPopup").style.display = "none";

    if(
        popup.style.display !== "block" &&
        settingsMenu.style.display !== "block" &&
        toolsMenu.style.display !== "block"
    ){
        overlay.style.display = "none";
    }
}

function saveLevelRewards(){

    levelRewards.gold =
        parseInt(document.getElementById("levelGold").value) || 0;

    levelRewards.mana =
        parseInt(document.getElementById("levelMana").value) || 0;

    levelRewards.hearts =
        parseInt(document.getElementById("levelHearts").value) || 0;

    localStorage.setItem(
        className + "_levelRewards",
        JSON.stringify(levelRewards)
    );

    alert("Récompenses sauvegardées !");
    closeLevelRewards();
}



function openWeeklyRewards(){

   const days = [
    ["mon","Lundi"],
    ["tue","Mardi"],
    ["wed","Mercredi"],
    ["thu","Jeudi"],
    ["fri","Vendredi"],
    ["sat","Samedi"],
    ["sun","Dimanche"]
];

    function build(containerId, type){

        const div = document.getElementById(containerId);
        div.innerHTML = "";

        days.forEach(([key,label])=>{
    div.innerHTML += `
        <label style="display:block;">
            <input type="checkbox"
                ${weeklyRewards[type][key] ? "checked" : ""}
                onchange="weeklyRewards['${type}']['${key}']=this.checked">
            ${label}
        </label>
    `;
});
    }

    build("weekHeartsDays","hearts");
    build("weekManaDays","mana");
    build("weekGoldDays","gold");

    document.getElementById("weekHeartsValue").value = weeklyRewards.values.hearts;
    document.getElementById("weekManaValue").value = weeklyRewards.values.mana;
    document.getElementById("weekGoldValue").value = weeklyRewards.values.gold;

    overlay.style.display = "block";
    document.getElementById("weeklyPopup").style.display = "block";
}

function closeWeeklyRewards(){
    document.getElementById("weeklyPopup").style.display = "none";
    overlay.style.display = "none";
}

function saveWeeklyRewards(){

    weeklyRewards.values.hearts =
        parseInt(document.getElementById("weekHeartsValue").value) || 0;

    weeklyRewards.values.mana =
        parseInt(document.getElementById("weekManaValue").value) || 0;

    weeklyRewards.values.gold =
        parseInt(document.getElementById("weekGoldValue").value) || 0;

    localStorage.setItem(
        className + "_weeklyRewards",
        JSON.stringify(weeklyRewards)
    );

    alert("Récompenses hebdomadaires sauvegardées !");
    closeWeeklyRewards();
}

function applyWeeklyRewards(){

    const dayMap = ["sun","mon","tue","wed","thu","fri","sat"];
    const today = dayMap[new Date().getDay()];

    students.forEach(s=>{

        if(s.hearts === 0) return; // ❌ exclu

        if(weeklyRewards.hearts[today]){
            s.hearts = Math.min(10,
                s.hearts + weeklyRewards.values.hearts
            );
        }

        if(weeklyRewards.mana[today]){
            s.mana = Math.min(5,
                s.mana + weeklyRewards.values.mana
            );
        }

        if(weeklyRewards.gold[today]){
            s.gold += weeklyRewards.values.gold;
        }
    });

    saveData();
    render();
}

function autoWeeklyRewards(){

    const today = getTodayKey();

    
    const lastRunKey = "weekly_" + className + "_" + today;
    const lastRun = localStorage.getItem(lastRunKey);

    // déjà appliqué aujourd’hui → on sort
    if(lastRun === "done") return;

    students.forEach(s => {

    if(s.hearts === 0) return;

    if(weeklyRewards.hearts[today]){
        s.hearts = Math.min(
            10,
            s.hearts + weeklyRewards.values.hearts
        );
    }

    if(weeklyRewards.mana[today]){
        s.mana = Math.min(
            5,
            s.mana + weeklyRewards.values.mana
        );
    }

    if(weeklyRewards.gold[today]){
        s.gold += weeklyRewards.values.gold;
    }
});

    localStorage.setItem(lastRunKey, "done");

    saveData();
    render();
}

function openRecurringRewards(){
    if(current == null || !students[current]) return;
    const s = students[current];

    const days =
    ["mon","tue","wed","thu","fri","sat","sun"];

    days.forEach(day=>{

        document.getElementById("rh_"+day).value =
            s.recurringRewards.hearts[day];

        document.getElementById("rm_"+day).value =
            s.recurringRewards.mana[day];

        document.getElementById("rg_"+day).value =
            s.recurringRewards.gold[day];
    });

    document.getElementById(
        "studentRecurringPopup"
    ).style.display = "block";
}

function closeRecurringRewards(){

    document.getElementById(
        "studentRecurringPopup"
    ).style.display = "none";
}

function saveRecurringRewards(){

    const s = students[current];

    const days =
    ["mon","tue","wed","thu","fri","sat","sun"];

    days.forEach(day=>{

        s.recurringRewards.hearts[day] =
            parseInt(
                document.getElementById("rh_"+day).value
            ) || 0;

        s.recurringRewards.mana[day] =
            parseInt(
                document.getElementById("rm_"+day).value
            ) || 0;

        s.recurringRewards.gold[day] =
            parseInt(
                document.getElementById("rg_"+day).value
            ) || 0;
    });

    saveData();

    alert("Récompenses sauvegardées");

    closeRecurringRewards();
}

function applyRewardsForDate(date){

   const dayMap = ["sun","mon","tue","wed","thu","fri","sat"];
    const day = dayMap[date.getDay()];

    students.forEach(s=>{

        if(s.hearts === 0) return;

        if(weeklyRewards.hearts[day]){
            s.hearts = Math.min(10, s.hearts + weeklyRewards.values.hearts);
        }

        if(weeklyRewards.mana[day]){
            s.mana = Math.min(5, s.mana + weeklyRewards.values.mana);
        }

        if(weeklyRewards.gold[day]){
            s.gold += weeklyRewards.values.gold;
        }
    });
}

function applyRecurringRewardsForDate(date){

    const dayMap =
    ["sun","mon","tue","wed","thu","fri","sat"];

    const day =
        dayMap[date.getDay()];

    students.forEach(s=>{

        if(s.hearts === 0) return;

        s.hearts = Math.min(
            10,
            s.hearts +
            (s.recurringRewards.hearts[day] || 0)
        );

        s.mana = Math.min(
            5,
            s.mana +
            (s.recurringRewards.mana[day] || 0)
        );

        s.gold +=
            (s.recurringRewards.gold[day] || 0);
    });
}

function applyMissingDailyRewards(){

    const lastDateKey = "weekly_lastDate_" + className;
    const lastDateStr = localStorage.getItem(lastDateKey);

    const today = new Date();
    today.setHours(0,0,0,0);

   

    let lastDate;

    if(lastDateStr){
        lastDate = new Date(lastDateStr);
        lastDate.setHours(0,0,0,0);
    } else {
        // première visite → on considère aujourd’hui uniquement
        localStorage.setItem(lastDateKey, today.toISOString());
        return;
    }

    // différence en jours
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if(diffDays <= 0) return;

    // appliquer chaque jour manqué
   for(let i = 0; i < diffDays; i++){
const tempDate = new Date(lastDate);

console.log("Applying rewards for", tempDate);

    tempDate.setDate(
        tempDate.getDate() + i + 1
    );

    applyRewardsForDate(tempDate);

    applyRecurringRewardsForDate(
        tempDate
    );
}

    // mettre à jour la dernière date
    localStorage.setItem(lastDateKey, today.toISOString());

    saveData();
    render();
}

function getTodayDate(){
    return new Date().toISOString().split("T")[0];
}

function getTodayKey(){
    const dayMap = ["sun","mon","tue","wed","thu","fri","sat"];
    return dayMap[new Date().getDay()];
}

function getDayKey(date = new Date()){
    return ["sun","mon","tue","wed","thu","fri","sat"][date.getDay()];
}

function getDayLabel(key){
    return dayMapFR[key];
}

function quickHeart(index, value){

    let s = students[index];

    let old = s.hearts;

    s.hearts = Math.min(
        10,
        Math.max(0, s.hearts + value)
    );

    if(s.hearts !== old){

        heartEffect(index, value > 0);

        addHistory({

            studentIndex:index,
            studentName:s.name,

            type:"hearts",

            amount:value,

            before:old,
            after:s.hearts,

            source:"individual",

            date:Date.now()
        });
    }

    saveData();
    render();
}

function quickMana(index, value){
    let s = students[index];
    s.mana = Math.min(5, Math.max(0, s.mana + value));
    saveData();
    render();
}

function quickGold(index, value){
    let s = students[index];
    s.gold = Math.max(0, s.gold + value);
    saveData();
    render();
}

function quickXP(index, amount){
    addXP(amount, index);
    saveData();
    render();
}

function openSanctionEditor(){
    renderSanctions();
    document.getElementById("sanctionEditor").style.display = "block";
    overlay.style.display = "block";
}

function closeSanctionEditor(){
    document.getElementById("sanctionEditor").style.display = "none";
    overlay.style.display = "none";
}

function addSanction(){
    sanctions.push({ name: "Nouvelle sanction", hearts: -1 });
    renderSanctions();
}

function saveSanctions(){
    localStorage.setItem(className + "_sanctions", JSON.stringify(sanctions));
    alert("Sanctions sauvegardées !");
    closeSanctionEditor();
}

let sanctionTarget = null;

function openSanctionMenu(index){
    if(index == null || !students[index]) return;
    sanctionTarget = index;

    const div = document.getElementById("sanctionOptions");
    div.innerHTML = "";

    sanctions.forEach((s, idx) => {
        div.innerHTML += `
            <button onclick="applySanction(${idx})">
                ${s.name} (${s.hearts})
            </button><br>
        `;
    });

    document.getElementById("sanctionPopup").style.display = "block";
    overlay.style.display = "block";
}

function closeSanctionPopup(){
    document.getElementById("sanctionPopup").style.display = "none";
    overlay.style.display = "none";
}

function applySanction(i){
    const s = students[sanctionTarget];
    const sanction = sanctions[i];

    s.hearts = Math.max(0, s.hearts + sanction.hearts);

    heartEffect(sanctionTarget, sanction.hearts > 0 ? true : false);

    saveData();
    render();
	updateLive()
    closeSanctionPopup();
}