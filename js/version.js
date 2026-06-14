const CURRENT_VERSION = "0.0.1";

async function checkForUpdates() {
    try {
        const res = await fetch("./version.json?cache=" + Date.now(), {
            cache: "no-store"
        });

        const data = await res.json();

        console.log("Version serveur:", data.version);

        if (data.version !== CURRENT_VERSION) {
            alert("Nouvelle version disponible !");
        } else {
            console.log("À jour");
        }

    } catch (e) {
        console.error("Erreur update:", e);
    }
}

function forceUpdateCheck() {
    console.log("Bouton update cliqué");
    checkForUpdates();
}