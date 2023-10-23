import  socketConnect  from "./connection.js";
const locations={
    1 : {left : '4vw',margintop : '7%',angle : '180deg'},
    2 : {left : '23vw',margintop : '7%',angle : '180deg'},
    3 : {left : '42vw',margintop : '7%',angle : '180deg'},
    4 : {left : '61vw',margintop : '7%',angle : '180deg'},
    5 : {left : '80vw',margintop : '7%',angle : '180deg'},
    6 : {left : '4vw',margintop : '40%',angle : '0deg'},
    7 : {left : '23vw',margintop : '40%',angle : '0deg'},
    8 : {left : '42vw',margintop : '40%',angle : '0deg'},
    9 : {left : '61vw',margintop : '40%',angle : '0deg'},
    10 : {left : '80vw',margintop : '40%',angle : '0deg'}
}

let slot,zone;

function makecaranimation(loc,area){
    let car_animation=document.createElement('style');
    let comemovement=document.createTextNode(`@keyframes comecar{
        0%{left: 100vw;transform: rotate(90deg);margin-top: 23.5%;}
        70%{left: ${locations[loc].left};transform: rotate(90deg);}
        80%{transform: rotate(${locations[loc].angle});margin-top: 23.5%;}
    }`);
    let gomovement=document.createTextNode(`@keyframes comecar{
        0%{left: 100vw;transform: rotate(90deg);margin-top: 23.5%;}
        70%{left: ${locations[loc].left};transform: rotate(90deg);}
        80%{transform: rotate(${locations[loc].angle});margin-top: 23.5%;}
    }`);
    car_animation.appendChild(comemovement);
    car_animation.appendChild(gomovement);

    document.getElementById(area).appendChild(car_animation)
}


async function sendDataToIoT(data){
    try {
        const socket = await socketConnect();
        socket.send(data);
    } catch (err) {
        console.log(err);
    }
}

async function handleData(){
    try{
        
        const socket=  await socketConnect();
        socket.onmessage = (event)=>{
            updateslots(event.data)
            console.log(event.data)

        }
    } catch (err){
        console.log(err)
    }
}

setTimeout(handleData,1000)

function managepark(slot,zone){
    
    let slotst=(slot!=10)?"0":""
    slotst=slotst+slot
    let park=""+zone+slotst+'r'
    console.log(park)
    sendDataToIoT(park)
    let slotid="but"+zone+slot
    console.log(slotid)
    document.getElementById(slotid).style.backgroundColor="red";
    makecar(slot,zone,slotid)
}



function updateslots(rcvddata) {
    console.log(rcvddata[0])
    for(let i=0;i<20;i++){
        zone=(i<10)?'j':'c';
        slot=i+1;
        if(zone=='c') slot=slot-10;
        let slotid='but'+zone+slot
        if(rcvddata[i]=='g') document.getElementById(slotid).style.backgroundColor="green";
        else document.getElementById(slotid).style.backgroundColor="red";
    }
}
 
var w,h;
var slotwidth,slotheight;
var parkareawidth,parkareaheight;
var topdist,leftdist;
var locx,locy;

function makecar(slot,zone,slotid){
    
    let parkarea=(zone=='j')?'park1':'park2'
    makecaranimation(slot,parkarea)
    console.log(parkarea)

    let targetparklocation=document.getElementById(parkarea)
    console.log(targetparklocation)
    let img = document.createElement('img')
    img.src='car2.png'
    img.className='carup'
    let imgid=parkarea+'car'+slot
    img.id=imgid
    img.style.width='15vw'
    img.style.height='15vw'
    img.style.left=locations[slot].left
    img.style.marginTop=locations[slot].margintop
    img.style.animation='comecar 2s'
    img.addEventListener('click',()=>{removecar(imgid,slotid)})
    img.style.transform = `rotate(${locations[slot].angle})`;
    targetparklocation.prepend(img)
    
}
window.managepark = managepark

function removecar(carel,slotel){
    console.log("hello i am a car",carel)
    console.log(document.getElementById(carel))
    document.getElementById(slotel).style.backgroundColor='green'
    document.getElementById(carel).style.animation='comecar 2s'
    document.getElementById(carel).remove()
    

}
