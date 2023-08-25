const body = document.querySelector("body");
const themeToggle = document.querySelector(".toggle-theme");
const input = document.querySelector("input");
const list = document.querySelector(".list");

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
  listItem.classList.add("list-item");

  // Used for accessibility
  const hiddenCheckbox = document.createElement("input");
  hiddenCheckbox.type = "checkbox";
  hiddenCheckbox.id = id;
  hiddenCheckbox.classList.add("hidden-checkbox");

  // Visible checkbox
  const checkbox = document.createElement("div");
  checkbox.classList.add("checkbox");

  const item = document.createElement("label");
  item.htmlFor = id;
  item.textContent = inputValue;
  item.classList.add("item");

  // Delete X icon
  const deleteSvg = `<svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>`;

  const svgContainer = document.createElement("div");
  svgContainer.innerHTML = deleteSvg;

  listItem.append(hiddenCheckbox, checkbox, item, svgContainer);
  id++;

  return listItem;
};

const addItem = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    const inputValue = e.target.value;
    const newListItem = createListItem(inputValue);
    list.appendChild(newListItem);

    list.style.display = "block";
    input.value = "";
  }
};

themeToggle.addEventListener("click", toggleTheme);
input.addEventListener("keydown", addItem);
