function bulkReward(){
const selected = document.querySelectorAll(".selectBox:checked");
    

    if(selected.length === 0){
        alert("Aucun élève sélectionné");
        return;
    }

    overlay.style.display = "block";
    document.getElementById("bulkPopup").style.display = "block";
}

function applyBulkReward(){
console.log("selectedStudents", selectedStudents);
console.log(
    selectedStudents.map(i => ({
        name: students[i].name,
        hearts: students[i].hearts,
        mana: students[i].mana,
        gold: students[i].gold,
        xp: students[i].xp
    }))
);
const checked =
    document.querySelectorAll(".selectBox:checked");

console.log("checked", checked.length);
    if(selectedStudents.length === 0){
        alert("Aucun élève sélectionné");
        return;
    }

    let hearts = parseInt(document.getElementById("bulkHearts").value) || 0;
    let mana   = parseInt(document.getElementById("bulkMana").value) || 0;
    let gold   = parseInt(document.getElementById("bulkGold").value) || 0;
    let xp     = parseInt(document.getElementById("bulkXP").value) || 0;

    selectedStudents.forEach(i=>{

    const oldHearts = students[i].hearts;
    const oldMana = students[i].mana;
    const oldGold = students[i].gold;

    students[i].hearts =
        Math.min(
            10,
            Math.max(
                0,
                students[i].hearts + hearts
            )
        );

    students[i].mana =
        Math.min(
            5,
            Math.max(
                0,
                students[i].mana + mana
            )
        );

    students[i].gold =
        Math.max(
            0,
            students[i].gold + gold
        );

    if(hearts !== 0){

        addHistory({

            studentIndex:i,
            studentName:students[i].name,

            type:"hearts",

            amount:hearts,

            before:oldHearts,
            after:students[i].hearts,

            source:"bulk",

            date:Date.now()
        });
    }

    if(mana !== 0){

        addHistory({

            studentIndex:i,
            studentName:students[i].name,

            type:"mana",

            amount:mana,

            before:oldMana,
            after:students[i].mana,

            source:"bulk",

            date:Date.now()
        });
    }

    if(gold !== 0){

        addHistory({

            studentIndex:i,
            studentName:students[i].name,

            type:"gold",

            amount:gold,

            before:oldGold,
            after:students[i].gold,

            source:"bulk",

            date:Date.now()
        });
    }

    if(xp !== 0){

        addXP(xp, i);

        addHistory({

            studentIndex:i,
            studentName:students[i].name,

            type:"xp",

            amount:xp,

            before:students[i].xp - xp,
            after:students[i].xp,

            source:"bulk",

            date:Date.now()
        });
    }

});

    saveData();
    render();

    selectedStudents = []; // reset propre
    closeAll();
}

function pickRandomStudent(){

    if(students.length === 0){
        alert("Aucun élève dans la classe");
        return;
    }

    let available = students.map((s,i)=>i).filter(i => !students[i].absent);

    if(document.getElementById("noRepeatToggle").checked){
        available = available.filter(i => !pickedStudents.includes(i));

        if(available.length === 0){
            alert("Tous les élèves ont déjà été choisis !");
            return;
        }
    }

    const index = available[Math.floor(Math.random()*available.length)];

    if(document.getElementById("noRepeatToggle").checked){
        pickedStudents.push(index);
    }

    document.querySelectorAll(".card").forEach(c=>{
        c.style.outline="none";
        c.style.transform="scale(1)";
    });

    const card = document.getElementById("card-"+index);
    card.style.outline="4px solid purple";
    card.style.transform="scale(1.05)";
    card.style.transition="0.3s";

    alert("🎉 Élève sélectionné : " + students[index].name);
}


/*reset function*/
function resetPicked(){
    pickedStudents = [];
    alert("Liste des élèves choisis réinitialisée !");
}


/*group maker*/
function makeGroups(){

    if(students.length === 0){
        alert("Il n'y a pas d'élèves dans la classe");
        return;
    }

    let groupSize = parseInt(document.getElementById("groupSize").value);
    if(groupSize < 2) groupSize = 2;
    if(groupSize > 6) groupSize = 6;

    let shuffled = [...students]
    .map((s,i)=>({student:s,index:i}))
    .filter(x => !x.student.absent)
    .sort(()=>Math.random()-0.5);

    let groups = [];
    let usedIndexes = [];

    for(let i=0; i<shuffled.length; i+=groupSize){
        let group = shuffled.slice(i, i+groupSize);

        // If only one left → FREE student
        if(group.length === 1){
            break;
        }

        group.forEach(member=>{
            usedIndexes.push(member.index);
        });

        groups.push(group);
    }

    // FREE students
    let freeStudents = students
        .map((s,i)=>({student:s,index:i}))
        .filter(s => !usedIndexes.includes(s.index));

    // Clear outlines
    document.querySelectorAll(".card").forEach(c=>c.style.outline="none");

    const colors = ["red","blue","green","orange","purple","brown"];

    groups.forEach((group,gIndex)=>{
        group.forEach(member=>{
            const card = document.getElementById("card-"+member.index);
            card.style.outline="4px solid "+colors[gIndex % colors.length];
        });
    });

    // Build popup content
    let content = "";

    groups.forEach((group,i)=>{
        content += "<strong>Groupe "+(i+1)+"</strong><br>";
        group.forEach(member=>{
            content += "- " + member.student.name + "<br>";
        });
        content += "<br>";
    });

    // SHOW FREE STUDENTS
    if(freeStudents.length > 0){
        content += "<strong>Élève(s) libre(s)</strong><br>";
        freeStudents.forEach(member=>{
            content += "- " + member.student.name + "<br>";
        });
    }

    document.getElementById("groupContent").innerHTML = content;

    overlay.style.display="block";
    document.getElementById("groupPopup").style.display="block";

    window.currentGroups = groups;
}


/*group download*/
function downloadGroups(){

    if(!window.currentGroups) return;

    let text = "";

    window.currentGroups.forEach((group,i)=>{
        text += "Groupe "+(i+1)+"\n";
        group.forEach(member=>{
            text += "- " + member.student.name + "\n";
        });
        text += "\n";
    });

    const blob = new Blob([text], {type:"text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "groupes.txt";
    link.click();
}

