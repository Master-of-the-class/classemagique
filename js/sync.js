function saveSyncSettings(){

    syncMinutes =
        parseInt(
            document.getElementById("syncMinutes").value
        ) || 5;

    if(syncMinutes < 1){
        syncMinutes = 1;
    }

    syncDisabled =
        document.getElementById("disableSync").checked;

    localStorage.setItem(
        "syncMinutes",
        syncMinutes
    );

    localStorage.setItem(
        "syncDisabled",
        syncDisabled
    );

    countdown = syncMinutes * 60;

    alert("Réglages sauvegardés !");
}

function toggleMute(){
    muted = document.getElementById("muteToggle").checked;
    localStorage.setItem("muted", muted);
}

function openSettings(){ 
overlay.style.display="block"; 
settingsMenu.style.display="block"; 

}

function openTools(){ 
overlay.style.display="block"; toolsMenu.style.display="block"; 
}

function syncClassData(){
if(syncDisabled) return;
    const rawData =
        localStorage.getItem("class_" + className);

    if(!rawData) return;

    const raw = JSON.parse(rawData);

  if(raw.students){

    console.log("SYNC");

    students = raw.students;

    render();
}
}
setInterval(()=>{
if(syncDisabled){

    timerDisplay.innerText =
        "🔄 Désactivée";

    return;
}
    countdown--;

    const minutes =
        Math.floor(countdown / 60);

    const seconds =
        countdown % 60;

    timerDisplay.innerText =
        `🔄 ${minutes}:${seconds
            .toString()
            .padStart(2,"0")}`;

    if(countdown <= 0){

        // si popup ouverte -> on reporte
        if(
            popup.style.display === "block" ||
            redemptionPopup.style.display === "block" ||
            settingsMenu.style.display === "block" ||
            toolsMenu.style.display === "block"
        ){
            countdown = 60;
            return;
        }

        syncClassData();

        countdown = 300;
    }

},1000);

window.addEventListener("storage", function(e){

    if(e.key === "class_" + className){

        const raw = JSON.parse(e.newValue);

        if(raw && raw.students){

            students = raw.students;

            render();
        }
    }
});


setInterval(heartbeat,300000);

let countdown = syncMinutes * 60;

const timerDisplay =
    document.getElementById("syncTimer");