import { domElements } from "./base";

// get search input value
export const getInputValueHandler = () => domElements.searchInput.value;

// clear serach input value after we get all recipes
export const clearSearchInputValueHandler = () =>
  (domElements.searchInput.value = "");

export const removeRecipesHandler = () =>
  (domElements.searchResultsList.innerHTML = "");

// create HTML structure for single recipe
const renderRecipeHandler = (recipe) => {
  const recipeMarkup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
                         `;

  domElements.searchResultsList.innerHTML += recipeMarkup;
};

// render fetched search results on UI
export const renderSearchResultsHandler = (recipes) => {
  /*
     loop through fetched recepis and render them on UI 
    ( shorthand version---> single recipe will be passed to renderRecipeHandler function )
  */

  recipes.forEach(renderRecipeHandler);

  // loop through fetched recipes and render them on UI
  // recipes.forEach((recipe) => renderRecipeHandler(recipe));
};
