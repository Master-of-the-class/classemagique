function renderSanctions(){
    const div = document.getElementById("sanctionList");
    div.innerHTML = "";

    sanctions.forEach((s, i) => {
        div.innerHTML += `
            <div style="margin-bottom:10px;">
                <input type="text" value="${s.name}"
                    onchange="sanctions[${i}].name=this.value">

                <input type="number" value="${s.hearts}"
                    onchange="sanctions[${i}].hearts=parseInt(this.value)">

                ❤️
                <button onclick="sanctions.splice(${i},1);renderSanctions()">❌</button>
            </div>
        `;
    });
}