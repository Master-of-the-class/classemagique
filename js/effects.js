const style=document.createElement("style");
style.innerHTML=`
@keyframes floatUp{
0%{opacity:1;transform:translate(-50%,-50%);}
100%{opacity:0;transform:translate(-50%,-120%);}
}`;
document.head.appendChild(style);

function xpEffect(index, amount){
    const card = document.getElementById("card-"+index);
    const xp = document.createElement("div");
    xp.innerText = "⭐ +" + amount;
    xp.style.position="absolute";
    xp.style.color="blue";
    xp.style.fontWeight="bold";
    xp.style.top="60%";
    xp.style.left="50%";
    xp.style.transform="translate(-50%,-50%)";
    xp.style.animation="floatUp 1s forwards";
    card.appendChild(xp);
    setTimeout(()=>xp.remove(),1000);
}
	
function heartEffect(index, positive=true){
    const card = document.getElementById("card-"+index);
    const heart = document.createElement("div");
    heart.innerText = positive ? "❤️ +1" : "💔 -1";
    heart.style.position="absolute";
    heart.style.color= positive ? "green":"red";
    heart.style.fontWeight="bold";
    heart.style.top="50%";
    heart.style.left="50%";
    heart.style.transform="translate(-50%,-50%)";
    heart.style.animation="floatUp 1s forwards";
    card.appendChild(heart);
    setTimeout(()=>heart.remove(),1000);
}

function levelUpEffect(index){
    const card = document.getElementById("card-"+index);
    card.style.boxShadow="0 0 20px gold";
    card.style.transition="0.3s";

    const banner = document.getElementById("levelBanner");
    banner.style.display="block";

    setTimeout(()=>{
        card.style.boxShadow="0 0 5px rgba(0,0,0,0.2)";
        banner.style.display="none";
    },1500);
}

