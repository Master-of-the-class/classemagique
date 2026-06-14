const CURRENT_VERSION = "0.0.1";

async function checkForUpdates() {
    try {
        const res = await fetch("./version.json?cache=" + Date.now(), {
            cache: "no-store"
        });

        const data = await res.json();

        const serverVersion = String(data.version).trim();
        const localVersion = String(CURRENT_VERSION).trim();

        console.log("LOCAL:", localVersion);
        console.log("SERVER:", serverVersion);

        if (serverVersion !== localVersion) {
            showUpdatePopup(serverVersion, data.message);
        } else {
            console.log("✔ À jour");
        }

    } catch (e) {
        console.error("Erreur update:", e);
    }
}

function showUpdatePopup(version, message) {

  
    if (document.getElementById("updatePopup")) return;

    const popup = document.createElement("div");
    popup.id = "updatePopup";

    popup.innerHTML = `
        <div class="update-box">
            <h2>🔄 Mise à jour disponible</h2>
            <p><b>Version :</b> ${version}</p>
            <p>${message || "Nouvelle mise à jour disponible."}</p>

            <button id="updateBtn">🚀 Mettre à jour</button>
            <button id="laterBtn">Plus tard</button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("updateBtn").onclick = () => {
        forceUpdate();
    };

    document.getElementById("laterBtn").onclick = () => {
        popup.remove();
    };
}

function forceUpdate() {
    console.log("Update forcé");

  
    window.location.href = window.location.href.split("?")[0] + "?v=" + Date.now();
}
}