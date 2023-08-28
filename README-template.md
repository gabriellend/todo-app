# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW) done with my DevIsland students.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

### Screenshot

![](./screenshot-mobile.png)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow

### What I learned

Getting the borders of the checkboxes to be a linear gradient on hover was an interesting challenge. I didn't know that you can't set a border color to a linear gradient. I solved this by setting the checkbox's hover background to a linear gradient and then putting a slightly smaller ::after element on top of it that was the same color as the list background. This gives the illusion of a linear gradient border.

Another new thing was adding the dragging capability to the list items. I'd never come across the dragging event listeners before so this was a whole new world. It was pretty straightforward, though it was challenging figuring out how to change the cursor while dragging and also to style the dragged element.
