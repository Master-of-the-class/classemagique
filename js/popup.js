function openPopup(index){

    if(!students[index])
        return;

    const s = students[index];
    current = index;
/* // 💀 CAS SPÉCIAL : RÉDEMPTION
    if(s.hearts === 0){
        openRedemption(index);
        return;
    }*/

    // ✅ CAS NORMAL
    studentName.value = s.name;

    document.getElementById("previewImage").src =
        s.useDefaultImage ? s.defaultImage : s.image;

    document.getElementById("genderDisplay").innerText =
        s.gender === "f" ? "♀ Féminin" : "♂ Masculin";

    updateLive();

    document.getElementById("card-"+index).style.outline="3px solid orange";

    openPopupById("student");
}

function closeAll(){

    closeAllPopups();

    document.getElementById("importFile").value = "";

    saveData();

    render();
}

function openPopupById(name){

    overlay.style.display = "block";

    popups[name].style.display = "block";
}

function closeAllPopups(){

    Object.values(popups).forEach(p => {
        p.style.display = "none";
    });

    overlay.style.display = "none";
}

function openRedemption(index){

    const s = students[index];
    if(!s) return;

    redemptionIndex = index;

    document.getElementById("redemptionImage").src =
        s.useDefaultImage ? s.defaultImage : s.image;

    document.getElementById("redemptionName").innerText =
        s.name;

    openPopupById("redemption");
}

function closeRedemption(){
    closeAllPopups();
    redemptionIndex = null;
}

function redeemStudent(){

    if(redemptionIndex === null) return;

    const s = students[redemptionIndex];

    s.hearts = 1;

    saveData();
    render();

    closeRedemption();
}

