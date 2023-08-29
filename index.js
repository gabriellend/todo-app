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

  // Add checkmark
  if (checkbox.innerHTML === "") {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>`;
    checkbox.innerHTML = svgString;
  } else {
    checkbox.innerHTML = "";
  }

  // If there is one item in "Completed" or "Active" that is toggled,
  // that item will disappear and a message will appear
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

  updateItemsLeft();
};

const updateItemsLeft = () => {
  // Necessary to do this reset?
  if (list.children.length === 0) {
    itemsLeftSpan.textContent = "";
    makePluralSpan.textContent = "";
    return;
  }

  const activeListItems = document.querySelectorAll(
    ".main-list-item:not(.complete)"
  );

  itemsLeftSpan.textContent = activeListItems.length;

  if (activeListItems.length !== 1) {
    makePluralSpan.textContent = "s";
  } else {
    makePluralSpan.textContent = "";
  }
};

const removeItem = (listItem) => {
  listItem.remove();
  updateItemsLeft();

  if (list.children.length === 0) {
    mainContentContainer.style.display = "none";
    id = 0;
  }
};

const addItem = (e) => {
  // If the enter key was pressed and the input has a value
  if (e.keyCode === 13 && e.target.value.trim() !== "") {
    e.preventDefault();
    if (errorModal.classList.contains("visible")) {
      hideErrorModal();
    }

    const inputValue = e.target.value;
    const newListItem = createListItem(inputValue);

    mainContentContainer.style.display = "flex";

    // No buttons are selected when the first item is added,
    // so "All" should be selected
    if (list.children.length === 0) {
      allButton.classList.add("selected");
    }

    // If viewing "Completed" and a new item is added, switch to
    // the "All" view
    const selectedButton = [...stateButtons].find((button) =>
      button.classList.contains("selected")
    );
    if (selectedButton.classList.contains("completed")) {
      selectedButton.classList.remove("selected");
      allButton.classList.add("selected");
      const listItems = document.querySelectorAll(".main-list-item");
      listItems.forEach((item) => {
        if (!isElementVisible(item)) {
          item.style.display = "grid";
        }
      });
    }

    list.appendChild(newListItem);
    input.value = "";
    updateItemsLeft();
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
  errorModal.classList.add("visible");

  if (type === "completed") {
    errorModal.textContent = "You haven't completed any items yet!";
  } else if (type === "active") {
    errorModal.textContent = "You've completed all your items!";
  }
};

const hideErrorModal = () => {
  errorModal.style.height = "";
  errorModal.style.display = "none";
  errorModal.classList.remove("visible");
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

  // "target" is the element being hovered over
  if (e.target.tagName === "LI") {
    const targetBoundingRect = e.target.getBoundingClientRect();
    const targetMidpoint = targetBoundingRect.y + targetBoundingRect.height / 2;

    // If the cursor is in the top half of the target
    if (e.clientY < targetMidpoint) {
      list.insertBefore(draggedItem, e.target); // Insert before target
    } else {
      list.insertBefore(draggedItem, e.target.nextElementSibling); // Insert after target
    }
  }
};

const saveNewValue = (e, parent, ogItem) => {
  if (e.keyCode === 13) {
    if (e.target.value.trim() !== "") {
      const newValue = e.target.value;
      e.target.remove();

      ogItem.textContent = newValue;
      ogItem.style.display = "grid";
    } else {
      parent.remove();
      updateItemsLeft();
    }
  }
};

const editItem = (e) => {
  const ogItem = e.target;
  const deleteIcon = e.target.nextElementSibling;
  const parentLi = e.target.parentElement;

  ogItem.style.display = "none";

  const tempInput = document.createElement("input");
  tempInput.value = ogItem.textContent;
  tempInput.type = "text";
  tempInput.classList.add("temporary");
  tempInput.addEventListener("keydown", (e) =>
    saveNewValue(e, parentLi, ogItem)
  );

  parentLi.insertBefore(tempInput, deleteIcon);
  tempInput.focus();
};

themeToggle.addEventListener("click", toggleTheme);
input.addEventListener("keydown", addItem);
clearCompletedButton.addEventListener("click", clearCompleted);
stateButtonsContainer.addEventListener("click", filterList);
list.addEventListener("dragstart", setDraggedItem);
list.addEventListener("dragover", allowDrop);
list.addEventListener("drop", dropItem);
