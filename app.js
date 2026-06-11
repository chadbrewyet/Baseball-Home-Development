const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STORAGE_KEY = "clubhouse-baseball-v3";
const OLD_STORAGE_KEY = "clubhouse-baseball-v2";
const ACTIVE_USER_KEY = "clubhouse-active-user";
const ACTIVE_PLAYER_KEY = "clubhouse-active-player";
const EFFECTIVE_USER_KEY = "clubhouse-effective-user";
const REMEMBER_LOGIN_KEY = "clubhouse-remember-login";
const MASQUERADE_SESSION_KEY = "clubhouse-masquerade-session";
const ROLE_ORDER = ["Player", "Parent", "Coach", "Director", "Super User"];
const ROLE_SCOPE = {"Super User":"All access",Director:"Organization",Coach:"Team",Parent:"Household",Player:"Player"};
const SPECIALIZATIONS = ["All","pitching","hitting","infielding","outfielding","catching"];
const todayISO = () => new Date().toISOString().slice(0, 10);
const isMasqueradeFrame = () => window.self !== window.top;

const D = (id, category, name, dose, purpose, cue, equipment, options = {}) => ({
  id, category, name, dose, purpose, cue, equipment,
  instructions: options.instructions || `${dose}. Focus on: ${cue}.`,
  phases: options.phases || ["In Season", "Off Season"],
  intensity: options.intensity || "Moderate",
  armLoad: options.armLoad || "None",
  supervision: Boolean(options.supervision),
  benchmark: options.benchmark || null,
  url: options.url || ""
});

const drillCatalog = [
  D("warm-dynamic","Warm-up","Dynamic warm-up","5-7 min","Prepare the body for training","Finish springy, not tired",["Open space"],{intensity:"Low"}),
  D("warm-movement","Warm-up","Movement prep flow","6 min","Prepare hips, ankles, trunk, and shoulders","Smooth range; no forcing",["Open space"],{intensity:"Low"}),
  D("recovery-mobility","Recovery","Mobility reset","10-15 min","Restore movement after games or hard work","Easy breathing; no pain",["Open space"],{intensity:"Low"}),
  D("arm-scap","Arm care","Scap push-up / wall slide / Y-T-W","5 min","Build shoulder-blade control","Slow, smooth, no shrugging",["Wall/floor"],{intensity:"Low",armLoad:"Light",url:"https://www.drivelinebaseball.com/free-youth-daily-arm-care-throwing-drills/"}),
  D("arm-band","Arm care","Band shoulder circuit","2 rounds","Build rotator-cuff and shoulder endurance","Light resistance; perfect control",["Resistance bands"],{intensity:"Low",armLoad:"Light",supervision:true}),
  D("speed-falling","Speed","Falling starts","6-8 x 10 yd","Acceleration and first-step power","Lean, push, sprint through line",["Open space","Cones"],{benchmark:{key:"sprint",label:"Best 10-yard sprint",unit:"sec",lowerBetter:true}}),
  D("speed-split","Speed","Split-stance starts","6 x 10 yd","Accelerate from a baseball-ready stance","Push the ground away",["Open space","Cones"]),
  D("speed-pushup","Speed","Push-up starts","5 x 10 yd","Develop aggressive first steps","Get up and go; stay low",["Open space","Cones"],{supervision:true}),
  D("speed-crossover","Speed","Crossover starts","5 each direction","Improve outfield and infield first step","Win the first two steps",["Open space","Cones"]),
  D("speed-shuffle","Speed","Shuffle-to-sprint","5 each direction","Connect lateral movement to acceleration","Stay low, then sprint",["Open space","Cones"]),
  D("speed-curve","Speed","Curved route runs","6 routes","Improve efficient outfield routes","Lean into curve; eyes level",["Open space","Cones"]),
  D("speed-reactive","Speed","Reactive audio-cue starts","8 x 5-10 yd","Improve reaction and acceleration","React first; race second",["Open space","Cones","Phone/timer"],{supervision:true}),
  D("speed-decel","Speed","Deceleration sticks","3 x 4 reps","Improve braking and body control","Sink hips; stop under control",["Open space","Cones"],{supervision:true}),
  D("strength-squat","Strength","Front-hold squat","3 x 8","Build leg strength and posture","Full foot; tall chest",["Light barbell/plates"],{supervision:true,benchmark:{key:"cleanReps",label:"Clean reps",unit:"reps"}}),
  D("strength-split","Strength","Split squat","3 x 6/side","Build single-leg strength","Front foot heavy; tall torso",["Open space"],{supervision:true}),
  D("strength-reverse-lunge","Strength","Reverse lunge","3 x 6/side","Build leg strength in a controlled pattern","Step back softly; drive up",["Open space"],{supervision:true}),
  D("strength-lateral-lunge","Strength","Lateral lunge","3 x 6/side","Build lateral strength and mobility","Sit into hip; keep foot flat",["Open space"],{supervision:true}),
  D("strength-rdl","Strength","Single-leg RDL","3 x 6/side","Build hamstrings, balance, and hip control","Long spine; square hips",["Light barbell/plates"],{supervision:true}),
  D("strength-bridge","Strength","Glute bridge","3 x 10","Build hip strength","Ribs down; squeeze at top",["Wall/floor"]),
  D("strength-calf","Strength","Single-leg calf raise","3 x 10/side","Build ankle strength and stiffness","Full range; pause at top",["Wall/floor"]),
  D("strength-pushup","Strength","Push-up variations","3 x 6-12","Build upper-body strength","Straight body; no sag",["Wall/floor"],{benchmark:{key:"cleanReps",label:"Clean push-ups",unit:"reps"}}),
  D("strength-row","Strength","Barbell or inverted row","3 x 8","Build pulling strength and posture","Pull elbows back; no shrug",["Light barbell/plates"],{supervision:true}),
  D("strength-hang","Strength","Active hang / pull-up negative","3 rounds","Build grip, back, and scapular strength","Active shoulder; slow lower",["Pull-up bar"],{supervision:true,benchmark:{key:"hang",label:"Active hang",unit:"sec"}}),
  D("strength-carry","Strength","Loaded carries","4 x 20 yd","Build trunk, grip, and posture","Walk tall; quiet steps",["Dumbbells or kettlebells","Open space"],{supervision:true}),
  D("core-deadbug","Core","Dead bug","2 x 8/side","Build trunk control","Ribs down; breathe",["Wall/floor"]),
  D("core-sideplank","Core","Side plank","2 x 20-30 sec/side","Build lateral trunk control","Hips level; breathe",["Wall/floor"],{benchmark:{key:"sidePlank",label:"Best side plank",unit:"sec"}}),
  D("core-antirotation","Core","Anti-rotation press","3 x 8/side","Build rotational control","Stay square; move slowly",["Resistance bands"],{supervision:true}),
  D("power-broad","Power","Broad jump and stick","4 x 3","Build horizontal power and landing control","Land quiet; knees over toes",["Open space"],{intensity:"High",supervision:true,benchmark:{key:"jump",label:"Best broad jump",unit:"in"}}),
  D("power-snapdown","Power","Snap-down to athletic stance","3 x 5","Teach fast, controlled landing","Land quiet and balanced",["Open space"],{supervision:true}),
  D("power-pogo","Power","Pogo jumps","3 x 10","Build ankle stiffness and rhythm","Quick off ground; stay tall",["Open space"],{intensity:"High",supervision:true}),
  D("power-lateral-bound","Power","Lateral bound and stick","3 x 4/side","Build lateral power and control","Own the landing",["Open space"],{intensity:"High",supervision:true}),
  D("power-skater","Power","Skater hops","3 x 6/side","Build repeatable lateral power","Push wide; control each landing",["Open space"],{intensity:"High",supervision:true}),
  D("power-vertical","Power","Vertical jump and stick","4 x 3","Build vertical power","Jump tall; land quiet",["Open space"],{intensity:"High",supervision:true}),
  D("power-medball","Power","Medicine-ball rotational throw","3 x 5/side","Build rotational power","Use hips; finish balanced",["Light medicine ball","Solid wall or partner"],{intensity:"High",armLoad:"Ballistic",supervision:true}),
  D("conditioning-sprints","Conditioning","Repeated short sprints","2 sets of 4 x 10 yd","Build repeat-effort baseball stamina","Fast reps; stop before speed drops",["Open space","Cones","Phone/timer"],{intensity:"High",supervision:true}),
  D("conditioning-shuttle","Conditioning","Basepath shuttle","4-6 reps","Build change-of-direction stamina","Touch line; accelerate out",["Open space","Cones"],{intensity:"High",supervision:true}),
  D("conditioning-circuit","Conditioning","Baseball movement circuit","3 rounds","Build general work capacity","Quality movement throughout",["Open space","Cones"],{supervision:true}),
  D("conditioning-game","Conditioning","Game-like work/rest intervals","6 x 15 sec / 45 sec rest","Build sport-specific repeat effort","Work fast; fully recover",["Open space","Phone/timer"],{intensity:"High",supervision:true}),
  D("hit-hightee","Hitting","High-tee line drives","25-35 swings","Reduce casting and improve path","Inside ball; firm line drive",["Baseballs","Batting tee","Hitting/throwing net"],{benchmark:{key:"contact",label:"Quality contacts",unit:"/30"},url:"https://www.justbats.com/videos/video/baseball-training--high-tee-drills/84/"}),
  D("hit-randomtee","Hitting","Randomized tee locations","30 swings","Build adjustability","Move with location; line-drive intent",["Baseballs","Batting tee","Hitting/throwing net"],{benchmark:{key:"contact",label:"Quality contacts",unit:"/30"}}),
  D("hit-target","Hitting","Target-scoring tee rounds","5 x 5 swings","Build intent and contact accuracy","Score the result, not the swing look",["Baseballs","Batting tee","Hitting/throwing net","Target markers"],{benchmark:{key:"contact",label:"Target hits",unit:"/25"}}),
  D("hit-twostrike","Hitting","Two-strike contact rounds","3 x 8 swings","Build barrel control with a shorter approach","Compete to put every ball on a line",["Baseballs","Batting tee","Hitting/throwing net"]),
  D("hit-pause","Hitting","Pause-stride swings","3 x 8 swings","Build balance and sequence","Pause balanced; then turn",["Baseballs","Batting tee","Hitting/throwing net"]),
  D("hit-intent","Hitting","Alternating intent rounds","3 rounds of controlled / hard","Blend barrel control and bat speed","Same posture at both intents",["Baseballs","Batting tee","Hitting/throwing net"]),
  D("hit-contact","Hitting","Contact-quality challenge","30 swings","Track line drives and hard contact","Count outcomes honestly",["Baseballs","Batting tee","Hitting/throwing net"],{benchmark:{key:"contact",label:"Quality contacts",unit:"/30"}}),
  D("field-dropstep","Fielding","Drop-step footwork","4 x 4/side","Improve outfield first move","Open hips; gain ground",["Open space","Cones"]),
  D("field-routes","Fielding","Route-angle patterns","8 routes","Improve efficient pursuit angles","Beat the ball to the spot",["Open space","Cones"]),
  D("field-transfer","Fielding","Transfer footwork","3 x 8","Improve field-to-throw rhythm","Feet replace feet; stay balanced",["Baseballs","Open space","Hitting/throwing net"],{armLoad:"Light"}),
  D("field-crowhop-no-throw","Fielding","Crow-hop pattern without throw","3 x 6","Build efficient throwing footwork without arm load","Gain ground toward target",["Open space","Cones"]),
  D("field-slowroller","Fielding","Slow-roller footwork","3 x 6","Improve approach and body control","Charge under control",["Baseballs","Open space"]),
  D("field-defense","Fielding","No-throw defensive movement circuit","3 rounds","Build position movement without throwing","Move game-speed; reset fully",["Open space","Cones"]),
  D("throw-towel","Throwing","Towel / no-ball delivery","2 x 8","Build sequence with no throwing load","Move toward target; finish balanced",["Towel","Hitting/throwing net"],{armLoad:"Light",url:"https://www.playsportstv.com/baseball/baseball-pitching_the-towel-drill"}),
  D("throw-command","Throwing","Flat-ground command grid","12-20 pitches","Build fastball/changeup command","Same arm speed; record strikes",["Baseballs","Hitting/throwing net","Target markers"],{armLoad:"Throwing",supervision:true,benchmark:{key:"command",label:"Quality strikes",unit:"/20"},url:"https://www.mlb.com/pitch-smart/pitching-guidelines/ages-9-12"}),
  D("throw-interval","Throwing","Pitch Smart interval throwing","Program-defined throws","Progress throwing distance safely","Follow the exact age 11-12 progression",["Baseballs","Throwing partner","Open space"],{armLoad:"Throwing",supervision:true,url:"https://content.mlb.com/documents/7/8/6/299925786/Pitch_Smart_Preseason_Throwing_Program_11_12_h8ug12hy.pdf"}),
  D("throw-crowhop","Throwing","Crow-hop throws","3 x 5","Build position-specific throwing rhythm","Gain ground; finish through target",["Baseballs","Hitting/throwing net"],{armLoad:"Throwing",supervision:true}),
  D("throw-zone","Throwing","Command-grid zone challenge","18 pitches","Build command under changing targets","Fastball/changeup only",["Baseballs","Hitting/throwing net","Target markers"],{armLoad:"Throwing",supervision:true,benchmark:{key:"command",label:"Quality strikes",unit:"/18"}})
];

const blueprintSeed = [
  ["is-tu","In Season","Tuesday","Normal home day","Day A: Strength + Acceleration + Hitting Path",40,"Moderate",["Warm-up","Speed","Strength","Hitting"],["warm-dynamic","speed-falling","strength-squat","hit-hightee"]],
  ["is-tu-r","In Season","Tuesday","Recovery after heavy pitching","Tuesday Recovery Version",20,"Low",["Recovery","Arm care","Hitting"],["recovery-mobility","arm-scap","hit-hightee"]],
  ["is-th","In Season","Thursday","Arm fresh and rest complete","Day B: Lateral Speed + Command + Bat Speed",35,"Moderate",["Warm-up","Speed","Throwing","Hitting"],["warm-dynamic","speed-crossover","throw-command","hit-intent"]],
  ["is-th-n","In Season","Thursday","Still in throwing rest window","Thursday No-Throw Version",30,"Moderate",["Warm-up","Speed","Hitting","Fielding"],["warm-dynamic","speed-shuffle","hit-randomtee","field-crowhop-no-throw"]],
  ["is-sa","In Season","Saturday","Off weekend only","Day C: Stronger Day",45,"High",["Warm-up","Power","Strength","Hitting"],["warm-dynamic","power-broad","strength-split","hit-contact"]],
  ["is-su","In Season","Sunday","Off weekend recovery","Recovery + Skills",25,"Low",["Recovery","Arm care","Hitting"],["recovery-mobility","arm-scap","hit-hightee"]],
  ["os-mo","Off Season","Monday","Strength A","Strength + Hitting Path",40,"Moderate",["Warm-up","Strength","Core","Hitting"],["warm-dynamic","strength-squat","core-deadbug","hit-hightee"]],
  ["os-tu","Off Season","Tuesday","Speed / Throw","Speed + Throwing Skill",35,"Moderate",["Warm-up","Speed","Arm care","Throwing"],["warm-dynamic","speed-falling","arm-scap","throw-command"]],
  ["os-we","Off Season","Wednesday","Rest","Rest Day",10,"Low",["Recovery"],["recovery-mobility"]],
  ["os-th","Off Season","Thursday","Strength B","Strength + Power + Bat Speed",45,"High",["Warm-up","Power","Strength","Hitting"],["warm-dynamic","power-broad","strength-rdl","hit-intent"]],
  ["os-fr","Off Season","Friday","Pitch / Field / Hit","Pitching Command + Fielding Footwork",40,"Moderate",["Warm-up","Throwing","Fielding","Hitting"],["warm-dynamic","throw-command","field-crowhop-no-throw","hit-contact"]],
  ["os-sa","Off Season","Saturday","Optional athletic day","Fun Athletic Movement",30,"Low",["Warm-up","Conditioning","Recovery"],["warm-movement","conditioning-circuit","recovery-mobility"]],
  ["os-su","Off Season","Sunday","Rest","Rest Day",10,"Low",["Recovery"],["recovery-mobility"]]
].map(x => ({id:x[0],phase:x[1],day:x[2],dayType:x[3],name:x[4],duration:x[5],intensity:x[6],slots:x[7],drillIds:x[8]}));

const defaultEquipment = ["Baseballs","Batting tee","Hitting/throwing net","Batting cage","Pull-up bar","Light barbell/plates","Open space","Wall/floor","Towel"];
const defaultState = {
  currentPhase:"In Season", workouts:blueprintSeed, variations:[], logs:[], pitchLogs:[], tests:[],
  readiness:{energy:8,arm:8,soreness:0,date:todayISO()}, equipment:defaultEquipment,
  approvedDrillIds:drillCatalog.filter(d=>!d.supervision).map(d=>d.id)
};

let state = loadState();
let actualUser=null,currentUser=null,currentPlayer=null,users=[],players=[],teams=[],memberships=[],accessRecords=[],teamRoles=[],events=[],alerts=[],decisions=[];
let organizations=[],households=[],organizationRoles=[],teamCoachRoles=[],householdMemberships=[],playerTeamMemberships=[],playerTags=[],accessRequests=[];
let recordAssociations=[],invitations=[],profileDetails=[],playerProfiles=[];
let accessRequestDetails=[];
let usersById=new Map(),playersById=new Map(),teamsById=new Map(),organizationsById=new Map(),householdsById=new Map();
let migrationChecked=false;
let individualFilters={role:"all",team:"all",query:""};
let adminTableControls={};
let associationActiveTab="household";
let deferredInstallPrompt=null;
let libraryFilter = "All";

function loadState(){
  const current=localStorage.getItem(STORAGE_KEY);
  if(current) return normalizeState(JSON.parse(current));
  const old=localStorage.getItem(OLD_STORAGE_KEY);
  if(old){
    const legacy=JSON.parse(old), migrated=structuredClone(defaultState);
    ["logs","pitchLogs","tests","readiness","currentPhase"].forEach(k=>{if(legacy[k]!=null)migrated[k]=legacy[k]});
    if(legacy.workouts?.length)migrated.workouts=legacy.workouts.map(migrateLegacyWorkout);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated));
    return migrated;
  }
  return structuredClone(defaultState);
}
function inferDrillId(text){
  const t=text.toLowerCase();
  const rules=[["warm","warm-dynamic"],["mobility","recovery-mobility"],["arm-care","arm-scap"],["arm care","arm-scap"],["falling","speed-falling"],["shuffle","speed-shuffle"],["crossover","speed-crossover"],["broad jump","power-broad"],["split squat","strength-split"],["front-hold squat","strength-squat"],["squat","strength-squat"],["rdl","strength-rdl"],["push-up","strength-pushup"],["pull-up","strength-hang"],["dead bug","core-deadbug"],["side plank","core-sideplank"],["high-tee","hit-hightee"],["top-hand","hit-randomtee"],["contact ladder","hit-contact"],["bat-speed","hit-intent"],["tee","hit-hightee"],["towel","throw-towel"],["flat-ground","throw-command"],["command","throw-command"],["crow-hop","field-crowhop-no-throw"],["catch","arm-scap"],["rest","recovery-mobility"]];
  return rules.find(([term])=>t.includes(term))?.[1]||"recovery-mobility";
}
function migrateLegacyWorkout(w){
  const seed=blueprintSeed.find(b=>b.id===w.id), phase=w.phase||seed?.phase||"In Season";
  const drillIds=(w.drills||[]).map(inferDrillId).slice(0,maxItems(phase));
  return {...(seed||{}),...w,phase,slots:drillIds.map(id=>drillFor(id).category),drillIds};
}
function normalizeState(s){return {...structuredClone(defaultState),...s,workouts:s.workouts?.every(w=>w.slots)?s.workouts:blueprintSeed,variations:s.variations||[],equipment:s.equipment||defaultEquipment,approvedDrillIds:s.approvedDrillIds||defaultState.approvedDrillIds}}
function saveState(){if(currentPlayer)ClubhouseDB.put("playerData",{id:currentPlayer.id,data:state})}
function drillFor(id){return drillCatalog.find(d=>d.id===id)}
function workoutFor(id){return state.workouts.find(w=>w.id===id)}
function variationFor(id){return state.variations.find(v=>v.id===id)}
function sessionFor(id){const v=variationFor(id);if(v){const b=workoutFor(v.blueprintId);return {...b,...v,id:v.id,name:v.name,isVariation:true}}return workoutFor(id)}
function fmtDate(d){return new Date(`${d}T12:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
function restDays(p){return p<=20?0:p<=35?1:p<=50?2:p<=65?3:4}
function addDays(date,days){const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+days+1);return d.toISOString().slice(0,10)}
function latestPitch(){return [...state.pitchLogs].sort((a,b)=>b.date.localeCompare(a.date))[0]}
function eligibleToThrow(){const p=latestPitch();return !p||todayISO()>=addDays(p.date,restDays(p.pitches))}
function hasEquipment(d){return d.equipment.every(e=>state.equipment.includes(e))}
function isApproved(d){return state.approvedDrillIds.includes(d.id)}
function recentDrillIds(){return new Set(state.logs.slice(-3).flatMap(l=>l.drillResults?.map(r=>r.drillId)||[]))}
function maxItems(phase){return phase==="In Season"?4:5}
function showToast(text){const t=document.querySelector("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function statCard([l,v,d]){return `<article class="stat-card"><small>${l}</small><strong>${v}</strong><em>${d}</em></article>`}
function drillLabel(id){const d=drillFor(id);return d?`${d.name} - ${d.dose}`:"Unknown drill"}
function sessionIssues(session){
  const drills=session.drillIds.map(drillFor).filter(Boolean), issues=[];
  const missing=[...new Set(drills.flatMap(d=>d.equipment.filter(e=>!state.equipment.includes(e))))];
  const unapproved=drills.filter(d=>!isApproved(d));
  const throwing=drills.filter(d=>d.armLoad==="Throwing");
  const ballistic=drills.filter(d=>d.armLoad==="Ballistic");
  if(missing.length)issues.push({type:"equipment",text:`Missing equipment: ${missing.join(", ")}`});
  if(unapproved.length)issues.push({type:"approval",text:`Parent approval needed: ${unapproved.map(d=>d.name).join(", ")}`});
  if(!eligibleToThrow()&&throwing.length)issues.push({type:"blocked",text:"Throwing is blocked during the active pitch-rest window."});
  if(state.readiness.soreness>=5&&ballistic.length)issues.push({type:"warning",text:"Elevated soreness: replace or carefully review upper-body ballistic work."});
  if(session.phase==="In Season"&&session.drillIds.length>4)issues.push({type:"blocked",text:"In-season sessions cannot exceed four items."});
  if(session.phase==="Off Season"&&session.drillIds.length>5)issues.push({type:"blocked",text:"Off-season sessions cannot exceed five items."});
  if(/Recovery|Rest/.test(session.dayType)&&session.intensity==="High")issues.push({type:"blocked",text:"Recovery sessions cannot be high intensity."});
  return issues;
}

function renderAll(){renderSidebar();renderDashboard();renderPlan();renderLog();renderPitch();renderTests();renderLibrary();renderEquipment();renderSchedule();renderAdmin();renderAlerts();renderProgress();renderContext()}
function renderSidebar(){const p=Math.min(100,Math.round(state.logs.length/24*100));document.querySelector("#season-percent").textContent=`${p}%`;document.querySelector("#season-meter-bar").style.width=`${p}%`;document.querySelector("#season-detail").textContent=`${state.logs.length} sessions complete`}
function todaysWorkout(){const day=DAYS[new Date().getDay()],phase=state.currentPhase;let choices=state.workouts.filter(w=>w.phase===phase&&w.day===day);if(phase==="In Season"&&!eligibleToThrow())choices=choices.filter(w=>/Recovery|No-Throw/.test(w.name));return choices[0]||state.workouts.find(w=>w.phase===phase)}
function noPlayerActionLabel(){return isUnassociated()?"Request access":canCreatePlayer()||isSuperUser()?"Create or link player":"Open profile"}
function renderDashboard(){
  if(!currentPlayer){
    document.querySelector("#today-card").innerHTML=`<p class="eyebrow">Player setup</p><h2>No player selected</h2><p class="meta">Clubhouse is player-first. Create a player record, link an existing player, or accept an invitation before logging daily training.</p><div class="drill-preview"><span>Readiness</span><span>Training plan</span><span>Progress history</span></div><button class="primary-button" data-view-link="admin">${noPlayerActionLabel()}</button>`;
    document.querySelector("#workload-alert").innerHTML=`<div class="workload-alert"><div><strong>Player record needed</strong>Daily training, pitch counts, and progress are saved to the selected player.</div><button class="text-button" data-view-link="admin">Profile</button></div>`;
    document.querySelector("#stat-grid").innerHTML=[["Player","Needed","select or create"],["Daily loop","Ready","after setup"],["Training data","Protected","per player"],["Access","Structured","team and household"]].map(statCard).join("");
    document.querySelector("#week-strip").innerHTML=`<div class="empty-state">Select a player to see the weekly training plan.</div>`;
    document.querySelector("#balance-list").innerHTML=`<div class="empty-state">Training balance appears after player setup.</div>`;
    renderReadiness();
    return;
  }
  const w=todaysWorkout(), drills=w.drillIds.map(drillFor);
  document.querySelector("#today-card").innerHTML=`<p class="eyebrow">${state.currentPhase}  /  ${w.dayType}</p><h2>${w.name}</h2><p class="meta">${w.duration} min  /  ${w.intensity}  /  ${drills.length} items</p><div class="drill-preview">${drills.slice(0,3).map(d=>`<span>${d.name}</span>`).join("")}</div><button class="primary-button" data-start-session="${w.id}">Start session</button>${canBuildTraining()?` <button class="secondary-button" data-build-variation="${w.id}">Build variation</button>`:""}`;
  const p=latestPitch(),alert=document.querySelector("#workload-alert");
  if(p){const rest=restDays(p.pitches),next=addDays(p.date,rest),clear=todayISO()>=next;alert.innerHTML=`<div class="workload-alert ${clear?"clear":""}"><div><strong>${clear?"Throwing rest complete":"Throwing restricted"}</strong>${p.pitches} pitches on ${fmtDate(p.date)}  /  ${rest} rest day(s) required${p.pitches>=41?"  /  No catching afterward that day":""}</div><button class="text-button" data-view-link="pitch">Pitch log</button></div>`}else alert.innerHTML=`<div class="workload-alert clear"><div><strong>No recent pitch count</strong>Log throwing outings to activate rest guidance.</div><button class="text-button" data-view-link="pitch">Log pitches</button></div>`;
  const mins=state.logs.reduce((s,l)=>s+Number(l.duration),0),avg=state.logs.length?(state.logs.reduce((s,l)=>s+Number(l.rpe),0)/state.logs.length).toFixed(1):"--";
  document.querySelector("#stat-grid").innerHTML=[["Current phase",state.currentPhase,"active plan"],["Saved variants",state.variations.length,"reusable sessions"],["Training time",`${Math.floor(mins/60)}h ${mins%60}m`,"focused work"],["Avg. effort",avg,"target 4-7"]].map(statCard).join("");
  document.querySelector("#week-strip").innerHTML=DAYS.map((day,i)=>{const x=state.workouts.find(a=>a.phase===state.currentPhase&&a.day===day);return `<div class="day-cell ${i===new Date().getDay()?"today":""}"><small>${day.slice(0,3)}</small><strong>${x?x.intensity.slice(0,3):"TEAM"}</strong><i></i></div>`}).join("");
  const counts=state.workouts.filter(w=>w.phase===state.currentPhase).reduce((a,w)=>{a[w.intensity]=(a[w.intensity]||0)+1;return a},{}),mx=Math.max(...Object.values(counts),1);
  document.querySelector("#balance-list").innerHTML=Object.entries(counts).map(([n,v])=>`<div class="balance-item"><div><strong>${n}</strong><span>${v} days</span></div><div class="balance-bar"><i style="width:${v/mx*100}%"></i></div></div>`).join("");renderReadiness();
}
const FEELINGS={
  energy:[["Wiped Out",2],["Low",4],["Okay",6],["Good",8],["Great",10]],
  arm:[["Hurts",1],["Very Sore",3],["A Little Sore",5],["Good",8],["Great",10]],
  soreness:[["Very Sore",9],["Sore",7],["A Little Sore",5],["Good",3],["Fresh",1]]
};
function feelingSvg(value,invert=false){const good=invert?11-value:value,mouth=good>=8?"M15 26 Q24 34 33 26":good>=5?"M16 28 H32":"M15 32 Q24 24 33 32",eyes=good>=5?"":" opacity='.65'";return `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="20" r="2.5" fill="currentColor"${eyes}/><circle cx="31" cy="20" r="2.5" fill="currentColor"${eyes}/><path d="${mouth}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`}
function esc(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function profileInitials(name=""){const parts=String(name).trim().split(/\s+/).filter(Boolean);return (parts.length>1?`${parts[0][0]}${parts.at(-1)[0]}`:parts[0]?.slice(0,2)||"?").toUpperCase()}
function publicRecordId(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%*-_";let out="";const bytes=new Uint8Array(15);crypto.getRandomValues(bytes);bytes.forEach(b=>out+=chars[b%chars.length]);return out}
const RECORD_TYPES=[
  {type:"organization",label:"Organization",plural:"Organizations",store:"organizations",role:"Director"},
  {type:"team",label:"Team",plural:"Teams",store:"teams",role:"Coach"},
  {type:"household",label:"Household",plural:"Households",store:"households",role:"Parent"},
  {type:"coach",label:"Coach",plural:"Coaches",store:"users",role:"Coach"},
  {type:"player",label:"Player/Individual",plural:"Players/Individuals",store:"players",role:"Player"}
];
const ADMIN_RECORD_TYPES=[
  {type:"superUser",label:"Super User",store:"users",role:"Super User"},
  RECORD_TYPES[0],RECORD_TYPES[1],RECORD_TYPES[2],
  {type:"director",label:"Director",store:"users",role:"Director"},
  RECORD_TYPES[3],
  {type:"parent",label:"Parent",store:"users",role:"Parent"},
  RECORD_TYPES[4]
];
function recordMeta(type){return [...RECORD_TYPES,...ADMIN_RECORD_TYPES,{type:"individual",label:"Individual",plural:"Individuals",store:"users",role:""},{type:"unassociated",label:"Individual",plural:"Individuals",store:"users",role:""}].find(r=>r.type===type)}
function recordPlural(type){const meta=recordMeta(type);return meta?.plural||`${meta?.label||type}s`}
function userHasAnyAssociation(userId){
  return userRecordAssociations(userId).length||
    organizationRoles.some(r=>r.userId===userId&&r.active!==false)||
    teamCoachRoles.some(r=>r.userId===userId&&r.active!==false)||
    householdMemberships.some(m=>m.userId===userId&&m.active!==false)||
    players.some(p=>p.userId===userId&&p.active!==false);
}
function isIndividualUser(user){return Boolean(user)&&!isSuperUser(user)&&(!userHasAnyAssociation(user.id)||isUnassociated(user))}
function recordsForType(type){
  if(type==="superUser")return users.filter(u=>isSuperUser(u));
  if(type==="unassociated")return users.filter(u=>isIndividualUser(u));
  if(type==="organization")return organizations;
  if(type==="team")return teams;
  if(type==="household")return households;
  if(type==="director")return users.filter(u=>rolesFor(u).includes("Director")||u.recordType==="director");
  if(type==="coach")return users.filter(u=>rolesFor(u).includes("Coach")||u.recordType==="coach");
  if(type==="parent")return users.filter(u=>rolesFor(u).includes("Parent")||u.recordType==="parent");
  if(type==="individual")return users;
  if(type==="player")return players;
  return [];
}
function rebuildRecordIndexes(){
  usersById=new Map(users.map(u=>[u.id,u]));
  playersById=new Map(players.map(p=>[p.id,p]));
  teamsById=new Map(teams.map(t=>[t.id,t]));
  organizationsById=new Map(organizations.map(o=>[o.id,o]));
  householdsById=new Map(households.map(h=>[h.id,h]));
}
const userById=id=>usersById.get(id);
const playerById=id=>playersById.get(id);
const teamById=id=>teamsById.get(id);
const organizationById=id=>organizationsById.get(id);
const householdById=id=>householdsById.get(id);
function normalizeLoadedRecords(){
  users=users.map(u=>({...u,username:u.username||u.name,roles:normalizeRoles(u),status:u.status||"active",loginCount:u.loginCount||0,lastLoginAt:u.lastLoginAt||null}));
  memberships=playerTeamMemberships;
  teamRoles=teamCoachRoles.map(r=>({id:r.id,userId:r.userId,teamId:r.teamId,coach:true,scheduler:true,coachType:r.coachType,specializations:r.specializations,active:r.active}));
  rebuildRecordIndexes();
}
function recordName(record){return record?.name||record?.username||"Unnamed"}
function assocFor(userId,type,recordId){return recordAssociations.find(a=>a.userId===userId&&a.recordType===type&&a.recordId===recordId&&a.active!==false)}
function userRecordAssociations(userId=currentUser?.id,type){return recordAssociations.filter(a=>a.userId===userId&&a.active!==false&&(!type||a.recordType===type))}
function isRecordAdmin(type,recordId,userId=currentUser?.id){const user=userById(userId);return isSuperUser(user)||(["superUser","unassociated","director","coach","parent"].includes(type)&&isSuperUser(actualUser))||assocFor(userId,type,recordId)?.role==="admin"}
function idsFrom(items,key){return [...new Set(items.map(x=>x?.[key]).filter(Boolean))]}
function householdIdsForUser(userId=currentUser?.id){const owned=householdMemberships.filter(m=>m.userId===userId&&m.active!==false).map(m=>m.householdId),playerIds=players.filter(p=>p.userId===userId&&p.active!==false).map(p=>p.id),asPlayer=householdMemberships.filter(m=>playerIds.includes(m.playerId)&&m.active!==false).map(m=>m.householdId);return [...new Set([...owned,...asPlayer,...userRecordAssociations(userId,"household").map(a=>a.recordId)])]}
function householdPlayerIds(userId=currentUser?.id){const hh=householdIdsForUser(userId);return idsFrom(householdMemberships.filter(m=>hh.includes(m.householdId)&&m.playerId&&m.active!==false),"playerId")}
function householdParentUserIds(userId=currentUser?.id){const hh=householdIdsForUser(userId);return idsFrom(householdMemberships.filter(m=>hh.includes(m.householdId)&&m.userId&&m.role==="parent"&&m.active!==false),"userId")}
function teamIdsForPlayers(playerIds){return idsFrom(playerTeamMemberships.filter(m=>playerIds.includes(m.playerId)&&m.active!==false),"teamId")}
function orgIdsForTeams(teamIds){return idsFrom(teams.filter(t=>teamIds.includes(t.id)&&t.organizationId),"organizationId")}
function orgTeamIds(orgIds){return idsFrom(teams.filter(t=>orgIds.includes(t.organizationId)&&t.active!==false),"id")}
function teamPlayerIds(teamIds){return idsFrom(playerTeamMemberships.filter(m=>teamIds.includes(m.teamId)&&m.active!==false),"playerId")}
function playerParentUserIds(playerIds){const hids=idsFrom(householdMemberships.filter(m=>playerIds.includes(m.playerId)&&m.active!==false),"householdId");return idsFrom(householdMemberships.filter(m=>hids.includes(m.householdId)&&m.userId&&m.role==="parent"&&m.active!==false),"userId")}
function organizationIdsForUser(userId=currentUser?.id){if(isSuperUser(userById(userId)||currentUser))return organizations.map(o=>o.id);const direct=userOrgIds(userId),coached=orgIdsForTeams(coachTeamIds(userId)),householdTeams=teamIdsForPlayers(householdPlayerIds(userId)),householdOrgs=orgIdsForTeams(householdTeams),selfTeams=teamIdsForPlayers(players.filter(p=>p.userId===userId).map(p=>p.id));return [...new Set([...direct,...coached,...householdOrgs,...orgIdsForTeams(selfTeams)])]}
function visibleTeamIds(userId=currentUser?.id){if(isSuperUser(userById(userId)||currentUser))return teams.map(t=>t.id);const own=coachTeamIds(userId),orgView=orgTeamIds(orgIdsForTeams(own)),householdTeams=teamIdsForPlayers(householdPlayerIds(userId)),selfTeams=teamIdsForPlayers(players.filter(p=>p.userId===userId).map(p=>p.id));if(organizationRoles.some(r=>r.userId===userId&&r.active!==false))return orgTeamIds(organizationIdsForUser(userId));return [...new Set([...own,...orgView,...householdTeams,...selfTeams,...userRecordAssociations(userId,"team").map(a=>a.recordId)])]}
function visiblePlayerIds(userId=currentUser?.id){if(isSuperUser(userById(userId)||currentUser))return players.map(p=>p.id);if(organizationRoles.some(r=>r.userId===userId&&r.active!==false))return teamPlayerIds(orgTeamIds(organizationIdsForUser(userId)));const coachedOwn=teamPlayerIds(coachTeamIds(userId)),coachOrg=teamPlayerIds(orgTeamIds(orgIdsForTeams(coachTeamIds(userId)))),household=householdPlayerIds(userId),self=players.filter(p=>p.userId===userId).map(p=>p.id),playerTeam=teamPlayerIds(teamIdsForPlayers(self));return [...new Set([...self,...household,...coachedOwn,...coachOrg,...playerTeam,...userRecordAssociations(userId,"player").map(a=>a.recordId)])]}
function visibleParentUserIds(userId=currentUser?.id){const user=userById(userId)||currentUser;if(isSuperUser(user))return users.filter(u=>rolesFor(u).includes("Parent")||u.recordType==="parent").map(u=>u.id);const hParents=householdParentUserIds(userId),self=rolesFor(user).includes("Parent")?[userId]:[];let playerIds=[];if(organizationRoles.some(r=>r.userId===userId&&r.active!==false))playerIds=visiblePlayerIds(userId);else if(teamCoachRoles.some(r=>r.userId===userId&&r.active!==false))playerIds=teamPlayerIds(coachTeamIds(userId));else playerIds=visiblePlayerIds(userId);return [...new Set([...self,...hParents,...playerParentUserIds(playerIds)])]}
function visibleCoachUserIds(userId=currentUser?.id){if(isSuperUser(userById(userId)||currentUser))return users.filter(u=>rolesFor(u).includes("Coach")||u.recordType==="coach").map(u=>u.id);const teamIds=visibleTeamIds(userId);return idsFrom(teamCoachRoles.filter(r=>teamIds.includes(r.teamId)&&r.active!==false),"userId")}
function canEditIndividualUser(record,userId=currentUser?.id){
  const user=userById(userId)||currentUser;
  if(record.id===userId||isSuperUser(user))return true;
  const linkedPlayers=players.filter(p=>p.userId===record.id&&p.active!==false);
  if(isParent(user)&&linkedPlayers.some(p=>householdPlayerIds(userId).includes(p.id)))return true;
  const orgIds=organizationIdsForUser(userId);
  const orgCoachLink=recordAssociations.some(a=>a.userId===record.id&&a.recordType==="organization"&&orgIds.includes(a.recordId)&&a.active!==false&&String(a.role||"").toLowerCase().includes("coach"));
  if(isDirector(user)&&(canEditRecord("coach",record,userId)||orgCoachLink))return true;
  return false;
}
function canEditRecord(type,record,userId=currentUser?.id){
  if(!record||isSuperUser(userById(userId)||currentUser))return Boolean(record);
  if(["director","coach","parent","unassociated"].includes(type)&&record.id===userId)return true;
  if(type==="organization")return organizationRoles.some(r=>r.userId===userId&&r.organizationId===record.id&&r.active!==false)||assocFor(userId,"organization",record.id)?.role==="admin";
  if(type==="team")return organizationRoles.some(r=>r.userId===userId&&teamById(record.id)?.organizationId===r.organizationId&&r.active!==false)||teamCoachRoles.some(r=>r.userId===userId&&r.teamId===record.id&&r.active!==false);
  if(type==="household")return householdMemberships.some(m=>m.userId===userId&&m.householdId===record.id&&m.role==="parent"&&m.active!==false);
  if(type==="player"){const player=record;return player.userId===userId||organizationRoles.some(r=>r.userId===userId&&orgTeamIds([r.organizationId]).some(tid=>playerTeamMemberships.some(m=>m.teamId===tid&&m.playerId===player.id&&m.active!==false))&&r.active!==false)||teamCoachRoles.some(r=>r.userId===userId&&r.active!==false&&playerTeamMemberships.some(m=>m.teamId===r.teamId&&m.playerId===player.id&&m.active!==false))||householdPlayerIds(userId).includes(player.id)&&isParent(userById(userId)||currentUser)}
  if(type==="coach")return organizationIdsForUser(userId).some(orgId=>teamCoachRoles.some(r=>r.userId===record.id&&r.active!==false&&teamById(r.teamId)?.organizationId===orgId))&&isDirector(userById(userId)||currentUser);
  if(type==="parent")return record.id===userId||(isParent(userById(userId)||currentUser)&&householdParentUserIds(userId).includes(record.id));
  if(type==="individual")return canEditIndividualUser(record,userId);
  return isRecordAdmin(type,record.id,userId);
}
function visibleRecords(type,userId=currentUser?.id){if(isSuperUser(userById(userId)||currentUser))return recordsForType(type);const ids=userRecordAssociations(userId,type).map(a=>a.recordId);if(type==="organization")return organizations.filter(o=>organizationIdsForUser(userId).includes(o.id));if(type==="team")return teams.filter(t=>visibleTeamIds(userId).includes(t.id));if(type==="household")return households.filter(h=>householdIdsForUser(userId).includes(h.id));if(type==="player")return players.filter(p=>visiblePlayerIds(userId).includes(p.id));if(type==="parent")return users.filter(u=>visibleParentUserIds(userId).includes(u.id));if(type==="coach")return users.filter(u=>visibleCoachUserIds(userId).includes(u.id));if(type==="director")return users.filter(u=>ids.includes(u.id)||rolesFor(u).includes("Director"));return recordsForType(type).filter(r=>ids.includes(r.id)||r.id===userId)}
function adminRecordsForType(type){return type==="player"?[...players,...recordsForType("unassociated").map(u=>({...u,__recordType:"unassociated"}))]:recordsForType(type)}
function isParentApprovalForCurrentUser(req){return req?.userId===currentUser?.id&&req.requestedUserId&&req.requestedUserId!==currentUser?.id}
function isTeamCoachApprovalForCurrentUser(req){return req?.recordType==="team"&&teamCoachRoles.some(r=>r.userId===currentUser?.id&&r.teamId===req.recordId&&r.active!==false)}
function canDecideRecordRequest(req){return Boolean(req&&req.status==="pending"&&(isRecordAdmin(req.recordType,req.recordId)||isParentApprovalForCurrentUser(req)||isTeamCoachApprovalForCurrentUser(req)))}
function pendingRequestsForAdmin(){return accessRequests.filter(r=>canDecideRecordRequest(r))}
function pendingApprovalCount(){return pendingRequestsForAdmin().length}
function requestDetail(req){
  const detail=accessRequestDetails.find(d=>d.id===req.id)||{};
  const user=users.find(u=>u.id===(req.requestedUserId||req.userId)),approver=users.find(u=>u.id===req.userId),meta=recordMeta(req.recordType),rec=recordsForType(req.recordType).find(x=>x.id===req.recordId);
  return {
    requesterName:detail.requester_name||user?.name||"Unknown user",
    requesterEmail:detail.requester_email||user?.username||"No email available",
    approverName:detail.approver_name||approver?.name||"",
    recordType:meta?.label||req.recordType||"Record",
    recordName:detail.record_name||recordName(rec)||"Unknown record",
    requestedRole:req.requestedRole||"member",
    recordId:req.recordId
  };
}
function installGuidance(){if(deferredInstallPrompt)return "Install app";return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?"Add to Home Screen":"Install app"}
function renderReadiness(){Object.entries(FEELINGS).forEach(([key,choices])=>{document.querySelector(`#${key}-options`).innerHTML=choices.map(([label,value])=>`<button type="button" class="feeling-choice ${state.readiness[key]===value?"selected":""}" data-feeling="${key}" data-value="${value}">${feelingSvg(value,key==="soreness")}<span>${label}</span></button>`).join("")});document.querySelector("#readiness-detail-wrap").hidden=state.readiness.arm>1&&state.readiness.soreness<7;document.querySelector("#readiness-score").textContent=((+state.readiness.energy + +state.readiness.arm + (11- +state.readiness.soreness))/3).toFixed(1)}
function renderPlan(){
  const ws=state.workouts.filter(w=>w.phase===state.currentPhase);
  document.querySelector("#plan-list").innerHTML=ws.map(w=>{const vars=state.variations.filter(v=>v.blueprintId===w.id);return `<article class="workout-card"><div class="workout-day"><small>${w.dayType}</small><strong>${w.day}</strong></div><div><h3>${w.name}</h3><p><span class="tag">${w.phase}</span><span class="tag">${w.intensity}</span>${w.slots.join("  /  ")}</p>${vars.map(v=>`<span class="variant-row"><button class="variant-chip" data-start-session="${v.id}">${v.name}</button>${canBuildTraining()?`<button class="variant-action" data-edit-variation="${v.id}">Edit</button><button class="variant-action" data-delete-variation="${v.id}">Delete</button>`:""}</span>`).join("")}</div><div class="card-actions"><button data-start-session="${w.id}">Start</button>${canBuildTraining()?`<button data-build-variation="${w.id}">Variation</button>`:""}</div></article>`}).join("");
}
function allSessions(){return [...state.workouts,...state.variations.map(v=>sessionFor(v.id))]}
function renderLog(){
  const s=document.querySelector("#log-workout"),selected=s.value;s.innerHTML=allSessions().map(w=>`<option value="${w.id}">${w.isVariation?"Variant":"Plan"}: ${w.name}</option>`).join("");if(selected&&sessionFor(selected))s.value=selected;document.querySelector("#log-date").value||=todayISO();renderLogDrills();
  document.querySelector("#history-list").innerHTML=state.logs.length?[...state.logs].reverse().map(l=>{const session=sessionFor(l.sessionId||l.workoutId);const done=l.drillResults?.filter(r=>r.completed).length;return `<div class="history-item"><div><h3>${session?.name||l.sessionName||"Workout"}</h3><strong>RPE ${l.rpe}</strong></div><p>${fmtDate(l.date)}  /  ${l.duration} min${done!=null?`  /  ${done}/${l.drillResults.length} items`:""}</p>${l.notes?`<p>${l.notes}</p>`:""}</div>`}).join(""):`<div class="empty-state">Your completed sessions will appear here.</div>`;
}
function renderLogDrills(){const session=sessionFor(document.querySelector("#log-workout").value)||allSessions()[0];document.querySelector("#log-drill-list").innerHTML=session?session.drillIds.map(id=>{const d=drillFor(id);return `<div class="log-drill"><label class="check-label"><input type="checkbox" data-complete-drill="${id}" checked><span><strong>${d.name}</strong><small>${d.dose}</small></span></label>${d.benchmark?`<label>${d.benchmark.label}<input data-benchmark-drill="${id}" type="number" step=".01" placeholder="${d.benchmark.unit}"></label>`:""}</div>`}).join(""):""}
function renderPitch(){document.querySelector("#pitch-date").value||=todayISO();const p=latestPitch(),status=document.querySelector("#pitch-status");if(!p)status.innerHTML=`<div class="pitch-status-card"><h3>Ready to begin tracking</h3><p>Stop throwing for sharp or next-day elbow/shoulder pain.</p></div>`;else{const r=restDays(p.pitches),next=addDays(p.date,r),restricted=todayISO()<next;status.innerHTML=`<div class="pitch-status-card ${restricted?"restricted":""}"><h3>${restricted?`No throwing until ${fmtDate(next)}`:"Rest requirement complete"}</h3><p>${p.pitches} pitches  /  ${r} rest day(s)  /  soreness ${p.soreness}/10</p></div>`}document.querySelector("#pitch-history").innerHTML=state.pitchLogs.length?[...state.pitchLogs].reverse().map(x=>`<div class="history-item"><div><h3>${x.setting}</h3><strong>${x.pitches} pitches</strong></div><p>${fmtDate(x.date)}  /  ${restDays(x.pitches)} rest day(s)</p></div>`).join(""):""}
function renderTests(){document.querySelector("#test-date").value||=todayISO();document.querySelector("#test-history").innerHTML=state.tests.length?[...state.tests].reverse().map(t=>`<div class="test-card"><h3>${fmtDate(t.date)}</h3><div class="test-metrics"><span><strong>${t.sprint||"--"}</strong>10 yd sec</span><span><strong>${t.jump||"--"}</strong>broad jump</span><span><strong>${t.pushups||"--"}</strong>push-ups</span><span><strong>${t.hang||"--"}</strong>hang sec</span><span><strong>${t.command!==""?Math.round(t.command/20*100)+"%":"--"}</strong>command</span><span><strong>${t.contact!==""?Math.round(t.contact/30*100)+"%":"--"}</strong>contact</span></div></div>`).join(""):`<div class="empty-state">Record a baseline assessment, then retest every 4-6 weeks.</div>`}
function renderLibrary(){
  const cats=["All",...new Set(drillCatalog.map(d=>d.category))];document.querySelector("#library-filters").innerHTML=cats.map(c=>`<button class="filter ${c===libraryFilter?"active":""}" data-library-filter="${c}">${c}</button>`).join("");
  const recent=recentDrillIds(),list=libraryFilter==="All"?drillCatalog:drillCatalog.filter(d=>d.category===libraryFilter);
  document.querySelector("#library-grid").innerHTML=list.map(d=>`<article class="drill-card ${!isApproved(d)?"needs-approval":""}"><div><span class="tag">${d.category}</span>${d.benchmark?`<span class="tag">Benchmark</span>`:""}${recent.has(d.id)?`<span class="tag neutral">Recently used</span>`:""}</div><h3>${d.name}</h3><p><strong>Dose:</strong> ${d.dose}<br><strong>Purpose:</strong> ${d.purpose}<br><strong>Cue:</strong> ${d.cue}<br><strong>Equipment:</strong> ${d.equipment.join(", ")}</p><div class="drill-status">${hasEquipment(d)?"Equipment ready":`Missing: ${d.equipment.filter(e=>!state.equipment.includes(e)).join(", ")}`}</div>${d.supervision&&isAdmin()?`<button class="${isApproved(d)?"secondary-button":"primary-button"}" data-toggle-approval="${d.id}">${isApproved(d)?"Approved - revoke":"Review and approve"}</button>`:"<span class='approval-note'>Requires parent/coach approval</span>"}${d.url?`<a href="${d.url}" target="_blank" rel="noopener">Reference</a>`:""}</article>`).join("");
}
function renderEquipment(){
  document.querySelector("#equipment-grid").innerHTML=state.equipment.map(e=>`<button class="equipment-item" data-remove-equipment="${e}"><span>${e}</span><small>Remove</small></button>`).join("");
  const missing=[...new Set(drillCatalog.flatMap(d=>d.equipment.filter(e=>!state.equipment.includes(e))))];
  document.querySelector("#missing-equipment-list").innerHTML=missing.map(e=>`<div class="history-item"><div><h3>${e}</h3><strong>${drillCatalog.filter(d=>d.equipment.includes(e)).length} drills</strong></div></div>`).join("")||`<div class="empty-state">The shed covers every drill in the library.</div>`;
}
function normalizeRoles(user){
  const raw=user?.roles||[];
  const roles=raw.map(r=>r==="Owner"?"Super User":r==="Scheduler"?"Director":r).filter(r=>ROLE_ORDER.includes(r));
  if(user?.owner&&!roles.includes("Super User"))roles.push("Super User");
  return [...new Set(roles)];
}
function rolesFor(user=currentUser){
  const base=normalizeRoles(user);
  const assigned=[
    ...organizationRoles.filter(r=>r.userId===user?.id&&r.active!==false).map(()=>"Director"),
    ...teamCoachRoles.filter(r=>r.userId===user?.id&&r.active!==false).map(()=>"Coach"),
    ...householdMemberships.filter(r=>r.userId===user?.id&&r.role==="parent"&&r.active!==false).map(()=>"Parent"),
    ...players.filter(p=>p.userId===user?.id&&p.active!==false).map(()=>"Player")
  ];
  return [...new Set([...base,...assigned])].sort((a,b)=>ROLE_ORDER.indexOf(b)-ROLE_ORDER.indexOf(a));
}
function highestRole(user=currentUser){return rolesFor(user)[0]||""}
function isSuperUser(user=currentUser){return rolesFor(user).includes("Super User")}
function isDirector(user=currentUser){return rolesFor(user).includes("Director")}
function isCoach(user=currentUser){return rolesFor(user).includes("Coach")||teamRoles.some(r=>r.userId===user?.id&&r.coach)}
function isParent(user=currentUser){return rolesFor(user).includes("Parent")}
function isUnassociated(user=currentUser){return Boolean(user)&&user.status==="pending_association"&&!rolesFor(user).length}
function isAdmin(){return Boolean(currentUser)&&(isUnassociated()||isSuperUser()||isDirector()||isCoach()||isParent())}
function isMasquerading(){return Boolean(actualUser&&currentUser&&actualUser.id!==currentUser.id)}
function canManageSecurity(){return isSuperUser(actualUser)&&!isMasquerading()}
function canManageOrganization(orgId){return isSuperUser()||isDirector()||organizationRoles.some(r=>r.userId===currentUser?.id&&r.organizationId===orgId&&r.active!==false)||isRecordAdmin("organization",orgId)}
function canCreateProfile(){return isSuperUser()||isDirector()||headCoachTeamIds().length>0}
function canCreateTeam(){return isSuperUser()||isDirector()}
function canCreatePlayer(){return isDirector()||isParent()||headCoachTeamIds().length>0||assistantCoachTeamIds().length>0}
function canResetPins(){return canManageSecurity()}
function defaultOrg(){return organizations[0]}
function userOrgIds(userId=currentUser?.id){if(isSuperUser())return organizations.map(o=>o.id);return [...new Set([...organizationRoles.filter(r=>r.userId===userId&&r.active!==false).map(r=>r.organizationId),...userRecordAssociations(userId,"organization").map(a=>a.recordId)])]}
function headCoachTeamIds(userId=currentUser?.id){return teamCoachRoles.filter(r=>r.userId===userId&&r.coachType==="head"&&r.active!==false).map(r=>r.teamId)}
function assistantCoachTeamIds(userId=currentUser?.id){return teamCoachRoles.filter(r=>r.userId===userId&&r.coachType==="assistant"&&r.active!==false).map(r=>r.teamId)}
function coachTeamIds(userId=currentUser?.id){return [...new Set([...headCoachTeamIds(userId),...assistantCoachTeamIds(userId)])]}
function playerTagValues(playerId){return playerTags.filter(t=>t.playerId===playerId).flatMap(t=>t.tags||[])}
function coachCanAccessPlayer(coachRole,playerId){
  if(coachRole.coachType==="head")return true;
  const specs=coachRole.specializations||["All"];
  if(specs.includes("All"))return true;
  return playerTagValues(playerId).some(t=>specs.includes(t));
}
function accessiblePlayerIds(){
  if(!currentUser)return[];
  return visiblePlayerIds(currentUser.id);
}
function managedTeamIds(){
  if(isSuperUser()||isDirector())return teams.map(t=>t.id);
  const coached=coachTeamIds();
  const associated=userRecordAssociations(currentUser?.id,"team").map(a=>a.recordId);
  const household=memberships.filter(m=>accessiblePlayerIds().includes(m.playerId)&&m.active).map(m=>m.teamId);
  return [...new Set([...coached,...associated,...household])];
}
function canSchedule(){
  return !isSuperUser()&&(isDirector()||isCoach());
}
function canScheduleTeam(teamId){
  return !isSuperUser()&&(isDirector()||teamCoachRoles.some(r=>r.userId===currentUser?.id&&r.teamId===teamId&&r.active!==false)||isRecordAdmin("team",teamId));
}
function canBuildTraining(){return !isSuperUser()&&(isDirector()||isCoach())}
function applyViewAccess(){
  document.querySelectorAll("[data-view-link]").forEach(el=>{
    if(el.dataset.viewLink==="admin"){el.hidden=true;return}
    el.hidden=isUnassociated()||isSuperUser();
  });
}
function renderContext(){
  document.querySelector("#avatar-initials").textContent=profileInitials(currentUser?.name);
  const contextPlayers=players.filter(p=>accessiblePlayerIds().includes(p.id));
  document.querySelector("#context-player").innerHTML=contextPlayers.length?contextPlayers.map(p=>`<option value="${p.id}" ${p.id===currentPlayer?.id?"selected":""}>${esc(p.name)}</option>`).join(""):`<option value="">No player linked</option>`;
  document.querySelector("#context-player").disabled=!contextPlayers.length;
  document.querySelectorAll(".admin-nav").forEach(el=>el.hidden=true);
  document.querySelectorAll('.bottom-nav [data-view-link="admin"]').forEach(el=>el.hidden=true);
  document.querySelector("#equipment-form").hidden=!isAdmin();
  document.querySelector("#add-event").hidden=!canSchedule();
  applyViewAccess();
  const alertCount=alerts.filter(a=>!a.read&&alertVisible(a)).length+pendingApprovalCount();
  document.querySelector("#alert-badge").textContent=alertCount||"";
  document.querySelector("#avatar-alert").hidden=!pendingApprovalCount();
  document.querySelector("#masquerade-banner").hidden=!isMasquerading();
  document.querySelector("#masquerade-banner").innerHTML=isMasquerading()?`Masquerading as ${esc(currentUser.name)}. Security settings are disabled. <button class="text-button" id="banner-exit-masquerade" type="button">Exit masquerade</button>`:"";
}
function eventVisible(e){
  if(e.playerId)return e.playerId===currentPlayer?.id;
  return memberships.some(m=>m.playerId===currentPlayer?.id&&m.teamId===e.teamId&&m.active);
}
function datePlus(date,days){const d=new Date(`${date}T12:00:00`);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function upcomingEvents(){
  const start=todayISO(),end=datePlus(start,30),out=[];
  events.filter(eventVisible).forEach(e=>{if(e.repeat==="weekly"){let date=e.date;while(date<start)date=datePlus(date,7);while(date<=end){out.push({...e,occurrenceDate:date});date=datePlus(date,7)}}else if(e.date>=start&&e.date<=end)out.push({...e,occurrenceDate:e.date})});
  return out.filter(e=>!decisions.some(d=>d.playerId===currentPlayer?.id&&d.date===e.occurrenceDate&&d.eventId===e.id&&d.action==="remove")).map(e=>decisions.some(d=>d.playerId===currentPlayer?.id&&d.date===e.occurrenceDate&&d.eventId===e.id&&d.action==="change")?{...e,title:`Recovery replacement for ${e.title}`,type:"Recovery",workload:"Low"}:e).sort((a,b)=>a.occurrenceDate.localeCompare(b.occurrenceDate));
}
function scheduleConflicts(){
  const grouped={};upcomingEvents().forEach(e=>(grouped[e.occurrenceDate]??=[]).push(e));
  return Object.entries(grouped).filter(([date,items])=>!decisions.some(d=>d.playerId===currentPlayer?.id&&d.date===date&&["change","keep","remove"].includes(d.action))&&items.length>1&&items.some(i=>i.workload==="High")).map(([date,items])=>({date,items}));
}
function renderSchedule(){
  const conflicts=scheduleConflicts();
  document.querySelector("#schedule-conflicts").innerHTML=conflicts.map(c=>`<div class="workload-alert"><div><strong>Schedule conflict  /  ${fmtDate(c.date)}</strong>${c.items.map(i=>i.title).join(" + ")}</div><div class="conflict-actions"><button data-conflict-action="change" data-conflict-event="${c.items.at(-1).id}" data-conflict-date="${c.date}">Change</button><button data-conflict-action="keep" data-conflict-event="${c.items.at(-1).id}" data-conflict-date="${c.date}">Keep</button><button data-conflict-action="remove" data-conflict-event="${c.items.at(-1).id}" data-conflict-date="${c.date}">Remove</button></div></div>`).join("");
  document.querySelector("#agenda-list").innerHTML=upcomingEvents().map(e=>`<article class="agenda-item"><time>${fmtDate(e.occurrenceDate)}</time><div><span class="tag">${e.type}</span><h3>${e.title}</h3><p>${e.teamId?teamById(e.teamId)?.name:"Individual"}  /  ${e.workload} workload${e.repeat==="weekly"?"  /  Weekly":""}</p></div>${canSchedule()?`<button data-delete-event="${e.id}">Delete</button>`:""}</article>`).join("")||`<div class="empty-state">No upcoming events.</div>`;
}
function alertVisible(a){
  if(isDirector())return true;
  if(a.userIds?.includes(currentUser?.id))return true;
  if(a.playerId&&playerById(a.playerId)?.userId===currentUser?.id)return true;
  if(a.playerId&&accessRecords.some(x=>x.userId===currentUser?.id&&x.playerId===a.playerId))return true;
  const playerTeams=memberships.filter(m=>m.playerId===a.playerId).map(m=>m.teamId);
  return teamRoles.some(r=>r.userId===currentUser?.id&&r.coach&&playerTeams.includes(r.teamId));
}
function requestVisible(r){
  if(r.status!=="pending")return false;
  if(isSuperUser())return true;
  if(r.requestedRole==="Director")return false;
  if(isDirector())return true;
  return headCoachTeamIds().length>0&&["Coach","Parent","Player"].includes(r.requestedRole);
}
const LANGUAGE_OPTIONS=["English","Spanish","French","Japanese"];
const POSITION_OPTIONS=["Pitcher","Catcher","First Base","Second Base","Third Base","Shortstop","Left Field","Center Field","Right Field","Utility","Designated Hitter"];
const HAND_OPTIONS=["Right","Left","Switch"];
const GENDER_OPTIONS=["","Female","Male","Non-binary","Prefer not to say"];
const STATUS_OPTIONS=["Fully Active","Inactive","Injured","Cleared for Activity"];
const EVALUATION_OPTIONS=["","Weekly","Biweekly","Monthly","Quarterly","Semiannual","Annual"];
const PROFILE_FIELDS=[
  ["firstName","First Name","text",true],["lastName","Last Name","text",true],["email","Email","email",true],["phone1","Phone 1"],["phone2","Phone 2"],["profilePictureData","Profile Picture","image"],["dateOfBirth","Date of Birth","date"],["primaryLanguage","Primary Language","select",false,LANGUAGE_OPTIONS],["city","City"],["state","State"],["facebook","Facebook Address"],["xAddress","X Address"],["instagram","Instagram Address"],["tikTok","Tik Tok Address"],["youtube","YouTube Channel"]
];
const PLAYER_FIELDS=[
  ["nickname","Nickname"],["gender","Gender","select",false,GENDER_OPTIONS],["school","School"],["graduationYear","Graduation Year (Class of)","number"],["primaryPosition","Primary Position","select",false,POSITION_OPTIONS],["otherPositions","Other Positions","multiselect",false,POSITION_OPTIONS],["bats","Bats","select",false,HAND_OPTIONS],["throws","Throws","select",false,HAND_OPTIONS],["height","Height"],["weight","Weight"],["playerParentNotes","Player/Parent Notes","textarea"],["gameChanger","Game Changer Link"],["hudl","Hudl Address"],["perfectGame","Perfect Game Profile"],["pbr","Prep Baseball / PBR"],["ncsa","NCSA Profile"],["sportsRecruits","SportsRecruits Profile"],["fieldLevel","FieldLevel Profile"],["baseballFactory","Baseball Factory Profile"],["trackman","Trackman Profile"],["rapsodo","Rapsodo Profile"],["hitTrax","HitTrax Profile"],["blastMotion","Blast Motion Profile"],["pocketRadar","Pocket Radar Profile"],["synergy","Synergy Profile"]
];
const ATHLETIC_FIELDS=[
  ["currentStatus","Current Status","select",STATUS_OPTIONS],["currentRestrictions","Current Restrictions","textarea"],["primaryGoals","Primary Goals","textarea"],["otherGoals","Other Goals","textarea"],["shortTermGoals","Short-term Goals","textarea"],["evaluationFrequency","Evaluation Frequency","select",EVALUATION_OPTIONS],["nextEvaluationDate","Next Evaluation Date","date"],["strengths","Strengths","textarea"],["weaknesses","Weaknesses","textarea"],["motivationStyle","Motivation Style","textarea"],["gameIq","Game IQ"],["coachNotes","Coach's Notes","textarea"]
];
const METRIC_GROUPS=[
  ["Measurements",["Height","Weight","60-yard dash","Home-to-first time","Vertical jump","Broad jump","Grip strength","Arm velocity","Position-specific metrics"]],
  ["Hitting Metrics",["Exit velocity","Average exit velocity","Max distance","Launch angle","Bat speed","Hand speed","Attack angle","Contact rate"]],
  ["Pitching Metrics",["Fastball velocity","Average velocity","Max velocity","Pitch types","Spin rate by pitch","Pitch movement","Strike percentage","Command rating"]],
  ["Catching Metrics",["Pop time","Catcher velocity","Receiving rating","Blocking rating","Transfer time"]],
  ["Fielding Metrics",["Infield velocity","Outfield velocity","Footwork rating","Arm accuracy","Range rating"]]
];
function detailForUser(userId){return profileDetails.find(d=>d.id===userId)||{id:userId}}
function profileForPlayer(playerId){return playerProfiles.find(p=>p.id===playerId)||{id:playerId,metrics:{},athletic:{}}}
function splitName(name=""){const parts=name.trim().split(/\s+/).filter(Boolean);return {firstName:parts[0]||"",lastName:parts.slice(1).join(" ")}}
function ageFromDob(dob){if(!dob)return "";const birth=new Date(`${dob}T00:00:00`);if(Number.isNaN(birth.getTime()))return "";const now=new Date();let years=now.getFullYear()-birth.getFullYear(),months=now.getMonth()-birth.getMonth();if(now.getDate()<birth.getDate())months--;if(months<0){years--;months+=12}return years>=0?`${years} years, ${months} months`:""}
function fieldValue(data,key,fallback=""){return data?.[key]??fallback}
function inputField(prefix,[key,label,type="text",required=false,options=[]],data,fallback=""){
  const value=fieldValue(data,key,fallback),req=required?"required":"",attr=`data-${prefix}-field="${key}"`;
  if(type==="image"){
    const preview=value?`<img src="${esc(value)}" alt="">`:`<span>No picture</span>`;
    return `<label class="profile-picture-field">${esc(label)}<span class="profile-picture-preview">${preview}</span><input type="file" accept="image/*" data-profile-picture-input="${esc(key)}"><small>Images are resized before saving.</small></label>`;
  }
  if(type==="textarea")return `<label>${esc(label)}<textarea ${attr} ${req}>${esc(value)}</textarea></label>`;
  if(type==="select")return `<label>${esc(label)}${required?"*":""}<select ${attr} ${req}>${options.map(o=>`<option value="${esc(o)}" ${value===o?"selected":""}>${esc(o||"Select")}</option>`).join("")}</select></label>`;
  if(type==="multiselect"){const selected=new Set(Array.isArray(value)?value:[]);return `<label>${esc(label)}<select ${attr} multiple>${options.map(o=>`<option value="${esc(o)}" ${selected.has(o)?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`}
  return `<label>${esc(label)}${required?"*":""}<input ${attr} type="${type}" value="${esc(value)}" ${req}></label>`;
}
function emergencyContactSummary(player=currentPlayer){
  const hids=idsFrom(householdMemberships.filter(m=>m.playerId===player?.id&&m.active!==false),"householdId");
  const parents=householdMemberships.filter(m=>hids.includes(m.householdId)&&m.userId&&m.role==="parent"&&m.active!==false).map(m=>userById(m.userId)).filter(Boolean);
  if(!parents.length)return `<div class="empty-state compact">No household parents linked yet.</div>`;
  return parents.map(parent=>{const d=detailForUser(parent.id);return `<div class="association-member"><div><strong>${esc(recordName(parent))}</strong><small>${esc(d.email||parent.username||"No email")}</small><small>${esc([d.phone1,d.phone2].filter(Boolean).join(" / ")||"No phone")}</small></div></div>`}).join("");
}
function metricKey(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}
function metricRows(profile){
  const metrics=profile.metrics||{};
  return METRIC_GROUPS.map(([title,names])=>`<section class="metric-group"><h3>${esc(title)}</h3>${names.map(name=>{const key=metricKey(name),m=metrics[key]||{};return `<div class="metric-row"><strong>${esc(name)}</strong><label>Initial<input data-metric-field="${key}.initialValue" value="${esc(m.initialValue||"")}"></label><label>Initial Date<input type="date" data-metric-field="${key}.initialDate" value="${esc(m.initialDate||"")}"></label><label>Last<input data-metric-field="${key}.lastValue" value="${esc(m.lastValue||"")}"></label><label>Last Date<input type="date" data-metric-field="${key}.lastDate" value="${esc(m.lastDate||"")}"></label><label>Next Goal<input data-metric-field="${key}.goalValue" value="${esc(m.goalValue||"")}"></label><label>Goal Date<input type="date" data-metric-field="${key}.goalDate" value="${esc(m.goalDate||"")}"></label></div>`}).join("")}</section>`).join("");
}
function collectFieldData(attr){
  const data={};
  document.querySelectorAll(`[data-${attr}-field]`).forEach(el=>{
    const key=el.dataset[`${attr.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())}Field`];
    data[key]=el.multiple?[...el.selectedOptions].map(o=>o.value):el.value.trim();
  });
  return data;
}
function imageSizeFromDataUrl(dataUrl=""){const base64=String(dataUrl).split(",")[1]||"";return Math.ceil((base64.length*3)/4)}
function loadImageForCompression(file){
  if("createImageBitmap" in window)return createImageBitmap(file);
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Unable to read image."))};
    img.src=url;
  });
}
async function compressProfilePicture(file){
  if(!file)return null;
  if(!file.type.startsWith("image/"))throw new Error("Please choose an image file.");
  const source=await loadImageForCompression(file),maxSide=512,width=source.width||source.naturalWidth,height=source.height||source.naturalHeight,scale=Math.min(1,maxSide/Math.max(width,height)),canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
  canvas.getContext("2d").drawImage(source,0,0,canvas.width,canvas.height);
  if(typeof source.close==="function")source.close();
  let dataUrl=canvas.toDataURL("image/webp",0.72);
  if(!dataUrl.startsWith("data:image/webp"))dataUrl=canvas.toDataURL("image/jpeg",0.76);
  return {profilePictureData:dataUrl,profilePictureMime:dataUrl.slice(5,dataUrl.indexOf(";")),profilePictureSize:imageSizeFromDataUrl(dataUrl)};
}
async function applyProfilePicture(detail){
  const file=document.querySelector("[data-profile-picture-input]")?.files?.[0];
  if(!file)return detail;
  return {...detail,...await compressProfilePicture(file)};
}
function addMonths(date,months){const next=new Date(date);next.setMonth(next.getMonth()+months);return next}
function nextEvaluationFrom(dateValue,frequency){
  if(!dateValue||!frequency)return dateValue;
  let date=new Date(`${dateValue}T00:00:00`),today=new Date(`${todayISO()}T00:00:00`);
  if(Number.isNaN(date.getTime()))return dateValue;
  const advance=()=>{if(frequency==="Weekly")date.setDate(date.getDate()+7);else if(frequency==="Biweekly")date.setDate(date.getDate()+14);else if(frequency==="Monthly")date=addMonths(date,1);else if(frequency==="Quarterly")date=addMonths(date,3);else if(frequency==="Semiannual")date=addMonths(date,6);else if(frequency==="Annual")date=addMonths(date,12);else date=today};
  while(date<today)advance();
  return date.toISOString().slice(0,10);
}
function collectMetricData(){
  const metrics={};
  document.querySelectorAll("[data-metric-field]").forEach(el=>{const [metric,field]=el.dataset.metricField.split(".");metrics[metric]={...(metrics[metric]||{}),[field]:el.value.trim()}});
  return metrics;
}
function profilePanel(eyebrow,title,body,{open=false,classes=""}={}){
  return `<details class="panel profile-collapse ${classes}" ${open?"open":""}><summary class="section-heading profile-collapse-summary"><div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2></div><span class="collapse-indicator" aria-hidden="true"></span></summary><div class="profile-collapse-body">${body}</div></details>`;
}
function profileInfoSection(){const detail=detailForUser(currentUser.id),nameParts=splitName(currentUser.name||"");const fields=PROFILE_FIELDS.map(f=>inputField("profile",f,detail,f[0]==="firstName"?nameParts.firstName:f[0]==="lastName"?nameParts.lastName:f[0]==="email"?currentUser.username:f[0]==="primaryLanguage"?"English":"")).join("");return profilePanel("Account","Personal Information",`<form id="profile-info-form" class="form-stack"><div class="form-grid">${fields}<label>Age<span class="readonly-field">${esc(ageFromDob(detail.dateOfBirth))||"Not available"}</span></label><label>New password<input id="profile-edit-password" type="password" minlength="8" autocomplete="new-password" placeholder="Leave blank to keep current password"></label></div><button class="primary-button">Save personal information</button></form>`,{open:true})}
function playerProfileSections(){if(!currentPlayer||!canEditRecord("player",currentPlayer))return "";const profile=profileForPlayer(currentPlayer.id),athletic=profile.athletic||{};const playerFields=PLAYER_FIELDS.map(f=>inputField("player-profile",f,profile)).join("");const athleticFields=ATHLETIC_FIELDS.map(([key,label,type="text",options=[]])=>inputField("athletic",[key,label,type,false,options],athletic)).join("");return profilePanel("Player","Player Information",`<form id="player-profile-form" class="form-stack"><div class="form-grid">${playerFields}</div><section class="association-detail-section"><h3>Emergency Contacts</h3>${emergencyContactSummary(currentPlayer)}</section><button class="primary-button">Save player information</button></form>`)+profilePanel("Athletic","Athletic Information",`<form id="athletic-profile-form" class="form-stack"><div class="form-grid">${athleticFields}</div><button class="primary-button">Save athletic information</button></form>`)+profilePanel("Metrics","Performance Metrics",`<form id="performance-metrics-form" class="form-stack">${metricRows(profile)}<button class="primary-button">Save performance metrics</button></form>`)}
function superUserSecuritySection(){return profilePanel("Security","Super User Password",`<form id="super-password-form" class="form-stack"><label>New password<input id="super-password" type="password" minlength="8" autocomplete="new-password" required></label><label>Confirm password<input id="super-password-confirm" type="password" minlength="8" autocomplete="new-password" required></label><button class="primary-button">Reset password</button></form>`)}
function appSettingsSection(){const enabled=("Notification"in window)&&Notification.permission==="granted";return profilePanel("Device features","App Settings",`<div class="settings-row"><div><strong>Device notifications</strong><small>Best-effort alerts on this device.</small></div><button class="toggle-button" id="enable-notifications" type="button" aria-pressed="${enabled}"><span></span>${enabled?"Enabled":"Enable"}</button></div><button class="secondary-button wide" id="install-app" type="button">${installGuidance()}</button><button class="text-button wide" id="sign-out" type="button">Sign out</button>`,{classes:"app-settings-panel"})}
function recordActions(record,type){const admin=isRecordAdmin(type,record.id),editable=canEditRecord(type,record),encoded=`data-record-type="${type}" data-record-id="${esc(record.id)}"`;if(admin)return `<div class="row-actions"><button class="icon-action" title="Edit" data-edit-record ${encoded}>Edit</button><button class="icon-action" title="Invite" data-invite-record ${encoded}>Invite</button><button class="icon-action danger" title="Delete" data-delete-record ${encoded}>Delete</button></div>`;if(editable)return `<div class="row-actions"><button class="icon-action" title="Edit" data-edit-record ${encoded}>Edit</button><button class="icon-action" title="View" data-view-record ${encoded}>View</button></div>`;return `<div class="row-actions"><button class="icon-action" title="View" data-view-record ${encoded}>View</button></div>`}
function recordDetailText(record,type){const actionType=record.__recordType||type;return actionType==="coach"||actionType==="director"||actionType==="parent"||actionType==="unassociated"?rolesFor(record).join(", ")||record.status||"Individual":record.season||record.status||record.recordType||""}
const DATABASE_LOOKUP_TYPES=[
  {type:"all",label:"All entities"},
  {type:"organization",label:"Organizations"},
  {type:"team",label:"Teams"},
  {type:"household",label:"Households"},
  {type:"user",label:"Users"},
  {type:"director",label:"Directors"},
  {type:"coach",label:"Coaches"},
  {type:"parent",label:"Parents"},
  {type:"player",label:"Players"},
  {type:"superUser",label:"Super Users"},
  {type:"unassociated",label:"Unassociated"}
];
function databaseLookupItems(){
  const userItems=users.map(u=>({type:"user",name:recordName(u),email:u.username||"",id:u.id,details:rolesFor(u).join(", ")||u.status||"User",record:u}));
  const roleItems=users.flatMap(u=>{
    const roles=rolesFor(u),items=[];
    if(roles.includes("Director"))items.push({type:"director",name:recordName(u),email:u.username||"",id:u.id,details:"Director",record:u});
    if(roles.includes("Coach"))items.push({type:"coach",name:recordName(u),email:u.username||"",id:u.id,details:"Coach",record:u});
    if(roles.includes("Parent"))items.push({type:"parent",name:recordName(u),email:u.username||"",id:u.id,details:"Parent",record:u});
    if(roles.includes("Super User"))items.push({type:"superUser",name:recordName(u),email:u.username||"",id:u.id,details:"Super User",record:u});
    if(!roles.length||u.status==="pending_association"||u.recordType==="unassociated")items.push({type:"unassociated",name:recordName(u),email:u.username||"",id:u.id,details:u.status||"Unassociated",record:u});
    return items;
  });
  const playerItems=players.map(p=>{const u=userById(p.userId);return {type:"player",name:recordName(p),email:u?.username||"",id:p.id,details:u?`Login: ${recordName(u)}`:"Player",record:p}});
  const orgItems=organizations.map(o=>({type:"organization",name:recordName(o),email:"",id:o.id,details:"Organization",record:o}));
  const teamItems=teams.map(t=>({type:"team",name:recordName(t),email:"",id:t.id,details:organizationsById.get(t.organizationId)?.name||"Team",record:t}));
  const householdItems=households.map(h=>({type:"household",name:recordName(h),email:userById(h.ownerUserId)?.username||"",id:h.id,details:"Household",record:h}));
  return [...orgItems,...teamItems,...householdItems,...userItems,...roleItems,...playerItems];
}
async function copyLookupId(text){
  try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
    else prompt("Copy this ID:",text);
    showToast("ID copied");
  }catch(err){
    prompt("Copy this ID:",text);
  }
}
function renderDatabaseLookup(){
  const type=document.querySelector("#database-lookup-type")?.value||"all",q=(document.querySelector("#database-lookup-search")?.value||"").trim().toLowerCase();
  const typeSelect=document.querySelector("#database-lookup-type");
  if(typeSelect&&!typeSelect.options.length)typeSelect.innerHTML=DATABASE_LOOKUP_TYPES.map(t=>`<option value="${t.type}">${t.label}</option>`).join("");
  const items=databaseLookupItems().filter(item=>(type==="all"||item.type===type)&&(!q||[item.name,item.email,item.id,item.details,item.type].join(" ").toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"})).slice(0,80);
  document.querySelector("#database-lookup-results").innerHTML=items.length?items.map(item=>`<button class="database-lookup-row" type="button" data-copy-text="${esc(item.id)}" title="Copy ID"><strong>${esc(item.name)}</strong><small>${esc(item.type)}${item.details?` / ${esc(item.details)}`:""}</small><small>${esc(item.email||"No email")}</small><code>${esc(item.id)}</code></button>`).join(""):`<div class="empty-state compact">No matching entities.</div>`;
}
function adminTableState(type){return adminTableControls[type]||{query:"",filter:"all",sort:"name",dir:"asc"}}
function filteredRecordItems(type,items){
  const state=adminTableState(type),q=state.query.trim().toLowerCase();
  const filtered=items.filter(r=>{
    const details=recordDetailText(r,type),haystack=[recordName(r),r.id,details,r.username,r.status,r.recordType].join(" ").toLowerCase();
    return (!q||haystack.includes(q))&&(state.filter==="all"||details===state.filter);
  });
  const value=r=>state.sort==="id"?r.id:state.sort==="details"?recordDetailText(r,type):recordName(r);
  return filtered.sort((a,b)=>String(value(a)||"").localeCompare(String(value(b)||""),undefined,{numeric:true,sensitivity:"base"})*(state.dir==="desc"?-1:1));
}
function recordTableControls(type,items){
  const state=adminTableState(type),details=[...new Set(items.map(r=>recordDetailText(r,type)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  return `<div class="table-controls" data-table-controls="${esc(type)}"><input type="search" data-admin-table-search="${esc(type)}" placeholder="Search ${esc(recordPlural(type).toLowerCase())}" value="${esc(state.query)}"><select data-admin-table-filter="${esc(type)}"><option value="all">All details</option>${details.map(d=>`<option value="${esc(d)}" ${state.filter===d?"selected":""}>${esc(d)}</option>`).join("")}</select></div>`;
}
function sortButton(type,key,label){
  const state=adminTableState(type),active=state.sort===key;
  return `<button class="table-sort ${active?"active":""}" type="button" data-admin-sort="${esc(type)}" data-sort-key="${key}">${label}${active?` ${state.dir==="asc"?"A-Z":"Z-A"}`:""}</button>`;
}
function recordTable(type,items,adminMode=false){
  const filtered=filteredRecordItems(type,items);
  const rows=filtered.map(r=>{const actionType=r.__recordType||type,details=recordDetailText(r,type);return `<tr><td><strong>${esc(recordName(r))}</strong></td><td><code>${esc(r.id)}</code></td><td>${esc(details)}</td><td>${adminMode?adminRecordActions(r,actionType):recordActions(r,actionType)}</td></tr>`}).join("");
  return `${recordTableControls(type,items)}<div class="table-wrap"><table class="profile-table"><thead><tr><th>${sortButton(type,"name","Name")}</th><th>${sortButton(type,"id","ID")}</th><th>${sortButton(type,"details","Details")}</th><th></th></tr></thead><tbody>${rows||`<tr><td colspan="4"><div class="empty-state compact">No matching records.</div></td></tr>`}</tbody></table></div>`;
}
function adminRecordActions(record,type){const canMasq=["coach","player","unassociated"].includes(type)||["Director","Parent","Player","Coach"].some(role=>rolesFor(record).includes(role));const canDelete=!(type==="superUser"&&record.id===actualUser?.id);return `<div class="row-actions"><button class="icon-action" title="Edit" data-edit-record data-record-type="${type}" data-record-id="${esc(record.id)}">Edit</button>${type==="unassociated"?`<button class="icon-action" title="Make Super User" data-promote-super="${esc(record.id)}">Make Super</button>`:""}${canMasq&&!isSuperUser(record)?`<button class="icon-action" title="Masquerade" data-masquerade-user="${esc(record.userId||record.id)}">Masq</button>`:""}${canDelete?`<button class="icon-action danger" title="Delete" data-delete-record data-record-type="${type}" data-record-id="${esc(record.id)}">Delete</button>`:""}</div>`}
function profileAssociationSection(meta){const items=visibleRecords(meta.type);if(!items.length)return "";return `<article class="panel"><div class="section-heading"><div><p class="eyebrow">Associated records</p><h2>${recordPlural(meta.type)}</h2></div></div>${recordTable(meta.type,items)}</article>`}
function pendingRequestSection(always=false){const reqs=pendingRequestsForAdmin();if(!reqs.length&&!always)return "";return profilePanel("Approvals","Pending Requests",reqs.length?reqs.map(r=>{const d=requestDetail(r);return `<div class="manage-row"><div><strong>${esc(d.requesterName)}</strong><small>${esc(d.requesterEmail)}</small><small>Wants ${esc(requestRoleLabel(d.requestedRole))} access to ${esc(d.recordType)}: ${esc(d.recordName)}</small><small>ID: ${esc(d.recordId)}</small></div><div><button data-approve-request="${r.id}">Approve</button><button data-deny-request="${r.id}">Deny</button></div></div>`}).join(""):`<div class="empty-state compact">No pending requests.</div>`)}
function refreshButton(){return `<button class="secondary-button refresh-button" type="button" id="refresh-profile"><span class="refresh-icon">R</span> Refresh</button>`}
const ASSOCIATION_TABS=[
  {key:"household",label:"Household",type:"household"},
  {key:"organization",label:"Organizations",type:"organization"},
  {key:"team",label:"Teams",type:"team"},
  {key:"individual",label:"Players/Individuals",type:"player"}
];
function associationItems(tab){
  if(tab.key==="household")return visibleRecords("household");
  if(tab.key==="organization")return visibleRecords("organization");
  if(tab.key==="team")return visibleRecords("team");
  return individualDirectoryUsers();
}
function roleMatchesFilter(user,filter){
  if(filter==="all")return true;
  const roles=rolesFor(user),hasPlayer=players.some(p=>p.userId===user.id&&p.active!==false);
  if(filter==="director")return roles.includes("Director")||organizationRoles.some(r=>r.userId===user.id&&r.active!==false);
  if(filter==="coach")return roles.includes("Coach")||teamCoachRoles.some(r=>r.userId===user.id&&r.active!==false);
  if(filter==="parent")return roles.includes("Parent")||householdMemberships.some(m=>m.userId===user.id&&m.role==="parent"&&m.active!==false);
  if(filter==="player")return roles.includes("Player")||hasPlayer;
  if(filter==="unassociated")return isIndividualUser(user)&&!hasPlayer;
  return true;
}
function directoryUserTeamIds(userId){
  const playerIds=players.filter(p=>p.userId===userId&&p.active!==false).map(p=>p.id);
  const parentPlayerIds=householdPlayerIds(userId);
  const coached=coachTeamIds(userId);
  const roster=teamIdsForPlayers([...playerIds,...parentPlayerIds]);
  const direct=userRecordAssociations(userId,"team").map(a=>a.recordId);
  const orgTeams=orgTeamIds(organizationIdsForUser(userId));
  return [...new Set([...coached,...roster,...direct,...orgTeams])];
}
function associatedUserIdsForDirectory(userId=currentUser?.id){
  if(!userId)return[];
  if(isSuperUser())return users.map(u=>u.id);
  const ids=new Set();
  const add=id=>{if(id&&id!==userId)ids.add(id)};
  const orgIds=organizationIdsForUser(userId),orgScopeTeamIds=orgTeamIds(orgIds),teamIds=[...new Set([...visibleTeamIds(userId),...orgScopeTeamIds])],hhIds=householdIdsForUser(userId),playerIds=visiblePlayerIds(userId);
  visibleCoachUserIds(userId).forEach(add);visibleParentUserIds(userId).forEach(add);
  playerIds.forEach(pid=>add(playerById(pid)?.userId));
  teamCoachRoles.filter(r=>teamIds.includes(r.teamId)&&r.active!==false).forEach(r=>add(r.userId));
  playerTeamMemberships.filter(m=>teamIds.includes(m.teamId)&&m.active!==false).forEach(m=>add(playerById(m.playerId)?.userId));
  playerParentUserIds(teamPlayerIds(teamIds)).forEach(add);
  householdMemberships.filter(m=>hhIds.includes(m.householdId)&&m.active!==false).forEach(m=>{add(m.userId);add(playerById(m.playerId)?.userId)});
  organizationRoles.filter(r=>orgIds.includes(r.organizationId)&&r.active!==false).forEach(r=>add(r.userId));
  recordAssociations.filter(a=>a.active!==false&&(teamIds.includes(a.recordId)||orgIds.includes(a.recordId)||hhIds.includes(a.recordId)||playerIds.includes(a.recordId))).forEach(a=>add(a.userId));
  recordAssociations.filter(a=>a.active!==false&&a.recordType==="organization"&&orgIds.includes(a.recordId)).forEach(a=>add(a.userId));
  recordAssociations.filter(a=>a.active!==false&&a.recordType==="team"&&teamIds.includes(a.recordId)).forEach(a=>add(a.userId));
  return [...ids];
}
function individualDirectoryUsers(){
  const q=individualFilters.query.trim().toLowerCase(),teamId=individualFilters.team;
  const associatedIds=new Set(associatedUserIdsForDirectory());
  return users.filter(u=>associatedIds.has(u.id))
    .filter(u=>roleMatchesFilter(u,individualFilters.role))
    .filter(u=>teamId==="all"||directoryUserTeamIds(u.id).includes(teamId))
    .filter(u=>!q||[u.name,u.username,rolesFor(u).join(" ")].join(" ").toLowerCase().includes(q))
    .sort((a,b)=>recordName(a).localeCompare(recordName(b)));
}
function individualControls(){
  const teamOptions=visibleRecords("team").map(t=>`<option value="${esc(t.id)}" ${individualFilters.team===t.id?"selected":""}>${esc(recordName(t))}</option>`).join("");
  return `<div class="directory-filters"><input id="individual-search" type="search" placeholder="Search people" value="${esc(individualFilters.query)}"><select id="individual-role-filter"><option value="all">All types</option><option value="director" ${individualFilters.role==="director"?"selected":""}>Directors</option><option value="coach" ${individualFilters.role==="coach"?"selected":""}>Coaches</option><option value="parent" ${individualFilters.role==="parent"?"selected":""}>Parents</option><option value="player" ${individualFilters.role==="player"?"selected":""}>Players</option><option value="unassociated" ${individualFilters.role==="unassociated"?"selected":""}>Unassociated</option></select><select id="individual-team-filter"><option value="all">All associated teams</option>${teamOptions}</select></div>`;
}
function individualRow(user){
  const detail=rolesFor(user).join(", ")||"Individual";
  return associationMemberRow("individual","directory","individual",user,detail,false);
}
function pendingLinkRequestsForType(type){return accessRequests.filter(r=>r.userId===currentUser?.id&&r.recordType===type&&r.status==="pending")}
function pendingAssociationCards(type){
  return pendingLinkRequestsForType(type).map(req=>{
    const detail=accessRequestDetails.find(d=>d.id===req.id),record=recordsForType(type).find(r=>r.id===req.recordId),name=detail?.record_name||recordName(record)||`${recordMeta(type)?.label||type} request`;
    return `<div class="association-row pending"><div><strong>${esc(name)}</strong><small>Pending link request</small></div><div class="row-actions"><button class="icon-action danger" type="button" data-cancel-link-request="${esc(req.id)}">Cancel</button></div></div>`;
  }).join("");
}
function parentApproverIdsForUser(userId){
  const playerIds=players.filter(p=>p.userId===userId&&p.active!==false).map(p=>p.id);
  return playerParentUserIds(playerIds).filter(id=>id!==userId);
}
async function createParentApprovalRequests(targetUserId,type,recordId,role,requestedBy=currentUser?.id){
  const parentIds=parentApproverIdsForUser(targetUserId);
  if(!parentIds.length)return false;
  for(const parentId of parentIds){
    const existing=accessRequests.find(r=>r.userId===parentId&&r.requestedUserId===targetUserId&&r.recordType===type&&r.recordId===recordId&&r.status==="pending");
    if(!existing)await ClubhouseDB.put("accessRequests",{id:ClubhouseDB.id("request"),userId:parentId,requestedUserId:targetUserId,requestedRole:role,requestedBy,reason:"parent_approval",recordType:type,recordId,status:"pending",created:new Date().toISOString()});
  }
  return true;
}
function scopedRoleLabel(type,record){
  if(type==="household"){
    const m=householdMemberships.find(x=>x.householdId===record.id&&x.userId===currentUser?.id&&x.active!==false);
    return m?.role==="parent"?"Parent manager":m?"Household member":"Linked household";
  }
  if(type==="organization"){
    const r=organizationRoles.find(x=>x.organizationId===record.id&&x.userId===currentUser?.id&&x.active!==false);
    return r?.role==="director"?"Director":"Organization access";
  }
  if(type==="team"){
    const r=teamCoachRoles.find(x=>x.teamId===record.id&&x.userId===currentUser?.id&&x.active!==false);
    if(r)return `${r.coachType==="head"?"Head coach":"Assistant coach"} / ${(r.specializations||["All"]).join(", ")}`;
    return "Team access";
  }
  return record.userId===currentUser?.id?"Player account":"Player access";
}
function associationActions(type,record){
  const encoded=`data-association-type="${type}" data-association-id="${esc(record.id)}"`;
  const invite=isRecordAdmin(type,record.id)||canEditRecord(type,record);
  return `<div class="row-actions">${invite?`<button class="icon-action" type="button" data-invite-record data-record-type="${type}" data-record-id="${esc(record.id)}">Invite</button>`:""}</div>`;
}
function associationList(tab){
  const items=associationItems(tab);
  const pending=pendingAssociationCards(tab.type);
  if(tab.key==="individual")return `${individualControls()}<div class="association-list">${items.length?items.map(individualRow).join(""):`<div class="empty-state">No people match these filters.</div>`}${pending}</div>`;
  if(!items.length&&!pending)return `<div class="empty-state">No ${tab.label.toLowerCase()} associations yet.</div>`;
  return `<div class="association-list">${items.map(item=>`<div class="association-row clickable" data-open-association data-association-type="${tab.type}" data-association-id="${esc(item.id)}"><div><strong>${esc(recordName(item))}</strong><small>${esc(scopedRoleLabel(tab.type,item))}</small><small>ID: ${esc(item.id)}</small></div>${associationActions(tab.type,item)}</div>`).join("")}${pending}</div>`;
}
function associationsSection(){
  const active=ASSOCIATION_TABS.some(t=>t.key===associationActiveTab)?associationActiveTab:"household";
  return profilePanel("Scoped access","Associations",`<div class="association-tabs">${ASSOCIATION_TABS.map(tab=>`<button class="association-tab ${tab.key===active?"active":""}" type="button" data-association-tab="${tab.key}">${tab.label}</button>`).join("")}</div>${ASSOCIATION_TABS.map(tab=>`<div class="association-pane ${tab.key===active?"active":""}" data-association-pane="${tab.key}">${associationList(tab)}</div>`).join("")}`,{classes:"associations-panel"});
}
function renderSuperAdmin(){document.querySelector("#profile-actions").innerHTML=`${refreshButton()}<button class="primary-button" type="button" id="add-new-button">Add New</button>`;const sections=ADMIN_RECORD_TYPES.map(meta=>profilePanel("Global records",recordPlural(meta.type),recordTable(meta.type,adminRecordsForType(meta.type),true))).join("");document.querySelector("#profile-stack").innerHTML=`${profileInfoSection()}${playerProfileSections()}${profilePanel("Super User","Admin",`<p class="panel-copy">Super Users manage global records and use masquerade for role testing. Training-plan controls remain tied to the masqueraded account.</p>`)}${superUserSecuritySection()}${pendingRequestSection(true)}${associationsSection()}${sections}${appSettingsSection()}`}
function renderAdmin(){
  if(!currentUser)return;
  document.querySelector("#profile-actions").innerHTML=isSuperUser()?"":`${refreshButton()}<button class="primary-button" type="button" id="add-new-button">Add New</button><button class="secondary-button" type="button" id="link-record-button">Link</button>`;
  if(isSuperUser()){renderSuperAdmin();return}
  document.querySelector("#profile-stack").innerHTML=`${profileInfoSection()}${playerProfileSections()}${pendingRequestSection()}${associationsSection()}${appSettingsSection()}`;
}
function scopedInviteRoles(type){
  if(type==="household")return ["Parent","Player"];
  if(type==="organization")return ["Director","Coach","Player","Parent"];
  if(type==="team")return ["Coach","Player","Parent"];
  return [];
}
function linkRequestRoles(type){
  const roles=scopedInviteRoles(type);
  if(type==="player")return ["Player"];
  return roles.length?roles:["member"];
}
function requestRoleLabel(role){return role==="member"?"Member":role}
function associationModalActions(type,record){
  const roles=scopedInviteRoles(type),canInvite=isRecordAdmin(type,record.id)||canEditRecord(type,record);
  return `<div class="association-modal-actions">${canInvite?roles.map(role=>`<button class="secondary-button" type="button" data-scoped-invite data-invite-role="${role}" data-record-type="${type}" data-record-id="${esc(record.id)}">Invite ${role}</button>`).join(""):""}<button class="text-button danger" type="button" data-leave-association data-record-type="${type}" data-record-id="${esc(record.id)}">Leave</button></div>`;
}
function canManageScopeMembers(scopeType,scopeId){
  if(isSuperUser())return true;
  if(scopeType==="household")return householdMemberships.some(m=>m.householdId===scopeId&&m.userId===currentUser?.id&&m.role==="parent"&&m.active!==false);
  if(scopeType==="team")return organizationRoles.some(r=>r.userId===currentUser?.id&&r.active!==false&&teamById(scopeId)?.organizationId===r.organizationId)||teamCoachRoles.some(r=>r.teamId===scopeId&&r.userId===currentUser?.id&&r.active!==false&&r.coachType==="head");
  if(scopeType==="organization")return organizationRoles.some(r=>r.organizationId===scopeId&&r.userId===currentUser?.id&&r.active!==false);
  if(scopeType==="player")return canEditRecord("player",playerById(scopeId));
  return false;
}
function associationMemberRow(scopeType,scopeId,entityType,record,detail="",removable=true){
  const encoded=`data-scope-type="${scopeType}" data-scope-id="${esc(scopeId)}" data-entity-type="${entityType}" data-entity-id="${esc(record.id)}"`;
  const editable=canEditRecord(entityType,record)||canManageScopeMembers(scopeType,scopeId),canRemove=removable&&canManageScopeMembers(scopeType,scopeId);
  return `<div class="association-member"><div><strong>${esc(recordName(record))}</strong>${detail?`<small>${esc(detail)}</small>`:""}</div><div class="row-actions"><button class="icon-action" type="button" data-view-entity ${encoded}>View</button>${editable?`<button class="icon-action" type="button" data-edit-entity ${encoded}>Edit</button>`:""}${canRemove?`<button class="icon-action danger" type="button" data-remove-entity-association ${encoded}>Remove</button>`:""}</div></div>`;
}
function openAssociationDetail(type,id){
  const record=recordsForType(type).find(r=>r.id===id);if(!record)return;
  document.querySelector("#association-eyebrow").textContent=recordMeta(type)?.label||"Association";
  document.querySelector("#association-title").textContent=recordName(record);
  document.querySelector("#association-detail").innerHTML=associationModalActions(type,record)+associationDetail(type,record);
  document.querySelector("#association-dialog").showModal();
}
function associationSectionBlock(title,items,empty){
  return `<section class="association-detail-section"><h3>${title}</h3>${items.length?items.join(""):`<div class="empty-state compact">${empty}</div>`}</section>`;
}
function associationDetail(type,record){
  if(type==="household"){
    const members=householdMemberships.filter(m=>m.householdId===record.id&&m.active!==false);
    const parentRows=members.filter(m=>m.userId).map(m=>associationMemberRow(type,record.id,"parent",userById(m.userId)||{id:m.userId,name:"Unknown parent"},m.role||"parent"));
    const playerRows=members.filter(m=>m.playerId).map(m=>associationMemberRow(type,record.id,"player",playerById(m.playerId)||{id:m.playerId,name:"Unknown player"},m.role||"player"));
    return `${associationSectionBlock("Parents",parentRows,"No parents linked.")}${associationSectionBlock("Players/Individuals",playerRows,"No players or individuals linked.")}`;
  }
  if(type==="organization"){
    const orgTeams=teams.filter(t=>t.organizationId===record.id&&t.active!==false);
    const directDirectorIds=recordAssociations.filter(a=>a.recordType==="organization"&&a.recordId===record.id&&["Director","admin"].includes(a.role)&&a.active!==false).map(a=>a.userId);
    const directorRows=[...new Set([...organizationRoles.filter(r=>r.organizationId===record.id&&r.active!==false).map(r=>r.userId),...directDirectorIds])].map(uid=>associationMemberRow(type,record.id,"individual",userById(uid)||{id:uid,name:"Unknown director"},"director"));
    const directCoachIds=recordAssociations.filter(a=>a.recordType==="organization"&&a.recordId===record.id&&a.role==="Coach"&&a.active!==false).map(a=>a.userId);
    const coachSeen=new Set();
    const coachRows=[...teamCoachRoles.filter(r=>orgTeams.some(t=>t.id===r.teamId)&&r.active!==false).map(r=>{coachSeen.add(r.userId);return associationMemberRow(type,record.id,"individual",userById(r.userId)||{id:r.userId,name:"Unknown coach"},`${teamById(r.teamId)?.name||"Team"} / ${r.coachType||"coach"} / ${(r.specializations||["All"]).join(", ")}`)}),...directCoachIds.filter(uid=>!coachSeen.has(uid)).map(uid=>associationMemberRow(type,record.id,"individual",userById(uid)||{id:uid,name:"Unknown coach"},"organization coach"))];
    const teamRows=orgTeams.map(t=>associationMemberRow(type,record.id,"team",t,t.season||""));
    return `${associationSectionBlock("Directors",directorRows,"No directors linked.")}${associationSectionBlock("Coaches",coachRows,"No coaches linked.")}${associationSectionBlock("Teams",teamRows,"No teams linked.")}`;
  }
  if(type==="team"){
    const directCoachIds=recordAssociations.filter(a=>a.recordType==="team"&&a.recordId===record.id&&a.role==="Coach"&&a.active!==false).map(a=>a.userId);
    const coachSeen=new Set();
    const coachRows=[...teamCoachRoles.filter(r=>r.teamId===record.id&&r.active!==false).map(r=>{coachSeen.add(r.userId);return associationMemberRow(type,record.id,"individual",userById(r.userId)||{id:r.userId,name:"Unknown coach"},`${r.coachType||"coach"} / ${(r.specializations||["All"]).join(", ")}`)}),...directCoachIds.filter(uid=>!coachSeen.has(uid)).map(uid=>associationMemberRow(type,record.id,"individual",userById(uid)||{id:uid,name:"Unknown coach"},"coach"))];
    const directPlayerIds=recordAssociations.filter(a=>a.recordType==="team"&&a.recordId===record.id&&a.role==="Player"&&a.active!==false).map(a=>players.find(p=>p.userId===a.userId)?.id).filter(Boolean);
    const teamPlayerIds=[...new Set([...playerTeamMemberships.filter(m=>m.teamId===record.id&&m.active!==false).map(m=>m.playerId),...directPlayerIds])];
    const playerRows=teamPlayerIds.map(pid=>associationMemberRow(type,record.id,"player",playerById(pid)||{id:pid,name:"Unknown player"},"player"));
    const directParentIds=recordAssociations.filter(a=>a.recordType==="team"&&a.recordId===record.id&&a.role==="Parent"&&a.active!==false).map(a=>a.userId);
    const parentRows=[...new Set([...playerParentUserIds(teamPlayerIds),...directParentIds])].map(uid=>associationMemberRow(type,record.id,"individual",userById(uid)||{id:uid,name:"Unknown parent"},"parent"));
    return `${associationSectionBlock("Coaches",coachRows,"No coaches linked.")}${associationSectionBlock("Players/Individuals",playerRows,"No players or individuals linked.")}${associationSectionBlock("Parents",parentRows,"No parents linked.")}`;
  }
  const player=record,playerTeams=teams.filter(t=>playerTeamMemberships.some(m=>m.playerId===player.id&&m.teamId===t.id&&m.active!==false)),playerHouseholds=households.filter(h=>householdMemberships.some(m=>m.playerId===player.id&&m.householdId===h.id&&m.active!==false));
  const coachRows=teamCoachRoles.filter(r=>playerTeams.some(t=>t.id===r.teamId)&&r.active!==false).map(r=>associationMemberRow(type,record.id,"coach",userById(r.userId)||{id:r.userId,name:"Unknown coach"},`${teamById(r.teamId)?.name||"Team"} / ${r.coachType||"coach"}`));
  return `${associationSectionBlock("Teams",playerTeams.map(t=>associationMemberRow(type,record.id,"team",t,t.season||"")),"No teams linked.")}${associationSectionBlock("Households",playerHouseholds.map(h=>associationMemberRow(type,record.id,"household",h,"household")),"No households linked.")}${associationSectionBlock("Coaches",coachRows,"No coaches linked.")}`;
}
function entityRecord(type,id){
  if(["individual","coach","parent","director","superUser","unassociated"].includes(type))return userById(id);
  if(type==="player")return playerById(id);
  if(type==="team")return teamById(id);
  if(type==="organization")return organizationById(id);
  if(type==="household")return householdById(id);
  return recordsForType(type).find(r=>r.id===id);
}
function userAssociationDetail(user){
  const userPlayerIds=players.filter(p=>p.userId===user.id&&p.active!==false).map(p=>p.id);
  const detailPlayerIds=[...new Set([...userPlayerIds,...householdPlayerIds(user.id)])];
  const userPlayers=detailPlayerIds.map(playerById).filter(Boolean);
  const hhIds=householdIdsForUser(user.id),teamIds=visibleTeamIds(user.id),orgIds=organizationIdsForUser(user.id);
  const roleBlock=`<section class="association-detail-section"><h3>Basic Information</h3><div class="entity-facts"><div><strong>Email</strong><span>${esc(user.username||"No email")}</span></div><div><strong>Roles</strong><span>${esc(rolesFor(user).join(", ")||"None")}</span></div><div><strong>Status</strong><span>${esc(user.status||"active")}</span></div></div></section>`;
  return roleBlock+
    associationSectionBlock("Households",households.filter(h=>hhIds.includes(h.id)).map(h=>associationMemberRow("user",user.id,"household",h,"household",false)),"No households linked.")+
    associationSectionBlock("Organizations",organizations.filter(o=>orgIds.includes(o.id)).map(o=>associationMemberRow("user",user.id,"organization",o,"organization",false)),"No organizations linked.")+
    associationSectionBlock("Teams",teams.filter(t=>teamIds.includes(t.id)).map(t=>associationMemberRow("user",user.id,"team",t,t.season||"",false)),"No teams linked.")+
    associationSectionBlock("Players/Individuals",userPlayers.map(p=>associationMemberRow("user",user.id,"player",p,"player account",false)),"No player or individual account linked.");
}
function playerBasicFacts(player){
  const linkedUser=users.find(u=>u.id===player.userId);
  return `<section class="association-detail-section"><h3>Basic Information</h3><div class="entity-facts"><div><strong>Email</strong><span>${esc(linkedUser?.username||"No login email linked")}</span></div><div><strong>Player ID</strong><span>${esc(player.id)}</span></div><div><strong>Status</strong><span>${esc(player.active===false?"inactive":"active")}</span></div></div></section>`;
}
function recordBasicFacts(type,record){
  const facts=[
    ["Type",recordMeta(type)?.label||type],
    ["ID",record.id],
    ["Status",record.active===false?"inactive":"active"]
  ];
  if(type==="team")facts.splice(2,0,["Season",record.season||""]);
  if(type==="team"){const org=organizations.find(o=>o.id===record.organizationId);facts.splice(3,0,["Organization",org?recordName(org):"None"])}
  if(type==="organization")facts.splice(2,0,["Teams",String(teams.filter(t=>t.organizationId===record.id&&t.active!==false).length)]);
  if(type==="household")facts.splice(2,0,["Members",String(householdMemberships.filter(m=>m.householdId===record.id&&m.active!==false).length)]);
  return `<section class="association-detail-section"><h3>Basic Information</h3><div class="entity-facts">${facts.map(([label,value])=>`<div><strong>${esc(label)}</strong><span>${esc(value||"None")}</span></div>`).join("")}</div></section>`;
}
function openEntityDetail(type,id){
  const record=entityRecord(type,id);if(!record)return;
  const meta=recordMeta(type);
  document.querySelector("#association-eyebrow").textContent=meta?.label||"Entity";
  document.querySelector("#association-title").textContent=recordName(record);
  document.querySelector("#association-detail").innerHTML=["coach","parent","director","superUser","unassociated","individual"].includes(type)?userAssociationDetail(record):type==="player"?playerBasicFacts(record)+associationDetail(type,record):recordBasicFacts(type,record)+associationDetail(type,record);
  document.querySelector("#association-dialog").showModal();
}
function entityUserId(type,id){return type==="player"?playerById(id)?.userId:id}
async function updateScopedMember(scopeType,scopeId,entityType,entityId){
  if(!canManageScopeMembers(scopeType,scopeId)){alert("You do not have permission to edit members in this association.");return false}
  const userId=entityUserId(entityType,entityId);
  if(!userId){alert("This entity is not linked to a user account yet.");return false}
  if(scopeType==="team"){
    const current=teamCoachRoles.some(r=>r.userId===userId&&r.teamId===scopeId&&r.active!==false)?"Coach":playerById(entityId)||players.some(p=>p.userId===userId&&playerTeamMemberships.some(m=>m.playerId===p.id&&m.teamId===scopeId&&m.active!==false))?"Player":"Parent";
    const role=prompt("Set team role (Coach, Parent, Player):",current);if(!role)return false;
    const normalized=role.trim().toLowerCase(),next=normalized==="coach"?"Coach":normalized==="player"?"Player":normalized==="parent"?"Parent":"";
    if(!next){alert("Use Coach, Parent, or Player.");return false}
    if(next!=="Coach")for(const r of teamCoachRoles.filter(r=>r.userId===userId&&r.teamId===scopeId))await ClubhouseDB.remove("teamCoachRoles",r.id);
    if(next==="Coach"){
      await activateUserRole(userId,"Coach");
      await ensureRecordAssociation(userId,"team",scopeId,"Coach");
      const team=teamById(scopeId);if(team?.organizationId)await ensureRecordAssociation(userId,"organization",team.organizationId,"member");
      const coachRole=teamCoachRoles.find(r=>r.userId===userId&&r.teamId===scopeId),coachType=prompt("Coach type (head or assistant):",coachRole?.coachType||"assistant");
      if(coachType&&["head","assistant"].includes(coachType.trim().toLowerCase())){
        const specs=prompt("Skill focus, comma separated:",(coachRole?.specializations||["All"]).join(", "));
        await ClubhouseDB.put("teamCoachRoles",{id:coachRole?.id||ClubhouseDB.id("coachRole"),userId,teamId:scopeId,coachType:coachType.trim().toLowerCase(),permissions:coachRole?.permissions||{manageTeam:true,managePlans:true,manageParents:coachType.trim().toLowerCase()==="head",manageAssistants:coachType.trim().toLowerCase()==="head"},specializations:(specs||"All").split(",").map(s=>s.trim()).filter(Boolean),active:true});
      }
    }else await grantRecordAccess(userId,"team",scopeId,next);
    return true;
  }
  if(scopeType==="organization"){
    const role=prompt("Set organization role (Director, Coach, Parent, Player):",organizationRoles.some(r=>r.userId===userId&&r.organizationId===scopeId&&r.active!==false)?"Director":"Coach");if(!role)return false;
    const normalized=role.trim().toLowerCase(),next=normalized==="director"?"Director":normalized==="coach"?"Coach":normalized==="parent"?"Parent":normalized==="player"?"Player":"";
    if(!next){alert("Use Director, Coach, Parent, or Player.");return false}
    if(next!=="Director")for(const r of organizationRoles.filter(r=>r.userId===userId&&r.organizationId===scopeId))await ClubhouseDB.remove("organizationRoles",r.id);
    await grantRecordAccess(userId,"organization",scopeId,next);
    return true;
  }
  if(scopeType==="household"){
    const role=prompt("Set household role (Parent or Player):",householdMemberships.some(m=>m.householdId===scopeId&&m.userId===userId&&m.role==="parent"&&m.active!==false)?"Parent":"Player");if(!role)return false;
    const normalized=role.trim().toLowerCase(),next=normalized==="parent"?"Parent":normalized==="player"?"Player":"";
    if(!next){alert("Use Parent or Player.");return false}
    await grantRecordAccess(userId,"household",scopeId,next);
    return true;
  }
  return false;
}
async function editEntity(type,id,scopeType="",scopeId=""){
  if(scopeType&&scopeType!=="user"&&scopeType!=="directory"&&canManageScopeMembers(scopeType,scopeId))return await updateScopedMember(scopeType,scopeId,type,id)?"association":undefined;
  const record=entityRecord(type,id);if(!record||!canEditRecord(type,record)){alert("You do not have permission to edit this record.");return}
  const name=prompt("Update name:",recordName(record));if(!name)return;
  await updateRecordName(type,id,name.trim());
  return "record";
}
async function removeRecordAssociationsFor(userId,type,recordId){
  for(const assoc of recordAssociations.filter(a=>a.userId===userId&&a.recordType===type&&a.recordId===recordId))await ClubhouseDB.remove("recordAssociations",assoc.id);
}
async function removeEntityAssociation(scopeType,scopeId,entityType,entityId){
  const scope=entityRecord(scopeType,scopeId);
  if(!scope||!canManageScopeMembers(scopeType,scopeId)){alert("You do not have permission to remove members from this association.");return}
  if(!confirm(`Remove this ${recordMeta(entityType)?.label||entityType} from ${recordName(scope)}? This only removes the association.`))return;
  if(scopeType==="household"&&["parent","director","coach"].includes(entityType)){
    for(const m of householdMemberships.filter(m=>m.householdId===scopeId&&m.userId===entityId))await ClubhouseDB.remove("householdMemberships",m.id);
    await removeRecordAssociationsFor(entityId,"household",scopeId);
  }else if(scopeType==="household"&&entityType==="player"){
    for(const m of householdMemberships.filter(m=>m.householdId===scopeId&&m.playerId===entityId))await ClubhouseDB.remove("householdMemberships",m.id);
    const player=playerById(entityId);if(player?.userId)await removeRecordAssociationsFor(player.userId,"household",scopeId);
  }else if(scopeType==="organization"&&entityType==="director"){
    for(const r of organizationRoles.filter(r=>r.organizationId===scopeId&&r.userId===entityId))await ClubhouseDB.remove("organizationRoles",r.id);
    await removeRecordAssociationsFor(entityId,"organization",scopeId);
  }else if(scopeType==="organization"&&entityType==="coach"){
    const orgTeamIds=teams.filter(t=>t.organizationId===scopeId).map(t=>t.id);
    for(const r of teamCoachRoles.filter(r=>r.userId===entityId&&orgTeamIds.includes(r.teamId)))await ClubhouseDB.remove("teamCoachRoles",r.id);
    await removeRecordAssociationsFor(entityId,"organization",scopeId);
  }else if(scopeType==="organization"&&entityType==="team"){
    const team=teamById(entityId);if(team)await ClubhouseDB.put("teams",{...team,organizationId:""});
  }else if(scopeType==="team"&&entityType==="coach"){
    for(const r of teamCoachRoles.filter(r=>r.teamId===scopeId&&r.userId===entityId))await ClubhouseDB.remove("teamCoachRoles",r.id);
    await removeRecordAssociationsFor(entityId,"team",scopeId);
  }else if(scopeType==="team"&&entityType==="player"){
    for(const m of playerTeamMemberships.filter(m=>m.teamId===scopeId&&m.playerId===entityId))await ClubhouseDB.remove("playerTeamMemberships",m.id);
    const player=playerById(entityId);if(player?.userId)await removeRecordAssociationsFor(player.userId,"team",scopeId);
  }else if(scopeType==="team"&&entityType==="parent"){
    await removeRecordAssociationsFor(entityId,"team",scopeId);
  }else if(scopeType==="player"&&entityType==="team"){
    for(const m of playerTeamMemberships.filter(m=>m.playerId===scopeId&&m.teamId===entityId))await ClubhouseDB.remove("playerTeamMemberships",m.id);
  }else if(scopeType==="player"&&entityType==="household"){
    for(const m of householdMemberships.filter(m=>m.playerId===scopeId&&m.householdId===entityId))await ClubhouseDB.remove("householdMemberships",m.id);
  }else{
    alert("That relationship is inherited through another silo. Remove it from the team, household, or organization where it was assigned.");
    return;
  }
}
async function leaveAssociation(type,id){
  const record=entityRecord(type,id);if(!record)return;
  if(!confirm(`Leave ${recordName(record)}? This removes only your account's association.`))return;
  if(type==="household"){
    for(const m of householdMemberships.filter(m=>m.householdId===id&&m.userId===currentUser.id))await ClubhouseDB.remove("householdMemberships",m.id);
    const selfPlayers=players.filter(p=>p.userId===currentUser.id).map(p=>p.id);
    for(const m of householdMemberships.filter(m=>m.householdId===id&&selfPlayers.includes(m.playerId)))await ClubhouseDB.remove("householdMemberships",m.id);
  }else if(type==="organization"){
    for(const r of organizationRoles.filter(r=>r.organizationId===id&&r.userId===currentUser.id))await ClubhouseDB.remove("organizationRoles",r.id);
  }else if(type==="team"){
    for(const r of teamCoachRoles.filter(r=>r.teamId===id&&r.userId===currentUser.id))await ClubhouseDB.remove("teamCoachRoles",r.id);
    const selfPlayers=players.filter(p=>p.userId===currentUser.id).map(p=>p.id);
    for(const m of playerTeamMemberships.filter(m=>m.teamId===id&&selfPlayers.includes(m.playerId)))await ClubhouseDB.remove("playerTeamMemberships",m.id);
  }else if(type==="player"&&record.userId===currentUser.id){
    alert("You cannot leave your own individual player account. You can remove team or household links from those silos.");
    return;
  }
  await removeRecordAssociationsFor(currentUser.id,type,id);
}
function openScopedInvite(role,type,recordId){
  const meta=recordMeta(type);if(!meta)return;
  document.querySelector("#invite-title").textContent=`Invite ${role} to ${meta.label}`;
  document.querySelector("#invite-type").value=type;
  document.querySelector("#invite-record-id").value=recordId;
  document.querySelector("#invite-role").value=role;
  document.querySelector("#invite-email").value="";
  document.querySelector("#invite-dialog").showModal();
}
async function cancelLinkRequest(id){
  const req=accessRequests.find(r=>r.id===id);
  if(!req||req.userId!==currentUser?.id||req.status!=="pending"){alert("This request can no longer be canceled.");return}
  if(!confirm("Cancel this pending link request?"))return;
  await ClubhouseDB.remove("accessRequests",id);
}
function renderAlerts(){
  const visible=alerts.filter(alertVisible).sort((a,b)=>b.created.localeCompare(a.created)),approvals=pendingRequestsForAdmin();
  const approvalItems=approvals.map(r=>{const d=requestDetail(r);return `<article class="agenda-item unread"><time>Pending</time><div><span class="tag">Approval</span><h3>${esc(d.recordType)} access request</h3><p><strong>${esc(d.requesterName)}</strong> (${esc(d.requesterEmail)}) wants ${esc(requestRoleLabel(d.requestedRole))} access to ${esc(d.recordName)}.</p><p><small>Record ID: ${esc(d.recordId)}</small></p><div class="conflict-actions"><button data-approve-request="${r.id}">Approve</button><button data-deny-request="${r.id}">Deny</button></div></div></article>`}).join("");
  const alertItems=visible.map(a=>`<article class="agenda-item ${a.read?"":"unread"}"><time>${fmtDate(a.created.slice(0,10))}</time><div><span class="tag">${a.type}</span><h3>${a.title}</h3><p>${a.message}</p>${a.status==="pending"&&isAdmin()?`<div class="conflict-actions"><button data-pain-decision="allow" data-alert-id="${a.id}">Allow this session</button><button data-pain-decision="remove" data-alert-id="${a.id}">Remove throwing</button></div>`:""}</div></article>`).join("");
  document.querySelector("#alert-list").innerHTML=approvalItems+alertItems||`<div class="empty-state">No alerts.</div>`;
}
function renderProgress(){const mins=state.logs.reduce((s,l)=>s+Number(l.duration),0),recent=state.logs.slice(-8),bench=state.logs.flatMap(l=>l.drillResults||[]).filter(r=>r.benchmarkValue!=="");document.querySelector("#progress-stats").innerHTML=[["Sessions",state.logs.length,"completed"],["Training hours",(mins/60).toFixed(1),"time invested"],["Variants",state.variations.length,"saved and reusable"],["Benchmarks",bench.length,"results recorded"]].map(statCard).join("");document.querySelector("#effort-chart").innerHTML=recent.length?recent.map(l=>`<div class="chart-bar" style="--height:${l.rpe*10}%"><strong>${l.rpe}</strong><i style="height:${l.rpe*10}%"></i><small>${fmtDate(l.date)}</small></div>`).join(""):`<div class="empty-state">Log sessions to build your trend.</div>`;const counts=state.logs.flatMap(l=>l.drillResults||[]).reduce((a,r)=>{const c=drillFor(r.drillId)?.category||"Other";a[c]=(a[c]||0)+1;return a},{}),mx=Math.max(...Object.values(counts),1);document.querySelector("#category-progress").innerHTML=Object.entries(counts).map(([n,v])=>`<div class="category-item"><div><strong>${n}</strong><span>${v} completed</span></div><div class="category-bar"><i style="width:${v/mx*100}%"></i></div></div>`).join("")||`<div class="empty-state">No drill data yet.</div>`;document.querySelector("#takeaway-grid").innerHTML=state.logs.filter(l=>l.notes).slice(-3).reverse().map(l=>`<div class="takeaway"><small>${fmtDate(l.date)}</small><p>${l.notes}</p></div>`).join("")||`<div class="empty-state">Session notes will appear here.</div>`}

function switchView(v){document.querySelectorAll(".view").forEach(e=>e.classList.toggle("active",e.id===`${v}-view`));document.querySelectorAll(".nav-link,.bottom-nav button").forEach(e=>e.classList.toggle("active",e.dataset.viewLink===v));document.querySelector("#page-title").textContent={dashboard:"Dashboard",plan:"Training Plan",log:"Session Log",pitch:"Pitch Count",tests:"Monthly Tests",library:"Drill Library",equipment:"Equipment Shed",schedule:"Schedule",admin:isSuperUser()?"Admin":"Profile",alerts:"Alerts",progress:"Progress"}[v];document.querySelector(".sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
function startSession(id){
  let session=sessionFor(id);
  if(state.throwingRemovedDate===todayISO()&&session.drillIds.some(id=>drillFor(id)?.armLoad==="Throwing")){const replacementId=`pain-safe-${crypto.randomUUID()}`;state.variations.push({id:replacementId,blueprintId:session.blueprintId||session.id,name:`${session.name} - No Throw`,drillIds:session.drillIds.map(id=>drillFor(id)?.armLoad==="Throwing"?"field-crowhop-no-throw":id),created:todayISO(),oneTime:true});saveState();session=sessionFor(replacementId);id=replacementId}
  const issues=sessionIssues(session),blocked=issues.filter(x=>x.type==="blocked"||x.type==="approval");
  const painAlert=alerts.find(a=>a.playerId===currentPlayer?.id&&a.type==="Arm Pain"&&a.status==="pending");
  if(painAlert&&session.drillIds.some(id=>drillFor(id)?.armLoad==="Throwing")){alert("Throwing is tentative until a parent or coach reviews the arm-pain alert.");return}
  if(blocked.length){alert(blocked.map(x=>x.text).join("\n"));return}
  const equipment=issues.find(x=>x.type==="equipment");if(equipment&&!confirm(`${equipment.text}\n\nContinue and acknowledge the missing equipment?`))return;
  document.querySelector("#log-workout").value=id;renderLogDrills();switchView("log");
}
function openVariationDialog(blueprintId,variationId=""){
  const b=workoutFor(blueprintId),v=variationId?variationFor(variationId):null;
  document.querySelector("#variation-id").value=v?.id||"";document.querySelector("#variation-blueprint-id").value=b.id;document.querySelector("#variation-name").value=v?.name||`${b.name} - Variation`;
  document.querySelector("#variation-guidance").innerHTML=`Keep the session's ${b.slots.length} required slots. Core defaults are marked; balanced rotation means changing about ${Math.max(1,Math.round(b.slots.length/3))} accessory drill(s). Maximum: ${maxItems(b.phase)} items.`;
  const recent=recentDrillIds(),chosen=v?.drillIds||b.drillIds;
  document.querySelector("#variation-slots").innerHTML=b.slots.map((slot,i)=>{const options=drillCatalog.filter(d=>d.category===slot&&d.phases.includes(b.phase));return `<label class="variation-slot"><span>${i+1}. ${slot} ${b.drillIds[i]===chosen[i]?" /  Core default":""}</span><select data-variation-slot="${i}">${options.map(d=>`<option value="${d.id}" ${d.id===chosen[i]?"selected":""} ${(!isApproved(d)||(!eligibleToThrow()&&d.armLoad==="Throwing"))?"disabled":""}>${d.name}${recent.has(d.id)?"  /  recently used":""}${!hasEquipment(d)?"  /  missing equipment":""}${!isApproved(d)?"  /  approval needed":""}</option>`).join("")}</select></label>`}).join("");
  updateVariationWarnings();document.querySelector("#variation-dialog").showModal();
}
function selectedVariationSession(){const b=workoutFor(document.querySelector("#variation-blueprint-id").value);return {...b,name:document.querySelector("#variation-name").value,drillIds:[...document.querySelectorAll("[data-variation-slot]")].map(s=>s.value)}}
function updateVariationWarnings(){const box=document.querySelector("#variation-warnings"),session=selectedVariationSession(),issues=sessionIssues(session);box.innerHTML=issues.length?`<div class="builder-warnings">${issues.map(i=>`<p class="${i.type}">${i.text}</p>`).join("")}</div>`:`<div class="builder-ready">Ready to save. All selected drills are approved and equipment-ready.</div>`}
async function refreshRecords(){
  const masqueradeDataMode=isMasqueradeFrame()&&localStorage.getItem(MASQUERADE_SESSION_KEY)==="true";
  if(!migrationChecked&&!masqueradeDataMode){
    try{await ClubhouseDB.normalizeCurrentUserAssociations()}catch(err){console.warn("Association normalization skipped.",err)}
    migrationChecked=true;
  }
  const context=masqueradeDataMode?null:await ClubhouseDB.appContext?.();
  if(context){
    ({users,players,teams,events,alerts,decisions,organizations,households,organizationRoles,teamCoachRoles,householdMemberships,playerTeamMemberships,playerTags,accessRequests,recordAssociations,invitations,profileDetails,playerProfiles,accessRequestDetails}=context);
    accessRecords=context.userPlayerAccess||[];
    if(!profileDetails||!playerProfiles)[profileDetails,playerProfiles]=await Promise.all(["profileDetails","playerProfiles"].map(ClubhouseDB.all));
    normalizeLoadedRecords();
    return;
  }
  [users,players,teams,accessRecords,events,alerts,decisions,organizations,households,organizationRoles,teamCoachRoles,householdMemberships,playerTeamMemberships,playerTags,accessRequests,recordAssociations,invitations,profileDetails,playerProfiles]=await Promise.all(["users","players","teams","userPlayerAccess","events","alerts","decisions","organizations","households","organizationRoles","teamCoachRoles","householdMemberships","playerTeamMemberships","playerTags","accessRequests","recordAssociations","invitations","profileDetails","playerProfiles"].map(ClubhouseDB.all));
  accessRequestDetails=await ClubhouseDB.accessRequestAdminDetails();
  if(!masqueradeDataMode){
    const oldMemberships=await ClubhouseDB.all("teamMemberships"),oldTeamRoles=await ClubhouseDB.all("userTeamRoles");
    await migrateAssociations(oldMemberships,oldTeamRoles);
  }
  normalizeLoadedRecords();
}
async function migrateAssociations(oldMemberships=[],oldTeamRoles=[]){
  if(await ClubhouseDB.normalizeCurrentUserAssociations())return;
  const now=()=>new Date().toISOString();
  const addAssoc=async (userId,type,recordId,role="member",createdBy=userId)=>{
    if(!userId||!type||!recordId)return;
    const existing=recordAssociations.find(a=>a.userId===userId&&a.recordType===type&&a.recordId===recordId);
    const item={id:existing?.id||ClubhouseDB.id("assoc"),userId,recordType:type,recordId,role:existing?.role==="admin"?"admin":role,active:true,created:existing?.created||now(),createdBy:existing?.createdBy||createdBy};
    await ClubhouseDB.put("recordAssociations",item);
    if(!existing)recordAssociations.push(item);
  };
  const addHouseholdMember=async item=>{
    const existing=householdMemberships.find(m=>m.householdId===item.householdId&&((item.userId&&m.userId===item.userId)||(item.playerId&&m.playerId===item.playerId)));
    const next={id:existing?.id||ClubhouseDB.id("hh"),...item,role:item.role||existing?.role||"member",active:true};
    await ClubhouseDB.put("householdMemberships",next);
    if(!existing)householdMemberships.push(next);
  };
  if(!organizations.length){
    if(!isSuperUser(currentUser))return;
    const setup=await ClubhouseDB.get("meta","setup"),orgId=setup?.defaultOrganizationId||ClubhouseDB.id("org");
    await ClubhouseDB.put("organizations",{id:orgId,name:"Default Organization",settings:{directorApprovalRequiredForCoachPlans:false},equipment:[],active:true,created:new Date().toISOString()});
    if(setup)await ClubhouseDB.put("meta",{...setup,defaultOrganizationId:orgId,version:2});
    organizations=[await ClubhouseDB.get("organizations",orgId)];
  }
  const orgId=organizations[0]?.id;
  for(const team of teams.filter(t=>!t.organizationId))await ClubhouseDB.put("teams",{...team,organizationId:orgId,equipment:team.equipment||[]});
  if(!playerTeamMemberships.length&&oldMemberships.length){
    for(const m of oldMemberships)await ClubhouseDB.put("playerTeamMemberships",{id:m.id,playerId:m.playerId,teamId:m.teamId,active:m.active!==false,priority:m.priority||1});
  }
  if(!teamCoachRoles.length&&oldTeamRoles.length){
    const byTeam={};oldTeamRoles.filter(r=>r.coach||r.scheduler).forEach(r=>(byTeam[r.teamId]??=[]).push(r));
    for(const list of Object.values(byTeam)){
      for(const r of list){
        const only=list.length===1,coachType=only?"head":"assistant";
        await ClubhouseDB.put("teamCoachRoles",{id:r.id,userId:r.userId,teamId:r.teamId,coachType,permissions:{manageTeam:true,managePlans:true,manageParents:coachType==="head",manageAssistants:coachType==="head"},specializations:["All"],active:true});
      }
    }
  }
  for(const user of users){
    const roles=normalizeRoles(user);
    if(roles.includes("Director")&&!organizationRoles.some(r=>r.userId===user.id))await ClubhouseDB.put("organizationRoles",{id:ClubhouseDB.id("orgRole"),userId:user.id,organizationId:orgId,role:"director",active:true});
  }
  for(const r of organizationRoles.filter(r=>r.active!==false)){
    await addAssoc(r.userId,"organization",r.organizationId,"admin");
  }
  for(const r of teamCoachRoles.filter(r=>r.active!==false)){
    await addAssoc(r.userId,"team",r.teamId,r.coachType==="head"?"admin":"member");
    const team=teams.find(t=>t.id===r.teamId);
    if(team?.organizationId)await addAssoc(r.userId,"organization",team.organizationId,r.coachType==="head"?"admin":"member");
  }
  for(const access of accessRecords.filter(a=>a.permission==="manage")){
    const parent=users.find(u=>u.id===access.userId);if(!parent)continue;
    let household=households.find(h=>h.ownerUserId===parent.id);
    if(!household){household={id:ClubhouseDB.id("household"),name:`${parent.name}'s Household`,ownerUserId:parent.id,equipment:[],active:true};await ClubhouseDB.put("households",household);households.push(household)}
    await addHouseholdMember({householdId:household.id,userId:parent.id,role:"parent"});
    await addHouseholdMember({householdId:household.id,playerId:access.playerId,role:"player"});
  }
  for(const m of householdMemberships.filter(m=>m.active!==false&&m.userId)){
    await addAssoc(m.userId,"household",m.householdId,m.role==="parent"?"admin":"member");
  }
  for(const p of players.filter(p=>p.userId)){
    await addAssoc(p.userId,"player",p.id,"admin");
  }
  for(const m of playerTeamMemberships.filter(m=>m.active!==false)){
    const player=players.find(p=>p.id===m.playerId),team=teams.find(t=>t.id===m.teamId);
    if(player?.userId){
      await addAssoc(player.userId,"team",m.teamId,"member");
      if(team?.organizationId)await addAssoc(player.userId,"organization",team.organizationId,"member");
    }
  }
  for(const assoc of recordAssociations.filter(a=>a.recordType==="team"&&a.active!==false)){
    const team=teams.find(t=>t.id===assoc.recordId);
    if(team?.organizationId)await addAssoc(assoc.userId,"organization",team.organizationId,assoc.role==="admin"?"admin":"member",assoc.createdBy);
  }
  for(const assoc of recordAssociations.filter(a=>a.recordType==="household"&&a.active!==false)){
    const player=players.find(p=>p.userId===assoc.userId);
    if(player)await addHouseholdMember({householdId:assoc.recordId,playerId:player.id,role:"player"});
    else await addHouseholdMember({householdId:assoc.recordId,userId:assoc.userId,role:"parent"});
  }
  for(const household of households.filter(h=>h.active!==false)){
    const members=householdMemberships.filter(m=>m.householdId===household.id&&m.active!==false);
    const parentUserIds=members.filter(m=>m.userId&&m.role==="parent").map(m=>m.userId);
    const householdPlayers=members.filter(m=>m.playerId).map(m=>players.find(p=>p.id===m.playerId)).filter(Boolean);
    const playerUserIds=householdPlayers.map(p=>p.userId).filter(Boolean);
    const householdUserIds=[...new Set([...parentUserIds,...playerUserIds])];
    for(const userId of householdUserIds){
      await addAssoc(userId,"household",household.id,parentUserIds.includes(userId)?"admin":"member",household.ownerUserId||userId);
      for(const parentId of parentUserIds.filter(id=>id!==userId))await addAssoc(userId,"parent",parentId,"member",household.ownerUserId||userId);
      for(const player of householdPlayers)await addAssoc(userId,"player",player.id,player.userId===userId?"admin":"member",household.ownerUserId||userId);
    }
    for(const parentId of parentUserIds)for(const player of householdPlayers){
      if(!accessRecords.some(a=>a.userId===parentId&&a.playerId===player.id&&a.permission==="manage")){
        await ClubhouseDB.put("userPlayerAccess",{id:ClubhouseDB.id("access"),userId:parentId,playerId:player.id,permission:"manage",active:true});
      }
    }
  }
}
async function selectPlayer(id){
  currentPlayer=players.find(p=>p.id===id)||players.find(p=>accessiblePlayerIds().includes(p.id));
  if(!currentPlayer){state=structuredClone(defaultState);renderAll();return}
  const record=await ClubhouseDB.get("playerData",currentPlayer.id);state=normalizeState(record?.data||structuredClone(defaultState));
  localStorage.setItem(ACTIVE_PLAYER_KEY,currentPlayer.id);renderAll();
}
function showAuth(){document.querySelector("#auth-screen").classList.add("show")}
function hideAuth(){document.querySelector("#auth-screen").classList.remove("show")}
async function signOutUser(){await ClubhouseDB.signOut();localStorage.removeItem(ACTIVE_USER_KEY);localStorage.removeItem(EFFECTIVE_USER_KEY);localStorage.removeItem(REMEMBER_LOGIN_KEY);localStorage.removeItem(MASQUERADE_SESSION_KEY);actualUser=null;currentUser=null;showAuth();loginScreen()}
function isPasswordResetRoute(){
  const query=new URLSearchParams(location.search),hash=new URLSearchParams(location.hash.replace(/^#/,""));
  return query.get("mode")==="reset-password"||hash.get("type")==="recovery"||hash.get("error_code");
}
function passwordResetRouteMessage(){
  const hash=new URLSearchParams(location.hash.replace(/^#/,""));
  return hash.get("error_description")||"";
}
function cleanPasswordResetUrl(){if(history.replaceState)history.replaceState(null,"",`${location.origin}${location.pathname}`)}
function passwordResetRequestScreen(message="",email=""){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">Password help</p><h1>Reset Password</h1>${message?`<p class="auth-error">${esc(message)}</p>`:""}<form id="password-reset-request-form" class="form-stack"><label>Email<input id="password-reset-email" type="email" autocomplete="email" value="${esc(email)}" required></label><button class="primary-button">Send reset email</button><button class="text-button" type="button" id="back-to-login">Back to login</button></form>`;
  document.querySelector("#back-to-login").onclick=()=>loginScreen();
}
function passwordResetUpdateScreen(message=""){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">Password recovery</p><h1>Choose New Password</h1>${message?`<p class="auth-error">${esc(message)}</p>`:""}<form id="password-reset-update-form" class="form-stack"><label>New password<input id="password-reset-new" type="password" minlength="8" autocomplete="new-password" required></label><label>Confirm password<input id="password-reset-confirm" type="password" minlength="8" autocomplete="new-password" required></label><button class="primary-button">Update password</button><button class="text-button" type="button" id="back-to-login">Back to login</button></form>`;
  document.querySelector("#back-to-login").onclick=async()=>{await ClubhouseDB.signOut();cleanPasswordResetUrl();loginScreen()};
}
function setupScreen(){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">First-time setup</p><h1>Create your local clubhouse</h1><p>This device will store profiles, schedules, and training records. Existing training data will be copied into the first player.</p><form id="setup-form" class="form-stack"><label>Super User name<input id="setup-owner" required></label><label>Super User PIN<input id="setup-pin" type="password" inputmode="numeric" minlength="4" required></label><label>Initial player name<input id="setup-player" required></label><button class="primary-button">Create clubhouse</button></form>`;
  document.querySelector("#setup-form").onsubmit=async e=>{e.preventDefault();await ClubhouseDB.createSetup(document.querySelector("#setup-owner").value.trim(),document.querySelector("#setup-pin").value,document.querySelector("#setup-player").value.trim(),state);await refreshRecords();currentUser=users.find(u=>isSuperUser(u));await recordLogin(currentUser);localStorage.setItem(ACTIVE_USER_KEY,currentUser.id);await selectPlayer(players[0].id);hideAuth()};
}
function loginScreen(message=""){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">Local login</p><h1>Who's using Clubhouse?</h1>${message?`<p class="auth-error">${message}</p>`:""}<form id="login-form" class="form-stack"><label>Profile<select id="login-user">${users.filter(u=>u.active).map(u=>`<option value="${u.id}">${u.name}  /  ${u.roles.join("/")}</option>`).join("")}</select></label><label>PIN<input id="login-pin" type="password" inputmode="numeric" required></label><button class="primary-button">Enter clubhouse</button></form>`;
  document.querySelector("#login-form").onsubmit=async e=>{e.preventDefault();const user=users.find(u=>u.id===document.querySelector("#login-user").value);if(!await ClubhouseDB.verifyPin(document.querySelector("#login-pin").value,user)){loginScreen("That PIN did not match.");return}currentUser=user;await recordLogin(user);localStorage.setItem(ACTIVE_USER_KEY,user.id);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));hideAuth();roleHome()};
}
async function recordLogin(user){
  if(!user)return;
  user.roles=normalizeRoles(user);
  user.lastLoginAt=new Date().toISOString();
  user.loginCount=(user.loginCount||0)+1;
  await ClubhouseDB.put("users",user);
}
function roleHome(){
  if(isUnassociated()||isSuperUser())switchView("admin");
  else if(currentPlayer||highestRole()==="Player")switchView("dashboard");
  else if(isCoach()&&!isDirector())switchView("schedule");
  else switchView(alerts.some(a=>!a.read&&alertVisible(a))?"alerts":"dashboard");
}
async function boot(){
  await ClubhouseDB.open();
  showAuth();
  ClubhouseDB.onAuthStateChange?.((event)=>{if(event==="PASSWORD_RECOVERY"){showAuth();passwordResetUpdateScreen()}});
  if(isPasswordResetRoute()){await ClubhouseDB.authSession();passwordResetUpdateScreen(passwordResetRouteMessage());return}
  if(!isMasqueradeFrame()){localStorage.removeItem(EFFECTIVE_USER_KEY);localStorage.removeItem(MASQUERADE_SESSION_KEY)}
  const authUser=await ClubhouseDB.currentAuthUser();
  if(authUser&&localStorage.getItem(REMEMBER_LOGIN_KEY)!=="true"&&!(isMasqueradeFrame()&&localStorage.getItem(MASQUERADE_SESSION_KEY)==="true")){await ClubhouseDB.signOut();loginScreen();return}
  if(!authUser){showAuth();loginScreen();return}
  currentUser=await ClubhouseDB.ensureAuthProfile(authUser);
  if(isSuperUser(currentUser))await ClubhouseDB.seedInitialSuperUser();
  await refreshRecords();
  const saved=users.find(u=>u.id===currentUser?.id);
  if(!saved){showAuth();loginScreen();return}
  actualUser=saved;currentUser=(isMasqueradeFrame()?users.find(u=>u.id===localStorage.getItem(EFFECTIVE_USER_KEY)):null)||saved;localStorage.setItem(ACTIVE_USER_KEY,saved.id);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));hideAuth();roleHome();
}
async function disableOfflineCache(){
  if("serviceWorker"in navigator){
    const regs=await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r=>r.unregister()));
  }
  if("caches"in window){
    const keys=await caches.keys();
    await Promise.all(keys.map(k=>caches.delete(k)));
  }
}
function loginScreen(message=""){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">Supabase login</p><h1>Clubhouse Login</h1>${message?`<p class="auth-error">${esc(message)}</p>`:""}<form id="login-form" class="form-stack"><label>Email<input id="login-username" type="email" autocomplete="email" required></label><label>Password<input id="login-pin" type="password" autocomplete="current-password" required></label><label class="check-label"><input id="login-remember" type="checkbox"><span>Remember me on this device</span></label><button class="primary-button">Enter clubhouse</button><button class="text-button" type="button" id="open-signup">Sign Up</button><button class="text-button" type="button" id="forgot-password">Forgot password?</button></form>`;
  document.querySelector("#open-signup").onclick=()=>openSignupDialog();
  document.querySelector("#forgot-password").onclick=()=>passwordResetRequestScreen("",document.querySelector("#login-username")?.value.trim()||"");
  document.querySelector("#login-form").onsubmit=async e=>{e.preventDefault();try{const email=document.querySelector("#login-username").value.trim(),password=document.querySelector("#login-pin").value,remember=document.querySelector("#login-remember").checked,{data,error}=await ClubhouseDB.signIn(email,password);if(error){loginScreen(error.message);return}localStorage.setItem(REMEMBER_LOGIN_KEY,remember?"true":"false");const profile=await ClubhouseDB.ensureAuthProfile(data.user);currentUser=profile;await refreshRecords();actualUser=users.find(u=>u.id===profile.id)||profile;currentUser=actualUser;await recordLogin(actualUser);localStorage.setItem(ACTIVE_USER_KEY,actualUser.id);localStorage.removeItem(EFFECTIVE_USER_KEY);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));hideAuth();roleHome()}catch(err){console.error(err);loginScreen(err.message||"Login failed. Please try again.")}};
}
function openSignupDialog(){
  document.querySelector("#signup-dialog").showModal();
}
async function approveRequest(id){
  const req=accessRequests.find(r=>r.id===id),user=users.find(u=>u.id===req?.userId);if(!req||!user)return;
  if(req.requestedRole==="Director"&&!isSuperUser()){alert("Only Super Users can approve Directors.");return}
  if(!["Director","Coach","Parent","Player"].includes(req.requestedRole)){alert("Invalid requested role.");return}
  const orgId=defaultOrg()?.id,approverHeadTeam=headCoachTeamIds()[0];
  user.status="active";user.roles=[req.requestedRole];user.requestedRole="";
  await ClubhouseDB.put("users",user);
  if(req.requestedRole==="Director")await ClubhouseDB.put("organizationRoles",{id:ClubhouseDB.id("orgRole"),userId:user.id,organizationId:orgId,role:"director",active:true});
  if(req.requestedRole==="Coach"&&approverHeadTeam&&!isDirector())await ClubhouseDB.put("teamCoachRoles",{id:ClubhouseDB.id("coachRole"),userId:user.id,teamId:approverHeadTeam,coachType:"assistant",permissions:{manageTeam:true,managePlans:true,manageParents:false,manageAssistants:false},specializations:["All"],active:true});
  if(req.requestedRole==="Parent"){
    const household={id:ClubhouseDB.id("household"),name:`${user.name}'s Household`,ownerUserId:user.id,equipment:[],active:true};
    await ClubhouseDB.put("households",household);await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,userId:user.id,role:"parent",active:true});
  }
  if(req.requestedRole==="Player"){
    const playerId=ClubhouseDB.id("player");await ClubhouseDB.put("players",{id:playerId,name:user.name,userId:user.id,active:true});await ClubhouseDB.put("playerData",{id:playerId,data:structuredClone(defaultState)});if(approverHeadTeam&&!isDirector())await ClubhouseDB.put("playerTeamMemberships",{id:ClubhouseDB.id("membership"),playerId,teamId:approverHeadTeam,active:true,priority:1});
  }
  req.status="approved";req.decidedBy=currentUser.id;req.decidedAt=new Date().toISOString();await ClubhouseDB.put("accessRequests",req);
  await refreshRecords();renderAll();showToast("Request approved");
}
async function denyRequest(id){
  const req=accessRequests.find(r=>r.id===id);if(!req)return;
  req.status="denied";req.decidedBy=currentUser.id;req.decidedAt=new Date().toISOString();await ClubhouseDB.put("accessRequests",req);
  await refreshRecords();renderAll();showToast("Request denied");
}
async function startMasquerade(userId){
  if(!isSuperUser(actualUser))return;
  const target=users.find(u=>u.id===userId&&!isSuperUser(u));if(!target)return;
  localStorage.setItem(EFFECTIVE_USER_KEY,target.id);
  localStorage.setItem(MASQUERADE_SESSION_KEY,"true");
  document.querySelector("#masquerade-shell-title").textContent=`Masquerading as ${target.name}`;
  document.querySelector("#masquerade-frame").src=`${location.pathname}${location.search || ""}`;
  document.querySelector("#database-lookup-panel").hidden=true;
  document.querySelector("#masquerade-shell-dialog").showModal();
}
async function exitMasquerade(){
  if(!actualUser)return;
  localStorage.removeItem(EFFECTIVE_USER_KEY);
  localStorage.removeItem(MASQUERADE_SESSION_KEY);
  document.querySelector("#masquerade-frame").src="about:blank";
  document.querySelector("#database-lookup-panel").hidden=true;
  document.querySelector("#masquerade-shell-dialog").close();
  currentUser=actualUser;await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));renderAll();
}
async function createAlert(type,title,message,playerId=currentPlayer?.id){
  const item={id:ClubhouseDB.id("alert"),type,title,message,playerId,status:"pending",read:false,created:new Date().toISOString()};await ClubhouseDB.put("alerts",item);alerts.push(item);
  if(Notification.permission==="granted")new Notification(title,{body:message,icon:"assets/icon.svg"});
}
function profileRoleOptions(){
  const roles=isSuperUser()&&!isMasquerading()?["Super User","Director","Coach","Parent","Player"]:isDirector()?["Coach","Parent","Player"]:headCoachTeamIds().length?["Coach","Parent","Player"]:["Parent","Player"];
  return roles.map(r=>`<option>${r}</option>`).join("");
}
function openManage(kind){
  document.querySelector("#manage-title").textContent=`Add ${kind}`;
  document.querySelector("#manage-fields").innerHTML=kind==="Profile"?`<input type="hidden" id="manage-kind" value="Profile"><label>Name<input id="manage-name" required></label><label>PIN<input id="manage-pin" type="password" inputmode="numeric" minlength="4" required></label><label>Role<select id="manage-role">${profileRoleOptions()}</select></label>`:kind==="Player"?`<input type="hidden" id="manage-kind" value="Player"><label>Player name<input id="manage-name" required></label><label>Player email<input id="manage-email" type="email" autocomplete="email" required></label><label>Linked parent<select id="manage-parent"><option value="">None</option>${users.filter(u=>rolesFor(u).includes("Parent")).map(u=>`<option value="${u.id}">${u.name}</option>`).join("")}</select></label><p class="panel-copy">The player signs up with this email and Clubhouse links the login automatically.</p>`:`<input type="hidden" id="manage-kind" value="Team"><label>Team name<input id="manage-name" required></label><label>Season<input id="manage-season" value="${new Date().getFullYear()}"></label>`;
  document.querySelector("#manage-dialog").showModal();
}
function openRecordCreate(type){
  const meta=recordMeta(type);if(!meta)return;
  document.querySelector("#manage-title").textContent=`Add ${meta.label}`;
  document.querySelector("#manage-fields").innerHTML=type==="superUser"?`<input type="hidden" id="manage-kind" value="Record"><input type="hidden" id="manage-record-type" value="superUser"><label>Existing or invited email<input id="manage-email" type="email" required></label><label>Display name for pending invite<input id="manage-name" placeholder="Optional"></label><p class="panel-copy">If the email already has an account, it is promoted immediately. If not, the email is pre-authorized and will become a Super User after sign-up.</p>`:type==="player"?`<input type="hidden" id="manage-kind" value="Record"><input type="hidden" id="manage-record-type" value="player"><label>Player name<input id="manage-name" required></label><label>Player email<input id="manage-email" type="email" autocomplete="email" required></label><p class="panel-copy">The player will sign up with this email. Clubhouse links that login to this player record automatically.</p>`:`<input type="hidden" id="manage-kind" value="Record"><input type="hidden" id="manage-record-type" value="${type}"><label>${meta.label} name<input id="manage-name" required></label>`;
  document.querySelector("#manage-dialog").showModal();
}
async function createAssociatedRecord(type,name,email=""){
  const id=publicRecordId(),now=new Date().toISOString(),createdBy=currentUser.id,useRpc=!isMasquerading();
  if(type==="superUser"){
    const normalized=email.toLowerCase(),existing=users.find(u=>u.username?.toLowerCase()===normalized);
    if(existing)await promoteToSuperUser(existing.id);
    else await ClubhouseDB.put("invitations",{id:ClubhouseDB.id("invite"),email:normalized,name,recordType:"superUser",role:"Super User",status:"pending",invitedBy:createdBy,created:now});
    return;
  }else if(type==="organization"){
    if(useRpc&&await ClubhouseDB.createRecordWithAdminAssociation(type,id,name))return;
    await ClubhouseDB.put("organizations",{id,name,settings:{directorApprovalRequiredForCoachPlans:false},equipment:[],active:true,created:now,createdBy});
  }else if(type==="team"){
    if(useRpc&&await ClubhouseDB.createRecordWithAdminAssociation(type,id,name,defaultOrg()?.id))return;
    await ClubhouseDB.put("teams",{id,name,season:String(new Date().getFullYear()),organizationId:defaultOrg()?.id,equipment:[],active:true,created:now,createdBy});
  }else if(type==="household"){
    if(useRpc&&await ClubhouseDB.createRecordWithAdminAssociation(type,id,name))return;
    await ClubhouseDB.put("households",{id,name,ownerUserId:currentUser.id,equipment:[],active:true,created:now,createdBy});
  }else if(type==="coach"){
    await ClubhouseDB.put("users",{id,name,username:"",active:true,status:"record_only",roles:["Coach"],recordType:"coach",created:now,createdBy,loginCount:0,lastLoginAt:null});
  }else if(type==="player"){
    const normalized=email.toLowerCase();
    if(!normalized){alert("Player email is required so the player can sign up and log in.");return}
    let playerUser=users.find(u=>u.username?.toLowerCase()===normalized);
    if(playerUser){
      playerUser={...playerUser,name:playerUser.name||name,active:true,status:"active",roles:[...new Set([...rolesFor(playerUser),"Player"])],recordType:playerUser.recordType||"player"};
      await ClubhouseDB.put("users",playerUser);
    }else{
      playerUser={id:ClubhouseDB.id("user"),name,username:normalized,active:true,status:"invited",roles:["Player"],recordType:"player",created:now,createdBy,loginCount:0,lastLoginAt:null};
      await ClubhouseDB.put("users",playerUser);
      await ClubhouseDB.put("invitations",{id:ClubhouseDB.id("invite"),email:normalized,recordType:"player",recordId:id,role:"admin",status:"pending",invitedBy:createdBy,created:now});
    }
    await ClubhouseDB.put("players",{id,name,userId:playerUser.id,active:true,created:now,createdBy});
    await ClubhouseDB.put("playerData",{id,data:structuredClone(defaultState)});
  }
  await grantRecordAccess(currentUser.id,type,id,"admin");
}
async function promoteToSuperUser(userId){
  if(!isSuperUser(actualUser)||isMasquerading()){alert("Only a non-masquerading Super User can add another Super User.");return}
  const user=users.find(u=>u.id===userId);if(!user)return;
  user.roles=[...new Set([...normalizeRoles(user),"Super User"])];user.status="active";user.requestedRole="";user.allowSuperUserWrite=true;
  await ClubhouseDB.put("users",user);
  delete user.allowSuperUserWrite;
}
function openLinkRecord(type){
  const meta=recordMeta(type);if(!meta)return;
  document.querySelector("#link-title").textContent=`Link ${meta.label}`;
  document.querySelector("#link-type").value=type;
  document.querySelector("#link-record-id").value="";
  document.querySelector("#link-role").innerHTML=linkRequestRoles(type).map(role=>`<option value="${esc(role)}">${esc(requestRoleLabel(role))}</option>`).join("");
  document.querySelector("#link-dialog").showModal();
}
function openInviteRecord(type,recordId){
  const meta=recordMeta(type);if(!meta)return;
  document.querySelector("#invite-title").textContent=`Invite to ${meta.label}`;
  document.querySelector("#invite-type").value=type;
  document.querySelector("#invite-record-id").value=recordId;
  document.querySelector("#invite-role").value="member";
  document.querySelector("#invite-email").value="";
  document.querySelector("#invite-dialog").showModal();
}
async function updateRecordName(type,recordId,name){
  const meta=recordMeta(type),record=recordsForType(type).find(r=>r.id===recordId);if(!meta||!record)return;
  await ClubhouseDB.put(meta.store,{...record,name});
}
async function deleteRecord(type,recordId){
  const meta=recordMeta(type),record=recordsForType(type).find(r=>r.id===recordId);if(!meta||!record)return;
  if(type==="superUser"&&recordId===actualUser?.id){alert("You cannot delete your own Super User account from this table.");return}
  for(let i=1;i<=3;i++)if(!confirm(`Warning ${i} of 3: deleting ${recordName(record)} removes associated access and cannot be undone. Continue?`))return;
  await ClubhouseDB.remove(meta.store,recordId);
  for(const assoc of recordAssociations.filter(a=>a.recordType===type&&a.recordId===recordId))await ClubhouseDB.remove("recordAssociations",assoc.id);
  if(["superUser","unassociated","director","coach","parent"].includes(type))for(const assoc of recordAssociations.filter(a=>a.userId===recordId))await ClubhouseDB.remove("recordAssociations",assoc.id);
  for(const req of accessRequests.filter(r=>r.recordType===type&&r.recordId===recordId))await ClubhouseDB.remove("accessRequests",req.id);
}
async function approveRecordRequest(id){
  const req=accessRequests.find(r=>r.id===id);if(!canDecideRecordRequest(req))return;
  const remoteDecided=!isMasquerading()&&await ClubhouseDB.decideRecordLinkRequest(id,true);
  await grantRecordAccess(req.requestedUserId||req.userId,req.recordType,req.recordId,req.requestedRole||"member");
  if(!remoteDecided){req.status="approved";req.decidedBy=currentUser.id;req.decidedAt=new Date().toISOString();await ClubhouseDB.put("accessRequests",req);}
}
async function denyRecordRequest(id){
  const req=accessRequests.find(r=>r.id===id);if(!canDecideRecordRequest(req))return;
  if(!isMasquerading()&&await ClubhouseDB.decideRecordLinkRequest(id,false))return;
  req.status="denied";req.decidedBy=currentUser.id;req.decidedAt=new Date().toISOString();await ClubhouseDB.put("accessRequests",req);
}
async function inviteToRecord(type,recordId,email,role="member"){
  const record=recordsForType(type).find(r=>r.id===recordId);
  if(!(isRecordAdmin(type,recordId)||canEditRecord(type,record))){alert("Only an authorized manager can invite users.");return}
  const remoteResult=isMasquerading()?null:await ClubhouseDB.inviteOrLinkUserToRecord(type,recordId,email,role);
  if(remoteResult)return remoteResult;
  const normalized=email.toLowerCase(),existing=users.find(u=>u.username?.toLowerCase()===normalized);
  if(existing){
    existing.status="active";await ClubhouseDB.put("users",existing);
    if(role==="Player"&&["team","organization"].includes(type)&&await createParentApprovalRequests(existing.id,type,recordId,role)){
      return "approval_required";
    }
    await grantRecordAccess(existing.id,type,recordId,role);
    return "linked";
  }
  await ClubhouseDB.put("invitations",{id:ClubhouseDB.id("invite"),email:normalized,recordType:type,recordId,role,status:"pending",invitedBy:currentUser.id,created:new Date().toISOString()});
  return "pending";
}
async function activateUserRole(userId,role){
  if(!["Director","Coach","Parent","Player","Super User"].includes(role))return;
  const user=users.find(u=>u.id===userId);if(!user)return;
  user.status="active";
  user.roles=[...new Set([...normalizeRoles(user),role])];
  if(role==="Player"&&!user.recordType)user.recordType="player";
  await ClubhouseDB.put("users",user);
}
async function grantRecordAccess(userId,type,recordId,role="member"){
  await activateUserRole(userId,role);
  await ensureRecordAssociation(userId,type,recordId,role==="Director"?"admin":role);
  let rolePlayer=players.find(p=>p.userId===userId&&p.active!==false);
  if(role==="Player"&&!rolePlayer){
    const user=users.find(u=>u.id===userId);
    rolePlayer={id:ClubhouseDB.id("player"),name:user?.name||user?.username||"Player",userId,active:true,createdBy:currentUser?.id};
    await ClubhouseDB.put("players",rolePlayer);
    players.push(rolePlayer);
  }
  if(type==="team"){
    if(["Coach","admin"].includes(role)){
      const coachRole=teamCoachRoles.find(r=>r.userId===userId&&r.teamId===recordId);
      const coachType=coachRole?.coachType||(role==="admin"&&!teamCoachRoles.some(r=>r.teamId===recordId&&r.coachType==="head"&&r.active!==false)?"head":"assistant");
      await ClubhouseDB.put("teamCoachRoles",{id:coachRole?.id||ClubhouseDB.id("coachRole"),userId,teamId:recordId,coachType,permissions:coachRole?.permissions||{manageTeam:true,managePlans:true,manageParents:coachType==="head",manageAssistants:coachType==="head"},specializations:coachRole?.specializations||["All"],active:true});
    }
    if(["Player","member"].includes(role)){
      const player=role==="Player"?rolePlayer:players.find(p=>p.userId===userId);
      if(player&&!playerTeamMemberships.some(m=>m.playerId===player.id&&m.teamId===recordId&&m.active!==false))await ClubhouseDB.put("playerTeamMemberships",{id:ClubhouseDB.id("membership"),playerId:player.id,teamId:recordId,active:true,priority:playerTeamMemberships.some(m=>m.playerId===player.id)?2:1});
    }
    const team=teams.find(t=>t.id===recordId);
    if(team?.organizationId)await ensureRecordAssociation(userId,"organization",team.organizationId,role==="admin"?"admin":"member");
  }else if(type==="household"){
    const player=role==="Player"?rolePlayer:players.find(p=>p.userId===userId);
    const existingMember=householdMemberships.find(m=>m.householdId===recordId&&((player&&m.playerId===player.id)||m.userId===userId));
    if(role==="Player"&&player){
      await ClubhouseDB.put("householdMemberships",{id:existingMember?.id||ClubhouseDB.id("hh"),householdId:recordId,playerId:player.id,role:"player",active:true});
      for(const m of householdMemberships.filter(m=>m.householdId===recordId&&m.userId===userId&&m.role==="parent"))await ClubhouseDB.put("householdMemberships",{...m,active:false});
    }else await ClubhouseDB.put("householdMemberships",{id:existingMember?.id||ClubhouseDB.id("hh"),householdId:recordId,userId,role:"parent",active:true});
  }else if(type==="organization"&&["admin","Director"].includes(role)){
    const existingRole=organizationRoles.find(r=>r.userId===userId&&r.organizationId===recordId);
    await ClubhouseDB.put("organizationRoles",{id:existingRole?.id||ClubhouseDB.id("orgRole"),userId,organizationId:recordId,role:"director",active:true});
  }else if(type==="organization"&&role==="Player"){
    const player=rolePlayer,orgTeamIds=teams.filter(t=>t.organizationId===recordId&&t.active!==false).map(t=>t.id);
    if(player)for(const teamId of orgTeamIds)if(!playerTeamMemberships.some(m=>m.playerId===player.id&&m.teamId===teamId&&m.active!==false))await ClubhouseDB.put("playerTeamMemberships",{id:ClubhouseDB.id("membership"),playerId:player.id,teamId,active:true,priority:2});
  }else if(type==="player"){
    const player=players.find(p=>p.id===recordId);
    if(player&&!player.userId)await ClubhouseDB.put("players",{...player,userId});
  }
}
async function ensureRecordAssociation(userId,type,recordId,role="member"){
  const existing=recordAssociations.find(a=>a.userId===userId&&a.recordType===type&&a.recordId===recordId);
  const next={id:existing?.id||ClubhouseDB.id("assoc"),userId,recordType:type,recordId,role:existing?.role==="admin"?"admin":role,active:true,created:existing?.created||new Date().toISOString(),createdBy:existing?.createdBy||currentUser.id};
  await ClubhouseDB.put("recordAssociations",next);
}
function openAddMenu(anchor){
  const existing=anchor.nextElementSibling;if(existing?.classList.contains("floating-menu")){existing.remove();return}
  const old=document.querySelector(".floating-menu");if(old)old.remove();
  const types=isSuperUser(actualUser)&&!isMasquerading()?[{type:"superUser",label:"Super User"},...RECORD_TYPES]:RECORD_TYPES;
  const menu=document.createElement("div");menu.className="floating-menu";menu.innerHTML=types.map(m=>`<button type="button" data-create-record="${m.type}">${m.label}</button>`).join("");
  anchor.after(menu);
}
function openLinkMenu(anchor){
  const existing=anchor.nextElementSibling;if(existing?.classList.contains("floating-menu")){existing.remove();return}
  const old=document.querySelector(".floating-menu");if(old)old.remove();
  const menu=document.createElement("div");menu.className="floating-menu";menu.innerHTML=RECORD_TYPES.map(m=>`<button type="button" data-link-record="${m.type}">${m.label}</button>`).join("");
  anchor.after(menu);
}
async function refreshProfileSections(button){
  button?.classList.add("refreshing");
  await refreshRecords();
  actualUser=users.find(u=>u.id===actualUser?.id)||actualUser;
  currentUser=users.find(u=>u.id===currentUser?.id)||currentUser;
  renderAdmin();renderAlerts();renderContext();
  setTimeout(()=>button?.classList.remove("refreshing"),450);
  showToast("Profile data refreshed");
}

function updateDialogScrollLock(){
  document.body.classList.toggle("modal-open",[...document.querySelectorAll("dialog")].some(dialog=>dialog.open));
}
function installDialogScrollLock(){
  if(HTMLDialogElement.prototype.__clubhouseScrollLockInstalled)return;
  HTMLDialogElement.prototype.__clubhouseScrollLockInstalled=true;
  const showModal=HTMLDialogElement.prototype.showModal;
  const close=HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.showModal=function(...args){
    const result=showModal.apply(this,args);
    updateDialogScrollLock();
    return result;
  };
  HTMLDialogElement.prototype.close=function(...args){
    const result=close.apply(this,args);
    updateDialogScrollLock();
    return result;
  };
  document.querySelectorAll("dialog").forEach(dialog=>dialog.addEventListener("close",updateDialogScrollLock));
}
installDialogScrollLock();

document.addEventListener("click",e=>{
  const v=e.target.closest("[data-view-link]");if(v){e.preventDefault();switchView(v.dataset.viewLink)}
  const start=e.target.closest("[data-start-session]");if(start)startSession(start.dataset.startSession);
  const build=e.target.closest("[data-build-variation]");if(build&&canBuildTraining())openVariationDialog(build.dataset.buildVariation);
  const editVariation=e.target.closest("[data-edit-variation]");if(editVariation&&canBuildTraining()){const item=variationFor(editVariation.dataset.editVariation);openVariationDialog(item.blueprintId,item.id)}
  const deleteVariation=e.target.closest("[data-delete-variation]");if(deleteVariation&&canBuildTraining()&&confirm("Delete this saved variation?")){state.variations=state.variations.filter(v=>v.id!==deleteVariation.dataset.deleteVariation);saveState();renderAll()}
  const approval=e.target.closest("[data-toggle-approval]");if(approval){const id=approval.dataset.toggleApproval;if(isApproved(drillFor(id)))state.approvedDrillIds=state.approvedDrillIds.filter(x=>x!==id);else state.approvedDrillIds.push(id);saveState();renderAll()}
  const filter=e.target.closest("[data-library-filter]");if(filter){libraryFilter=filter.dataset.libraryFilter;renderLibrary()}
  const remove=e.target.closest("[data-remove-equipment]");if(remove&&confirm(`Remove ${remove.dataset.removeEquipment} from the Equipment Shed?`)){state.equipment=state.equipment.filter(x=>x!==remove.dataset.removeEquipment);saveState();renderAll()}
  if(e.target.closest("[data-close-variation]"))document.querySelector("#variation-dialog").close();
  if(e.target.closest("[data-close-event]"))document.querySelector("#event-dialog").close();
  if(e.target.closest("[data-close-manage]"))document.querySelector("#manage-dialog").close();
  if(e.target.closest("[data-close-signup]"))document.querySelector("#signup-dialog").close();
  if(e.target.closest("#banner-exit-masquerade"))exitMasquerade();
  if(e.target.closest("#close-masquerade-shell"))exitMasquerade();
  if(e.target.closest("#database-lookup-toggle")){const panel=document.querySelector("#database-lookup-panel");panel.hidden=!panel.hidden;if(!panel.hidden){renderDatabaseLookup();document.querySelector("#database-lookup-search").focus()}return}
  if(e.target.closest("#database-lookup-close")){document.querySelector("#database-lookup-panel").hidden=true;return}
  const copyLookup=e.target.closest("[data-copy-text]");if(copyLookup){copyLookupId(copyLookup.dataset.copyText);return}
  const deleteEvent=e.target.closest("[data-delete-event]");if(deleteEvent&&confirm("Delete this event and all recurring occurrences?"))ClubhouseDB.remove("events",deleteEvent.dataset.deleteEvent).then(async()=>{await refreshRecords();renderAll()});
  const conflict=e.target.closest("[data-conflict-action]");if(conflict){ClubhouseDB.put("decisions",{id:ClubhouseDB.id("decision"),playerId:currentPlayer.id,eventId:conflict.dataset.conflictEvent,date:conflict.dataset.conflictDate,action:conflict.dataset.conflictAction,created:new Date().toISOString()}).then(async()=>{await refreshRecords();renderAll()});showToast(`Conflict marked: ${conflict.dataset.conflictAction}`)}
  const pain=e.target.closest("[data-pain-decision]");if(pain){const item=alerts.find(a=>a.id===pain.dataset.alertId);item.status=pain.dataset.painDecision==="allow"?"allowed":"removed";item.read=true;if(item.status==="removed"){state.throwingRemovedDate=todayISO();saveState()}ClubhouseDB.put("alerts",item);ClubhouseDB.put("decisions",{id:ClubhouseDB.id("decision"),alertId:item.id,action:item.status,userId:currentUser.id,created:new Date().toISOString()});renderAll()}
  const roster=e.target.closest("[data-roster-team]");if(roster){if(!currentPlayer){alert("Select a player before changing roster membership.");return}const existing=memberships.find(m=>m.teamId===roster.dataset.rosterTeam&&m.playerId===currentPlayer.id);(existing?ClubhouseDB.remove("playerTeamMemberships",existing.id):(currentPlayer.userId?grantRecordAccess(currentPlayer.userId,"team",roster.dataset.rosterTeam,"member"):ClubhouseDB.put("playerTeamMemberships",{id:ClubhouseDB.id("membership"),teamId:roster.dataset.rosterTeam,playerId:currentPlayer.id,active:true,priority:memberships.some(m=>m.playerId===currentPlayer.id)?2:1}))).then(async()=>{await refreshRecords();renderAll()})}
  const priority=e.target.closest("[data-priority-team]");if(priority){if(!currentPlayer){alert("Select a player before changing priority team.");return}currentPlayer.priorityTeamId=priority.dataset.priorityTeam;ClubhouseDB.put("players",currentPlayer).then(async()=>{await refreshRecords();renderAll()})}
  const reset=e.target.closest("[data-reset-pin]");if(reset){if(!canManageSecurity()){alert("Security settings are disabled while masquerading.");return}const pin=prompt("Enter the new local PIN (4+ characters):");if(pin)ClubhouseDB.hashPin(pin).then(async h=>{const user=users.find(u=>u.id===reset.dataset.resetPin);Object.assign(user,{pinSalt:h.salt,pinHash:h.hash});await ClubhouseDB.put("users",user);showToast("PIN reset")})}
  const approve=e.target.closest("[data-approve-request]");if(approve){const req=accessRequests.find(r=>r.id===approve.dataset.approveRequest);(req?.recordType?approveRecordRequest(req.id):approveRequest(req.id)).then(async()=>{await refreshRecords();renderAll();showToast("Request approved")})}
  const deny=e.target.closest("[data-deny-request]");if(deny){const req=accessRequests.find(r=>r.id===deny.dataset.denyRequest);(req?.recordType?denyRecordRequest(req.id):denyRequest(req.id)).then(async()=>{await refreshRecords();renderAll();showToast("Request denied")})}
  if(e.target.closest("[data-close-link]"))document.querySelector("#link-dialog").close();
  if(e.target.closest("[data-close-invite]"))document.querySelector("#invite-dialog").close();
  if(e.target.closest("[data-close-association]"))document.querySelector("#association-dialog").close();
  const refresh=e.target.closest("#refresh-profile");if(refresh)refreshProfileSections(refresh);
  const assocTab=e.target.closest("[data-association-tab]");if(assocTab){associationActiveTab=assocTab.dataset.associationTab;document.querySelectorAll("[data-association-tab]").forEach(b=>b.classList.toggle("active",b===assocTab));document.querySelectorAll("[data-association-pane]").forEach(p=>p.classList.toggle("active",p.dataset.associationPane===assocTab.dataset.associationTab))}
  const cancelReq=e.target.closest("[data-cancel-link-request]");if(cancelReq)cancelLinkRequest(cancelReq.dataset.cancelLinkRequest).then(async()=>{await refreshRecords();renderAll();showToast("Request canceled")});
  const scopedInvite=e.target.closest("[data-scoped-invite]");if(scopedInvite){openScopedInvite(scopedInvite.dataset.inviteRole,scopedInvite.dataset.recordType,scopedInvite.dataset.recordId);return}
  const leaveAssoc=e.target.closest("[data-leave-association]");if(leaveAssoc)leaveAssociation(leaveAssoc.dataset.recordType,leaveAssoc.dataset.recordId).then(async()=>{document.querySelector("#association-dialog").close();await refreshRecords();renderAll();showToast("Association removed")});
  const viewEntity=e.target.closest("[data-view-entity]");if(viewEntity){openEntityDetail(viewEntity.dataset.entityType,viewEntity.dataset.entityId);return}
  const editEntityBtn=e.target.closest("[data-edit-entity]");if(editEntityBtn)editEntity(editEntityBtn.dataset.entityType,editEntityBtn.dataset.entityId,editEntityBtn.dataset.scopeType,editEntityBtn.dataset.scopeId).then(async(result)=>{if(!result)return;await refreshRecords();renderAll();if(result==="association")openAssociationDetail(editEntityBtn.dataset.scopeType,editEntityBtn.dataset.scopeId);else openEntityDetail(editEntityBtn.dataset.entityType,editEntityBtn.dataset.entityId);showToast("Record updated")});
  const removeEntity=e.target.closest("[data-remove-entity-association]");if(removeEntity)removeEntityAssociation(removeEntity.dataset.scopeType,removeEntity.dataset.scopeId,removeEntity.dataset.entityType,removeEntity.dataset.entityId).then(async()=>{await refreshRecords();renderAll();openAssociationDetail(removeEntity.dataset.scopeType,removeEntity.dataset.scopeId);showToast("Association removed")});
  const openAssoc=e.target.closest("[data-open-association]");if(openAssoc&&!e.target.closest("button"))openAssociationDetail(openAssoc.dataset.associationType,openAssoc.dataset.associationId);
  const tableSort=e.target.closest("[data-admin-sort]");if(tableSort){const type=tableSort.dataset.adminSort,key=tableSort.dataset.sortKey,state=adminTableState(type);adminTableControls[type]={...state,sort:key,dir:state.sort===key&&state.dir==="asc"?"desc":"asc"};renderAdmin();return}
  const addNew=e.target.closest("#add-new-button");if(addNew)openAddMenu(addNew);
  const linkButton=e.target.closest("#link-record-button");if(linkButton)openLinkMenu(linkButton);
  const createRecord=e.target.closest("[data-create-record]");if(createRecord){document.querySelector(".floating-menu")?.remove();openRecordCreate(createRecord.dataset.createRecord)}
  const linkRecord=e.target.closest("[data-link-record]");if(linkRecord){document.querySelector(".floating-menu")?.remove();openLinkRecord(linkRecord.dataset.linkRecord)}
  const inviteRecord=e.target.closest("[data-invite-record]");if(inviteRecord)openInviteRecord(inviteRecord.dataset.recordType,inviteRecord.dataset.recordId);
  const editRecord=e.target.closest("[data-edit-record]");if(editRecord){const record=recordsForType(editRecord.dataset.recordType).find(r=>r.id===editRecord.dataset.recordId);if(record&&canEditRecord(editRecord.dataset.recordType,record)){const name=prompt("Update name:",recordName(record));if(name)updateRecordName(editRecord.dataset.recordType,record.id,name.trim()).then(async()=>{await refreshRecords();renderAll()})}}
  const viewRecord=e.target.closest("[data-view-record]");if(viewRecord){const record=recordsForType(viewRecord.dataset.recordType).find(r=>r.id===viewRecord.dataset.recordId);if(record)alert(`${recordName(record)}\nID: ${record.id}`)}
  const deleteBtn=e.target.closest("[data-delete-record]");if(deleteBtn&&isRecordAdmin(deleteBtn.dataset.recordType,deleteBtn.dataset.recordId))deleteRecord(deleteBtn.dataset.recordType,deleteBtn.dataset.recordId).then(async()=>{await refreshRecords();renderAll();showToast("Record deleted")});
  const promote=e.target.closest("[data-promote-super]");if(promote&&confirm("Make this account a Super User?"))promoteToSuperUser(promote.dataset.promoteSuper).then(async()=>{await refreshRecords();renderAll();showToast("Super User added")});
  const masq=e.target.closest("[data-masquerade-user]");if(masq)startMasquerade(masq.dataset.masqueradeUser);
  const profileAction=e.target.closest("[data-profile-action]");if(profileAction){document.querySelector("#profile-menu").hidden=true;if(profileAction.dataset.profileAction==="edit")switchView("admin");if(profileAction.dataset.profileAction==="logout")signOutUser()}
  if(e.target.closest("#sign-out"))signOutUser();
  if(e.target.closest("#enable-notifications")){if("Notification"in window)Notification.requestPermission().then(p=>{showToast(`Notifications: ${p}`);renderAll()});else showToast("Notifications are not available in this browser.")}
  if(e.target.closest("#install-app")){if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt=null}else showToast(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?"Use Add to Home Screen in your browser menu.":"Use the browser install option, if available.")}
  if(!e.target.closest(".avatar-wrap"))document.querySelector("#profile-menu").hidden=true;
  if(!e.target.closest(".profile-actions")&&!e.target.closest(".floating-menu"))document.querySelector(".floating-menu")?.remove();
});
document.querySelectorAll("dialog").forEach(dialog=>{
  if(dialog.id==="masquerade-shell-dialog"){
    dialog.addEventListener("cancel",e=>e.preventDefault());
    return;
  }
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
});
document.addEventListener("change",e=>{if(e.target.matches("[data-variation-slot]"))updateVariationWarnings();if(e.target.id==="log-workout")renderLogDrills()});
document.addEventListener("change",e=>{
  if(e.target.id==="individual-role-filter"||e.target.id==="individual-team-filter"){
    individualFilters={...individualFilters,role:document.querySelector("#individual-role-filter")?.value||"all",team:document.querySelector("#individual-team-filter")?.value||"all"};
    renderAdmin();
  }
  if(e.target.matches("[data-admin-table-filter]")){
    const type=e.target.dataset.adminTableFilter,state=adminTableState(type);
    adminTableControls[type]={...state,filter:e.target.value};
    renderAdmin();
  }
  if(e.target.id==="database-lookup-type")renderDatabaseLookup();
});
document.addEventListener("input",e=>{
  if(e.target.id==="individual-search"){
    const caret=e.target.selectionStart??e.target.value.length;
    individualFilters={...individualFilters,query:e.target.value};
    renderAdmin();
    const search=document.querySelector("#individual-search");
    search?.focus();
    search?.setSelectionRange(caret,caret);
  }
  if(e.target.matches("[data-admin-table-search]")){
    const type=e.target.dataset.adminTableSearch,caret=e.target.selectionStart??e.target.value.length,state=adminTableState(type);
    adminTableControls[type]={...state,query:e.target.value};
    renderAdmin();
    const search=[...document.querySelectorAll("[data-admin-table-search]")].find(input=>input.dataset.adminTableSearch===type);
    search?.focus();
    search?.setSelectionRange(caret,caret);
  }
  if(e.target.id==="database-lookup-search")renderDatabaseLookup();
});
document.addEventListener("submit",async e=>{
  if(e.target.id==="password-reset-request-form"){
    e.preventDefault();
    const email=document.querySelector("#password-reset-email").value.trim();
    const {error}=await ClubhouseDB.resetPassword(email)||{};
    if(error){passwordResetRequestScreen(error.message,email);return}
    passwordResetRequestScreen("If that email has an account, a reset link is on the way.",email);
    return;
  }
  if(e.target.id==="password-reset-update-form"){
    e.preventDefault();
    const password=document.querySelector("#password-reset-new").value,confirmPassword=document.querySelector("#password-reset-confirm").value;
    if(password!==confirmPassword){passwordResetUpdateScreen("Passwords do not match.");return}
    const {error}=await ClubhouseDB.updateAuth({password})||{};
    if(error){passwordResetUpdateScreen(error.message||"Unable to update password.");return}
    await ClubhouseDB.signOut();
    localStorage.removeItem(REMEMBER_LOGIN_KEY);
    cleanPasswordResetUrl();
    loginScreen("Password updated. Please log in.");
    return;
  }
  if(e.target.id==="profile-info-form"){
    e.preventDefault();
    let detail={...detailForUser(currentUser.id),...collectFieldData("profile"),id:currentUser.id};
    try{detail=await applyProfilePicture(detail)}catch(error){alert(error.message||"Unable to process profile picture.");return}
    const name=[detail.firstName,detail.lastName].filter(Boolean).join(" ").trim()||currentUser.name,email=detail.email||currentUser.username,password=document.querySelector("#profile-edit-password").value;
    if(isMasquerading()&&(password||(email&&email!==currentUser.username))){alert("Email and password changes are disabled while masquerading.");return}
    if(!isMasquerading()){
      const authChanges={data:{name}};if(email&&email!==currentUser.username)authChanges.email=email;if(password)authChanges.password=password;
      const {error}=await ClubhouseDB.updateAuth(authChanges)||{};
      if(error){alert(error.message);return}
    }
    currentUser.name=name;currentUser.username=email||currentUser.username;await ClubhouseDB.put("users",currentUser);await ClubhouseDB.put("profileDetails",detail);await refreshRecords();actualUser=users.find(u=>u.id===actualUser?.id)||actualUser;currentUser=users.find(u=>u.id===currentUser?.id)||currentUser;renderAll();showToast("Profile updated");
    return;
  }
  if(e.target.id==="player-profile-form"){
    e.preventDefault();
    if(!currentPlayer){alert("Select a player first.");return}
    const profile={...profileForPlayer(currentPlayer.id),...collectFieldData("player-profile"),id:currentPlayer.id};
    await ClubhouseDB.put("playerProfiles",profile);await refreshRecords();renderAll();showToast("Player profile updated");
    return;
  }
  if(e.target.id==="athletic-profile-form"){
    e.preventDefault();
    if(!currentPlayer){alert("Select a player first.");return}
    const profile=profileForPlayer(currentPlayer.id),athletic=collectFieldData("athletic");
    athletic.nextEvaluationDate=nextEvaluationFrom(athletic.nextEvaluationDate,athletic.evaluationFrequency);
    await ClubhouseDB.put("playerProfiles",{...profile,id:currentPlayer.id,athletic});await refreshRecords();renderAll();showToast("Athletic profile updated");
    return;
  }
  if(e.target.id==="performance-metrics-form"){
    e.preventDefault();
    if(!currentPlayer){alert("Select a player first.");return}
    const profile=profileForPlayer(currentPlayer.id);
    await ClubhouseDB.put("playerProfiles",{...profile,id:currentPlayer.id,metrics:collectMetricData()});await refreshRecords();renderAll();showToast("Performance metrics updated");
    return;
  }
  if(e.target.id==="super-password-form"){
    e.preventDefault();
    if(!canManageSecurity()){alert("Password changes are disabled while masquerading.");return}
    const password=document.querySelector("#super-password").value,confirmPassword=document.querySelector("#super-password-confirm").value;
    if(password!==confirmPassword){alert("Passwords do not match.");return}
    const {error}=await ClubhouseDB.updateAuth({password})||{};
    if(error){alert(error.message);return}
    e.target.reset();
    showToast("Password updated");
  }
  if(e.target.id==="link-form"){
    e.preventDefault();
    const type=document.querySelector("#link-type").value,recordId=document.querySelector("#link-record-id").value.trim(),requestedRole=document.querySelector("#link-role").value||"member",meta=recordMeta(type);
    const record=recordsForType(type).find(r=>r.id===recordId)||await ClubhouseDB.get(meta.store,recordId);
    if(!record){alert("No record found with that ID.");return}
    if(assocFor(currentUser.id,type,recordId)){alert("This account is already linked to that record.");return}
    const existing=accessRequests.find(r=>r.userId===currentUser.id&&r.recordType===type&&r.recordId===recordId&&r.status==="pending");
    await ClubhouseDB.put("accessRequests",{id:existing?.id||ClubhouseDB.id("request"),userId:currentUser.id,requestedRole,requestedBy:currentUser.id,recordType:type,recordId,status:"pending",created:existing?.created||new Date().toISOString()});
    document.querySelector("#link-dialog").close();await refreshRecords();renderAll();showToast("Link request submitted");
  }
  if(e.target.id==="invite-form"){
    e.preventDefault();
    const result=await inviteToRecord(document.querySelector("#invite-type").value,document.querySelector("#invite-record-id").value,document.querySelector("#invite-email").value.trim(),document.querySelector("#invite-role").value||"member");
    document.querySelector("#invite-dialog").close();await refreshRecords();renderAll();showToast(result==="approval_required"?"Parent approval requested":result==="linked"?"User linked":"Invitation stored");
  }
});
document.querySelector("#menu-button").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.querySelector("#profile-button").onclick=()=>{document.querySelector("#profile-menu").hidden=!document.querySelector("#profile-menu").hidden};
document.querySelector("#context-player").onchange=e=>selectPlayer(e.target.value);
document.querySelector("#add-workout").style.display="none";
document.querySelector("#reset-data").onclick=()=>{if(confirm("Reset all app data to the incorporated development plan?")){state=structuredClone(defaultState);saveState();renderAll();showToast("Development plan restored")}};
document.querySelectorAll("#phase-filters .filter").forEach(b=>b.onclick=()=>{state.currentPhase=b.dataset.phase;saveState();document.querySelectorAll("#phase-filters .filter").forEach(x=>x.classList.toggle("active",x===b));renderAll()});
document.addEventListener("click",e=>{const feeling=e.target.closest("[data-feeling]");if(feeling){state.readiness[feeling.dataset.feeling]=+feeling.dataset.value;renderReadiness()}});
document.querySelector("#save-readiness").onclick=async()=>{if(!currentPlayer){alert("Select or create a player before saving a check-in.");return}state.readiness.date=todayISO();state.readiness.detail=document.querySelector("#readiness-detail").value.trim();saveState();if(state.readiness.arm===1)await createAlert("Arm Pain",`${currentPlayer.name} reported arm pain`,state.readiness.detail||"Throwing requires an admin decision.");else{const pending=alerts.filter(a=>a.playerId===currentPlayer.id&&a.type==="Arm Pain"&&a.status==="pending");for(const a of pending){a.status="cleared";a.read=true;await ClubhouseDB.put("alerts",a)}}await refreshRecords();renderAll();showToast("Check-in saved")};
document.querySelector("#log-rpe").oninput=e=>document.querySelector("#rpe-output").textContent=e.target.value;
document.querySelector("#pitch-soreness").oninput=e=>document.querySelector("#pitch-soreness-output").textContent=e.target.value;
document.querySelector("#equipment-form").onsubmit=e=>{e.preventDefault();const name=document.querySelector("#equipment-name").value.trim();if(name&&!state.equipment.some(x=>x.toLowerCase()===name.toLowerCase()))state.equipment.push(name);saveState();e.target.reset();renderAll();showToast("Equipment added")};
document.querySelector("#add-event").onclick=()=>{if(!currentPlayer){alert("Select a player before adding an event.");return}document.querySelector("#event-date").value=todayISO();const teamOptions=teams.filter(t=>memberships.some(m=>m.playerId===currentPlayer.id&&m.teamId===t.id)&&canScheduleTeam(t.id)).map(t=>`<option value="team:${t.id}">${t.name}</option>`).join("");document.querySelector("#event-scope").innerHTML=`<option value="player:${currentPlayer.id}">${currentPlayer.name}</option>${teamOptions}`;document.querySelector("#event-dialog").showModal()};
document.querySelector("#event-form").onsubmit=async e=>{e.preventDefault();const [scope,id]=document.querySelector("#event-scope").value.split(":");await ClubhouseDB.put("events",{id:ClubhouseDB.id("event"),title:document.querySelector("#event-title").value.trim(),type:document.querySelector("#event-type").value,workload:document.querySelector("#event-workload").value,date:document.querySelector("#event-date").value,repeat:document.querySelector("#event-repeat").value,[`${scope}Id`]:id,createdBy:currentUser.id});document.querySelector("#event-dialog").close();e.target.reset();await refreshRecords();renderAll()};
document.querySelector("#manage-form").onsubmit=async e=>{e.preventDefault();try{const kind=document.querySelector("#manage-kind").value,name=document.querySelector("#manage-name").value.trim(),orgId=defaultOrg()?.id;if(kind==="Record"){await createAssociatedRecord(document.querySelector("#manage-record-type").value,name,document.querySelector("#manage-email")?.value.trim()||"")}else if(kind==="Profile"){if(!canCreateProfile()){alert("You do not have permission to create profiles.");return}const role=document.querySelector("#manage-role").value;if(role==="Super User"&&!canManageSecurity()){alert("Only a non-masquerading Super User can create another Super User.");return}const h=await ClubhouseDB.hashPin(document.querySelector("#manage-pin").value),user={id:ClubhouseDB.id("user"),username:name,name,pinSalt:h.salt,pinHash:h.hash,owner:false,active:true,status:"active",roles:[role],loginCount:0,lastLoginAt:null};await ClubhouseDB.put("users",user);if(role==="Director")await ClubhouseDB.put("organizationRoles",{id:ClubhouseDB.id("orgRole"),userId:user.id,organizationId:orgId,role:"director",active:true});if(role==="Parent"){const household={id:ClubhouseDB.id("household"),name:`${name}'s Household`,ownerUserId:user.id,equipment:[],active:true};await ClubhouseDB.put("households",household);await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,userId:user.id,role:"parent",active:true})}}else if(kind==="Player"){if(!canCreatePlayer()){alert("You do not have permission to create players.");return}const id=ClubhouseDB.id("player"),userId=ClubhouseDB.id("user"),h=await ClubhouseDB.hashPin(document.querySelector("#manage-player-pin").value);await ClubhouseDB.put("users",{id:userId,username:name,name,pinSalt:h.salt,pinHash:h.hash,owner:false,active:true,status:"active",roles:["Player"],loginCount:0,lastLoginAt:null});await ClubhouseDB.put("players",{id,name,userId,active:true});await ClubhouseDB.put("playerData",{id,data:structuredClone(defaultState)});const parent=document.querySelector("#manage-parent").value||(!isDirector()&&isParent()?currentUser.id:"");if(parent){let household=households.find(h=>h.ownerUserId===parent);if(!household){household={id:ClubhouseDB.id("household"),name:`${users.find(u=>u.id===parent)?.name||"Parent"}'s Household`,ownerUserId:parent,equipment:[],active:true};await ClubhouseDB.put("households",household)}await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,userId:parent,role:"parent",active:true});await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,playerId:id,role:"player",active:true})}}else{if(!canCreateTeam()){alert("You do not have permission to create teams.");return}await ClubhouseDB.put("teams",{id:ClubhouseDB.id("team"),name,season:document.querySelector("#manage-season").value,organizationId:orgId,equipment:[]})}document.querySelector("#manage-dialog").close();await refreshRecords();renderAll();showToast("Record saved")}catch(err){console.error(err);alert(err.message||"Unable to save record.")}};
document.querySelector("#signup-form").onsubmit=async e=>{e.preventDefault();const email=document.querySelector("#signup-username").value.trim(),name=document.querySelector("#signup-name").value.trim(),password=document.querySelector("#signup-pin").value,confirmPassword=document.querySelector("#signup-pin-confirm").value;if(password!==confirmPassword){alert("Passwords do not match.");document.querySelector("#signup-pin-confirm").focus();return}const {data,error}=await ClubhouseDB.signUp(email,password,name);if(error){alert(error.message);return}if(data.user&&data.session){await ClubhouseDB.ensureAuthProfile(data.user,name);await ClubhouseDB.signOut()}localStorage.removeItem(REMEMBER_LOGIN_KEY);document.querySelector("#signup-dialog").close();document.querySelector("#signup-form").reset();showAuth();loginScreen("Account created. Please log in.")};
document.querySelector("#mark-alerts-read").onclick=async()=>{for(const a of alerts.filter(alertVisible)){a.read=true;await ClubhouseDB.put("alerts",a)}renderAll()};
document.querySelector("#variation-form").onsubmit=e=>{e.preventDefault();const session=selectedVariationSession(),issues=sessionIssues(session);if(issues.some(i=>i.type==="blocked"||i.type==="approval")){alert("Resolve blocked or unapproved drills before saving.");return}const id=document.querySelector("#variation-id").value||crypto.randomUUID(),v={id,blueprintId:session.id,name:session.name,drillIds:session.drillIds,created:todayISO()},i=state.variations.findIndex(x=>x.id===id);if(i>=0)state.variations[i]=v;else state.variations.push(v);saveState();document.querySelector("#variation-dialog").close();renderAll();showToast("Variation saved")};
document.querySelector("#start-one-time").onclick=()=>{const session=selectedVariationSession(),issues=sessionIssues(session);if(issues.some(i=>i.type==="blocked"||i.type==="approval")){alert("Resolve blocked or unapproved drills before starting.");return}const equipment=issues.find(i=>i.type==="equipment");if(equipment&&!confirm(`${equipment.text}\n\nContinue and acknowledge the missing equipment?`))return;const id=`one-time-${crypto.randomUUID()}`;state.variations.push({id,blueprintId:session.id,name:`${session.name} (one-time)`,drillIds:session.drillIds,created:todayISO(),oneTime:true});saveState();document.querySelector("#variation-dialog").close();renderAll();startSession(id)};
document.querySelector("#log-form").onsubmit=e=>{e.preventDefault();const sessionId=document.querySelector("#log-workout").value,session=sessionFor(sessionId),drillResults=[...document.querySelectorAll("[data-complete-drill]")].map(c=>({drillId:c.dataset.completeDrill,completed:c.checked,benchmarkValue:document.querySelector(`[data-benchmark-drill="${c.dataset.completeDrill}"]`)?.value||""}));state.logs.push({id:crypto.randomUUID(),sessionId,sessionName:session?.name,workoutId:session?.blueprintId||sessionId,date:document.querySelector("#log-date").value,duration:+document.querySelector("#log-duration").value,rpe:+document.querySelector("#log-rpe").value,metric:document.querySelector("#log-metric").value.trim(),notes:document.querySelector("#log-notes").value.trim(),drillResults});if(variationFor(sessionId)?.oneTime)state.variations=state.variations.filter(v=>v.id!==sessionId);saveState();e.target.reset();renderAll();showToast("Session and drill results logged")};
document.querySelector("#pitch-form").onsubmit=e=>{e.preventDefault();state.pitchLogs.push({id:crypto.randomUUID(),date:document.querySelector("#pitch-date").value,setting:document.querySelector("#pitch-setting").value,pitches:+document.querySelector("#pitch-count").value,innings:+document.querySelector("#pitch-innings").value||0,soreness:+document.querySelector("#pitch-soreness").value,notes:document.querySelector("#pitch-notes").value.trim()});saveState();e.target.reset();renderAll();showToast("Pitch count saved")};
document.querySelector("#test-form").onsubmit=e=>{e.preventDefault();const val=id=>document.querySelector(id).value;state.tests.push({id:crypto.randomUUID(),date:val("#test-date"),sprint:val("#test-sprint"),jump:val("#test-jump"),pushups:val("#test-pushups"),hang:val("#test-hang"),command:val("#test-command"),contact:val("#test-contact"),notes:val("#test-notes")});saveState();e.target.reset();renderAll();showToast("Assessment saved")};
document.querySelector("#page-eyebrow").textContent=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
document.querySelectorAll("#phase-filters .filter").forEach(b=>b.classList.toggle("active",b.dataset.phase===state.currentPhase));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e});
disableOfflineCache().catch(console.warn).finally(()=>boot().catch(err=>{console.error(err);showAuth();document.querySelector("#auth-card").innerHTML=`<h1>Unable to start Clubhouse</h1><p>${esc(err.message||"Serve the app from localhost or HTTPS and reload.")}</p><button class="primary-button" type="button" onclick="location.reload()">Reload</button>`}));

