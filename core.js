let schedule = {};

// -------------------- SUBJECTS --------------------
function parseSubjects(input){
    return input.split(",").map(s => s.trim()).filter(s => s);
}

function addWeakPriority(subjects, weak){
    if(weak && subjects.includes(weak)){
        subjects.push(weak); // extra weight
    }
    return subjects;
}

function fetchTasksByDate(date){
    return new Promise((resolve)=>{

        let saved = localStorage.getItem("schedule");
        let data = saved ? JSON.parse(saved) : {};

        resolve(data[date] || []);
    });
}


// -------------------- GENERATION --------------------
function generateDaily(subjects, hours){
    let main = subjects.filter(s => s !== "Revision" && s !== "Test");
    let low = subjects.filter(s => s === "Revision" || s === "Test");

    let plan = [];
    while(hours > 0){
        let pool = Math.random() < 0.8 ? main : [...main, ...low];
        let subject = pool[Math.floor(Math.random() * pool.length)];
        plan.push({subject: subject, duration: 1});
        hours--;
    }
    return plan;
}

// -------------------- 1 YEAR SCHEDULE --------------------
function createSchedule(subjects, weak, weeklyTime, options){
    schedule = {};

    subjects = addWeakPriority(subjects, weak);

    // Keep these as subjects in daily tasks
    if(options.revision) subjects.push("Revision");
    if(options.test) subjects.push("Test");

    let start = new Date();

    for(let i=0; i<365; i++){
        let date = new Date();
        date.setDate(start.getDate() + i);

        let dayName = date.toLocaleDateString("en-US",{weekday:"long"});
        let dateKey = date.toISOString().split("T")[0];

        let hours = weeklyTime[dayName] || 0;

        schedule[dateKey] = generateDaily(subjects, hours);
    }

    saveSchedule(); // save immediately
}

// -------------------- STORAGE --------------------
function loadSchedule(){
    let saved = localStorage.getItem("schedule");
    if(saved){
        schedule = JSON.parse(saved);
    }
}

function saveSchedule(){
    localStorage.setItem("schedule", JSON.stringify(schedule));
}

loadSchedule();
