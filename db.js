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
  const REMOTE_TABLES={users:"profiles",organizations:"organizations",teams:"teams",households:"households",players:"players",userPlayerAccess:"user_player_access",organizationRoles:"organization_roles",teamCoachRoles:"team_coach_roles",householdMemberships:"household_memberships",playerTeamMemberships:"player_team_memberships",recordAssociations:"record_associations",accessRequests:"access_requests",invitations:"invitations",playerData:"player_training_state",events:"calendar_events",alerts:"alerts",decisions:"admin_decisions",playerTags:"player_tags"};
  const REMOTE_KEYS={playerData:"player_id"};
  const fromRemote=(name,row)=>{
    if(!row)return row;
    if(name==="users")return {id:row.id,authUserId:row.auth_user_id,username:row.username,name:row.display_name,active:row.status!=="inactive",status:row.status,roles:row.is_super_user?["Super User"]:[],loginCount:0,lastLoginAt:null};
    if(name==="organizations")return {id:row.id,name:row.name,settings:row.settings||{},equipment:row.equipment||[],active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="teams")return {id:row.id,name:row.name,season:row.season,organizationId:row.organization_id,equipment:row.equipment||[],active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="households")return {id:row.id,name:row.name,ownerUserId:row.owner_user_id,equipment:row.equipment||[],active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="players")return {id:row.id,name:row.name,userId:row.user_id,active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="userPlayerAccess")return {id:row.id,userId:row.user_id,playerId:row.player_id,permission:row.permission,active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="organizationRoles")return {id:row.id,userId:row.user_id,organizationId:row.organization_id,role:row.role,active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="teamCoachRoles")return {id:row.id,userId:row.user_id,teamId:row.team_id,coachType:row.coach_type,permissions:row.permissions||{},specializations:row.specializations||["All"],active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="householdMemberships")return {id:row.id,householdId:row.household_id,userId:row.user_id,playerId:row.player_id,role:row.role,active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="playerTeamMemberships")return {id:row.id,playerId:row.player_id,teamId:row.team_id,active:row.active,priority:row.priority,createdBy:row.created_by,created:row.created_at};
    if(name==="recordAssociations")return {id:row.id,userId:row.user_id,recordType:row.record_type,recordId:row.record_id,role:row.role,active:row.active,createdBy:row.created_by,created:row.created_at};
    if(name==="accessRequests")return {id:row.id,userId:row.user_id,recordType:row.record_type,recordId:row.record_id,status:row.status,decidedBy:row.decided_by,decidedAt:row.decided_at,created:row.created_at};
    if(name==="invitations")return {id:row.id,email:row.email,recordType:row.record_type,recordId:row.record_id,role:row.role,status:row.status,invitedBy:row.invited_by,acceptedBy:row.accepted_by,acceptedAt:row.accepted_at,created:row.created_at};
    if(name==="playerData")return {id:row.player_id,data:row.data||{}};
    if(name==="events")return {...(row.data||{}),id:row.id,playerId:row.player_id,teamId:row.team_id,title:row.title,type:row.type,workload:row.workload,date:row.event_date,repeat:row.repeat,status:row.status,createdBy:row.created_by,created:row.created_at};
    if(name==="alerts")return {...(row.data||{}),id:row.id,playerId:row.player_id,type:row.type,title:row.title,message:row.message,status:row.status,read:row.read,createdBy:row.created_by,created:row.created_at};
    if(name==="decisions")return {...(row.data||{}),id:row.id,playerId:row.player_id,eventId:row.event_id,alertId:row.alert_id,date:row.decision_date,action:row.action,userId:row.created_by,created:row.created_at};
    if(name==="playerTags")return {id:row.id,playerId:row.player_id,tags:row.tags||[],active:row.active,createdBy:row.created_by,created:row.created_at};
    return row;
  };
  const toRemote=(name,value)=>{
    const v={...value};
    if(name==="users"){
      const row={id:v.id,auth_user_id:v.authUserId||(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(v.id)?v.id:null),username:v.username||"",display_name:v.name||v.username||"User",status:v.status||"active",updated_at:new Date().toISOString()};
      if(v.allowSuperUserWrite)row.is_super_user=(v.roles||[]).includes("Super User");
      return row;
    }
    if(name==="organizations")return {id:v.id,name:v.name,settings:v.settings||{},equipment:v.equipment||[],active:v.active!==false,created_by:v.createdBy,updated_at:new Date().toISOString()};
    if(name==="teams")return {id:v.id,name:v.name,season:v.season,organization_id:v.organizationId,equipment:v.equipment||[],active:v.active!==false,created_by:v.createdBy,updated_at:new Date().toISOString()};
    if(name==="households")return {id:v.id,name:v.name,owner_user_id:v.ownerUserId,equipment:v.equipment||[],active:v.active!==false,created_by:v.createdBy,updated_at:new Date().toISOString()};
    if(name==="players")return {id:v.id,name:v.name,user_id:v.userId,active:v.active!==false,created_by:v.createdBy,updated_at:new Date().toISOString()};
    if(name==="userPlayerAccess")return {id:v.id,user_id:v.userId,player_id:v.playerId,permission:v.permission||"manage",active:v.active!==false,created_by:v.createdBy};
    if(name==="organizationRoles")return {id:v.id,user_id:v.userId,organization_id:v.organizationId,role:v.role||"director",active:v.active!==false,created_by:v.createdBy};
    if(name==="teamCoachRoles")return {id:v.id,user_id:v.userId,team_id:v.teamId,coach_type:v.coachType||"assistant",permissions:v.permissions||{},specializations:v.specializations||["All"],active:v.active!==false,created_by:v.createdBy};
    if(name==="householdMemberships")return {id:v.id,household_id:v.householdId,user_id:v.userId||null,player_id:v.playerId||null,role:v.role||"member",active:v.active!==false,created_by:v.createdBy};
    if(name==="playerTeamMemberships")return {id:v.id,player_id:v.playerId,team_id:v.teamId,active:v.active!==false,priority:v.priority||1,created_by:v.createdBy};
    if(name==="recordAssociations")return {id:v.id,user_id:v.userId,record_type:v.recordType,record_id:v.recordId,role:v.role||"member",active:v.active!==false,created_by:v.createdBy};
    if(name==="accessRequests")return {id:v.id,user_id:v.userId,record_type:v.recordType,record_id:v.recordId,status:v.status||"pending",decided_by:v.decidedBy,decided_at:v.decidedAt};
    if(name==="invitations")return {id:v.id,email:v.email,record_type:v.recordType,record_id:v.recordId,role:v.role,status:v.status||"pending",invited_by:v.invitedBy,accepted_by:v.acceptedBy,accepted_at:v.acceptedAt};
    if(name==="playerData")return {player_id:v.id,data:v.data||{},updated_at:new Date().toISOString()};
    if(name==="events")return {id:v.id,player_id:v.playerId||null,team_id:v.teamId||null,title:v.title||"Event",type:v.type,workload:v.workload,event_date:v.date||null,repeat:v.repeat,status:v.status||"active",assigned_session_id:v.assignedSessionId,data:v,created_by:v.createdBy,updated_at:new Date().toISOString()};
    if(name==="alerts")return {id:v.id,player_id:v.playerId||null,type:v.type,title:v.title||"Alert",message:v.message,status:v.status||"pending",read:Boolean(v.read),data:v,created_by:v.createdBy,updated_at:new Date().toISOString()};
    if(name==="decisions")return {id:v.id,player_id:v.playerId||null,event_id:v.eventId||null,alert_id:v.alertId||null,decision_date:v.date||null,action:v.action||"unknown",data:v,created_by:v.userId||v.createdBy};
    if(name==="playerTags")return {id:v.id,player_id:v.playerId,tags:v.tags||[],active:v.active!==false,created_by:v.createdBy,updated_at:new Date().toISOString()};
    return v;
  };

  async function all(name){
    if(hasRemote()&&await authed()){
      if(REMOTE_TABLES[name]){
        const {data,error}=await sb.from(REMOTE_TABLES[name]).select("*").order(REMOTE_KEYS[name]||"id");
        if(error)throw error;
        return data.map(row=>fromRemote(name,row));
      }
      const {data,error}=await sb.from("clubhouse_records").select("data").eq("store",name).order("id");
      if(error)throw error;
      return data.map(r=>r.data);
    }
    return localAll(name);
  }
  async function get(name,itemId){
    if(hasRemote()&&await authed()){
      if(REMOTE_TABLES[name]){
        const {data,error}=await sb.from(REMOTE_TABLES[name]).select("*").eq(REMOTE_KEYS[name]||"id",itemId).maybeSingle();
        if(error)throw error;
        return fromRemote(name,data);
      }
      const {data,error}=await sb.from("clubhouse_records").select("data").eq("store",name).eq("id",itemId).maybeSingle();
      if(error)throw error;
      return data?.data;
    }
    return localGet(name,itemId);
  }
  async function put(name,value){
    if(!value.id)value.id=id(name);
    if(hasRemote()&&await authed()){
      if(REMOTE_TABLES[name]){
        const row=toRemote(name,value);
        const {error}=await sb.from(REMOTE_TABLES[name]).upsert(row);
        if(error)throw error;
        return value;
      }
      const {error}=await sb.from("clubhouse_records").upsert({store:name,id:value.id,data:value,updated_at:new Date().toISOString()});
      if(error)throw error;
      return value;
    }
    return localPut(name,value);
  }
  async function createRecordWithAdminAssociation(type,recordId,name,organizationId=null){
    if(hasRemote()&&await authed()){
      const {error}=await sb.rpc("create_record_with_admin_association",{p_record_type:type,p_record_id:recordId,p_name:name,p_organization_id:organizationId});
      if(error)throw error;
      return true;
    }
    return false;
  }
  async function requestRecordLink(type,recordId){
    if(hasRemote()&&await authed()){
      const {data,error}=await sb.rpc("request_record_link",{p_record_type:type,p_record_id:recordId});
      if(error)throw error;
      return data;
    }
    return null;
  }
  async function inviteOrLinkUserToRecord(type,recordId,email){
    if(hasRemote()&&await authed()){
      const {data,error}=await sb.rpc("invite_or_link_user_to_record",{p_record_type:type,p_record_id:recordId,p_email:email});
      if(error)throw error;
      return data;
    }
    return null;
  }
  async function acceptPendingInvitations(){
    if(hasRemote()&&await authed()){
      const {data,error}=await sb.rpc("accept_pending_invitations_for_current_user");
      if(error)throw error;
      return data||0;
    }
    return 0;
  }
  async function decideRecordLinkRequest(requestId,approve){
    if(hasRemote()&&await authed()){
      const {error}=await sb.rpc("decide_record_link_request",{p_request_id:requestId,p_approve:Boolean(approve)});
      if(error)throw error;
      return true;
    }
    return false;
  }
  async function remove(name,itemId){
    if(hasRemote()&&await authed()){
      if(REMOTE_TABLES[name]){
        const {error}=await sb.from(REMOTE_TABLES[name]).delete().eq(REMOTE_KEYS[name]||"id",itemId);
        if(error)throw error;
        return;
      }
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
    if(existing){await acceptPendingInvitations();return await get("users",authUser.id)}
    const hasUsers=(await all("users")).length>0;
    const user={id:authUser.id,authUserId:authUser.id,username:authUser.email,name:name||authUser.email,active:true,status:hasUsers?"pending_association":"active",roles:hasUsers?[]:["Super User"],loginCount:0,lastLoginAt:null};
    await put("users",user);
    await acceptPendingInvitations();
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
  return {open,all,get,put,remove,id,hashPin,verifyPin,signIn,signUp,signOut,updateAuth,currentAuthUser,authSession,ensureAuthProfile,hasSetup,seedInitialSuperUser,createSetup,createRecordWithAdminAssociation,requestRecordLink,inviteOrLinkUserToRecord,acceptPendingInvitations,decideRecordLinkRequest};
})();
