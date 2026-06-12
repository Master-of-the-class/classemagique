function addXP(amount, index){

    let s = students[index];

    s.xp += amount;

    if(s.xpTotal === undefined){
        s.xpTotal = 0;
    }
    s.xpTotal += amount;

    let leveledUp = false;

    while(s.xp >= 1000){
        s.xp -= 1000;
        s.level++;

        s.gold += levelRewards.gold;

        s.mana = Math.min(5, s.mana + levelRewards.mana);
        s.hearts = Math.min(10, s.hearts + levelRewards.hearts);

        leveledUp = true;

        const oldStage = getEvolutionStage(s.level - 1);
        const newStage = getEvolutionStage(s.level);

        if(oldStage !== newStage){
            refreshDefaultImage(s);
        }


    }

    if(typeof xpEffect === "function"){
        xpEffect(index, amount);
    }

    if(leveledUp){
        levelUpEffect(index);
    }
}

function changeXP(){

    let amount =
        parseInt(
            document.getElementById("xpInput").value
        ) || 0;

    if(amount <= 0)
        return;

    let s = students[current];

    const oldXP =
        s.xp;

    const oldLevel =
        s.level;

   addXP(
    amount,
    current
);

    addHistory({

        studentIndex: current,
        studentName: s.name,

        type: "xp",

        amount: amount,

        before: oldXP,
        after: s.xp,

        beforeLevel: oldLevel,
        afterLevel: s.level,

        source: "individual",

        date: Date.now()

    });

    updateLive();

    saveData();

    setTimeout(() => {

        render();

    },250);
}