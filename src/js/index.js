// Global app controller
import SearchModel from "./models/Search";
import RecipeModel from "./models/Recipe";
import ShoppingList from "./models/ShoppingList";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
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
  const query = searchView.getInputValueHandler();

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

base.domElements.searchResultPagination.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn-inline");

  if (btn) {
    const goToPage = parseInt(btn.getAttribute("data-gotopage"));
    searchView.removeRecipesHandler();
    searchView.renderSearchResultsHandler(state.search.results, goToPage);
    // same as getAttribute but we can also set the attribute value like e.g. below
    //let goToPage = (btn.dataset.gotopage = "uros");
    //console.log("gotoPage", gotoPage);
  }
});

// Recipe conrtoller
const controlRecipeHandler = async () => {
  const id = window.location.hash.replace("#", "");
  // const id = window.location.hash.split("#")[1];

  //highlight searched recipe
  if (state.search) searchView.highlightSelectedHandler(id);

  if (id) {
    // 1. Prepare UI for changes
    recipeView.clearRecipeHandler();
    base.renderLoaderHandler(base.domElements.recipe);
    // 2. Create new Recipe object
    state.recipe = new RecipeModel(id);

    try {
      // 3. Get recipe data and parse igredients

      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // 4. Calculate serving and cooking time
      state.recipe.calcCookingTime();
      state.recipe.calcServings();

      // 5. Render recipe
      base.removeLoaderHandler();
      recipeView.renderRecipeHandler(state.recipe);
      //console.log("recipe after fetch", state.recipe);
    } catch (error) {
      console.log("error fechting recipe", error);
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

//
["hashchange", "load"].map((eventType) =>
  window.addEventListener(eventType, controlRecipeHandler)
);

base.domElements.recipe.addEventListener("click", (event) => {
  console.log("event.target", event.target);
  /* event will be trigered if we click on btn-decrease
    or .btn-decrease * ---> or any child element of .btn-decrease
  */
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrese btn is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    //increase btn is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log("state.recipe", state.recipe.ingredients);
});

base.domElements.recipe.addEventListener("click", (event) => {
  console.log(
    "event.target",
    event.target.matches("recipe__btn, recipe__btn *")
  );
});
