const divisions=document.querySelectorAll("div.list div");
const overview=document.querySelector(".over");
const right=document.querySelector(".right");
var emotions=["angry","happy","sad","disgust","neutral","surprised","fear"];
divisions.forEach(divid=>{
    let emotion=divid.getAttribute("name");
    let time=divid.getAttribute("time");
    for(var i of emotions){
        if (emotion.includes(i)){
            var emo=i;
        }
    }
    const t=`<div>${time}</div>`
    const e=`<div>${emo}</div>`
    divid.insertAdjacentHTML("beforeend",t);
    divid.insertAdjacentHTML("beforeend",e);

    
})
divisions.forEach(division=>{
    division.addEventListener("click",function(){
        overview.classList.remove("active1");
        divisions.forEach(divi=>divi.classList.remove("active"));
        this.classList.add("active");
        var val=division.getAttribute("name");
        right.classList.add("li");
        right.innerHTML="";
        const k=`<div><img src="${"./images/"+val+".jpg"}" alt="image1"></div>`;
        const g=`<div><img src="${"./images/"+val+"_image.png"}" alt="image2" class="pop"></div>`;
        const popup=`<div class="popup"><div class="popup-image-container"><img src="${"../images/"+val+"_image.png"}" class="popup-image"></div></div>`
        right.insertAdjacentHTML("beforeend",k);
        right.insertAdjacentHTML("beforeend",g);
    });
});


overview.addEventListener("click",function(){
    divisions.forEach(divis=>divis.classList.remove("active"));
    right.innerHTML="";
    this.classList.add("active1");
    const pie=`<div class='pie'></div>`;  
    const content= `<div class='content'><div class='happy'></div><div style="grid-column:2/3;
    grid-row:1/2;">Happy</div><div style="grid-column:3/4;
    grid-row:1/2;">40%</div>
    <div class='angry'></div><div style="grid-column:2/3;
    grid-row:2/3;">Angry</div><div style="grid-column:3/4;
    grid-row:2/3;">15%</div>
    <div class='fear'></div><div style="grid-column:2/3;
    grid-row:3/4;">Fear</div><div style="grid-column:3/4;
    grid-row:3/4;">10%</div>
    <div class='sad'></div><div style="grid-column:2/3;
    grid-row:4/5;">Sad</div><div style="grid-column:3/4;
    grid-row:4/5;">5%</div>
    <div class='disgust'></div><div style="grid-column:2/3;
    grid-row:5/6;">Disgust</div><div style="grid-column:3/4;
    grid-row:5/6;">10%</div>
    <div class='neutral'></div><div style="grid-column:2/3;
    grid-row:6/7;">Neutral</div><div style="grid-column:3/4;
    grid-row:6/7;">15%</div>
    <div class='surprised'></div><div style="grid-column:2/3;
    grid-row:7/8;">Surprised</div><div style="grid-column:3/4;
    grid-row:7/8;">5%</div></div>`
    right.insertAdjacentHTML("beforeend",pie);
    right.insertAdjacentHTML("beforeend",content);
});
