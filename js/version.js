const CURRENT_VERSION = "0.0.1";

async function checkForUpdates() {
    const res = await fetch("./version.json?cache=" + Date.now());
    const data = await res.json();

    const serverVersion = String(data.version).trim();
    const localVersion = String(CURRENT_VERSION).trim();

    console.log("LOCAL:", localVersion);
    console.log("SERVER:", serverVersion);

    if (serverVersion !== localVersion) {
        alert("Nouvelle version disponible !");
    } else {
        console.log("À jour");
    }
}

function forceUpdateCheck() {
    console.log("Bouton update cliqué");
    checkForUpdates();
}