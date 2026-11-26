const STORAGE_KEY = "campus_competition_data_v3";

const DEFAULT_EVENTS = [
  { id: "ev-1", name: "Hackathon Sprint", category: "Tech", date: "Dec 12", maxTeams: 4 },
  { id: "ev-2", name: "UI/UX Design Jam", category: "Design", date: "Dec 14", maxTeams: 5 },
  { id: "ev-3", name: "Code & Quiz Bowl", category: "General", date: "Dec 16", maxTeams: 6 }
];

const DEFAULT_TEAMS = [
  {
    id: 1,
    eventId: "ev-1",
    teamName: "Byte Builders",
    leaderName: "Rohan Verma",
    members: 3,
    status: "Confirmed"
  },
  {
    id: 2,
    eventId: "ev-2",
    teamName: "Pixel Craft",
    leaderName: "Ananya Nair",
    members: 2,
    status: "Confirmed"
  }
];

let events = [];
let teams = [];

function saveToStorage() {
  const data = {
    events: events,
    teams: teams
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    const parsed = JSON.parse(saved);
    events = parsed.events;
    teams = parsed.teams;
  } else {
    events = DEFAULT_EVENTS;
    teams = DEFAULT_TEAMS;
    saveToStorage();
  }
}

function findEventById(eventId) {
  for (let i = 0; i < events.length; i++) {
    if (events[i].id === eventId) {
      return events[i];
    }
  }
  return null;
}

function countConfirmedTeams(eventId) {
  let count = 0;
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].eventId === eventId && teams[i].status === "Confirmed") {
      count = count + 1;
    }
  }
  return count;
}

function renderStats() {
  let confirmedTotal = 0;
  let waitlistedTotal = 0;

  for (let i = 0; i < teams.length; i++) {
    if (teams[i].status === "Confirmed") {
      confirmedTotal = confirmedTotal + 1;
    } else {
      waitlistedTotal = waitlistedTotal + 1;
    }
  }

  document.getElementById("stat-events").textContent = events.length;
  document.getElementById("stat-confirmed").textContent = confirmedTotal;
  document.getElementById("stat-waitlisted").textContent = waitlistedTotal;
}

function renderEventSelect() {
  const select = document.getElementById("event-select");
  const currentChoice = select.value;
  select.innerHTML = "";

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const option = document.createElement("option");
    option.value = ev.id;
    option.textContent = ev.name + " [" + ev.category + "] (" + ev.date + ")";
    select.appendChild(option);
  }

  if (currentChoice !== "") {
    select.value = currentChoice;
  }
}

function renderEventsList() {
  const listDiv = document.getElementById("events-list");
  const selectedCategory = document.getElementById("category-filter").value;
  listDiv.innerHTML = "";

  let shownCount = 0;

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];

    if (selectedCategory === "All" || ev.category === selectedCategory) {
      shownCount = shownCount + 1;
      const confirmed = countConfirmedTeams(ev.id);
      let percent = Math.round((confirmed / ev.maxTeams) * 100);
      if (percent > 100) {
        percent = 100;
      }

      const barClass = confirmed >= ev.maxTeams ? "progress-fill progress-full" : "progress-fill";

      const item = document.createElement("div");
      item.className = "event-item";
      item.innerHTML =
        '<div class="event-top">' +
          '<span class="event-title">' + ev.name + "</span>" +
          '<span class="event-date">' + ev.category + " | " + ev.date + "</span>" +
        "</div>" +
        '<div class="event-meta">Confirmed Slots: ' + confirmed + " / " + ev.maxTeams + "</div>" +
        '<div class="progress-track"><div class="' + barClass + '" style="width: ' + percent + '%"></div></div>';

      listDiv.appendChild(item);
    }
  }

  if (shownCount === 0) {
    listDiv.innerHTML = '<div class="event-meta">No competitions in this category.</div>';
  }
}

function renderTeamsTable() {
  const tbody = document.getElementById("teams-tbody");
  const countBadge = document.getElementById("team-count");
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("category-filter").value;

  tbody.innerHTML = "";
  let visibleCount = 0;

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const ev = findEventById(team.eventId);
    const eventName = ev ? ev.name : "Event";
    const eventCategory = ev ? ev.category : "";

    const matchCategory = selectedCategory === "All" || eventCategory === selectedCategory;
    const matchTeam = team.teamName.toLowerCase().indexOf(query) !== -1;
    const matchLeader = team.leaderName.toLowerCase().indexOf(query) !== -1;
    const matchEvent = eventName.toLowerCase().indexOf(query) !== -1;

    if (matchCategory && (query === "" || matchTeam || matchLeader || matchEvent)) {
      visibleCount = visibleCount + 1;
      const statusClass =
        team.status === "Confirmed" ? "status-pill status-confirmed" : "status-pill status-waitlisted";

      const row = document.createElement("tr");
      row.innerHTML =
        "<td><strong>" + team.teamName + "</strong><br><small>Lead: " + team.leaderName + "</small></td>" +
        "<td>" + eventName + "</td>" +
        "<td>" + team.members + "</td>" +
        '<td><span class="' + statusClass + '">' + team.status + "</span></td>" +
        '<td><button type="button" class="btn btn-danger" onclick="removeTeam(' + team.id + ')">Remove</button></td>';

      tbody.appendChild(row);
    }
  }

  countBadge.textContent = visibleCount + " Teams";

  if (visibleCount === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No matching teams found.</td></tr>';
  }
}

function showMessage(text, typeClass) {
  const box = document.getElementById("message-box");
  box.textContent = text;
  box.className = "message-box " + typeClass;
}

function handleRegistration(event) {
  event.preventDefault();

  const eventId = document.getElementById("event-select").value;
  const teamName = document.getElementById("team-name").value.trim();
  const leaderName = document.getElementById("leader-name").value.trim();
  const members = parseInt(document.getElementById("team-size").value, 10);

  if (teamName === "" || leaderName === "" || isNaN(members) || members < 1) {
    showMessage("Please fill out all fields properly.", "msg-error");
    return;
  }

  const selectedEvent = findEventById(eventId);
  const confirmedCount = countConfirmedTeams(eventId);

  let status = "Confirmed";
  if (selectedEvent && confirmedCount >= selectedEvent.maxTeams) {
    status = "Waitlisted";
  }

  const newTeam = {
    id: Date.now(),
    eventId: eventId,
    teamName: teamName,
    leaderName: leaderName,
    members: members,
    status: status
  };

  teams.push(newTeam);
  saveToStorage();
  renderAll();

  document.getElementById("register-form").reset();
  document.getElementById("team-size").value = "3";

  if (status === "Confirmed") {
    showMessage("Team registered with Confirmed status!", "msg-success");
  } else {
    showMessage("Event slots are full — team added to Waitlist.", "msg-waitlist");
  }
}

function removeTeam(teamId) {
  const updatedTeams = [];
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].id !== teamId) {
      updatedTeams.push(teams[i]);
    }
  }
  teams = updatedTeams;
  saveToStorage();
  renderAll();
  showMessage("Team registration removed.", "msg-success");
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  events = DEFAULT_EVENTS;
  teams = DEFAULT_TEAMS;
  document.getElementById("search-input").value = "";
  document.getElementById("category-filter").value = "All";
  saveToStorage();
  renderAll();
  showMessage("Reset back to default sample data.", "msg-success");
}

function renderAll() {
  renderStats();
  renderEventSelect();
  renderEventsList();
  renderTeamsTable();
}

loadFromStorage();
renderAll();

document.getElementById("register-form").addEventListener("submit", handleRegistration);
document.getElementById("reset-btn").addEventListener("click", resetDemoData);
document.getElementById("search-input").addEventListener("input", renderTeamsTable);
document.getElementById("category-filter").addEventListener("change", function () {
  renderEventsList();
  renderTeamsTable();
});
