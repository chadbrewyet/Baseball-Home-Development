const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STORAGE_KEY = "clubhouse-baseball-v3";
const OLD_STORAGE_KEY = "clubhouse-baseball-v2";
const ACTIVE_USER_KEY = "clubhouse-active-user";
const ACTIVE_PLAYER_KEY = "clubhouse-active-player";
const EFFECTIVE_USER_KEY = "clubhouse-effective-user";
const ROLE_ORDER = ["Player", "Parent", "Coach", "Director", "Super User"];
const ROLE_SCOPE = {"Super User":"All access",Director:"Organization",Coach:"Team",Parent:"Household",Player:"Player"};
const SPECIALIZATIONS = ["All","pitching","hitting","infielding","outfielding","catching"];
const todayISO = () => new Date().toISOString().slice(0, 10);

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
function renderDashboard(){
  const w=todaysWorkout(), drills=w.drillIds.map(drillFor);
  document.querySelector("#today-card").innerHTML=`<p class="eyebrow">${state.currentPhase} · ${w.dayType}</p><h2>${w.name}</h2><p class="meta">${w.duration} min · ${w.intensity} · ${drills.length} items</p><div class="drill-preview">${drills.slice(0,3).map(d=>`<span>${d.name}</span>`).join("")}</div><button class="primary-button" data-start-session="${w.id}">Start session</button>${canBuildTraining()?` <button class="secondary-button" data-build-variation="${w.id}">Build variation</button>`:""}`;
  const p=latestPitch(),alert=document.querySelector("#workload-alert");
  if(p){const rest=restDays(p.pitches),next=addDays(p.date,rest),clear=todayISO()>=next;alert.innerHTML=`<div class="workload-alert ${clear?"clear":""}"><div><strong>${clear?"Throwing rest complete":"Throwing restricted"}</strong>${p.pitches} pitches on ${fmtDate(p.date)} · ${rest} rest day(s) required${p.pitches>=41?" · No catching afterward that day":""}</div><button class="text-button" data-view-link="pitch">Pitch log</button></div>`}else alert.innerHTML=`<div class="workload-alert clear"><div><strong>No recent pitch count</strong>Log throwing outings to activate rest guidance.</div><button class="text-button" data-view-link="pitch">Log pitches</button></div>`;
  const mins=state.logs.reduce((s,l)=>s+Number(l.duration),0),avg=state.logs.length?(state.logs.reduce((s,l)=>s+Number(l.rpe),0)/state.logs.length).toFixed(1):"—";
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
function renderReadiness(){Object.entries(FEELINGS).forEach(([key,choices])=>{document.querySelector(`#${key}-options`).innerHTML=choices.map(([label,value])=>`<button type="button" class="feeling-choice ${state.readiness[key]===value?"selected":""}" data-feeling="${key}" data-value="${value}">${feelingSvg(value,key==="soreness")}<span>${label}</span></button>`).join("")});document.querySelector("#readiness-detail-wrap").hidden=state.readiness.arm>1&&state.readiness.soreness<7;document.querySelector("#readiness-score").textContent=((+state.readiness.energy + +state.readiness.arm + (11- +state.readiness.soreness))/3).toFixed(1)}
function renderPlan(){
  const ws=state.workouts.filter(w=>w.phase===state.currentPhase);
  document.querySelector("#plan-list").innerHTML=ws.map(w=>{const vars=state.variations.filter(v=>v.blueprintId===w.id);return `<article class="workout-card"><div class="workout-day"><small>${w.dayType}</small><strong>${w.day}</strong></div><div><h3>${w.name}</h3><p><span class="tag">${w.phase}</span><span class="tag">${w.intensity}</span>${w.slots.join(" · ")}</p>${vars.map(v=>`<span class="variant-row"><button class="variant-chip" data-start-session="${v.id}">${v.name}</button>${canBuildTraining()?`<button class="variant-action" data-edit-variation="${v.id}">Edit</button><button class="variant-action" data-delete-variation="${v.id}">Delete</button>`:""}</span>`).join("")}</div><div class="card-actions"><button data-start-session="${w.id}">Start</button>${canBuildTraining()?`<button data-build-variation="${w.id}">Variation</button>`:""}</div></article>`}).join("");
}
function allSessions(){return [...state.workouts,...state.variations.map(v=>sessionFor(v.id))]}
function renderLog(){
  const s=document.querySelector("#log-workout"),selected=s.value;s.innerHTML=allSessions().map(w=>`<option value="${w.id}">${w.isVariation?"Variant":"Plan"}: ${w.name}</option>`).join("");if(selected&&sessionFor(selected))s.value=selected;document.querySelector("#log-date").value||=todayISO();renderLogDrills();
  document.querySelector("#history-list").innerHTML=state.logs.length?[...state.logs].reverse().map(l=>{const session=sessionFor(l.sessionId||l.workoutId);const done=l.drillResults?.filter(r=>r.completed).length;return `<div class="history-item"><div><h3>${session?.name||l.sessionName||"Workout"}</h3><strong>RPE ${l.rpe}</strong></div><p>${fmtDate(l.date)} · ${l.duration} min${done!=null?` · ${done}/${l.drillResults.length} items`:""}</p>${l.notes?`<p>${l.notes}</p>`:""}</div>`}).join(""):`<div class="empty-state">Your completed sessions will appear here.</div>`;
}
function renderLogDrills(){const session=sessionFor(document.querySelector("#log-workout").value)||allSessions()[0];document.querySelector("#log-drill-list").innerHTML=session?session.drillIds.map(id=>{const d=drillFor(id);return `<div class="log-drill"><label class="check-label"><input type="checkbox" data-complete-drill="${id}" checked><span><strong>${d.name}</strong><small>${d.dose}</small></span></label>${d.benchmark?`<label>${d.benchmark.label}<input data-benchmark-drill="${id}" type="number" step=".01" placeholder="${d.benchmark.unit}"></label>`:""}</div>`}).join(""):""}
function renderPitch(){document.querySelector("#pitch-date").value||=todayISO();const p=latestPitch(),status=document.querySelector("#pitch-status");if(!p)status.innerHTML=`<div class="pitch-status-card"><h3>Ready to begin tracking</h3><p>Stop throwing for sharp or next-day elbow/shoulder pain.</p></div>`;else{const r=restDays(p.pitches),next=addDays(p.date,r),restricted=todayISO()<next;status.innerHTML=`<div class="pitch-status-card ${restricted?"restricted":""}"><h3>${restricted?`No throwing until ${fmtDate(next)}`:"Rest requirement complete"}</h3><p>${p.pitches} pitches · ${r} rest day(s) · soreness ${p.soreness}/10</p></div>`}document.querySelector("#pitch-history").innerHTML=state.pitchLogs.length?[...state.pitchLogs].reverse().map(x=>`<div class="history-item"><div><h3>${x.setting}</h3><strong>${x.pitches} pitches</strong></div><p>${fmtDate(x.date)} · ${restDays(x.pitches)} rest day(s)</p></div>`).join(""):""}
function renderTests(){document.querySelector("#test-date").value||=todayISO();document.querySelector("#test-history").innerHTML=state.tests.length?[...state.tests].reverse().map(t=>`<div class="test-card"><h3>${fmtDate(t.date)}</h3><div class="test-metrics"><span><strong>${t.sprint||"—"}</strong>10 yd sec</span><span><strong>${t.jump||"—"}</strong>broad jump</span><span><strong>${t.pushups||"—"}</strong>push-ups</span><span><strong>${t.hang||"—"}</strong>hang sec</span><span><strong>${t.command!==""?Math.round(t.command/20*100)+"%":"—"}</strong>command</span><span><strong>${t.contact!==""?Math.round(t.contact/30*100)+"%":"—"}</strong>contact</span></div></div>`).join(""):`<div class="empty-state">Record a baseline assessment, then retest every 4-6 weeks.</div>`}
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
function isAdmin(){return Boolean(currentUser)&&(isSuperUser()||isDirector()||isCoach()||isParent())}
function isMasquerading(){return Boolean(actualUser&&currentUser&&actualUser.id!==currentUser.id)}
function canManageSecurity(){return isSuperUser(actualUser)&&!isMasquerading()}
function canManageOrganization(orgId){return isSuperUser()||isDirector()||organizationRoles.some(r=>r.userId===currentUser?.id&&r.organizationId===orgId&&r.active!==false)}
function canCreateProfile(){return isSuperUser()||isDirector()||headCoachTeamIds().length>0}
function canCreateTeam(){return isSuperUser()||isDirector()}
function canCreatePlayer(){return isDirector()||isParent()||headCoachTeamIds().length>0||assistantCoachTeamIds().length>0}
function canResetPins(){return canManageSecurity()}
function defaultOrg(){return organizations[0]}
function userOrgIds(userId=currentUser?.id){if(isSuperUser())return organizations.map(o=>o.id);return organizationRoles.filter(r=>r.userId===userId&&r.active!==false).map(r=>r.organizationId)}
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
  if(isSuperUser()||isDirector())return players.map(p=>p.id);
  const self=players.filter(p=>p.userId===currentUser.id).map(p=>p.id);
  const household=householdMemberships.filter(m=>m.userId===currentUser.id&&m.role==="parent"&&m.active!==false).flatMap(m=>householdMemberships.filter(x=>x.householdId===m.householdId&&x.playerId&&x.active!==false).map(x=>x.playerId));
  const coached=teamCoachRoles.filter(r=>r.userId===currentUser.id&&r.active!==false).flatMap(r=>playerTeamMemberships.filter(m=>m.teamId===r.teamId&&m.active!==false&&coachCanAccessPlayer(r,m.playerId)).map(m=>m.playerId));
  return [...new Set([...self,...household,...coached])];
}
function managedTeamIds(){
  if(isSuperUser()||isDirector())return teams.map(t=>t.id);
  const coached=coachTeamIds();
  const household=memberships.filter(m=>accessiblePlayerIds().includes(m.playerId)&&m.active).map(m=>m.teamId);
  return [...new Set([...coached,...household])];
}
function canSchedule(){
  return !isSuperUser()&&(isDirector()||isCoach());
}
function canScheduleTeam(teamId){
  return !isSuperUser()&&(isDirector()||teamCoachRoles.some(r=>r.userId===currentUser?.id&&r.teamId===teamId&&r.active!==false));
}
function canBuildTraining(){return !isSuperUser()&&(isDirector()||isCoach())}
function renderContext(){
  document.querySelector("#profile-name").textContent=currentUser?.name||"Profile";
  document.querySelector("#profile-roles").textContent=rolesFor().join(" · ");
  document.querySelector("#context-player").innerHTML=players.filter(p=>accessiblePlayerIds().includes(p.id)).map(p=>`<option value="${p.id}" ${p.id===currentPlayer?.id?"selected":""}>${p.name}</option>`).join("");
  document.querySelectorAll(".admin-nav").forEach(el=>el.hidden=!isAdmin());
  document.querySelectorAll('.bottom-nav [data-view-link="admin"]').forEach(el=>el.hidden=!isAdmin());
  document.querySelector("#equipment-form").hidden=!isAdmin();
  document.querySelector("#add-event").hidden=!canSchedule();
  document.querySelector("#alert-badge").textContent=alerts.filter(a=>!a.read&&alertVisible(a)).length||"";
  document.querySelector("#masquerade-banner").hidden=!isMasquerading();
  document.querySelector("#masquerade-banner").innerHTML=isMasquerading()?`Masquerading as ${currentUser.name}. Security settings are disabled. <button class="text-button" id="banner-exit-masquerade" type="button">Exit masquerade</button>`:"";
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
  document.querySelector("#schedule-conflicts").innerHTML=conflicts.map(c=>`<div class="workload-alert"><div><strong>Schedule conflict · ${fmtDate(c.date)}</strong>${c.items.map(i=>i.title).join(" + ")}</div><div class="conflict-actions"><button data-conflict-action="change" data-conflict-event="${c.items.at(-1).id}" data-conflict-date="${c.date}">Change</button><button data-conflict-action="keep" data-conflict-event="${c.items.at(-1).id}" data-conflict-date="${c.date}">Keep</button><button data-conflict-action="remove" data-conflict-event="${c.items.at(-1).id}" data-conflict-date="${c.date}">Remove</button></div></div>`).join("");
  document.querySelector("#agenda-list").innerHTML=upcomingEvents().map(e=>`<article class="agenda-item"><time>${fmtDate(e.occurrenceDate)}</time><div><span class="tag">${e.type}</span><h3>${e.title}</h3><p>${e.teamId?teams.find(t=>t.id===e.teamId)?.name:"Individual"} · ${e.workload} workload${e.repeat==="weekly"?" · Weekly":""}</p></div>${canSchedule()?`<button data-delete-event="${e.id}">Delete</button>`:""}</article>`).join("")||`<div class="empty-state">No upcoming events.</div>`;
}
function renderAdmin(){
  if(!currentUser)return;
  document.querySelector("#add-profile").hidden=!canCreateProfile();
  document.querySelector("#add-team").hidden=!canCreateTeam();
  document.querySelector("#add-player").hidden=!canCreatePlayer();
  document.querySelector("#assignment-form").closest("article").hidden=!isDirector();
  const playerIds=accessiblePlayerIds(),teamIds=managedTeamIds();
  const visibleUsers=isDirector()?users:users.filter(u=>u.id===currentUser.id||players.some(p=>playerIds.includes(p.id)&&p.userId===u.id));
  const visiblePlayers=players.filter(p=>playerIds.includes(p.id));
  const visibleTeams=teams.filter(t=>teamIds.includes(t.id));
  document.querySelector("#profile-list").innerHTML=visibleUsers.map(u=>`<div class="manage-row"><div><strong>${u.name}</strong><small>${rolesFor(u).map(r=>`${r}: ${ROLE_SCOPE[r]}`).join(" · ")}${u.lastLoginAt?` · Last login ${fmtDate(u.lastLoginAt.slice(0,10))}`:""} · ${u.loginCount||0} logins</small></div>${canResetPins()&&u.id!==currentUser.id?`<button data-reset-pin="${u.id}">Reset PIN</button>`:""}</div>`).join("");
  document.querySelector("#player-list").innerHTML=visiblePlayers.map(p=>`<div class="manage-row"><div><strong>${p.name}</strong><small>Priority: ${teams.find(t=>t.id===p.priorityTeamId)?.name||"None"}</small></div></div>`).join("");
  document.querySelector("#team-list").innerHTML=visibleTeams.map(t=>`<div class="manage-row"><div><strong>${t.name}</strong><small>${t.season} · ${memberships.filter(m=>m.teamId===t.id&&m.active).length} players</small></div><div>${isDirector()||canScheduleTeam(t.id)?`<button data-roster-team="${t.id}">${memberships.some(m=>m.teamId===t.id&&m.playerId===currentPlayer?.id)?"Remove selected":"Add selected"}</button><button data-priority-team="${t.id}">Make priority</button>`:""}</div></div>`).join("");
  document.querySelector("#assignment-user").innerHTML=users.filter(u=>!rolesFor(u).includes("Player")).map(u=>`<option value="${u.id}">${u.name}</option>`).join("");
  document.querySelector("#assignment-team").innerHTML=teams.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");
}
function alertVisible(a){
  if(isDirector())return true;
  if(a.userIds?.includes(currentUser?.id))return true;
  if(a.playerId&&players.find(p=>p.id===a.playerId)?.userId===currentUser?.id)return true;
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
function renderAdmin(){
  if(!currentUser)return;
  const playerIds=accessiblePlayerIds(),teamIds=managedTeamIds(),visibleTeams=teams.filter(t=>teamIds.includes(t.id));
  const visibleUsers=isDirector()?users:users.filter(u=>u.id===currentUser.id||players.some(p=>playerIds.includes(p.id)&&p.userId===u.id));
  const visiblePlayers=players.filter(p=>playerIds.includes(p.id));
  document.querySelector("#add-profile").hidden=!canCreateProfile();
  document.querySelector("#add-team").hidden=!canCreateTeam();
  document.querySelector("#add-player").hidden=!canCreatePlayer();
  document.querySelector("#assignment-form").closest("article").hidden=!(isSuperUser()||isDirector()||headCoachTeamIds().length);
  document.querySelector("#masquerade-form").closest("article").hidden=!isSuperUser(actualUser);
  document.querySelector("#profile-list").innerHTML=visibleUsers.map(u=>`<div class="manage-row"><div><strong>${u.name}</strong><small>${u.username||u.name} · ${rolesFor(u).map(r=>`${r}: ${ROLE_SCOPE[r]}`).join(" · ")||u.status||"pending"}${u.requestedRole?` · requested ${u.requestedRole}`:""}${u.lastLoginAt?` · Last login ${fmtDate(u.lastLoginAt.slice(0,10))}`:""} · ${u.loginCount||0} logins</small></div>${canResetPins()&&u.id!==actualUser?.id?`<button data-reset-pin="${u.id}">Reset PIN</button>`:""}</div>`).join("")||`<div class="empty-state">No visible profiles.</div>`;
  document.querySelector("#player-list").innerHTML=visiblePlayers.map(p=>`<div class="manage-row"><div><strong>${p.name}</strong><small>Priority: ${teams.find(t=>t.id===p.priorityTeamId)?.name||"None"} · Tags: ${playerTagValues(p.id).join(", ")||"none"}</small></div></div>`).join("")||`<div class="empty-state">No visible players.</div>`;
  document.querySelector("#team-list").innerHTML=visibleTeams.map(t=>{const head=teamCoachRoles.find(r=>r.teamId===t.id&&r.coachType==="head"&&r.active!==false);return `<div class="manage-row"><div><strong>${t.name}</strong><small>${t.season} · ${memberships.filter(m=>m.teamId===t.id&&m.active).length} players · Head: ${users.find(u=>u.id===head?.userId)?.name||"none"}</small></div><div>${isSuperUser()||isDirector()||canScheduleTeam(t.id)?`<button data-roster-team="${t.id}">${memberships.some(m=>m.teamId===t.id&&m.playerId===currentPlayer?.id)?"Remove selected":"Add selected"}</button><button data-priority-team="${t.id}">Make priority</button>`:""}</div></div>`}).join("")||`<div class="empty-state">No visible teams.</div>`;
  document.querySelector("#request-list").innerHTML=accessRequests.filter(requestVisible).map(r=>`<div class="manage-row"><div><strong>${users.find(u=>u.id===r.userId)?.name||"User"}</strong><small>${r.requestedRole} · ${r.status}</small></div><div><button data-approve-request="${r.id}">Approve</button><button data-deny-request="${r.id}">Deny</button></div></div>`).join("")||`<div class="empty-state">No pending requests.</div>`;
  document.querySelector("#assignment-user").innerHTML=users.filter(u=>!isSuperUser(u)).map(u=>`<option value="${u.id}">${u.name} (${rolesFor(u).join("/")||u.requestedRole||"pending"})</option>`).join("");
  document.querySelector("#assignment-team").innerHTML=visibleTeams.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");
  document.querySelector("#masquerade-user").innerHTML=users.filter(u=>!isSuperUser(u)&&u.active!==false).map(u=>`<option value="${u.id}">${u.name} (${rolesFor(u).join("/")||u.status})</option>`).join("");
}
function renderAlerts(){
  const visible=alerts.filter(alertVisible).sort((a,b)=>b.created.localeCompare(a.created));
  document.querySelector("#alert-list").innerHTML=visible.map(a=>`<article class="agenda-item ${a.read?"":"unread"}"><time>${fmtDate(a.created.slice(0,10))}</time><div><span class="tag">${a.type}</span><h3>${a.title}</h3><p>${a.message}</p>${a.status==="pending"&&isAdmin()?`<div class="conflict-actions"><button data-pain-decision="allow" data-alert-id="${a.id}">Allow this session</button><button data-pain-decision="remove" data-alert-id="${a.id}">Remove throwing</button></div>`:""}</div></article>`).join("")||`<div class="empty-state">No alerts.</div>`;
}
function renderProgress(){const mins=state.logs.reduce((s,l)=>s+Number(l.duration),0),recent=state.logs.slice(-8),bench=state.logs.flatMap(l=>l.drillResults||[]).filter(r=>r.benchmarkValue!=="");document.querySelector("#progress-stats").innerHTML=[["Sessions",state.logs.length,"completed"],["Training hours",(mins/60).toFixed(1),"time invested"],["Variants",state.variations.length,"saved and reusable"],["Benchmarks",bench.length,"results recorded"]].map(statCard).join("");document.querySelector("#effort-chart").innerHTML=recent.length?recent.map(l=>`<div class="chart-bar" style="--height:${l.rpe*10}%"><strong>${l.rpe}</strong><i style="height:${l.rpe*10}%"></i><small>${fmtDate(l.date)}</small></div>`).join(""):`<div class="empty-state">Log sessions to build your trend.</div>`;const counts=state.logs.flatMap(l=>l.drillResults||[]).reduce((a,r)=>{const c=drillFor(r.drillId)?.category||"Other";a[c]=(a[c]||0)+1;return a},{}),mx=Math.max(...Object.values(counts),1);document.querySelector("#category-progress").innerHTML=Object.entries(counts).map(([n,v])=>`<div class="category-item"><div><strong>${n}</strong><span>${v} completed</span></div><div class="category-bar"><i style="width:${v/mx*100}%"></i></div></div>`).join("")||`<div class="empty-state">No drill data yet.</div>`;document.querySelector("#takeaway-grid").innerHTML=state.logs.filter(l=>l.notes).slice(-3).reverse().map(l=>`<div class="takeaway"><small>${fmtDate(l.date)}</small><p>${l.notes}</p></div>`).join("")||`<div class="empty-state">Session notes will appear here.</div>`}

function switchView(v){document.querySelectorAll(".view").forEach(e=>e.classList.toggle("active",e.id===`${v}-view`));document.querySelectorAll(".nav-link,.bottom-nav button").forEach(e=>e.classList.toggle("active",e.dataset.viewLink===v));document.querySelector("#page-title").textContent={dashboard:"Dashboard",plan:"Training Plan",log:"Session Log",pitch:"Pitch Count",tests:"Monthly Tests",library:"Drill Library",equipment:"Equipment Shed",schedule:"Schedule",admin:"Manage",alerts:"Alerts",progress:"Progress"}[v];document.querySelector(".sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
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
  document.querySelector("#variation-slots").innerHTML=b.slots.map((slot,i)=>{const options=drillCatalog.filter(d=>d.category===slot&&d.phases.includes(b.phase));return `<label class="variation-slot"><span>${i+1}. ${slot} ${b.drillIds[i]===chosen[i]?"· Core default":""}</span><select data-variation-slot="${i}">${options.map(d=>`<option value="${d.id}" ${d.id===chosen[i]?"selected":""} ${(!isApproved(d)||(!eligibleToThrow()&&d.armLoad==="Throwing"))?"disabled":""}>${d.name}${recent.has(d.id)?" · recently used":""}${!hasEquipment(d)?" · missing equipment":""}${!isApproved(d)?" · approval needed":""}</option>`).join("")}</select></label>`}).join("");
  updateVariationWarnings();document.querySelector("#variation-dialog").showModal();
}
function selectedVariationSession(){const b=workoutFor(document.querySelector("#variation-blueprint-id").value);return {...b,name:document.querySelector("#variation-name").value,drillIds:[...document.querySelectorAll("[data-variation-slot]")].map(s=>s.value)}}
function updateVariationWarnings(){const box=document.querySelector("#variation-warnings"),session=selectedVariationSession(),issues=sessionIssues(session);box.innerHTML=issues.length?`<div class="builder-warnings">${issues.map(i=>`<p class="${i.type}">${i.text}</p>`).join("")}</div>`:`<div class="builder-ready">Ready to save. All selected drills are approved and equipment-ready.</div>`}
async function refreshRecords(){
  [users,players,teams,accessRecords,events,alerts,decisions,organizations,households,organizationRoles,teamCoachRoles,householdMemberships,playerTeamMemberships,playerTags,accessRequests]=await Promise.all(["users","players","teams","userPlayerAccess","events","alerts","decisions","organizations","households","organizationRoles","teamCoachRoles","householdMemberships","playerTeamMemberships","playerTags","accessRequests"].map(ClubhouseDB.all));
  const oldMemberships=await ClubhouseDB.all("teamMemberships"),oldTeamRoles=await ClubhouseDB.all("userTeamRoles");
  await migrateAssociations(oldMemberships,oldTeamRoles);
  [users,players,teams,accessRecords,events,alerts,decisions,organizations,households,organizationRoles,teamCoachRoles,householdMemberships,playerTeamMemberships,playerTags,accessRequests]=await Promise.all(["users","players","teams","userPlayerAccess","events","alerts","decisions","organizations","households","organizationRoles","teamCoachRoles","householdMemberships","playerTeamMemberships","playerTags","accessRequests"].map(ClubhouseDB.all));
  users=users.map(u=>({...u,username:u.username||u.name,roles:normalizeRoles(u),status:u.status||"active",loginCount:u.loginCount||0,lastLoginAt:u.lastLoginAt||null}));
  memberships=playerTeamMemberships;
  teamRoles=teamCoachRoles.map(r=>({id:r.id,userId:r.userId,teamId:r.teamId,coach:true,scheduler:true,coachType:r.coachType,specializations:r.specializations,active:r.active}));
}
async function migrateAssociations(oldMemberships=[],oldTeamRoles=[]){
  if(!organizations.length){
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
  for(const access of accessRecords.filter(a=>a.permission==="manage")){
    const parent=users.find(u=>u.id===access.userId);if(!parent)continue;
    let household=households.find(h=>h.ownerUserId===parent.id);
    if(!household){household={id:ClubhouseDB.id("household"),name:`${parent.name}'s Household`,ownerUserId:parent.id,equipment:[],active:true};await ClubhouseDB.put("households",household);households.push(household)}
    if(!householdMemberships.some(m=>m.householdId===household.id&&m.userId===parent.id)){const item={id:ClubhouseDB.id("hh"),householdId:household.id,userId:parent.id,role:"parent",active:true};await ClubhouseDB.put("householdMemberships",item);householdMemberships.push(item)}
    if(!householdMemberships.some(m=>m.householdId===household.id&&m.playerId===access.playerId)){const item={id:ClubhouseDB.id("hh"),householdId:household.id,playerId:access.playerId,role:"player",active:true};await ClubhouseDB.put("householdMemberships",item);householdMemberships.push(item)}
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
function setupScreen(){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">First-time setup</p><h1>Create your local clubhouse</h1><p>This device will store profiles, schedules, and training records. Existing training data will be copied into the first player.</p><form id="setup-form" class="form-stack"><label>Super User name<input id="setup-owner" required></label><label>Super User PIN<input id="setup-pin" type="password" inputmode="numeric" minlength="4" required></label><label>Initial player name<input id="setup-player" required></label><button class="primary-button">Create clubhouse</button></form>`;
  document.querySelector("#setup-form").onsubmit=async e=>{e.preventDefault();await ClubhouseDB.createSetup(document.querySelector("#setup-owner").value.trim(),document.querySelector("#setup-pin").value,document.querySelector("#setup-player").value.trim(),state);await refreshRecords();currentUser=users.find(u=>isSuperUser(u));await recordLogin(currentUser);localStorage.setItem(ACTIVE_USER_KEY,currentUser.id);await selectPlayer(players[0].id);hideAuth()};
}
function loginScreen(message=""){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">Local login</p><h1>Who's using Clubhouse?</h1>${message?`<p class="auth-error">${message}</p>`:""}<form id="login-form" class="form-stack"><label>Profile<select id="login-user">${users.filter(u=>u.active).map(u=>`<option value="${u.id}">${u.name} · ${u.roles.join("/")}</option>`).join("")}</select></label><label>PIN<input id="login-pin" type="password" inputmode="numeric" required></label><button class="primary-button">Enter clubhouse</button></form>`;
  document.querySelector("#login-form").onsubmit=async e=>{e.preventDefault();const user=users.find(u=>u.id===document.querySelector("#login-user").value);if(!await ClubhouseDB.verifyPin(document.querySelector("#login-pin").value,user)){loginScreen("That PIN did not match.");return}currentUser=user;await recordLogin(user);localStorage.setItem(ACTIVE_USER_KEY,user.id);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));hideAuth();roleHome()};
}
async function recordLogin(user){
  if(!user)return;
  user.roles=normalizeRoles(user);
  user.lastLoginAt=new Date().toISOString();
  user.loginCount=(user.loginCount||0)+1;
  await ClubhouseDB.put("users",user);
}
function roleHome(){if(highestRole()==="Player")switchView("dashboard");else if(isCoach()&&!isDirector())switchView("schedule");else switchView(alerts.some(a=>!a.read&&alertVisible(a))?"alerts":"dashboard")}
async function boot(){
  await ClubhouseDB.open();
  await ClubhouseDB.seedInitialSuperUser();
  await refreshRecords();
  const saved=users.find(u=>u.id===localStorage.getItem(ACTIVE_USER_KEY));
  if(!saved){showAuth();loginScreen();return}
  actualUser=saved;currentUser=users.find(u=>u.id===localStorage.getItem(EFFECTIVE_USER_KEY))||saved;await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));hideAuth();roleHome();
}
function loginScreen(message=""){
  document.querySelector("#auth-card").innerHTML=`<p class="eyebrow">Local login</p><h1>Clubhouse Login</h1>${message?`<p class="auth-error">${message}</p>`:""}<form id="login-form" class="form-stack"><label>Username<input id="login-username" autocomplete="username" required></label><label>PIN<input id="login-pin" type="password" inputmode="numeric" autocomplete="current-password" required></label><button class="primary-button">Enter clubhouse</button><button class="text-button" type="button" id="open-signup">Sign Up</button></form>`;
  document.querySelector("#open-signup").onclick=()=>openSignupDialog();
  document.querySelector("#login-form").onsubmit=async e=>{e.preventDefault();const name=document.querySelector("#login-username").value.trim().toLowerCase(),user=users.find(u=>(u.username||u.name).toLowerCase()===name&&u.active!==false);if(!user||!await ClubhouseDB.verifyPin(document.querySelector("#login-pin").value,user)){loginScreen("That username or PIN did not match.");return}actualUser=user;currentUser=user;await recordLogin(user);localStorage.setItem(ACTIVE_USER_KEY,user.id);localStorage.removeItem(EFFECTIVE_USER_KEY);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));hideAuth();roleHome()};
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
  req.status="approved";req.decidedBy=actualUser?.id;req.decidedAt=new Date().toISOString();await ClubhouseDB.put("accessRequests",req);
  await refreshRecords();renderAll();showToast("Request approved");
}
async function denyRequest(id){
  const req=accessRequests.find(r=>r.id===id);if(!req)return;
  req.status="denied";req.decidedBy=actualUser?.id;req.decidedAt=new Date().toISOString();await ClubhouseDB.put("accessRequests",req);
  await refreshRecords();renderAll();showToast("Request denied");
}
async function startMasquerade(userId){
  if(!isSuperUser(actualUser)||isMasquerading())return;
  const target=users.find(u=>u.id===userId&&!isSuperUser(u));if(!target)return;
  currentUser=target;localStorage.setItem(EFFECTIVE_USER_KEY,target.id);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));renderAll();
}
async function exitMasquerade(){
  if(!actualUser)return;
  currentUser=actualUser;localStorage.removeItem(EFFECTIVE_USER_KEY);await selectPlayer(localStorage.getItem(ACTIVE_PLAYER_KEY));renderAll();
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
  document.querySelector("#manage-fields").innerHTML=kind==="Profile"?`<input type="hidden" id="manage-kind" value="Profile"><label>Name<input id="manage-name" required></label><label>PIN<input id="manage-pin" type="password" inputmode="numeric" minlength="4" required></label><label>Role<select id="manage-role">${profileRoleOptions()}</select></label>`:kind==="Player"?`<input type="hidden" id="manage-kind" value="Player"><label>Player name<input id="manage-name" required></label><label>Player login PIN<input id="manage-player-pin" type="password" inputmode="numeric" minlength="4" value="0000" required></label><label>Linked parent<select id="manage-parent"><option value="">None</option>${users.filter(u=>rolesFor(u).includes("Parent")).map(u=>`<option value="${u.id}">${u.name}</option>`).join("")}</select></label>`:`<input type="hidden" id="manage-kind" value="Team"><label>Team name<input id="manage-name" required></label><label>Season<input id="manage-season" value="${new Date().getFullYear()}"></label>`;
  document.querySelector("#manage-dialog").showModal();
}

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
  const deleteEvent=e.target.closest("[data-delete-event]");if(deleteEvent&&confirm("Delete this event and all recurring occurrences?"))ClubhouseDB.remove("events",deleteEvent.dataset.deleteEvent).then(async()=>{await refreshRecords();renderAll()});
  const conflict=e.target.closest("[data-conflict-action]");if(conflict){ClubhouseDB.put("decisions",{id:ClubhouseDB.id("decision"),playerId:currentPlayer.id,eventId:conflict.dataset.conflictEvent,date:conflict.dataset.conflictDate,action:conflict.dataset.conflictAction,created:new Date().toISOString()}).then(async()=>{await refreshRecords();renderAll()});showToast(`Conflict marked: ${conflict.dataset.conflictAction}`)}
  const pain=e.target.closest("[data-pain-decision]");if(pain){const item=alerts.find(a=>a.id===pain.dataset.alertId);item.status=pain.dataset.painDecision==="allow"?"allowed":"removed";item.read=true;if(item.status==="removed"){state.throwingRemovedDate=todayISO();saveState()}ClubhouseDB.put("alerts",item);ClubhouseDB.put("decisions",{id:ClubhouseDB.id("decision"),alertId:item.id,action:item.status,userId:currentUser.id,created:new Date().toISOString()});renderAll()}
  const roster=e.target.closest("[data-roster-team]");if(roster){if(!currentPlayer){alert("Select a player before changing roster membership.");return}const existing=memberships.find(m=>m.teamId===roster.dataset.rosterTeam&&m.playerId===currentPlayer.id);(existing?ClubhouseDB.remove("playerTeamMemberships",existing.id):ClubhouseDB.put("playerTeamMemberships",{id:ClubhouseDB.id("membership"),teamId:roster.dataset.rosterTeam,playerId:currentPlayer.id,active:true,priority:memberships.some(m=>m.playerId===currentPlayer.id)?2:1})).then(async()=>{await refreshRecords();renderAll()})}
  const priority=e.target.closest("[data-priority-team]");if(priority){if(!currentPlayer){alert("Select a player before changing priority team.");return}currentPlayer.priorityTeamId=priority.dataset.priorityTeam;ClubhouseDB.put("players",currentPlayer).then(async()=>{await refreshRecords();renderAll()})}
  const reset=e.target.closest("[data-reset-pin]");if(reset){if(!canManageSecurity()){alert("Security settings are disabled while masquerading.");return}const pin=prompt("Enter the new local PIN (4+ characters):");if(pin)ClubhouseDB.hashPin(pin).then(async h=>{const user=users.find(u=>u.id===reset.dataset.resetPin);Object.assign(user,{pinSalt:h.salt,pinHash:h.hash});await ClubhouseDB.put("users",user);showToast("PIN reset")})}
  const approve=e.target.closest("[data-approve-request]");if(approve)approveRequest(approve.dataset.approveRequest);
  const deny=e.target.closest("[data-deny-request]");if(deny)denyRequest(deny.dataset.denyRequest);
});
document.addEventListener("change",e=>{if(e.target.matches("[data-variation-slot]"))updateVariationWarnings();if(e.target.id==="log-workout")renderLogDrills()});
document.querySelector("#menu-button").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.querySelector("#quick-log").onclick=()=>switchView("log");
document.querySelector("#profile-button").onclick=()=>{showAuth();loginScreen()};
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
document.querySelector("#add-profile").onclick=()=>openManage("Profile");document.querySelector("#add-player").onclick=()=>openManage("Player");document.querySelector("#add-team").onclick=()=>openManage("Team");
document.querySelector("#manage-form").onsubmit=async e=>{e.preventDefault();const kind=document.querySelector("#manage-kind").value,name=document.querySelector("#manage-name").value.trim();if(kind==="Profile"){if(!canCreateProfile()){alert("Only a Director or Super User can create profiles.");return}const role=document.querySelector("#manage-role").value;if(role==="Super User"&&!isSuperUser()){alert("Only a Super User can create another Super User.");return}const h=await ClubhouseDB.hashPin(document.querySelector("#manage-pin").value);await ClubhouseDB.put("users",{id:ClubhouseDB.id("user"),name,pinSalt:h.salt,pinHash:h.hash,owner:false,active:true,roles:[role],loginCount:0,lastLoginAt:null})}else if(kind==="Player"){if(!canCreatePlayer()){alert("Only a Director, Super User, or Parent can create player profiles.");return}const id=ClubhouseDB.id("player"),userId=ClubhouseDB.id("user"),h=await ClubhouseDB.hashPin(document.querySelector("#manage-player-pin").value);await ClubhouseDB.put("users",{id:userId,name,pinSalt:h.salt,pinHash:h.hash,owner:false,active:true,roles:["Player"],loginCount:0,lastLoginAt:null});await ClubhouseDB.put("players",{id,name,userId,active:true});await ClubhouseDB.put("playerData",{id,data:structuredClone(defaultState)});await ClubhouseDB.put("userPlayerAccess",{id:ClubhouseDB.id("access"),userId,playerId:id,permission:"self"});const parent=document.querySelector("#manage-parent").value||(!isDirector()&&isParent()?currentUser.id:"");if(parent)await ClubhouseDB.put("userPlayerAccess",{id:ClubhouseDB.id("access"),userId:parent,playerId:id,permission:"manage"})}else{if(!canCreateTeam()){alert("Only a Director or Super User can create teams.");return}await ClubhouseDB.put("teams",{id:ClubhouseDB.id("team"),name,season:document.querySelector("#manage-season").value,equipment:[]})}document.querySelector("#manage-dialog").close();await refreshRecords();renderAll()};
document.querySelector("#manage-form").onsubmit=async e=>{e.preventDefault();const kind=document.querySelector("#manage-kind").value,name=document.querySelector("#manage-name").value.trim(),orgId=defaultOrg()?.id;if(kind==="Profile"){if(!canCreateProfile()){alert("You do not have permission to create profiles.");return}const role=document.querySelector("#manage-role").value;if(role==="Super User"&&!canManageSecurity()){alert("Only a non-masquerading Super User can create another Super User.");return}const h=await ClubhouseDB.hashPin(document.querySelector("#manage-pin").value),user={id:ClubhouseDB.id("user"),username:name,name,pinSalt:h.salt,pinHash:h.hash,owner:false,active:true,status:"active",roles:[role],loginCount:0,lastLoginAt:null};await ClubhouseDB.put("users",user);if(role==="Director")await ClubhouseDB.put("organizationRoles",{id:ClubhouseDB.id("orgRole"),userId:user.id,organizationId:orgId,role:"director",active:true});if(role==="Parent"){const household={id:ClubhouseDB.id("household"),name:`${name}'s Household`,ownerUserId:user.id,equipment:[],active:true};await ClubhouseDB.put("households",household);await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,userId:user.id,role:"parent",active:true})}}else if(kind==="Player"){if(!canCreatePlayer()){alert("You do not have permission to create players.");return}const id=ClubhouseDB.id("player"),userId=ClubhouseDB.id("user"),h=await ClubhouseDB.hashPin(document.querySelector("#manage-player-pin").value);await ClubhouseDB.put("users",{id:userId,username:name,name,pinSalt:h.salt,pinHash:h.hash,owner:false,active:true,status:"active",roles:["Player"],loginCount:0,lastLoginAt:null});await ClubhouseDB.put("players",{id,name,userId,active:true});await ClubhouseDB.put("playerData",{id,data:structuredClone(defaultState)});const parent=document.querySelector("#manage-parent").value||(!isDirector()&&isParent()?currentUser.id:"");if(parent){let household=households.find(h=>h.ownerUserId===parent);if(!household){household={id:ClubhouseDB.id("household"),name:`${users.find(u=>u.id===parent)?.name||"Parent"}'s Household`,ownerUserId:parent,equipment:[],active:true};await ClubhouseDB.put("households",household)}await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,userId:parent,role:"parent",active:true});await ClubhouseDB.put("householdMemberships",{id:ClubhouseDB.id("hh"),householdId:household.id,playerId:id,role:"player",active:true})}}else{if(!canCreateTeam()){alert("You do not have permission to create teams.");return}await ClubhouseDB.put("teams",{id:ClubhouseDB.id("team"),name,season:document.querySelector("#manage-season").value,organizationId:orgId,equipment:[]})}document.querySelector("#manage-dialog").close();await refreshRecords();renderAll()};
document.querySelector("#assignment-form").onsubmit=async e=>{e.preventDefault();const userId=document.querySelector("#assignment-user").value,teamId=document.querySelector("#assignment-team").value,coachType=document.querySelector("#assignment-coach-type").value,specializations=[...document.querySelector("#assignment-specializations").selectedOptions].map(o=>o.value||o.textContent);if(!isSuperUser()&&!isDirector()&&!headCoachTeamIds().includes(teamId)){alert("Only Super Users, Directors, or this team's Head Coach can assign team coach roles.");return}if(coachType==="head"&&!isSuperUser()&&!isDirector()){alert("Only Super Users or Directors can assign a Head Coach.");return}const existingHead=teamCoachRoles.find(r=>r.teamId===teamId&&r.coachType==="head"&&r.active!==false&&r.userId!==userId);if(coachType==="head"&&existingHead){alert("Only one active Head Coach is allowed per team.");return}const existing=teamCoachRoles.find(r=>r.userId===userId&&r.teamId===teamId);const user=users.find(u=>u.id===userId);if(user&&!rolesFor(user).includes("Coach"))await ClubhouseDB.put("users",{...user,roles:[...new Set([...normalizeRoles(user),"Coach"])],status:"active"});await ClubhouseDB.put("teamCoachRoles",{id:existing?.id||ClubhouseDB.id("coachRole"),userId,teamId,coachType,permissions:{manageTeam:true,managePlans:true,manageParents:coachType==="head",manageAssistants:coachType==="head"},specializations:specializations.length?specializations:["All"],active:true});await refreshRecords();renderAll();showToast("Team coach role saved")};
document.querySelector("#signup-form").onsubmit=async e=>{e.preventDefault();const username=document.querySelector("#signup-username").value.trim(),name=document.querySelector("#signup-name").value.trim(),pin=document.querySelector("#signup-pin").value,requestedRole=document.querySelector("#signup-role").value;if(users.some(u=>(u.username||u.name).toLowerCase()===username.toLowerCase())){alert("That username is already taken.");return}const h=await ClubhouseDB.hashPin(pin),user={id:ClubhouseDB.id("user"),username,name,pinSalt:h.salt,pinHash:h.hash,active:true,status:"pending_association",roles:[],requestedRole,loginCount:0,lastLoginAt:null};await ClubhouseDB.put("users",user);await ClubhouseDB.put("accessRequests",{id:ClubhouseDB.id("request"),userId:user.id,requestedRole,status:"pending",created:new Date().toISOString()});document.querySelector("#signup-dialog").close();document.querySelector("#signup-form").reset();await refreshRecords();loginScreen("Account created. It is pending association approval.")};
document.querySelector("#masquerade-form").onsubmit=e=>{e.preventDefault();startMasquerade(document.querySelector("#masquerade-user").value)};
document.querySelector("#exit-masquerade").onclick=()=>exitMasquerade();
document.querySelector("#sign-out").onclick=()=>{localStorage.removeItem(ACTIVE_USER_KEY);localStorage.removeItem(EFFECTIVE_USER_KEY);actualUser=null;currentUser=null;showAuth();loginScreen()};
document.querySelector("#enable-notifications").onclick=async()=>{if("Notification"in window){const p=await Notification.requestPermission();showToast(`Notifications: ${p}`)}};
document.querySelector("#install-app").onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt=null}else showToast("Use your browser's Add to Home Screen option.")};
document.querySelector("#mark-alerts-read").onclick=async()=>{for(const a of alerts.filter(alertVisible)){a.read=true;await ClubhouseDB.put("alerts",a)}renderAll()};
document.querySelector("#variation-form").onsubmit=e=>{e.preventDefault();const session=selectedVariationSession(),issues=sessionIssues(session);if(issues.some(i=>i.type==="blocked"||i.type==="approval")){alert("Resolve blocked or unapproved drills before saving.");return}const id=document.querySelector("#variation-id").value||crypto.randomUUID(),v={id,blueprintId:session.id,name:session.name,drillIds:session.drillIds,created:todayISO()},i=state.variations.findIndex(x=>x.id===id);if(i>=0)state.variations[i]=v;else state.variations.push(v);saveState();document.querySelector("#variation-dialog").close();renderAll();showToast("Variation saved")};
document.querySelector("#start-one-time").onclick=()=>{const session=selectedVariationSession(),issues=sessionIssues(session);if(issues.some(i=>i.type==="blocked"||i.type==="approval")){alert("Resolve blocked or unapproved drills before starting.");return}const equipment=issues.find(i=>i.type==="equipment");if(equipment&&!confirm(`${equipment.text}\n\nContinue and acknowledge the missing equipment?`))return;const id=`one-time-${crypto.randomUUID()}`;state.variations.push({id,blueprintId:session.id,name:`${session.name} (one-time)`,drillIds:session.drillIds,created:todayISO(),oneTime:true});saveState();document.querySelector("#variation-dialog").close();renderAll();startSession(id)};
document.querySelector("#log-form").onsubmit=e=>{e.preventDefault();const sessionId=document.querySelector("#log-workout").value,session=sessionFor(sessionId),drillResults=[...document.querySelectorAll("[data-complete-drill]")].map(c=>({drillId:c.dataset.completeDrill,completed:c.checked,benchmarkValue:document.querySelector(`[data-benchmark-drill="${c.dataset.completeDrill}"]`)?.value||""}));state.logs.push({id:crypto.randomUUID(),sessionId,sessionName:session?.name,workoutId:session?.blueprintId||sessionId,date:document.querySelector("#log-date").value,duration:+document.querySelector("#log-duration").value,rpe:+document.querySelector("#log-rpe").value,metric:document.querySelector("#log-metric").value.trim(),notes:document.querySelector("#log-notes").value.trim(),drillResults});if(variationFor(sessionId)?.oneTime)state.variations=state.variations.filter(v=>v.id!==sessionId);saveState();e.target.reset();renderAll();showToast("Session and drill results logged")};
document.querySelector("#pitch-form").onsubmit=e=>{e.preventDefault();state.pitchLogs.push({id:crypto.randomUUID(),date:document.querySelector("#pitch-date").value,setting:document.querySelector("#pitch-setting").value,pitches:+document.querySelector("#pitch-count").value,innings:+document.querySelector("#pitch-innings").value||0,soreness:+document.querySelector("#pitch-soreness").value,notes:document.querySelector("#pitch-notes").value.trim()});saveState();e.target.reset();renderAll();showToast("Pitch count saved")};
document.querySelector("#test-form").onsubmit=e=>{e.preventDefault();const val=id=>document.querySelector(id).value;state.tests.push({id:crypto.randomUUID(),date:val("#test-date"),sprint:val("#test-sprint"),jump:val("#test-jump"),pushups:val("#test-pushups"),hang:val("#test-hang"),command:val("#test-command"),contact:val("#test-contact"),notes:val("#test-notes")});saveState();e.target.reset();renderAll();showToast("Assessment saved")};
document.querySelector("#page-eyebrow").textContent=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
document.querySelectorAll("#phase-filters .filter").forEach(b=>b.classList.toggle("active",b.dataset.phase===state.currentPhase));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e});
if("serviceWorker"in navigator&&location.protocol!=="file:")navigator.serviceWorker.register("./sw.js");
boot().catch(err=>{console.error(err);showAuth();document.querySelector("#auth-card").innerHTML="<h1>Unable to start Clubhouse</h1><p>Serve the app from localhost or HTTPS and reload.</p>"});
