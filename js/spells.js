function openSpellEditor(){

    document.getElementById("toolsMenu").style.display = "none";

    renderSpells();

    document.getElementById("overlay").style.display = "block";
    document.getElementById("spellEditor").style.display = "block";
}

function closeSpellEditor(){

    document.getElementById("spellEditor").style.display = "none";

    const popup = document.getElementById("popup");
    const settingsMenu = document.getElementById("settingsMenu");
    const toolsMenu = document.getElementById("toolsMenu");
    const overlay = document.getElementById("overlay");

    const isPopupOpen = popup && popup.style.display === "block";
    const isSettingsOpen = settingsMenu && settingsMenu.style.display === "block";
    const isToolsOpen = toolsMenu && toolsMenu.style.display === "block";

    if(!isPopupOpen && !isSettingsOpen && !isToolsOpen){
        overlay.style.display = "none";
    }
}

function renderSpellShop(){

    const div = document.getElementById("spellShopList");
    div.innerHTML = "";

    const safeSpells = spells.filter(s => (s.damage || 0) <= 0);

    if(safeSpells.length === 0){
        div.innerHTML = "<p>Aucun sort disponible</p>";
        return;
    }

    safeSpells.forEach((spell, i)=>{

        const btn = document.createElement("button");
        btn.style.display = "block";
        btn.style.width = "100%";
        btn.style.margin = "5px 0";

        btn.innerText = `${spell.name} 🔮${spell.cost}`;

        btn.onclick = () => buySpell(spell);

        div.appendChild(btn);
    });
}

function addSpell(){
    spells.push({name:"Nouveau", cost:1, damage:1});
    renderSpells();
}

function removeSpell(i){
    spells.splice(i,1);
    renderSpells();
}

function saveSpells(){
    localStorage.setItem(
        className+"_spells",
        JSON.stringify(spells)
    );

    alert("Sorts sauvegardés !");

    closeSpellEditor();
}

function openSpellShop(){
    renderSpellShop();
    overlay.style.display = "block";
    document.getElementById("spellShopPopup").style.display = "block";
}

function closeSpellShop(){
    document.getElementById("spellShopPopup").style.display = "none";
    overlay.style.display = "none";
}

function renderSpells(){
    const div = document.getElementById("spellList");
    div.innerHTML = "";

    spells.forEach((s,i)=>{
        div.innerHTML += `
        <div style="margin-bottom:10px;">
            Nom: <input value="${s.name}" onchange="spells[${i}].name=this.value"><br>
            Mana: <input type="number" value="${s.cost}" onchange="spells[${i}].cost=parseInt(this.value)"><br>
            Dégâts: <input type="number" value="${s.damage}" onchange="spells[${i}].damage=parseInt(this.value)">
            <button onclick="removeSpell(${i})">❌</button>
        </div>
        `;
    });
}

function buySpell(spell){

    const s = students[current];

    if(s.mana < spell.cost){
        alert("Pas assez de mana !");
        return;
    }

    s.mana -= spell.cost;

    // exemple : bonus non violent
    if(spell.name.toLowerCase().includes("heal")){
        s.hearts = Math.min(10, s.hearts + 1);
    }

    if(spell.name.toLowerCase().includes("shield")){
        s.gold += 1; // ou buff fictif
    }

    updateLive();
    saveData();
    render();

    
    closeSpellShop();
}

