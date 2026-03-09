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

      <!-- Dynamic Styled Labels -->
      <div class="flex flex-wrap gap-2">
        ${element.labels
          .map((label) => {
            let badgeStyle = "badge-outline";

            if (label.toLowerCase().includes("enhancement")) {
              badgeStyle = "badge-soft badge-success";
            } else if (label.toLowerCase().includes("documentation")) {
              badgeStyle = "badge-soft badge-info";
            } else if (label.toLowerCase().includes("bug")) {
              badgeStyle = "badge-soft badge-error";
            } else if (label.toLowerCase().includes("help")) {
              badgeStyle = "badge-soft badge-warning";
            } else if (label.toLowerCase().includes("good first issue")) {
              badgeStyle = "badge-soft badge-primary";
            }

            return `
              <span class="badge ${badgeStyle} text-xs px-3 py-2">
                ${label}
              </span>
              `;
          })
          .join("")}
      </div>

      <hr>

      <div>
        <p class="text-[14px]">${element.author}</p>
        <p class="text-[14px]">${element.createdAt}</p>
      </div>
      
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

// Open Modal (Single Issue API)
async function openModal(issue) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issue.id}`,
  );

  const data = await res.json();

  const singleIssue = data.data;

  modalTitle.innerText = singleIssue.title;
  modalDescription.innerText = singleIssue.description;
  modalStatus.innerText = singleIssue.status;
  modalPriority.innerText = singleIssue.priority;
  modalAuthor.innerText = singleIssue.author?.name || singleIssue.author;
  modalAssignee.innerText = singleIssue.assignee?.name || singleIssue.assignee;
  modalDate.innerText = new Date(singleIssue.createdAt).toLocaleDateString();

  issueModal.showModal();
  console.log(singleIssue);
}

loadCards();
