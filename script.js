let allIssues = [];

// Modal variable
const issueModal = document.getElementById("issue-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalStatus = document.getElementById("modal-status");
const modalPriority = document.getElementById("modal-priority");
const modalAuthor = document.getElementById("modal-author");
const modalDate = document.getElementById("modal-date");
const modalAssignee = document.getElementById("modal-assignee");

// common vaiable
const cardsContainer = document.getElementById("cards-container");
const loadingSpinner = document.getElementById("loadingSpinner");
const totalIssues = document.getElementById("total-issues");
const searchInput = document.getElementById("search-input");

// Show Loading
function showLoading() {
  loadingSpinner.classList.remove("hidden");
  cardsContainer.innerHTML = "";
}

// Hide Loading
function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

// Load Cards
async function loadCards() {
  showLoading();

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  hideLoading();
  allIssues = data.data;
  displayCards(allIssues);
  updateCounters(allIssues);
}

// Display Cards
function displayCards(cards) {
  cardsContainer.innerHTML = "";
  cards.forEach((element) => {
    const singleCards = document.createElement("div");
    const borderColor =
      element.status === "open"
        ? "border-l-4 border-green-500"
        : "border-l-4 border-purple-500";
    singleCards.className = "h-full";
    singleCards.innerHTML = `
    <div class="card bg-white shadow-lg p-4 space-y-3 h-full cursor-pointer ${borderColor}">
    <div class="flex justify-between">
      <img src="./assets/${
        element.status === "closed" ? "Closed-Status.png" : "Open-Status.png"
      }">
        <div class="badge badge-soft badge-secondary">
        ${element.priority}
        </div>
        </div>
<div class="space-y-3">
      <h2 class="text-lg font-semibold">
        ${element.title}
        </h2>
<p class="line-clamp-2 text-sm">
        ${element.description}
        </p>
</div>
<div class="flex gap-2">
<div class="badge badge-outline bg-pink-100 badge-secondary">
        BUG
        </div>
<div class="badge badge-outline badge-warning bg-yellow-100">
        HELP WANTED
        </div>
</div>
<hr>
<p class="text-[14px]">${element.author}</p>
<p class="text-[14px]">${element.createdAt}</p>
</div>
    
    `;

    singleCards.addEventListener("click", function () {
      openModal(element);
    });

    cardsContainer.appendChild(singleCards);
  });
}

// ALL
document.getElementById("primary-btn").addEventListener("click", function () {
  setActiveButton("primary-btn");
  displayCards(allIssues);
  updateCounters(allIssues);
});

// OPEN
document.getElementById("opened-btn").addEventListener("click", function () {
  setActiveButton("opened-btn");
  const openedIssues = allIssues.filter((issue) => issue.status === "open");
  displayCards(openedIssues);
  updateCounters(openedIssues);
});

// CLOSED
document.getElementById("closed-btn").addEventListener("click", function () {
  setActiveButton("closed-btn");
  const closedIssues = allIssues.filter((issue) => issue.status === "closed");
  displayCards(closedIssues);
  updateCounters(closedIssues);
});

// Active Button
function setActiveButton(id) {
  document
    .querySelectorAll("#toggle-btn button")
    .forEach((btn) => btn.classList.remove("btn-primary"));
  document.getElementById(id).classList.add("btn-primary");
}

// Counter Function
function updateCounters(cards) {
  totalIssues.innerText = `${cards.length} Issues`;
}

// Search Issue
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  const filteredIssues = allIssues.filter((issue) =>
    issue.title.toLowerCase().includes(searchText),
  );
  displayCards(filteredIssues);
  updateCounters(filteredIssues);
});

// Open Modal
function openModal(issue) {
  modalTitle.innerText = issue.title;
  modalDescription.innerText = issue.description;
  modalStatus.innerText = issue.status;
  modalPriority.innerText = issue.priority;
  modalAuthor.innerText = issue.author;
  modalAssignee.innerText = issue.assignee;
  modalDate.innerText = new Date(issue.createdAt).toLocaleDateString();

  issueModal.showModal();
}

loadCards();
