const body = document.querySelector("body");
const themeToggle = document.querySelector(".toggle-theme");
const input = document.querySelector("input");
const mainContentContainer = document.querySelector(".main-content");
const listContainer = document.querySelector(".main-list-container");
const list = document.querySelector(".main-list");
const listFooter = document.querySelector(".main-list-footer");
const itemsLeftSpan = document.querySelector(".items-left");
const makePluralSpan = document.querySelector(".make-plural");
const clearCompletedButton = document.querySelector(".clear-completed");
const stateButtonsContainer = document.querySelector(".main-view-states");
const stateButtons = document.querySelectorAll(".state");
const allButton = document.querySelector(".all");
const errorModal = document.querySelector(".main-error-modal");

let id = 0;
let draggedItem = null;

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
  listItem.draggable = true;

  // Hidden checkbox used for accessibility
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

  const item = document.createElement("label");
  item.htmlFor = id;
  item.textContent = inputValue;
  item.classList.add("item");
  item.addEventListener("dblclick", editItem);

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

  const selectedButton = [...stateButtons].find((button) =>
    button.classList.contains("selected")
  );
  if (selectedButton.classList.contains("completed")) {
    if (!listItem.classList.contains("complete")) {
      const completedListItems = document.querySelectorAll(
        ".main-list-item.complete"
      );
      if (completedListItems.length === 0) {
        showErrorModal("completed");
      }

      listItem.style.display = "none";
    }
  } else if (selectedButton.classList.contains("active")) {
    if (listItem.classList.contains("complete")) {
      const activeListItems = document.querySelectorAll(
        ".main-list-item:not(.complete)"
      );
      if (activeListItems.length === 0) {
        showErrorModal("active");
      }

      listItem.style.display = "none";
    }
  }

  updateFooter();
};

const updateFooter = () => {
  const activeListItems = document.querySelectorAll(
    ".main-list-item:not(.complete)"
  );

  itemsLeftSpan.textContent = activeListItems.length;
  listFooter.style.display = "flex";

  if (activeListItems.length !== 1) {
    makePluralSpan.textContent = "s";
  } else {
    makePluralSpan.textContent = "";
  }

  if (list.children.length === 0) {
    itemsLeftSpan.textContent = "";
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
  if (e.keyCode === 13 && e.target.value.trim() !== "") {
    e.preventDefault();
    hideErrorModal();

    const inputValue = e.target.value;
    const newListItem = createListItem(inputValue);

    mainContentContainer.style.display = "flex";

    const buttonSelected = [...stateButtons].some((button) =>
      button.classList.contains("selected")
    );
    if (!buttonSelected) {
      allButton.classList.add("selected");
    }

    const selectedButton = [...stateButtons].find((button) =>
      button.classList.contains("selected")
    );
    if (selectedButton.classList.contains("completed")) {
      newListItem.style.display = "none";
    }
    list.appendChild(newListItem);

    input.value = "";

    updateFooter();
  }
};

function isElementVisible(element) {
  return window.getComputedStyle(element).display !== "none";
}

const filterList = (e) => {
  const button = e.target;
  const listItems = document.querySelectorAll(".main-list-item");
  stateButtons.forEach((button) => button.classList.remove("selected"));

  switch (button.textContent) {
    case "All":
      button.classList.add("selected");
      hideErrorModal();

      listItems.forEach((item) => {
        if (!isElementVisible(item)) {
          item.style.display = "grid";
        }
      });
      break;
    case "Active":
      button.classList.add("selected");
      hideErrorModal();

      const activeItems = [...listItems].filter(
        (item) => !item.classList.contains("complete")
      );
      if (activeItems.length === 0) {
        showErrorModal("active");
      }

      listItems.forEach((item) => {
        if (item.classList.contains("complete")) {
          item.style.display = "none";
        } else if (!item.classList.contains("complete")) {
          item.style.display = "grid";
        }
      });
      break;
    case "Completed":
      button.classList.add("selected");
      hideErrorModal();

      const completedItems = [...listItems].filter((item) =>
        item.classList.contains("complete")
      );
      if (completedItems.length === 0) {
        showErrorModal("completed");
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

const showErrorModal = (type) => {
  errorModal.style.height = window.getComputedStyle(list).height;
  errorModal.style.display = "flex";

  if (type === "completed") {
    errorModal.textContent = "You haven't completed any items yet!";
  } else if (type === "active") {
    errorModal.textContent = "You've completed all your items!";
  }
};

const hideErrorModal = () => {
  errorModal.style.height = "";
  errorModal.style.display = "none";
};

const clearCompleted = () => {
  const completedItems = document.querySelectorAll(".main-list-item.complete");
  completedItems.forEach((item) => removeItem(item));
};

const setDraggedItem = (e) => {
  draggedItem = e.target;
};

const allowDrop = (e) => {
  e.preventDefault(); // allows dropping
};

const dropItem = (e) => {
  e.preventDefault();

  if (e.target.tagName === "LI") {
    const boundingRect = e.target.getBoundingClientRect();
    const targetMidpoint = boundingRect.y + boundingRect.height / 2;

    // If the cursor is in the top half of the target
    if (e.clientY < targetMidpoint) {
      list.insertBefore(draggedItem, e.target); // Insert before target
    } else {
      list.insertBefore(draggedItem, e.target.nextElementSibling); // Insert after target
    }
  }
};

const saveNewValue = (e, nextSibling, parent) => {
  if (e.keyCode === 13 && e.target.value.trim() !== "") {
    const newValue = e.target.value;
    e.target.remove();

    const newItem = document.createElement("label");
    newItem.htmlFor = id;
    newItem.textContent = newValue;
    newItem.classList.add("item");
    newItem.addEventListener("dblclick", editItem);
    parent.insertBefore(newItem, nextSibling);
  } else {
    // use filter function here
    parent.remove();
  }
};

const editItem = (e) => {
  const ogItemValue = e.target.textContent;
  const nextSibling = e.target.nextElementSibling;
  const parentLi = e.target.parentElement;
  e.target.remove();

  const tempInput = document.createElement("input");
  tempInput.value = ogItemValue;
  tempInput.type = "text";
  tempInput.addEventListener("keydown", (e) =>
    saveNewValue(e, nextSibling, parentLi)
  );
  parentLi.insertBefore(tempInput, nextSibling);
};

themeToggle.addEventListener("click", toggleTheme);
input.addEventListener("keydown", addItem);
clearCompletedButton.addEventListener("click", clearCompleted);
stateButtonsContainer.addEventListener("click", filterList);
list.addEventListener("dragstart", setDraggedItem);
list.addEventListener("dragover", allowDrop);
list.addEventListener("drop", dropItem);
