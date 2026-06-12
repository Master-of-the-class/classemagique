function render(){

    const container = document.getElementById("students");

    let html = "";

    students.forEach((s,i)=>{

        html += createStudentCard(s,i);

    });

    container.innerHTML = html;

    updateGrid();
}

function renderStudent(i){

    const oldCard =
        document.getElementById(`card-${i}`);

    if(!oldCard) return;

    oldCard.outerHTML =
        createStudentCard(students[i], i);
}



function updateGrid(){

    const container = document.getElementById("students");

    const width = window.innerWidth;

    let cols = 6;

    if(width > 1800){
        cols = 7;
    }

    if(students.length > 40){
        cols++;
    }

    container.style.gridTemplateColumns =
        `repeat(${cols}, 1fr)`;
}

function updateLive(){
    const s = students[current];
    liveHearts.innerText = s.hearts+"/10";
    liveGold.innerText = s.gold;
    liveMana.innerText = s.mana+"/5";
    liveXP.innerText = s.xp + " / 1000";
}













