let schedule = {};
let completedTasks = {};

// ---------- CORE ----------

function parseSubjects(input){
    return input.split(",").map(s=>s.trim());
}

function createWeeklyTime(mon,tue,wed,thu,fri,sat,sun){
    return {
        Monday:mon, Tuesday:tue, Wednesday:wed,
        Thursday:thu, Friday:fri, Saturday:sat, Sunday:sun
    };
}

function addWeakPriority(subjects, weak){
    if(subjects.includes(weak)) subjects.push(weak);
    return subjects;
}

function generateDaily(subjects, hours){
    let plan=[], i=0;

    while(hours>0){
        plan.push({
            subject: subjects[i % subjects.length],
            duration: Math.min(1, hours)
        });
        hours--; i++;
    }

    return plan;
}

function createSchedule(subjects, weak, weeklyTime){
    subjects = addWeakPriority(subjects, weak);

    for(let day in weeklyTime){
        schedule[day] = generateDaily(subjects, weeklyTime[day]);
    }
}

// ---------- UI ----------

function generate(){
    let subjects = parseSubjects(document.getElementById("subjects").value);
    let weak = document.getElementById("weak").value;

    let weeklyTime = createWeeklyTime(
        +mon.value,+tue.value,+wed.value,
        +thu.value,+fri.value,+sat.value,+sun.value
    );

    createSchedule(subjects, weak, weeklyTime);

    localStorage.setItem("schedule", JSON.stringify(schedule));

    showToday();
}

function goToSchedule(){
    window.location.href = "schedule.html";
}

// ---------- DATE ----------

function getDay(date){
    return new Date(date).toLocaleDateString("en-US",{weekday:"long"});
}

function checkDate(){
    schedule = JSON.parse(localStorage.getItem("schedule")) || {};

    let day = getDay(date.value);
    let tasks = schedule[day] || [];

    let div = document.getElementById("dateResult");
    div.innerHTML = "";

    tasks.forEach(t=>{
        div.innerHTML += `<p>${t.subject} - ${t.duration} hr</p>`;
    });
}

// ---------- TODO ----------

function showToday(){
    let today = new Date().toLocaleDateString("en-US",{weekday:"long"});
    let tasks = schedule[today] || [];

    let div = document.getElementById("todo");
    div.innerHTML = "";

    let dateStr = new Date().toISOString().split("T")[0];

    tasks.forEach(t=>{
        div.innerHTML += `
        <div>
            <input type="checkbox" onclick="markDone('${dateStr}','${t.subject}')">
            ${t.subject} - ${t.duration} hr
        </div>
        `;
    });
}

function markDone(date, subject){
    if(!completedTasks[date]) completedTasks[date] = [];
    completedTasks[date].push(subject);
}
