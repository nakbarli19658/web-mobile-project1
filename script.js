"use strict";
const ROWS = "ABCDEFGHIJKL".split("");
const PRICES = { VIP:120, Premium:80, Standard:45 };
const STORAGE_KEY = "spotlight-cart-v1";
const seats = ROWS.flatMap((row,rowIndex)=>Array.from({length:20},(_,i)=>{
  const number=i+1, category=rowIndex<4?"VIP":rowIndex<8?"Premium":"Standard";
  return {id:`${row}${number}`,row,number,category,price:PRICES[category],
    unavailable:(rowIndex*17+i*11)%19===0 || (rowIndex===1&&i===8)};
}));
const seatById=new Map(seats.map(seat=>[seat.id,seat]));
let cart=loadCart(), selectedId=null;
function loadCart(){
  try {const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
    if(!Array.isArray(data))return [];
    return [...new Set(data.filter(id=>typeof id==="string"&&seatById.has(id)&&!seatById.get(id).unavailable))];
  }catch{return [];}
}
function saveCart(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch(e){console.warn("Storage unavailable",e);}}
const venue=document.getElementById("venue"),details=document.getElementById("seatDetails"),addButton=document.getElementById("addButton");
function renderVenue(){
  venue.replaceChildren();
  ROWS.forEach(row=>{
    const wrapper=document.createElement("div");wrapper.className="seat-row";
    const start=document.createElement("span");start.className="row-label";start.textContent=row;wrapper.append(start);
    seats.filter(s=>s.row===row).forEach((seat,i)=>{
      if(i===5||i===15){const aisle=document.createElement("span");aisle.className="aisle";wrapper.append(aisle);}
      const button=document.createElement("button");button.type="button";
      button.className=`seat ${seat.category.toLowerCase()}`;
      const state=seat.unavailable?"unavailable":cart.includes(seat.id)?"in-cart":selectedId===seat.id?"inspected":"available";
      button.classList.add(state);
      button.title=`${seat.id} · ${seat.category} · ₼${seat.price} · ${state}`;
      button.setAttribute("aria-label",`Seat ${seat.id}, ${seat.category}, ${seat.unavailable?"unavailable":cart.includes(seat.id)?"in cart":"₼"+seat.price}`);
      button.setAttribute("aria-pressed",String(selectedId===seat.id));
      button.disabled=seat.unavailable;
      button.addEventListener("click",()=>{selectedId=seat.id;renderAll();});
      wrapper.append(button);
    });
    const end=document.createElement("span");end.className="row-label";end.textContent=row;wrapper.append(end);
    venue.append(wrapper);
  });
}
function renderDetails(){
  details.replaceChildren();
  const seat=seatById.get(selectedId);
  addButton.disabled=!seat||seat.unavailable||cart.includes(seat.id);
  if(!seat){details.className="empty";details.textContent="Select an available seat to inspect its details and price.";return;}
  details.className="";
  [["Seat",seat.id],["Section",seat.category],["Row",seat.row],["Seat number",seat.number],["Price",`₼${seat.price}`],["Status",cart.includes(seat.id)?"Already in cart":"Available"]].forEach(([label,value])=>{
    const line=document.createElement("div");line.className="detail-row";
    const a=document.createElement("span");a.textContent=label;
    const b=document.createElement("strong");b.textContent=value;
    line.append(a,b);details.append(line);
  });
  addButton.textContent=cart.includes(seat.id)?"ALREADY IN CART":"ADD TO CART";
}
function renderCart(){
  const target=document.getElementById("cartItems");target.replaceChildren();
  document.getElementById("cartCount").textContent=cart.length;
  document.getElementById("total").textContent=`₼${cart.reduce((sum,id)=>sum+seatById.get(id).price,0)}`;
  if(!cart.length){target.className="empty";target.textContent="Your cart is empty.";return;}
  target.className="";
  cart.forEach(id=>{
    const seat=seatById.get(id),line=document.createElement("div");line.className="cart-line";
    const info=document.createElement("div"),name=document.createElement("strong"),sub=document.createElement("small");
    name.textContent=`Seat ${id} · ₼${seat.price}`;sub.textContent=seat.category;info.append(name,sub);
    const remove=document.createElement("button");remove.type="button";remove.className="remove";remove.textContent="Remove";remove.setAttribute("aria-label",`Remove seat ${id}`);
    remove.addEventListener("click",()=>{cart=cart.filter(x=>x!==id);saveCart();renderAll();});
    line.append(info,remove);target.append(line);
  });
}
function renderAll(){renderVenue();renderDetails();renderCart();}
addButton.addEventListener("click",()=>{
  const seat=seatById.get(selectedId);
  if(!seat||seat.unavailable||cart.includes(seat.id))return;
  cart.push(seat.id);saveCart();renderAll();
});
const shell=document.getElementById("mapShell"),content=document.getElementById("mapContent");
let zoom=0.85,offsetX=0,offsetY=0;
function updateTransform(){content.style.transform=`translate(calc(-50% + ${offsetX}px),calc(-50% + ${offsetY}px)) scale(${zoom})`;}
function setZoom(value){zoom=Math.min(1.8,Math.max(.5,value));updateTransform();}
function move(dx,dy){offsetX=Math.max(-450,Math.min(450,offsetX+dx));offsetY=Math.max(-400,Math.min(400,offsetY+dy));updateTransform();}
document.getElementById("zoomIn").onclick=()=>setZoom(zoom+.15);
document.getElementById("zoomOut").onclick=()=>setZoom(zoom-.15);
document.getElementById("up").onclick=()=>move(0,-45);
document.getElementById("down").onclick=()=>move(0,45);
document.getElementById("left").onclick=()=>move(-45,0);
document.getElementById("right").onclick=()=>move(45,0);
document.getElementById("reset").onclick=()=>{zoom=.85;offsetX=0;offsetY=0;updateTransform();};
shell.addEventListener("wheel",e=>{e.preventDefault();setZoom(zoom+(e.deltaY<0?.08:-.08));},{passive:false});
let drag=null;
shell.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest("button"))return;drag={x:e.clientX,y:e.clientY};shell.setPointerCapture(e.pointerId);shell.classList.add("dragging");});
shell.addEventListener("pointermove",e=>{if(!drag)return;move(e.clientX-drag.x,e.clientY-drag.y);drag={x:e.clientX,y:e.clientY};});
function endDrag(){drag=null;shell.classList.remove("dragging");}
shell.addEventListener("pointerup",endDrag);shell.addEventListener("pointercancel",endDrag);
renderAll();updateTransform();
