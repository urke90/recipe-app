import { domElements } from "./base";

// get search input value
export const getInputValueHandler = () => domElements.searchInput.value;

// clear serach input value after we get all recipes
export const clearSearchInputValueHandler = () =>
  (domElements.searchInput.value = "");

// removes recipes list from the UI
export const removeRecipesHandler = () =>
  (domElements.searchResultsList.innerHTML = "");

/*
Will shorthen recipe title
- Pasta with tomato and spinach -
1. acc = 0, curVal = 5, => newTitle = ['Pasta']
2. acc = 5, curVal = 4, => newTitle = ['Pasta', 'with']
3. acc = 9, curVal = 6, => newTitle = ['Pasta', 'with', 'tomato']
4. acc = 15, curVal = 3 // will add no more since we set the limit to 17 => newTitle = ['Pasta', 'with', 'tomato']
*/
const shortenRecipeTitleHandler = (title, limit = 17) => {
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
