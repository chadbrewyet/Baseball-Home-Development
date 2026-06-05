const ClubhouseDB = (() => {
  const DB_NAME = "clubhouse-baseball";
  const VERSION = 3;
  const SUPABASE_URL = "https://oczqjazkqmbscffsdvzw.supabase.co";
  const SUPABASE_KEY = "sb_publishable_kyF5JbMqNhT0sqUK7KQtcw_XkMtBxQA";
  const STORES = ["users","players","teams","teamMemberships","userPlayerAccess","userTeamRoles","events","playerData","alerts","decisions","meta","organizations","households","organizationRoles","teamCoachRoles","householdMemberships","playerTeamMemberships","playerTags","accessRequests","recordAssociations","invitations"];
  let db, sb;

  const hasRemote = () => Boolean(sb);
  const id = prefix => `${prefix}-${crypto.randomUUID()}`;
  const openLocal = () => new Promise((resolve,reject) => {
    const req=indexedDB.open(DB_NAME,VERSION);
    req.onupgradeneeded=()=>{const d=req.result;STORES.forEach(s=>{if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:"id"})})};
    req.onsuccess=()=>{db=req.result;resolve(db)};req.onerror=()=>reject(req.error);
  });
  async function open(){
    await openLocal();
    if(window.supabase)sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    return db;
  }

  const store=(name,mode="readonly")=>db.transaction(name,mode).objectStore(name);
  const localAll=name=>new Promise((res,rej)=>{const r=store(name).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  const localGet=(name,itemId)=>new Promise((res,rej)=>{const r=store(name).get(itemId);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  const localPut=(name,value)=>new Promise((res,rej)=>{const r=store(name,"readwrite").put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error)});
  const localRemove=(name,itemId)=>new Promise((res,rej)=>{const r=store(name,"readwrite").delete(itemId);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)});
  const authed = async () => Boolean((await sb?.auth.getSession())?.data?.session);

  async function all(name){
    if(hasRemote()&&await authed()){
      const {data,error}=await sb.from("clubhouse_records").select("data").eq("store",name).order("id");
      if(error)throw error;
      return data.map(r=>r.data);
    }
    return localAll(name);
  }
  async function get(name,itemId){
    if(hasRemote()&&await authed()){
      const {data,error}=await sb.from("clubhouse_records").select("data").eq("store",name).eq("id",itemId).maybeSingle();
      if(error)throw error;
      return data?.data;
    }
    return localGet(name,itemId);
  }
  async function put(name,value){
    if(!value.id)value.id=id(name);
    if(hasRemote()&&await authed()){
      const {error}=await sb.from("clubhouse_records").upsert({store:name,id:value.id,data:value,updated_at:new Date().toISOString()});
      if(error)throw error;
      return value;
    }
    return localPut(name,value);
  }
  async function remove(name,itemId){
    if(hasRemote()&&await authed()){
      const {error}=await sb.from("clubhouse_records").delete().eq("store",name).eq("id",itemId);
      if(error)throw error;
      return;
    }
    return localRemove(name,itemId);
  }

  async function hashPin(pin,salt=crypto.randomUUID()){
    const bytes=new TextEncoder().encode(`${salt}:${pin}`),hash=await crypto.subtle.digest("SHA-256",bytes);
    return {salt,hash:[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")};
  }
  async function verifyPin(pin,user){return user?.pinSalt&&(await hashPin(pin,user.pinSalt)).hash===user.pinHash}
  async function signIn(email,password){return sb.auth.signInWithPassword({email,password})}
  async function signUp(email,password,name){return sb.auth.signUp({email,password,options:{data:{name}}})}
  async function signOut(){return sb?.auth.signOut()}
  async function updateAuth(changes){return sb?.auth.updateUser(changes)}
  async function currentAuthUser(){return (await sb?.auth.getUser())?.data?.user||null}
  async function authSession(){return (await sb?.auth.getSession())?.data?.session||null}
  async function hasSetup(){return Boolean(await get("meta","setup"))}
  async function seedInitialSuperUser(){
    if(await hasSetup())return;
    const orgId=id("org");
    await put("organizations",{id:orgId,name:"Default Organization",settings:{directorApprovalRequiredForCoachPlans:false},equipment:[],active:true,created:new Date().toISOString()});
    await put("meta",{id:"setup",defaultOrganizationId:orgId,created:new Date().toISOString(),version:3});
  }
  async function ensureAuthProfile(authUser,name=authUser?.user_metadata?.name){
    if(!authUser)return null;
    const existing=await get("users",authUser.id);
    if(existing)return existing;
    const hasUsers=(await all("users")).length>0;
    const user={id:authUser.id,authUserId:authUser.id,username:authUser.email,name:name||authUser.email,active:true,status:hasUsers?"pending_association":"active",roles:hasUsers?[]:["Super User"],loginCount:0,lastLoginAt:null};
    await put("users",user);
    const pendingInvites=(await all("invitations")).filter(i=>i.email?.toLowerCase()===authUser.email?.toLowerCase()&&i.status==="pending");
    for(const invite of pendingInvites){
      await put("recordAssociations",{id:id("assoc"),userId:user.id,recordType:invite.recordType,recordId:invite.recordId,role:invite.role||"member",active:true,created:new Date().toISOString(),createdBy:invite.invitedBy});
      invite.status="accepted";invite.acceptedBy=user.id;invite.acceptedAt=new Date().toISOString();await put("invitations",invite);
    }
    return user;
  }
  async function createSetup(){await seedInitialSuperUser()}
  return {open,all,get,put,remove,id,hashPin,verifyPin,signIn,signUp,signOut,updateAuth,currentAuthUser,authSession,ensureAuthProfile,hasSetup,seedInitialSuperUser,createSetup};
})();
