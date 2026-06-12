function exportClass(){

    const data = JSON.stringify({

        icon:"🏫",

        students: students,

        shopItems: shopItems,

        spells: spells,

        weeklyRewards: weeklyRewards,

        levelRewards: levelRewards,

        syncSettings:{
            minutes: syncMinutes,
            disabled: syncDisabled
        },

        weeklyLastDate:
            localStorage.getItem(
                "weekly_lastDate_" + className
            )

    }, null, 2);

    const blob = new Blob([data], {type:"application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = className + ".json";
    link.click();
}

// Import class from JSON file
function importClass(event){
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        try{

            const data = JSON.parse(e.target.result);

if(!data.students || !Array.isArray(data.students)){
    alert("Format de fichier invalide !");
    return;
}

students = data.students;
if(data.shopItems)
    shopItems = data.shopItems;

if(data.spells)
    spells = data.spells;

if(data.weeklyRewards)
    weeklyRewards = data.weeklyRewards;

if(data.levelRewards)
    levelRewards = data.levelRewards;

if(data.syncSettings){

    syncMinutes =
        data.syncSettings.minutes || 5;

    syncDisabled =
        data.syncSettings.disabled || false;

    localStorage.setItem(
        "syncMinutes",
        syncMinutes
    );

    localStorage.setItem(
        "syncDisabled",
        syncDisabled
    );
}

if(data.weeklyLastDate){

    localStorage.setItem(
        "weekly_lastDate_" + className,
        data.weeklyLastDate
    );
}
            students.forEach((s,i)=>{

                if(s.hearts === undefined) s.hearts = 10;
                if(s.mana === undefined) s.mana = 5;
                if(s.gold === undefined) s.gold = 0;
                if(s.xp === undefined) s.xp = 0;
                if(s.level === undefined) s.level = 1;

                if(s.image === undefined)
                    s.image = "";

                if(s.gender === undefined)
                    s.gender = "m";

                if(s.useDefaultImage === undefined)
                    s.useDefaultImage = true;

                if(s.defaultImage === undefined ||
                   s.defaultImage === "")
                {
                    refreshDefaultImage(s);
                }

            });
			
localStorage.setItem(
    className+"_shop",
    JSON.stringify(shopItems)
);

localStorage.setItem(
    className+"_spells",
    JSON.stringify(spells)
);

localStorage.setItem(
    className+"_weeklyRewards",
    JSON.stringify(weeklyRewards)
);

localStorage.setItem(
    className+"_levelRewards",
    JSON.stringify(levelRewards)
);
            saveData();
            render();

            alert("Classe importée avec succès !");

        }
        catch(err){

            alert(
                "Erreur lors de la lecture du fichier : "
                + err
            );

        }
    };

    reader.readAsText(file);
}

function goBack(){
    window.location.href="index.html";
}

function goToBoss(){
    window.location.href = "boss.html?name=" + encodeURIComponent(className);
}

