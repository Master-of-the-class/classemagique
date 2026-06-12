function openHistoryPage(){

    window.location.href =
        "historique.html?name=" +
        encodeURIComponent(className);
}

function addHistory(entry){

    let history =
        JSON.parse(
            localStorage.getItem(
                className + "_history"
            )
        ) || [];

    const last = history[0];

  

    if(
        last &&
        last.studentIndex === entry.studentIndex &&
        last.type === entry.type &&
        last.source === entry.source &&
        Date.now() - last.date < 5000
    ){

       

        last.amount += entry.amount;
        last.after = entry.after;
        last.date = Date.now();

        localStorage.setItem(
            className + "_history",
            JSON.stringify(history)
        );

        return;
    }

   

    history.unshift(entry);

    localStorage.setItem(
        className + "_history",
        JSON.stringify(history)
    );
}