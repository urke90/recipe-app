import * as base from "./base";
import { shortenRecipeTitleHandler } from "./searchView";

export const toggleLikeBtn = (isLiked) => {
  const iconStr = isLiked ? "icon-heart" : "icon-heart-outlined";
  // icons.svg#icon-heart-outlined
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `img/icons.svg#${iconStr}`);
};

export const toggleLikeMenu = (numLikes) => {
  document.querySelector(".likes__field").style.visibility =
    numLikes > 0 ? "visible" : "hidden";
};

export const renderLikeHandler = (like) => {
  const { id, img, title, author } = like;
  const likeMarkup = `
        <li>
            <a class="likes__link" href="#${id}">
                <figure class="likes__fig">
                    <img src="${img}" alt="${title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${shortenRecipeTitleHandler(
                      title
                    )}</h4>
                    <p class="likes__author">${author}</p>
                </div>
            </a>
        </li>
    `;
  document
    .querySelector(".likes__list")
    .insertAdjacentHTML("beforeend", likeMarkup);
};

export const deleteLikeHandler = (id) => {
  const selectedEl = document.querySelector(`.likes__link[href*="#${id}"]`)
    .parentElement;
  if (selectedEl) selectedEl.parentElement.removeChild(selectedEl);
};
