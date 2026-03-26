let schedule = {};

function parseSubjects(input){
    return input.split(",").map(s=>s.trim());
}

function createWeeklyTime(mon,tue,wed,thu,fri,sat,sun){
    return {
        Monday:mon,Tuesday:tue,Wednesday:wed,
        Thursday:thu,Friday:fri,Saturday:sat,Sunday:sun
    };
}

function addWeakPriority(subjects, weak){
    if(subjects.includes(weak)) subjects.push(weak);
    return subjects;
}

function generateDaily(subjects, hours){

    let shuffled = [...subjects].sort(() => Math.random() - 0.5);

    let plan = [];
    let i = 0;

    while(hours > 0){
        plan.push({
            subject: shuffled[i % shuffled.length],
            duration: Math.min(1, hours)
        });

        hours--;
        i++;
    }

    return plan;
}


function createSchedule(subjects, weak, weeklyTime){
    subjects = addWeakPriority(subjects, weak);

    for(let day in weeklyTime){
        schedule[day] = generateDaily(subjects, weeklyTime[day]);
    }
}


// ALWAYS LOAD FROM STORAGE FIRST
function loadSchedule(){
    let saved = localStorage.getItem("schedule");
    if(saved){
        schedule = JSON.parse(saved);
    }
}

// CALL IT AUTOMATICALLY
loadSchedule();

