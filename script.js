let allIssues = [];
const cardsContainer = document.getElementById("cards-container");
const loadingSpinner = document.getElementById("loadingSpinner");

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
  console.log(allIssues.map(issue => issue.status));
  displayCards(allIssues);
}

// Display Cards
function displayCards(cards) {
  cardsContainer.innerHTML = "";
  cards.forEach((element) => {
    // console.log(element);
    const singleCards = document.createElement("div");
    singleCards.className = "card bg-white shadow-lg p-4 space-y-3 rounded-lg";
    singleCards.innerHTML = `
         <div id="card" class="card bg-white p-4 space-y-3 border border-green-500 h-full">
            <div class="flex justify-between">
              <img src="./assets/Open-Status.png" alt="" />
              <div class="badge badge-soft badge-secondary">${element.priority}</div>
            </div>
            <div class = "space-y-3">
              <h2 class = "text-lg font-semibold">${element.title}</h2>
              <p class="line-clamp-2 text-sm">
                ${element.description}
              </p>
            </div>
            <div class="flex gap-2">
              <div class="badge badge-outline bg-pink-100 badge-secondary">BUG</div>
              <div class="badge badge-outline badge-warning bg-yellow-100">HELP WANTED</div>
            </div>
            <hr>
            <p class ="text-[14px]" id="author">${element.author}</p>
            <p class ="text-[14px]" id="date">${element.createdAt}</p>
          </div>`;

    cardsContainer.appendChild(singleCards);
  });
}
loadCards();

// ALL
document.getElementById("primary-btn").addEventListener("click", function () {
  setActiveButton("primary-btn");
  displayCards(allIssues);
});

// OPEN
document.getElementById("opened-btn").addEventListener("click", function () {

  setActiveButton("opened-btn");

  const openedIssues = allIssues.filter(
    issue => issue.status === "open"
  );

  displayCards(openedIssues);

});


// Closed
document.getElementById("closed-btn").addEventListener("click", function () {

  setActiveButton("closed-btn");

  const closedIssues = allIssues.filter(
    issue => issue.status === "closed"
  );

  displayCards(closedIssues);

});


function setActiveButton(id){

  document
    .querySelectorAll("#toggle-btn button")
    .forEach(btn => btn.classList.remove("btn-primary"));

  document
    .getElementById(id)
    .classList.add("btn-primary");

}