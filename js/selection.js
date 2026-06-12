function toggleSelect(i){

    if(students[i].absent) return;

    if(selectedStudents.includes(i)){

        selectedStudents =
            selectedStudents.filter(x => x !== i);

    }else{

        selectedStudents.push(i);
    }

    const card =
        document.getElementById("card-"+i);

    if(card){
        card.classList.toggle("selected");
    }
}

function selectAllStudents(){

    selectedStudents = [];

    students.forEach((s,i)=>{

        if(!s.absent){
            selectedStudents.push(i);
        }

    });

    render();
}

function clearSelection(){

    selectedStudents = [];

    render();
}