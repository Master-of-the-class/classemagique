async function checkForUpdates(force = false) {

    const res = await fetch("version.json?t=" + Date.now());
    const data = await res.json();

    const localVersion = localStorage.getItem("app_version");

    console.log("Local:", localVersion);
    console.log("Remote:", data.version);

    // première visite → on enregistre
    if (!localVersion) {
        localStorage.setItem("app_version", data.version);
        return;
    }

    // si version différente OU force check
    if (force || localVersion !== data.version) {

        const ok = confirm(
            `Nouvelle version ${data.version} disponible. Recharger ?`
        );

        if (ok) {
            localStorage.setItem("app_version", data.version);
            location.reload();
        }
    }
}

function forceUpdateCheck() {
    checkForUpdates(true);
}