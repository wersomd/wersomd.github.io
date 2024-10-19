"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const letters = document.querySelectorAll(".letter");

  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.style.animationDelay = `${index * 0.2}s`;
    }, index * 200);
  });
});
