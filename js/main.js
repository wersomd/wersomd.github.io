"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const letters = document.querySelectorAll(".letter");

  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.style.animationDelay = `${index * 0.2}s`;
    }, index * 200);
  });
});

const menuLinks = document.querySelectorAll(".menu-link[data-goto]");
if (menuLinks.length > 0) {
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;

    if (
      menuLink.dataset.goto &&
      document.querySelector(menuLink.dataset.goto)
    ) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      const gotoBlockValue =
        gotoBlock.getBoundingClientRect().top +
        120 -
        document.querySelector("header").offsetHeight;

      window.scrollTo({
        top: gotoBlockValue,
        behavior: "smooth",
      });

      e.preventDefault();
    }
  }
}

const burgerMenu = document.getElementById("burger");
const navbarMenu = document.getElementById("menu");

burgerMenu.addEventListener("click", () => {
  burgerMenu.classList.toggle("is-active");
  navbarMenu.classList.toggle("is-active");

  if (navbarMenu.classList.contains("is-active")) {
    navbarMenu.style.maxHeight = navbarMenu.scrollHeight + "px";
  } else {
    navbarMenu.removeAttribute("style");
  }
});
