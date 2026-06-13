function loadClasses() {
    let list = document.getElementById("classList");
    list.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);

        // Ignore tout ce qui n'est pas une vraie classe
        if (!key.startsWith("class_") || key.endsWith("_lastReset")) {
            continue;
        }

        let name = key.replace("class_", "");

        let raw = localStorage.getItem(key);
        let data = null;

        try {
            data = raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error("LocalStorage corrompu pour :", key, raw);
            continue;
        }

        let icon = "🏫";
        let students = [];

        if (!data) {
            students = [];
        }
        else if (Array.isArray(data)) {
            students = data;
        }
        else {
            icon = data.icon || "🏫";
            students = data.students || [];
        }

        list.innerHTML += `
            <div class="classCard"
                 onclick="openClass('${name}')">

                <div class="classIcon">${icon}</div>

                <div class="className">${name}</div>

                <div>${students.length} élèves</div>

            </div>
        `;
    }
}

function createClass(){

    let name = document.getElementById("className").value.trim();
    let count = parseInt(document.getElementById("studentCount").value);
let icon =
    document.getElementById("classIcon").value;
    if(!name || isNaN(count) || count < 1 || count > 50){
        alert("Veuillez saisir un nom valide et un nombre d'élèves entre 1 et 50");
        return;
    }

    let students = [];

    for(let i = 0; i < count; i++){
        students.push({

    name:"Élève " + (i+1),

    hearts:10,
    mana:5,
    gold:0,
    xp:0,
    level:1,

    absent:false,

    recurringRewards:{
        hearts:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        },
        mana:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        },
        gold:{
            mon:0,tue:0,wed:0,
            thu:0,fri:0,sat:0,sun:0
        }
    },

    lastRecurringReward:
        new Date()
        .toISOString()
        .split("T")[0],

    gender:"m",
    image:"",
    useDefaultImage:true,
    defaultImage:""
});
    }

   localStorage.setItem(
    "class_"+name,
    JSON.stringify({
        icon: icon,
        students: students
    })
);

    document.getElementById("className").value = "";
    document.getElementById("studentCount").value = "";

    loadClasses();
}
function openClass(name){

    const data =
        JSON.parse(
            localStorage.getItem(
                "class_" + name
            )
        );

    if(data && data.demo){

        window.location.href =
            "demo.html?name=" +
            encodeURIComponent(name);

        return;
    }

    window.location.href =
        "class.html?name=" +
        encodeURIComponent(name);
}
function exportAllClasses(){

    const allClasses = {};

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith("class_")) {
            allClasses[key] = localStorage.getItem(key);
        }
    }

    const blob = new Blob(
        [JSON.stringify(allClasses,null,2)],
        {type:"application/json"}
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "toutes_les_classes.json";
    link.click();
}

function importAllClasses(event){

    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        try{

            const imported =
                JSON.parse(e.target.result);

            for(let key in imported){
                localStorage.setItem(
                    key,
                    imported[key]
                );
            }

            loadClasses();

        }catch(err){

            alert(
                "Erreur : " + err
            );
        }
    };

    reader.readAsText(file);
}
document.addEventListener(
    "DOMContentLoaded",
    init
);

function init() {
    
	document
    .getElementById("createClassBtn")
    .addEventListener(
        "click",
        createClass
    );
	document
    .getElementById("exportBtn")
    .addEventListener(
        "click",
        exportAllClasses
    );
	document
    .getElementById("importBtn")
    .addEventListener(
        "click",
        () => {
            document
                .getElementById("importClassesFile")
                .click();
        }
    );
	loadClasses();
}