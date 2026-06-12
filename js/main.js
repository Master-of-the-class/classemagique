render();
document.getElementById("muteToggle").checked = muted;
document.getElementById("syncMinutes").value =
    syncMinutes;

document.getElementById("disableSync").checked =
    syncDisabled;
	
const imageInput = document.getElementById("studentImage");	
	
	
imageInput.addEventListener("change", function(e){

    const file = e.target.files[0];
    if(!file || current === null) return;

   const reader = new FileReader();

reader.onload = function(event){
    
    const img = new Image();
    img.src = event.target.result;

    img.onload = function(){
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxSize = 120;
        canvas.width = maxSize;
        canvas.height = maxSize;

        ctx.drawImage(img, 0, 0, maxSize, maxSize);

        const compressed = canvas.toDataURL("image/jpeg", 0.6);

        students[current].image = compressed;

students[current].useDefaultImage = false;

        saveData();
        render();
    };
};

    reader.readAsDataURL(file);
});	
	
applyMissingDailyRewards();
autoWeeklyRewards();
saveData();
render();



const bulkBtn=document.createElement("button");
bulkBtn.innerText="🎁 Récompense de groupe";
bulkBtn.onclick=bulkReward;
document.getElementById("toolsMenu").appendChild(bulkBtn);

