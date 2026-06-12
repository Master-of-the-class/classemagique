function openShop(){
    current = null; // IMPORTANT : mode boutique générale
    renderShop();
    overlay.style.display = "block";
    document.getElementById("shopPopup").style.display = "block";
}

function closeShop(){
    document.getElementById("shopPopup").style.display = "none";
    overlay.style.display = "none";
}

function openShopEditor(){
    
    renderShopEditor();

    overlay.style.display = "block";
    document.getElementById("shopEditor").style.display = "block";
}

function closeShopEditor(){
    document.getElementById("shopEditor").style.display = "none";
    overlay.style.display = "none";
}

function renderShop(){

    const div = document.getElementById("shopList");
    div.innerHTML = "";

    if(shopItems.length === 0){
        div.innerHTML = "<p>Aucun objet disponible</p>";
        return;
    }

    shopItems.forEach((item, i)=>{

        const btn = document.createElement("button");
        btn.style.display = "block";
        btn.style.width = "100%";
        btn.style.margin = "5px 0";

       btn.innerHTML = `
    ${item.name}<br>
    🪙 ${item.gold}
    | 🔮 ${item.mana || 0}
    | ❤️ ${item.hearts || 0}
`;

        btn.onclick = () => buyItem(item);

        div.appendChild(btn);
    });
}

function renderShopEditor(){

    const div = document.getElementById("shopEditorList");

    if(!div){
        console.error("shopEditorList introuvable");
        return;
    }

    div.innerHTML = "";

    shopItems.forEach((item, i)=>{

        div.innerHTML += `
        <div style="border:1px solid #a88443;padding:8px;margin-bottom:10px;border-radius:8px;">
            
            Nom:<br>
            <input value="${item.name}"
                onchange="shopItems[${i}].name=this.value"><br><br>

            🪙 Or:<br>
            <input type="number" value="${item.gold}"
                onchange="shopItems[${i}].gold=parseInt(this.value)||0"><br><br>

            🔮 Mana (+/-):<br>
            <input type="number" value="${item.mana}"
                onchange="shopItems[${i}].mana=parseInt(this.value)||0"><br><br>

            ❤️ Cœurs (+/-):<br>
            <input type="number" value="${item.hearts || 0}"
                onchange="shopItems[${i}].hearts=parseInt(this.value)||0"><br><br>

            <button onclick="removeShopItem(${i})">❌ Supprimer</button>
        </div>
        `;
    });
}

function addShopItem(){
    shopItems.push({
        name:"Nouvel objet",
        gold:0,
        mana:0,
        hearts:0
    });

    renderShopEditor();
}

function removeShopItem(i){
    shopItems.splice(i,1);
    renderShopEditor();
}

function saveShop(){
    localStorage.setItem(className+"_shop", JSON.stringify(shopItems));
}

function saveShopItems(){
    localStorage.setItem(className+"_shop", JSON.stringify(shopItems));
    alert("Boutique sauvegardée !");
    closeShopEditor();
}

function buyItem(item){

    if(current === null){
        alert("Sélectionne d'abord un élève !");
        return;
    }

    const s = students[current];
    if(!s){
        alert("Erreur : élève introuvable");
        return;
    }

    // 💡 CALCULS PROVISOIRES (test avant achat)
    const newGold   = s.gold - item.gold;
    const newMana   = s.mana + (item.mana || 0);
    const newHearts = s.hearts + (item.hearts || 0);

    // ❌ BLOQUAGE SI INSUFFISANT
    if(newGold < 0){
        alert("Pas assez d'or !");
        return;
    }

    if(newMana < 0){
        alert("Pas assez de mana !");
        return;
    }

    if(newHearts < 0){
        alert("Pas assez de cœurs !");
        return;
    }

    // 💰 APPLICATION
    s.gold = newGold;

    s.mana = Math.max(0, Math.min(5, newMana));
    s.hearts = Math.max(0, Math.min(10, newHearts));

    // 🎯 effets spéciaux
    if(item.effect === "heal"){
        s.hearts = Math.min(10, s.hearts + 2);
    }

    if(item.effect === "mana"){
        s.mana = Math.min(5, s.mana + 2);
    }

    saveData();
    render();
    closeShop();
}

function openStudentShop(index){
    if(index === undefined || index === null) return;
    current = index;
    renderShop();
    overlay.style.display = "block";
    document.getElementById("shopPopup").style.display = "block";
}

