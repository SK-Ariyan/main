var schedule = {};

// -------------------- SUBJECTS --------------------
function parseSubjects(input){
    return input.split(",").map(s => s.trim()).filter(s => s);
}

function addWeakPriority(subjects, weak){
    if(weak && subjects.includes(weak)){
        subjects.push(weak);
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

// -------------------- DAILY PLAN --------------------
function generateDaily(subjects, hours){
    let plan = [];

    while(hours > 0){
        let subject = subjects[Math.floor(Math.random() * subjects.length)];
        plan.push({subject: subject, duration: 1});
        hours--;
    }

    return plan;
}

function createSchedule(subjects, weak, weeklyTime){
    schedule = {};

    // give extra weight to weak subject
    subjects = addWeakPriority(subjects, weak);

    let start = new Date();

    for(let i = 0; i < 365; i++){
        let date = new Date(start);
        date.setDate(start.getDate() + i);

        // get day name (Monday, Tuesday...)
        let dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        // format date key (YYYY-MM-DD)
        let dateKey = date.toISOString().split("T")[0];

        // get hours for that day
        let hours = weeklyTime[dayName] || 0;

        // generate tasks
        schedule[dateKey] = generateDaily(subjects, hours);
    }
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
