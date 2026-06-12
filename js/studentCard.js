function createStudentCard(s, i){

    const imageName =
        s.useDefaultImage
            ? s.defaultImage
            : s.image;

    const xpPercent =
        Math.min(100, (s.xp / 1000) * 100);

    let rarity = "";

    if(s.hearts === 0){
    rarity = "dead";
}
    else if(s.level >= 20){
        rarity = "legendary";
    }
    else if(s.level >= 10){
        rarity = "epic";
    }
    else if(s.level >= 5){
        rarity = "rare";
    }

    return `

<div class="card ${rarity} ${selectedStudents.includes(i) ? "selected" : ""} pop"
     id="card-${i}"
     onclick="openPopup(${i})">

    <input type="checkbox"
        class="selectBox"
        ${selectedStudents.includes(i) ? "checked" : ""}
        onclick="toggleSelect(${i});event.stopPropagation()">

    <div class="portraitWrapper">

        <img
            class="studentPortrait ${s.absent ? "absent" : ""}"
            src="${imageName}"
            onerror="this.src='images/m1-1.jpg'">

        ${s.absent ? `
            <img
                class="absentOverlay"
                src="images/dragondodo.jpg">
        ` : ""}

    </div>

    <div class="studentName">
        ${s.name}
        ${s.gender === "f" ? "♀" : "♂"}
    </div>

    <div class="levelBadge">
        ⭐ Niveau ${s.level}
    </div>

    <div class="xpBar">
        <div class="xpFill"
             style="width:${xpPercent}%">
        </div>
    </div>

   <div class="statsCompact">
    <div><span class="icon">❤️</span><span>${s.hearts}</span></div>
    <div><span class="icon">🔮</span><span>${s.mana}</span></div>
    <div><span class="icon">🪙</span><span>${s.gold}</span></div>
</div>

</div>
`;
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