// Global app controller
import SearchModel from "./models/Search";
import RecipeModel from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as base from "./views/base";

/* Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

// recipe search handler ( search controller )
const searchRecipesHandler = async () => {
  // 1. Get query from the view ( from search input.value )
  //const query = searchView.getInputValueHandler();

  // TESTING
  const query = "pizza";
  if (query) {
    // 2. Get new search object and add it to the state
    state.search = new SearchModel(query);
    // 3. Prepare UI for results
    searchView.clearSearchInputValueHandler();
    searchView.removeRecipesHandler();
    base.renderLoaderHandler(base.domElements.searchResultsContainer);
    // 4. Search for recipes
    try {
      await state.search.getResults();
      //console.log(state.search.results);
      // 5. Render results on UI
      searchView.renderSearchResultsHandler(state.search.results);
      base.removeLoaderHandler();
    } catch (error) {
      console.log("error fetching recepis", error);
    }
  }
};
// search form submit
base.domElements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  searchRecipesHandler();
});

// testing
window.addEventListener("load", (event) => {
  event.preventDefault();

  searchRecipesHandler();
});

base.domElements.searchResultPagination.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn-inline");

  if (btn) {
    const goToPage = parseInt(btn.getAttribute("data-gotopage"));
    console.log("goToPage", goToPage);
    searchView.removeRecipesHandler();
    searchView.renderSearchResultsHandler(state.search.results, goToPage);
    // same as getAttribute but we can also set the attribute value like e.g. below
    //let goToPage = (btn.dataset.gotopage = "uros");
    //console.log("gotoPage", gotoPage);
  }
});

// Recipe conrtoller
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  // const id = window.location.hash.split("#")[1];

  if (id) {
    // 1. Prepare UI for changes

    // 2. Create new Recipe object
    state.recipe = new RecipeModel(id);

    // TESTING
    window.r = state.recipe;
    // 3. Get recipe data
    try {
      await state.recipe.getRecipe();
      // 4. Calculate serving and cooking time
      state.recipe.calcCookingTime();
      state.recipe.calcServings();

      // 5. Render recipe
      //console.log("recipe after fetch", state.recipe);
    } catch (error) {
      console.log("error fechting recipe");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].map((eventType) =>
  window.addEventListener(eventType, controlRecipe)
);
