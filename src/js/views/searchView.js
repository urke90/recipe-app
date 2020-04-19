import { domElements } from "./base";

// highlight selected recipe
export const highlightSelectedHandler = (id) => {
  const a = document.querySelectorAll(".results__link");

  a.forEach((el) => el.classList.remove("results__link--active"));
  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.toggle("results__link--active");
};

// get search input value
export const getInputValueHandler = () => domElements.searchInput.value;

// clear serach input value after we get all recipes
export const clearSearchInputValueHandler = () =>
  (domElements.searchInput.value = "");

// removes recipes list from the UI
export const removeRecipesHandler = () => {
  domElements.searchResultsList.innerHTML = "";
  domElements.searchResultPagination.innerHTML = "";
};

/*
Will shorthen recipe title
- Pasta with tomato and spinach -
1. acc = 0, curVal = 5, => newTitle = ['Pasta']
2. acc = 5, curVal = 4, => newTitle = ['Pasta', 'with']
3. acc = 9, curVal = 6, => newTitle = ['Pasta', 'with', 'tomato']
4. acc = 15, curVal = 3 // will add no more since we set the limit to 17 => newTitle = ['Pasta', 'with', 'tomato']
*/
export const shortenRecipeTitleHandler = (title, limit = 17) => {
  const newTitle = [];

  if (title.length > limit) {
    title.split(" ").reduce((acc, curVal) => {
      if (acc + curVal.length <= limit) {
        newTitle.push(curVal);
      }

      return acc + curVal.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

// create HTML structure for single recipe
const renderRecipeHandler = (recipe) => {
  const recipeMarkup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${shortenRecipeTitleHandler(
                      recipe.title
                    )}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
                         `;

  domElements.searchResultsList.innerHTML += recipeMarkup;
};

// create HTML structure for next and prev btns
// type = "next" or "prev"
const createPagBtnStructureHandler = (currentPage, type) => `
  <button class="btn-inline results__btn--${type}" data-gotoPage=${
  type === "prev" ? currentPage - 1 : currentPage + 1
}>
    <span>Page ${type === "prev" ? currentPage - 1 : currentPage + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
        type === "prev" ? "left" : "right"
      }"></use>
    </svg>
   
  </button>
`;

/*
render pagination buttons
totalNumResults = total number of result (recipes) we fetch
resPerPage = how many recipes we have per page
curPage = current page
*/
const renderPaginationBtnsHandler = (curPage, totalNumResults, resPerPage) => {
  /*
  total num of pages we need for pagi
  Math.ceil in case totalNumPages = 4.5 (round it to higher intiger)
  */
  const totalNumPages = Math.ceil(totalNumResults / resPerPage);
  let btn;
  if (curPage === 1 && totalNumPages > 1) {
    // display only "next" btn
    btn = createPagBtnStructureHandler(curPage, "next");
  } else if (curPage < totalNumPages) {
    // display "prev" and "next" btns
    btn = `
      ${createPagBtnStructureHandler(curPage, "prev")}
      ${createPagBtnStructureHandler(curPage, "next")}
    `;
  } else if (curPage === totalNumPages && totalNumPages > 1) {
    // display "prev" btn
    btn = createPagBtnStructureHandler(curPage, "prev");
  }

  domElements.searchResultPagination.innerHTML += btn;
};

// render fetched search results on UI
export const renderSearchResultsHandler = (
  recipes,
  curPage = 1,
  itemsPerPage = 10
) => {
  // render recipes on UI
  const startSlice = (curPage - 1) * itemsPerPage; // for page 1 startSlice = 0
  const endSlice = curPage * itemsPerPage; // slice won't include end element ( no need for -1)

  /*
     loop through fetched recepis and render them on UI 
    ( shorthand version---> single recipe will be passed to renderRecipeHandler function )
  */
  recipes.slice(startSlice, endSlice).forEach(renderRecipeHandler);

  // loop through fetched recipes and render them on UI
  // recipes.forEach((recipe) => renderRecipeHandler(recipe));

  // render pagination buttons on page
  renderPaginationBtnsHandler(curPage, recipes.length, itemsPerPage);
};
