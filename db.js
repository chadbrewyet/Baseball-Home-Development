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
  async function ensureRecordAssociation(userId,type,recordId,role="member",createdBy=userId){
    const existing=(await all("recordAssociations")).find(a=>a.userId===userId&&a.recordType===type&&a.recordId===recordId);
    await put("recordAssociations",{id:existing?.id||id("assoc"),userId,recordType:type,recordId,role:existing?.role==="admin"?"admin":role,active:true,created:existing?.created||new Date().toISOString(),createdBy:existing?.createdBy||createdBy});
  }
  async function grantInviteAccess(user,invite){
    const role=invite.role||"member";
    await ensureRecordAssociation(user.id,invite.recordType,invite.recordId,role,invite.invitedBy);
    if(invite.recordType==="team"){
      const teamRoles=await all("teamCoachRoles"),coachRole=teamRoles.find(r=>r.userId===user.id&&r.teamId===invite.recordId);
      const coachType=coachRole?.coachType||(role==="admin"&&!teamRoles.some(r=>r.teamId===invite.recordId&&r.coachType==="head"&&r.active!==false)?"head":"assistant");
      await put("teamCoachRoles",{id:coachRole?.id||id("coachRole"),userId:user.id,teamId:invite.recordId,coachType,permissions:coachRole?.permissions||{manageTeam:true,managePlans:true,manageParents:coachType==="head",manageAssistants:coachType==="head"},specializations:coachRole?.specializations||["All"],active:true});
      const player=(await all("players")).find(p=>p.userId===user.id);
      if(player&&!(await all("playerTeamMemberships")).some(m=>m.playerId===player.id&&m.teamId===invite.recordId&&m.active!==false))await put("playerTeamMemberships",{id:id("membership"),playerId:player.id,teamId:invite.recordId,active:true,priority:(await all("playerTeamMemberships")).some(m=>m.playerId===player.id)?2:1});
      const team=(await get("teams",invite.recordId));
      if(team?.organizationId)await ensureRecordAssociation(user.id,"organization",team.organizationId,role==="admin"?"admin":"member",invite.invitedBy);
    }else if(invite.recordType==="household"){
      const player=(await all("players")).find(p=>p.userId===user.id);
      const existingMember=(await all("householdMemberships")).find(m=>m.householdId===invite.recordId&&((player&&m.playerId===player.id)||m.userId===user.id));
      await put("householdMemberships",player?{id:existingMember?.id||id("hh"),householdId:invite.recordId,playerId:player.id,role:"player",active:true}:{id:existingMember?.id||id("hh"),householdId:invite.recordId,userId:user.id,role:"parent",active:true});
    }else if(invite.recordType==="organization"&&role==="admin"){
      const existingRole=(await all("organizationRoles")).find(r=>r.userId===user.id&&r.organizationId===invite.recordId);
      await put("organizationRoles",{id:existingRole?.id||id("orgRole"),userId:user.id,organizationId:invite.recordId,role:"director",active:true});
    }else if(invite.recordType==="player"){
      const player=await get("players",invite.recordId);
      if(player&&!player.userId)await put("players",{...player,userId:user.id});
    }
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
      if(invite.recordType==="superUser"){
        user.roles=["Super User"];user.status="active";await put("users",user);
      }else await grantInviteAccess(user,invite);
      invite.status="accepted";invite.acceptedBy=user.id;invite.acceptedAt=new Date().toISOString();await put("invitations",invite);
    }
    return user;
  }
  async function createSetup(){await seedInitialSuperUser()}
  return {open,all,get,put,remove,id,hashPin,verifyPin,signIn,signUp,signOut,updateAuth,currentAuthUser,authSession,ensureAuthProfile,hasSetup,seedInitialSuperUser,createSetup};
})();
