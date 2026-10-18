const birthday = new Date("2026-11-02T00:00:00+05:30");
const $ = (id) => document.getElementById(id);
function updateCountdown(){
  const now = new Date();
  let diff = birthday.getTime() - now.getTime();
  if(diff <= 0){
    ["days","hours","minutes","seconds"].forEach(id => $(id).textContent = "00");
    $("countdown-message").textContent = "It's your birthday, Shreya! Today is all about you. ♡";
    return;
  }
  const days = Math.floor(diff / 86400000); diff %= 86400000;
  const hours = Math.floor(diff / 3600000); diff %= 3600000;
  const minutes = Math.floor(diff / 60000); diff %= 60000;
  const seconds = Math.floor(diff / 1000);
  $("days").textContent = String(days).padStart(2,"0");
  $("hours").textContent = String(hours).padStart(2,"0");
  $("minutes").textContent = String(minutes).padStart(2,"0");
  $("seconds").textContent = String(seconds).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown,1000);

document.querySelectorAll(".candle").forEach(candle => {
  candle.addEventListener("click", () => {
    candle.classList.add("out");
    const remaining = document.querySelectorAll(".candle:not(.out)").length;
    $("wish-message").textContent = remaining
      ? `${remaining} candle${remaining===1?"":"s"} left! Make a wish, birthday girl. ✨`
      : "Wish made? May the universe bring you beautiful things. Happy Birthday, Shreya! ♡";
    if(remaining===0) burstHearts();
  });
});
$("relight").addEventListener("click", () => {
  document.querySelectorAll(".candle").forEach(c => c.classList.remove("out"));
  $("wish-message").textContent = "Three candles, three wishes, and a whole universe cheering for you.";
});
function burstHearts(){
  for(let i=0;i<18;i++){
    const heart=document.createElement("span"); heart.textContent=["♡","✦","♥","✧"][i%4];
    heart.style.cssText=`position:fixed;left:${8+Math.random()*84}%;top:${35+Math.random()*40}%;z-index:30;color:${i%2?"#f5b8d0":"#f5d7a0"};font-size:${14+Math.random()*20}px;pointer-events:none;animation:heartFly ${1.3+Math.random()}s ease-out forwards`;
    document.body.appendChild(heart); setTimeout(()=>heart.remove(),2500);
  }
}
const extraStyle=document.createElement("style");
extraStyle.textContent="@keyframes heartFly{to{transform:translateY(-130px) rotate(35deg);opacity:0}}";
document.head.appendChild(extraStyle);

const song=$("song"), toggle=$("music-toggle"), status=$("music-status"), eq=document.querySelector(".equalizer");
toggle.addEventListener("click", async()=>{
  if(song.paused){
    try{await song.play();toggle.textContent="Ⅱ";status.textContent="Now playing for you…";eq.classList.add("playing");}
    catch(e){status.textContent="Add your song as assets/song.mp3 first";toggle.textContent="▶";}
  }else{song.pause();toggle.textContent="▶";status.textContent="Paused — tap to continue";eq.classList.remove("playing");}
});
song.addEventListener("ended",()=>{toggle.textContent="▶";status.textContent="A song for you, always";eq.classList.remove("playing");});
$("surprise-btn").addEventListener("click",()=>{
  const box=$("final-surprise");box.hidden=!box.hidden;
  $("surprise-btn").textContent=box.hidden?"Open your final surprise 💌":"Close your surprise ♡";
  if(!box.hidden){box.scrollIntoView({behavior:"smooth",block:"center"});burstHearts();}
});

document.querySelectorAll(".photo-card").forEach(card=>{
  const path=card.dataset.photo;
  const img=new Image();
  img.onload=()=>{card.style.backgroundImage=`url("${path}")`;card.classList.add("has-photo");};
  img.onerror=()=>{};
  img.src=path;
  card.addEventListener("click",()=>{
    if(!card.classList.contains("has-photo")) return;
    $("lightbox-image").src=path;$("lightbox").hidden=false;
  });
});
$("close-lightbox").addEventListener("click",()=>$("lightbox").hidden=true);
$("lightbox").addEventListener("click",e=>{if(e.target===$("lightbox"))$("lightbox").hidden=true;});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("lightbox").hidden=true;});
