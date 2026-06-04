const ClubhouseDB = (() => {
  const DB_NAME = "clubhouse-baseball";
  const VERSION = 1;
  const STORES = ["users","players","teams","teamMemberships","userPlayerAccess","userTeamRoles","events","playerData","alerts","decisions","meta"];
  let db;
  const open = () => new Promise((resolve,reject) => {
    const req=indexedDB.open(DB_NAME,VERSION);
    req.onupgradeneeded=()=>{const d=req.result;STORES.forEach(s=>{if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:"id"})})};
    req.onsuccess=()=>{db=req.result;resolve(db)};req.onerror=()=>reject(req.error);
  });
  const store=(name,mode="readonly")=>db.transaction(name,mode).objectStore(name);
  const all=name=>new Promise((res,rej)=>{const r=store(name).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  const get=(name,id)=>new Promise((res,rej)=>{const r=store(name).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  const put=(name,value)=>new Promise((res,rej)=>{const r=store(name,"readwrite").put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error)});
  const remove=(name,id)=>new Promise((res,rej)=>{const r=store(name,"readwrite").delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)});
  const id=prefix=>`${prefix}-${crypto.randomUUID()}`;
  async function hashPin(pin,salt=crypto.randomUUID()){const bytes=new TextEncoder().encode(`${salt}:${pin}`),hash=await crypto.subtle.digest("SHA-256",bytes);return {salt,hash:[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")}}
  async function verifyPin(pin,user){return (await hashPin(pin,user.pinSalt)).hash===user.pinHash}
  async function hasSetup(){return Boolean(await get("meta","setup"))}
  async function createSetup(ownerName,pin,playerName,legacyData){
    const ownerId=id("user"),playerId=id("player"),playerUserId=id("user"),teamId=id("team"),pinData=await hashPin(pin);
    await put("users",{id:ownerId,name:ownerName,pinSalt:pinData.salt,pinHash:pinData.hash,owner:true,active:true,roles:["Owner","Parent"]});
    const playerPin=await hashPin("0000");await put("users",{id:playerUserId,name:playerName,pinSalt:playerPin.salt,pinHash:playerPin.hash,owner:false,active:true,roles:["Player"]});
    await put("players",{id:playerId,name:playerName,userId:playerUserId,active:true,priorityTeamId:teamId});
    await put("teams",{id:teamId,name:"Primary Team",season:new Date().getFullYear().toString(),equipment:[]});
    await put("teamMemberships",{id:id("membership"),playerId,teamId,active:true,priority:1});
    await put("userPlayerAccess",{id:id("access"),userId:ownerId,playerId,permission:"manage"});
    await put("userPlayerAccess",{id:id("access"),userId:playerUserId,playerId,permission:"self"});
    await put("userTeamRoles",{id:id("role"),userId:ownerId,teamId,coach:false,scheduler:true});
    await put("playerData",{id:playerId,data:legacyData});
    await put("meta",{id:"setup",ownerId,created:new Date().toISOString(),version:1});
    return {ownerId,playerId};
  }
  return {open,all,get,put,remove,id,hashPin,verifyPin,hasSetup,createSetup};
})();
