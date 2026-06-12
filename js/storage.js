function saveData(){

    const existingRaw =
        localStorage.getItem(
            "class_" + className
        );

    const existing =
        existingRaw
        ? JSON.parse(existingRaw)
        : {};

    existing.students = students || [];

    localStorage.setItem(
        "class_" + className,
        JSON.stringify(existing)
    );
}

function heartbeat(){
    saveData();
    render();
}

function addHistory(entry){

    const history =
        JSON.parse(
            localStorage.getItem(
                className + "_history"
            )
        ) || [];

    history.unshift(entry);

    localStorage.setItem(
        className + "_history",
        JSON.stringify(history)
    );
}