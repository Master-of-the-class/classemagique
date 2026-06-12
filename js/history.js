console.log("history.js chargé");
const params =
    new URLSearchParams(location.search);

const className =
    params.get("name");

const container =
    document.getElementById(
        "historyContainer"
    );

renderHistory();

function renderHistory(){

    const history =
        JSON.parse(
            localStorage.getItem(
                className + "_history"
            )
        ) || [];

    let html = "";

    history.forEach((entry,index)=>{

        let icon = "";

        if(entry.type === "hearts")
            icon = "❤️";

        if(entry.type === "mana")
            icon = "🔮";

        if(entry.type === "gold")
            icon = "🪙";

        if(entry.type === "xp")
            icon = "⭐";

        let sourceText = entry.source;

        if(entry.source === "bulk")
            sourceText = "👥 Groupe";

        if(entry.source === "individual")
            sourceText = "👤 Individuel";

        if(entry.source === "weekly")
            sourceText = "📅 Hebdomadaire";

        if(entry.source === "daily")
            sourceText = "🔄 Automatique";

        html += `
        <div class="entry">

            <b>${entry.studentName}</b><br>

            ${icon}
            ${entry.amount > 0 ? "+" : ""}
            ${entry.amount}<br>

            ${sourceText}<br>

            ${new Date(entry.date).toLocaleString()}<br>

            <button
                class="undoBtn"
                onclick="undoHistory(${index})">
                ↩ Annuler
            </button>

        </div>
        `;
    });

    container.innerHTML = html;
}

function undoHistory(index){

    const history =
        JSON.parse(
            localStorage.getItem(
                className + "_history"
            )
        ) || [];

    const entry =
        history[index];

    const classData =
        JSON.parse(
            localStorage.getItem(
                "class_" + className
            )
        );

    const student =
        classData.students[
            entry.studentIndex
        ];

    student[entry.type] =
    entry.before;

if(
    entry.type === "xp" &&
    entry.beforeLevel !== undefined
){

    student.level =
        entry.beforeLevel;
}
    localStorage.setItem(
        "class_" + className,
        JSON.stringify(classData)
    );

    history.splice(index,1);

    localStorage.setItem(
        className + "_history",
        JSON.stringify(history)
    );

    renderHistory();
}

function goBack(){

    const params =
        new URLSearchParams(location.search);

    const className =
        params.get("name");

    window.location.href =
        "class.html?name=" +
        encodeURIComponent(className);
}