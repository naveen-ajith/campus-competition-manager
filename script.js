const STORAGE_KEY = "campus_competition_portal_v1";

const INITIAL_EVENTS = [
  {
    id: "evt-1",
    title: "CodeSprint 24H Hackathon",
    category: "Coding & Tech",
    schedule: "Dec 06 · Uniopolis Block 34",
    minTeamSize: 2,
    maxTeamSize: 4,
    maxTeams: 15
  },
  {
    id: "evt-2",
    title: "ZeroDay CTF Challenge",
    category: "Cybersecurity",
    schedule: "Dec 07 · Cyber Lab 102",
    minTeamSize: 1,
    maxTeamSize: 3,
    maxTeams: 12
  },
  {
    id: "evt-3",
    title: "Valorant Campus Cup",
    category: "Esports",
    schedule: "Dec 08 · Arena Hall B",
    minTeamSize: 5,
    maxTeamSize: 5,
    maxTeams: 16
  },
  {
    id: "evt-4",
    title: "RoboWars Arena",
    category: "Robotics & Design",
    schedule: "Dec 09 · Main Courtyard",
    minTeamSize: 2,
    maxTeamSize: 5,
    maxTeams: 8
  },
  {
    id: "evt-5",
    title: "UI/UX Designathon",
    category: "Robotics & Design",
    schedule: "Dec 10 · Design Studio 201",
    minTeamSize: 1,
    maxTeamSize: 2,
    maxTeams: 10
  }
];

const INITIAL_TEAMS = [
  {
    passId: "REG-2026-101",
    eventId: "evt-1",
    teamName: "StackOverflowed",
    leaderName: "Rohan Verma",
    leaderRegId: "12604112",
    leaderEmail: "rohan.verma@lpu.in",
    status: "Confirmed",
    members: [
      { name: "Ananya Nair", regId: "12604189" },
      { name: "Devansh Gill", regId: "12604205" }
    ]
  },
  {
    passId: "REG-2026-102",
    eventId: "evt-1",
    teamName: "NullPointers",
    leaderName: "Karthik Menon",
    leaderRegId: "12605110",
    leaderEmail: "karthik.m@lpu.in",
    status: "Confirmed",
    members: [
      { name: "Meera Krishnan", regId: "12605144" }
    ]
  },
  {
    passId: "REG-2026-103",
    eventId: "evt-2",
    teamName: "RootShell",
    leaderName: "Aditya Kulkarni",
    leaderRegId: "12606735",
    leaderEmail: "aditya.k@lpu.in",
    status: "Confirmed",
    members: [
      { name: "Nikhil Das", regId: "12606790" }
    ]
  },
  {
    passId: "REG-2026-104",
    eventId: "evt-2",
    teamName: "PacketHounds",
    leaderName: "Simran Kaur",
    leaderRegId: "12606811",
    leaderEmail: "simran.kaur@lpu.in",
    status: "Confirmed",
    members: []
  },
  {
    passId: "REG-2026-105",
    eventId: "evt-3",
    teamName: "SpikeRush Five",
    leaderName: "Vikramaditya Rao",
    leaderRegId: "12607301",
    leaderEmail: "vikram.rao@lpu.in",
    status: "Confirmed",
    members: [
      { name: "Pranav Joshi", regId: "12607312" },
      { name: "Sahil Bansal", regId: "12607319" },
      { name: "Tushar Negi", regId: "12607325" },
      { name: "Harshvardhan Singh", regId: "12607340" }
    ]
  },
  {
    passId: "REG-2026-106",
    eventId: "evt-3",
    teamName: "SiteB Rushers",
    leaderName: "Farhan Ahmed",
    leaderRegId: "12607402",
    leaderEmail: "farhan.a@lpu.in",
    status: "Pending",
    members: [
      { name: "Zoya Khan", regId: "12607410" },
      { name: "Rishabh Tiwari", regId: "12607418" },
      { name: "Kabir Malhotra", regId: "12607429" },
      { name: "Arjun Pillai", regId: "12607433" }
    ]
  },
  {
    passId: "REG-2026-107",
    eventId: "evt-4",
    teamName: "Torque Titans",
    leaderName: "Deepak Yadav",
    leaderRegId: "12608014",
    leaderEmail: "deepak.y@lpu.in",
    status: "Confirmed",
    members: [
      { name: "Manav Chawla", regId: "12608022" },
      { name: "Sneha Reddy", regId: "12608055" }
    ]
  },
  {
    passId: "REG-2026-108",
    eventId: "evt-5",
    teamName: "GridCraft",
    leaderName: "Diya Chatterjee",
    leaderRegId: "12609104",
    leaderEmail: "diya.c@lpu.in",
    status: "Confirmed",
    members: [
      { name: "Ishaan Kapoor", regId: "12609119" }
    ]
  }
];

let state = {
  events: [],
  teams: [],
  activeCategory: "All",
  eventSearch: "",
  teamSearch: "",
  filterEventId: "All",
  filterStatus: "All",
  latestReceipt: null
};

// Load saved data or seed initial demo data
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state.events = Array.isArray(parsed.events) ? parsed.events : INITIAL_EVENTS.slice();
      state.teams = Array.isArray(parsed.teams) ? parsed.teams : INITIAL_TEAMS.slice();
      return;
    } catch (err) {
      showAlert("Saved data was unreadable. Loaded default demo data.", "error");
    }
  }
  state.events = INITIAL_EVENTS.slice();
  state.teams = INITIAL_TEAMS.slice();
  saveState();
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      events: state.events,
      teams: state.teams
    })
  );
}

function resetDemoData() {
  state.events = INITIAL_EVENTS.slice();
  state.teams = INITIAL_TEAMS.slice();
  state.activeCategory = "All";
  state.eventSearch = "";
  state.teamSearch = "";
  state.filterEventId = "All";
  state.filterStatus = "All";
  saveState();
  document.getElementById("event-search").value = "";
  document.getElementById("team-search").value = "";
  syncCategoryButtons();
  renderAll();
  showAlert("Demo data reset to default competitions and teams.", "success");
}

function showAlert(message, type = "info") {
  const banner = document.getElementById("banner-alert");
  banner.textContent = message;
  banner.className = "alert-banner";
  if (type === "success") banner.classList.add("success");
  if (type === "error") banner.classList.add("error");

  clearTimeout(showAlert._timer);
  showAlert._timer = setTimeout(() => {
    banner.className = "alert-banner hidden";
  }, 3500);
}

// Helper: count teams registered for an event
function countTeamsForEvent(eventId) {
  let count = 0;
  for (let i = 0; i < state.teams.length; i++) {
    if (state.teams[i].eventId === eventId) {
      count++;
    }
  }
  return count;
}

function findEventById(eventId) {
  for (let i = 0; i < state.events.length; i++) {
    if (state.events[i].id === eventId) {
      return state.events[i];
    }
  }
  return null;
}

function generatePassId() {
  const num = Math.floor(100 + Math.random() * 900);
  return "REG-2026-" + num;
}

function isValidRegId(value) {
  return /^\d{8}$/.test(value.trim());
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// View switching
function switchView(viewId) {
  const views = document.querySelectorAll(".view");
  const tabs = document.querySelectorAll(".tab-btn");

  for (let i = 0; i < views.length; i++) {
    views[i].classList.toggle("active", views[i].id === viewId);
  }
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.toggle("active", tabs[i].dataset.view === viewId);
  }
}

function syncCategoryButtons() {
  const buttons = document.querySelectorAll(".filter-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.toggle("active", buttons[i].dataset.category === state.activeCategory);
  }
}

// Render Hero & Dashboard KPIs
function renderStats() {
  const totalEvents = state.events.length;
  const totalTeams = state.teams.length;

  let confirmedCount = 0;
  let waitlistedCount = 0;
  let totalParticipants = 0;

  for (let i = 0; i < state.teams.length; i++) {
    const team = state.teams[i];
    if (team.status === "Confirmed") confirmedCount++;
    if (team.status === "Waitlisted") waitlistedCount++;
    totalParticipants += 1 + team.members.length;
  }

  let totalCapacity = 0;
  let fullEvents = 0;
  for (let i = 0; i < state.events.length; i++) {
    const ev = state.events[i];
    totalCapacity += ev.maxTeams;
    if (countTeamsForEvent(ev.id) >= ev.maxTeams) {
      fullEvents++;
    }
  }

  const openSlots = Math.max(0, totalCapacity - totalTeams);
  const utilization = totalCapacity > 0 ? Math.round((totalTeams / totalCapacity) * 100) : 0;

  document.getElementById("hero-total-events").textContent = totalEvents;
  document.getElementById("hero-total-teams").textContent = totalTeams;
  document.getElementById("hero-open-slots").textContent = openSlots;

  document.getElementById("stat-events").textContent = totalEvents;
  document.getElementById("stat-events-sub").textContent = fullEvents + " full";

  document.getElementById("stat-teams").textContent = totalTeams;
  document.getElementById("stat-teams-sub").textContent =
    confirmedCount + " confirmed · " + waitlistedCount + " waitlisted";

  document.getElementById("stat-participants").textContent = totalParticipants;

  document.getElementById("stat-utilization").textContent = utilization + "%";
  document.getElementById("stat-utilization-sub").textContent =
    totalTeams + " / " + totalCapacity + " slots filled";
}

// Render Events Grid
function renderEvents() {
  const grid = document.getElementById("events-grid");
  const query = state.eventSearch.trim().toLowerCase();

  const filteredEvents = state.events.filter((ev) => {
    const matchesCategory = state.activeCategory === "All" || ev.category === state.activeCategory;
    const matchesSearch =
      query === "" ||
      ev.title.toLowerCase().includes(query) ||
      ev.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filteredEvents.length === 0) {
    grid.innerHTML =
      '<div class="event-card"><p class="event-meta">No competitions match the selected filter or search term.</p></div>';
    return;
  }

  let html = "";
  for (let i = 0; i < filteredEvents.length; i++) {
    const ev = filteredEvents[i];
    const registered = countTeamsForEvent(ev.id);
    const isFull = registered >= ev.maxTeams;
    const isFillingFast = !isFull && registered / ev.maxTeams >= 0.8;
    const pct = Math.min(100, Math.round((registered / ev.maxTeams) * 100));

    let badgeClass = "status-open";
    let badgeText = "Open";
    if (isFull) {
      badgeClass = "status-full";
      badgeText = "Full";
    } else if (isFillingFast) {
      badgeClass = "status-filling";
      badgeText = "Filling Fast";
    }

    const teamSizeText =
      ev.minTeamSize === ev.maxTeamSize
        ? ev.maxTeamSize + " Members"
        : ev.minTeamSize + "–" + ev.maxTeamSize + " Members";

    const actionLabel = isFull ? "Join Waitlist" : "Register Team";

    html += `
      <article class="event-card">
        <div>
          <div class="event-card-top">
            <span class="category-label">${escapeHtml(ev.category)}</span>
            <span class="status-badge ${badgeClass}">${badgeText}</span>
          </div>
          <h3 class="event-title">${escapeHtml(ev.title)}</h3>
          <p class="event-meta">${escapeHtml(ev.schedule)}</p>
          <p class="event-meta">Team Size: <span class="mono">${teamSizeText}</span></p>
          <div class="capacity-block">
            <div class="capacity-row">
              <span>Capacity</span>
              <span class="mono">${registered} / ${ev.maxTeams} Teams</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${isFull ? "full" : ""}" style="width: ${pct}%;"></div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary open-reg-btn" data-event-id="${ev.id}">
          ${actionLabel}
        </button>
      </article>
    `;
  }

  grid.innerHTML = html;
}

// Sync Event Dropdown in Directory Filter
function renderEventFilterOptions() {
  const select = document.getElementById("filter-event-select");
  const currentVal = state.filterEventId;

  let optionsHtml = '<option value="All">All Competitions</option>';
  for (let i = 0; i < state.events.length; i++) {
    const ev = state.events[i];
    optionsHtml += `<option value="${ev.id}">${escapeHtml(ev.title)}</option>`;
  }

  select.innerHTML = optionsHtml;
  select.value = currentVal;
}

// Render Teams Roster Table
function renderDirectoryTable() {
  const tbody = document.getElementById("roster-tbody");
  const query = state.teamSearch.trim().toLowerCase();

  const filteredTeams = state.teams.filter((team) => {
    const matchesEvent = state.filterEventId === "All" || team.eventId === state.filterEventId;
    const matchesStatus = state.filterStatus === "All" || team.status === state.filterStatus;

    let matchesQuery = query === "";
    if (!matchesQuery) {
      const ev = findEventById(team.eventId);
      const eventTitle = ev ? ev.title.toLowerCase() : "";
      const inBasic =
        team.passId.toLowerCase().includes(query) ||
        team.teamName.toLowerCase().includes(query) ||
        team.leaderName.toLowerCase().includes(query) ||
        team.leaderRegId.toLowerCase().includes(query) ||
        eventTitle.includes(query);

      let inMembers = false;
      for (let m = 0; m < team.members.length; m++) {
        if (
          team.members[m].name.toLowerCase().includes(query) ||
          team.members[m].regId.toLowerCase().includes(query)
        ) {
          inMembers = true;
          break;
        }
      }
      matchesQuery = inBasic || inMembers;
    }

    return matchesEvent && matchesStatus && matchesQuery;
  });

  if (filteredTeams.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="muted-note">No registered teams match the current search or filters.</td></tr>';
    return;
  }

  let rowsHtml = "";
  for (let i = 0; i < filteredTeams.length; i++) {
    const team = filteredTeams[i];
    const ev = findEventById(team.eventId);
    const eventName = ev ? ev.title : "Unknown Event";

    let statusClass = "status-pending";
    if (team.status === "Confirmed") statusClass = "status-confirmed";
    if (team.status === "Waitlisted") statusClass = "status-waitlisted";

    let membersHtml = "";
    if (team.members.length === 0) {
      membersHtml = '<span class="muted-note small-text">Solo / Leader only</span>';
    } else {
      for (let m = 0; m < team.members.length; m++) {
        const mem = team.members[m];
        membersHtml += `<span class="member-chip">${escapeHtml(mem.name)} <span class="mono">(${escapeHtml(mem.regId)})</span></span>`;
      }
    }

    rowsHtml += `
      <tr>
        <td class="mono">${escapeHtml(team.passId)}</td>
        <td><strong>${escapeHtml(team.teamName)}</strong></td>
        <td>${escapeHtml(eventName)}</td>
        <td>
          <div>${escapeHtml(team.leaderName)}</div>
          <div class="mono muted-note small-text">${escapeHtml(team.leaderRegId)}</div>
        </td>
        <td>${membersHtml}</td>
        <td><span class="status-badge ${statusClass}">${escapeHtml(team.status)}</span></td>
        <td>
          <div class="action-group">
            <button type="button" class="btn btn-secondary btn-sm edit-team-btn" data-pass-id="${team.passId}">Edit</button>
            <button type="button" class="btn btn-danger-outline btn-sm delete-team-btn" data-pass-id="${team.passId}">Remove</button>
          </div>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = rowsHtml;
}

function renderAll() {
  renderStats();
  renderEvents();
  renderEventFilterOptions();
  renderDirectoryTable();
}

// Modal Controls
function openModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}

function clearErrors(ids) {
  for (let i = 0; i < ids.length; i++) {
    const el = document.getElementById(ids[i]);
    if (el) el.textContent = "";
  }
}

// Member Row Helpers (used in both Register and Edit modals)
function createMemberRowHtml(nameVal = "", regIdVal = "") {
  return `
    <div class="member-row">
      <input type="text" class="input-control member-name" placeholder="Teammate full name" value="${escapeAttr(nameVal)}" />
      <input type="text" class="input-control mono member-reg" placeholder="8-digit Reg ID" value="${escapeAttr(regIdVal)}" />
      <button type="button" class="btn btn-secondary btn-sm remove-member-btn">Remove</button>
    </div>
  `;
}

function collectAndValidateMembers(containerId, eventObj, errorElId) {
  const rows = document.querySelectorAll("#" + containerId + " .member-row");
  const errorEl = document.getElementById(errorElId);
  const members = [];

  for (let i = 0; i < rows.length; i++) {
    const nameInput = rows[i].querySelector(".member-name");
    const regInput = rows[i].querySelector(".member-reg");
    const name = nameInput.value.trim();
    const regId = regInput.value.trim();

    if (!name && !regId) {
      errorEl.textContent = "Fill in both teammate name and 8-digit Reg ID, or remove the empty row.";
      return null;
    }
    if (!name) {
      errorEl.textContent = "Teammate name is required.";
      return null;
    }
    if (!isValidRegId(regId)) {
      errorEl.textContent = "Each teammate Reg ID must be exactly 8 digits.";
      return null;
    }
    members.push({ name, regId });
  }

  const totalSize = 1 + members.length;
  if (eventObj) {
    if (totalSize < eventObj.minTeamSize) {
      errorEl.textContent =
        "This competition requires at least " + eventObj.minTeamSize + " member(s) including the leader.";
      return null;
    }
    if (totalSize > eventObj.maxTeamSize) {
      errorEl.textContent =
        "This competition allows at most " + eventObj.maxTeamSize + " member(s) including the leader.";
      return null;
    }
  }

  errorEl.textContent = "";
  return members;
}

// Open Registration Modal
function openRegistrationModal(eventId) {
  const ev = findEventById(eventId);
  if (!ev) return;

  clearErrors([
    "err-reg-team-name",
    "err-reg-leader-name",
    "err-reg-leader-id",
    "err-reg-leader-email",
    "err-reg-members"
  ]);

  document.getElementById("register-form").reset();
  document.getElementById("reg-event-id").value = ev.id;
  document.getElementById("reg-modal-title").textContent = "Register Team — " + ev.title;

  const registered = countTeamsForEvent(ev.id);
  const isFull = registered >= ev.maxTeams;
  const notice = document.getElementById("reg-capacity-notice");

  if (isFull) {
    notice.className = "notice-box warn";
    notice.textContent =
      "This event is at full capacity (" +
      registered +
      "/" +
      ev.maxTeams +
      " teams). Submitting now will place your team on the Waitlist.";
    document.getElementById("reg-submit-btn").textContent = "Join Waitlist";
  } else {
    notice.className = "notice-box";
    notice.textContent =
      "Capacity: " +
      registered +
      "/" +
      ev.maxTeams +
      " teams registered · Team size: " +
      ev.minTeamSize +
      "–" +
      ev.maxTeamSize +
      " members (leader counts as 1).";
    document.getElementById("reg-submit-btn").textContent = "Confirm Registration";
  }

  document.getElementById("reg-size-hint").textContent =
    "Allowed total team size (including leader): " + ev.minTeamSize + " to " + ev.maxTeamSize + ".";

  const membersList = document.getElementById("reg-members-list");
  membersList.innerHTML = "";
  const neededExtra = Math.max(0, ev.minTeamSize - 1);
  for (let i = 0; i < neededExtra; i++) {
    membersList.insertAdjacentHTML("beforeend", createMemberRowHtml());
  }

  openModal("register-modal");
}

// Handle New Team Registration Submit
function handleRegisterSubmit(e) {
  e.preventDefault();

  const eventId = document.getElementById("reg-event-id").value;
  const ev = findEventById(eventId);
  if (!ev) return;

  const teamName = document.getElementById("reg-team-name").value.trim();
  const leaderName = document.getElementById("reg-leader-name").value.trim();
  const leaderRegId = document.getElementById("reg-leader-id").value.trim();
  const leaderEmail = document.getElementById("reg-leader-email").value.trim();

  clearErrors([
    "err-reg-team-name",
    "err-reg-leader-name",
    "err-reg-leader-id",
    "err-reg-leader-email",
    "err-reg-members"
  ]);

  let hasError = false;

  if (!teamName) {
    document.getElementById("err-reg-team-name").textContent = "Please enter a team name.";
    hasError = true;
  } else {
    for (let i = 0; i < state.teams.length; i++) {
      if (
        state.teams[i].eventId === eventId &&
        state.teams[i].teamName.toLowerCase() === teamName.toLowerCase()
      ) {
        document.getElementById("err-reg-team-name").textContent =
          "A team with this name is already registered for this competition.";
        hasError = true;
        break;
      }
    }
  }

  if (!leaderName) {
    document.getElementById("err-reg-leader-name").textContent = "Please enter the team leader's name.";
    hasError = true;
  }

  if (!isValidRegId(leaderRegId)) {
    document.getElementById("err-reg-leader-id").textContent = "Registration ID must be 8 digits.";
    hasError = true;
  }

  if (!isValidEmail(leaderEmail)) {
    document.getElementById("err-reg-leader-email").textContent = "Please enter a valid email address.";
    hasError = true;
  }

  const members = collectAndValidateMembers("reg-members-list", ev, "err-reg-members");
  if (!members) {
    hasError = true;
  }

  if (hasError) return;

  const currentCount = countTeamsForEvent(ev.id);
  const assignedStatus = currentCount >= ev.maxTeams ? "Waitlisted" : "Confirmed";

  const newTeam = {
    passId: generatePassId(),
    eventId: ev.id,
    teamName,
    leaderName,
    leaderRegId,
    leaderEmail,
    status: assignedStatus,
    members
  };

  state.teams.push(newTeam);
  state.latestReceipt = { team: newTeam, event: ev };
  saveState();
  renderAll();

  closeModal("register-modal");
  openReceiptModal(newTeam, ev);
  showAlert("Team \"" + teamName + "\" saved with status: " + assignedStatus + ".", "success");
}

function openReceiptModal(team, ev) {
  let rosterLines = `<div class="receipt-line"><span>Leader</span><span class="mono">${escapeHtml(team.leaderName)} (${escapeHtml(team.leaderRegId)})</span></div>`;
  for (let i = 0; i < team.members.length; i++) {
    const m = team.members[i];
    rosterLines += `<div class="receipt-line"><span>Member ${i + 2}</span><span class="mono">${escapeHtml(m.name)} (${escapeHtml(m.regId)})</span></div>`;
  }

  document.getElementById("receipt-content").innerHTML = `
    <div class="receipt-line"><strong>Pass ID</strong><strong class="mono">${escapeHtml(team.passId)}</strong></div>
    <div class="receipt-line"><span>Status</span><strong>${escapeHtml(team.status)}</strong></div>
    <div class="receipt-line"><span>Competition</span><span>${escapeHtml(ev.title)}</span></div>
    <div class="receipt-line"><span>Team Name</span><strong>${escapeHtml(team.teamName)}</strong></div>
    ${rosterLines}
  `;

  openModal("receipt-modal");
}

// Edit & Delete Team Records
function openEditTeamModal(passId) {
  let target = null;
  for (let i = 0; i < state.teams.length; i++) {
    if (state.teams[i].passId === passId) {
      target = state.teams[i];
      break;
    }
  }
  if (!target) return;

  clearErrors([
    "err-edit-team-name",
    "err-edit-leader-name",
    "err-edit-leader-id",
    "err-edit-members"
  ]);

  document.getElementById("edit-team-id").value = target.passId;
  document.getElementById("edit-team-name").value = target.teamName;
  document.getElementById("edit-leader-name").value = target.leaderName;
  document.getElementById("edit-leader-id").value = target.leaderRegId;
  document.getElementById("edit-status-select").value = target.status;

  const list = document.getElementById("edit-members-list");
  list.innerHTML = "";
  for (let i = 0; i < target.members.length; i++) {
    list.insertAdjacentHTML(
      "beforeend",
      createMemberRowHtml(target.members[i].name, target.members[i].regId)
    );
  }

  openModal("edit-team-modal");
}

function handleEditTeamSubmit(e) {
  e.preventDefault();

  const passId = document.getElementById("edit-team-id").value;
  let teamIndex = -1;
  for (let i = 0; i < state.teams.length; i++) {
    if (state.teams[i].passId === passId) {
      teamIndex = i;
      break;
    }
  }
  if (teamIndex === -1) return;

  const currentTeam = state.teams[teamIndex];
  const ev = findEventById(currentTeam.eventId);

  const teamName = document.getElementById("edit-team-name").value.trim();
  const leaderName = document.getElementById("edit-leader-name").value.trim();
  const leaderRegId = document.getElementById("edit-leader-id").value.trim();
  const status = document.getElementById("edit-status-select").value;

  clearErrors([
    "err-edit-team-name",
    "err-edit-leader-name",
    "err-edit-leader-id",
    "err-edit-members"
  ]);

  let hasError = false;
  if (!teamName) {
    document.getElementById("err-edit-team-name").textContent = "Team name is required.";
    hasError = true;
  }
  if (!leaderName) {
    document.getElementById("err-edit-leader-name").textContent = "Leader name is required.";
    hasError = true;
  }
  if (!isValidRegId(leaderRegId)) {
    document.getElementById("err-edit-leader-id").textContent = "Leader Reg ID must be 8 digits.";
    hasError = true;
  }

  const members = collectAndValidateMembers("edit-members-list", ev, "err-edit-members");
  if (!members) {
    hasError = true;
  }

  if (hasError) return;

  state.teams[teamIndex] = {
    ...currentTeam,
    teamName,
    leaderName,
    leaderRegId,
    status,
    members
  };

  saveState();
  renderAll();
  closeModal("edit-team-modal");
  showAlert("Updated record for \"" + teamName + "\".", "success");
}

function handleDeleteTeam(passId) {
  const nextTeams = [];
  let removedName = "";

  for (let i = 0; i < state.teams.length; i++) {
    if (state.teams[i].passId === passId) {
      removedName = state.teams[i].teamName;
    } else {
      nextTeams.push(state.teams[i]);
    }
  }

  if (!removedName) return;

  state.teams = nextTeams;
  saveState();
  renderAll();
  showAlert("Removed team \"" + removedName + "\" and updated event capacity.", "success");
}

// Add New Competition Event
function handleAddEventSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("new-event-title").value.trim();
  const category = document.getElementById("new-event-category").value;
  const maxTeams = parseInt(document.getElementById("new-event-capacity").value, 10);
  const minTeamSize = parseInt(document.getElementById("new-event-min").value, 10);
  const maxTeamSize = parseInt(document.getElementById("new-event-max").value, 10);
  const schedule = document.getElementById("new-event-schedule").value.trim();

  clearErrors([
    "err-new-event-title",
    "err-new-event-capacity",
    "err-new-event-min",
    "err-new-event-max",
    "err-new-event-schedule"
  ]);

  let hasError = false;
  if (!title) {
    document.getElementById("err-new-event-title").textContent = "Competition title is required.";
    hasError = true;
  }
  if (isNaN(maxTeams) || maxTeams < 1) {
    document.getElementById("err-new-event-capacity").textContent = "Enter a capacity of at least 1 team.";
    hasError = true;
  }
  if (isNaN(minTeamSize) || minTeamSize < 1) {
    document.getElementById("err-new-event-min").textContent = "Minimum size must be at least 1.";
    hasError = true;
  }
  if (isNaN(maxTeamSize) || maxTeamSize < 1) {
    document.getElementById("err-new-event-max").textContent = "Maximum size must be at least 1.";
    hasError = true;
  } else if (!isNaN(minTeamSize) && maxTeamSize < minTeamSize) {
    document.getElementById("err-new-event-max").textContent = "Max team size cannot be less than min team size.";
    hasError = true;
  }
  if (!schedule) {
    document.getElementById("err-new-event-schedule").textContent = "Date and venue are required.";
    hasError = true;
  }

  if (hasError) return;

  const newEvent = {
    id: "evt-" + Date.now(),
    title,
    category,
    schedule,
    minTeamSize,
    maxTeamSize,
    maxTeams
  };

  state.events.push(newEvent);
  saveState();
  renderAll();
  closeModal("add-event-modal");
  document.getElementById("add-event-form").reset();
  showAlert("Added competition \"" + title + "\".", "success");
}

// Basic HTML escaping to prevent broken markup
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("'", "&#39;");
}

// Attach Event Listeners
function bindEvents() {
  const tabs = document.querySelectorAll(".tab-btn");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", () => {
      switchView(tabs[i].dataset.view);
    });
  }

  document.getElementById("browse-events-btn").addEventListener("click", () => {
    document.getElementById("events-section").scrollIntoView({ behavior: "smooth" });
  });

  const catButtons = document.querySelectorAll(".filter-btn");
  for (let i = 0; i < catButtons.length; i++) {
    catButtons[i].addEventListener("click", () => {
      state.activeCategory = catButtons[i].dataset.category;
      syncCategoryButtons();
      renderEvents();
    });
  }

  document.getElementById("event-search").addEventListener("input", (e) => {
    state.eventSearch = e.target.value;
    renderEvents();
  });

  document.getElementById("events-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".open-reg-btn");
    if (btn) {
      openRegistrationModal(btn.dataset.eventId);
    }
  });

  document.getElementById("team-search").addEventListener("input", (e) => {
    state.teamSearch = e.target.value;
    renderDirectoryTable();
  });

  document.getElementById("filter-event-select").addEventListener("change", (e) => {
    state.filterEventId = e.target.value;
    renderDirectoryTable();
  });

  document.getElementById("filter-status-select").addEventListener("change", (e) => {
    state.filterStatus = e.target.value;
    renderDirectoryTable();
  });

  document.getElementById("roster-tbody").addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-team-btn");
    if (editBtn) {
      openEditTeamModal(editBtn.dataset.passId);
      return;
    }
    const delBtn = e.target.closest(".delete-team-btn");
    if (delBtn) {
      handleDeleteTeam(delBtn.dataset.passId);
    }
  });

  document.getElementById("add-member-btn").addEventListener("click", () => {
    document.getElementById("reg-members-list").insertAdjacentHTML("beforeend", createMemberRowHtml());
  });

  document.getElementById("edit-add-member-btn").addEventListener("click", () => {
    document.getElementById("edit-members-list").insertAdjacentHTML("beforeend", createMemberRowHtml());
  });

  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-member-btn");
    if (removeBtn) {
      const row = removeBtn.closest(".member-row");
      if (row) row.remove();
    }

    const closeBtn = e.target.closest("[data-close-modal]");
    if (closeBtn) {
      closeModal(closeBtn.dataset.closeModal);
    }
  });

  document.getElementById("register-form").addEventListener("submit", handleRegisterSubmit);
  document.getElementById("edit-team-form").addEventListener("submit", handleEditTeamSubmit);
  document.getElementById("add-event-form").addEventListener("submit", handleAddEventSubmit);

  document.getElementById("open-add-event-btn").addEventListener("click", () => {
    openModal("add-event-modal");
  });

  document.getElementById("copy-pass-btn").addEventListener("click", () => {
    if (!state.latestReceipt) return;
    const passId = state.latestReceipt.team.passId;
    navigator.clipboard.writeText(passId).then(
      () => showAlert("Copied Pass ID: " + passId, "success"),
      () => showAlert("Pass ID: " + passId, "info")
    );
  });

  document.getElementById("print-receipt-btn").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("reset-data-btn").addEventListener("click", resetDemoData);
}

// Initialize App
loadState();
bindEvents();
renderAll();