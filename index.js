const body = document.querySelector("body");
const themeToggle = document.querySelector(".toggle-theme");
const input = document.querySelector("input");
const mainContentContainer = document.querySelector(".main-content");
const listContainer = document.querySelector(".main-list-container");
const list = document.querySelector(".main-list");
const listFooter = document.querySelector(".main-list-footer");
const itemsCompletedSpan = document.querySelector(".items-completed");
const makePluralSpan = document.querySelector(".make-plural");
const stateButtonsContainer = document.querySelector(".main-view-states");
const allButton = document.querySelector(".all");

let id = 0;

const toggleTheme = () => {
  body.classList.toggle("dark-theme");

  if (body.classList.contains("dark-theme")) {
    themeToggle.src = "images/icon-sun.svg";
    themeToggle.alt = "Toggle light mode";
  } else {
    themeToggle.src = "images/icon-moon.svg";
    themeToggle.alt = "Toggle dark mode";
  }
};

const createListItem = (inputValue) => {
  const listItem = document.createElement("li");
  listItem.classList.add("main-list-item");

  const item = document.createElement("label");
  item.htmlFor = id;
  item.textContent = inputValue;
  item.classList.add("item");

  // Used for accessibility
  const hiddenCheckbox = document.createElement("input");
  hiddenCheckbox.type = "checkbox";
  hiddenCheckbox.id = id;
  hiddenCheckbox.classList.add("hidden-checkbox");

  // Visible checkbox
  const checkbox = document.createElement("div");
  checkbox.classList.add("checkbox");
  checkbox.addEventListener("click", () =>
    toggleComplete(listItem, item, checkbox)
  );

  // Delete X icon
  const svgString = `<svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>`;
  const svgContainer = document.createElement("div");
  svgContainer.innerHTML = svgString;
  const deleteIcon = svgContainer.querySelector(".delete-icon");
  deleteIcon.addEventListener("click", () => removeItem(listItem));

  listItem.append(hiddenCheckbox, checkbox, item, svgContainer);
  id++;

  return listItem;
};

const toggleComplete = (listItem, item, checkbox) => {
  item.classList.toggle("crossed-out");
  checkbox.classList.toggle("complete");
  listItem.classList.toggle("complete");

  if (checkbox.innerHTML === "") {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>`;
    checkbox.innerHTML = svgString;
  } else {
    checkbox.innerHTML = "";
  }

  updateFooter();
};

const updateFooter = () => {
  const completedListItems = document.querySelectorAll(
    ".main-list-item.complete"
  );

  if (completedListItems.length > 0) {
    itemsCompletedSpan.textContent = completedListItems.length;
    listFooter.style.display = "flex";
    if (completedListItems.length > 1) {
      makePluralSpan.textContent = "s";
    } else {
      makePluralSpan.textContent = "";
    }
  } else {
    itemsCompletedSpan.textContent = "";
    makePluralSpan.textContent = "";
    listFooter.style.display = "none";
  }
};

const removeItem = (listItem) => {
  if (list.children.length === 1) {
    mainContentContainer.style.display = "none";
    id = 0;
  }

  listItem.remove();

  updateFooter();
};

const addItem = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    const inputValue = e.target.value;
    const newListItem = createListItem(inputValue);
    list.appendChild(newListItem);

    mainContentContainer.style.display = "flex";
    // JUMP1: Simulates selecting the "All" button
    allButton.style.color = "hsl(220, 98%, 61%)";
    input.value = "";
  }
};

function isElementVisible(element) {
  return window.getComputedStyle(element).display !== "none";
}

const filterList = (e) => {
  const button = e.target;
  const listItems = list.querySelectorAll(".main-list-item");

  switch (button.textContent) {
    case "All":
      hideErrorModal();

      listItems.forEach((item) => {
        if (!isElementVisible(item)) {
          item.style.display = "grid";
        }
      });
      break;
    case "Active":
      // JUMP1: Remove simulated styles
      allButton.style.color = "";
      hideErrorModal();

      listItems.forEach((item) => {
        if (item.classList.contains("complete")) {
          item.style.display = "none";
        } else if (!item.classList.contains("complete")) {
          item.style.display = "grid";
        }
      });
      break;
    case "Completed":
      // JUMP1: Remove simulated styles
      allButton.style.color = "";

      const listNodesArray = [...listItems];
      const completedItems = listNodesArray.filter((item) =>
        item.classList.contains("complete")
      );
      if (completedItems.length === 0) {
        showErrorModal();
      }

      listItems.forEach((item) => {
        if (item.classList.contains("complete")) {
          item.style.display = "grid";
        } else if (!item.classList.contains("complete")) {
          item.style.display = "none";
        }
      });
      break;
  }
};

const showErrorModal = () => {
  const errorModal = document.querySelector(".main-error-modal");
  errorModal.style.height = window.getComputedStyle(listContainer).height;
  errorModal.style.display = "flex";
};

const hideErrorModal = () => {
  const errorModal = document.querySelector(".main-error-modal");
  errorModal.style.height = "";
  errorModal.style.display = "none";
};

themeToggle.addEventListener("click", toggleTheme);
input.addEventListener("keydown", addItem);
stateButtonsContainer.addEventListener("click", filterList);
