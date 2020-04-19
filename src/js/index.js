// Global app controller
import SearchModel from "./models/Search";
import RecipeModel from "./models/Recipe";
import ShoppingList from "./models/ShoppingList";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as shoppingListView from "./views/shoppingListView";
import * as base from "./views/base";

/* Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
// GLOBAL STATE OF THE APP
const state = {};
// save it to window object
window.state = state;
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
// event triggered on next/prev page for pagination
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

["hashchange", "load"].map((eventType) =>
  window.addEventListener(eventType, controlRecipeHandler)
);

// Likes controller
const controlLikesHandler = () => {
  if (!state.likes) state.likes = new Likes();

  // id of the current recipe
  const currentId = state.recipe.id;
  // user has NOT  yet liked current recipe
  if (!state.likes.isLiked(currentId)) {
    const { id, title, author, img } = state.recipe;
    // Add like to the state
    const newLike = state.likes.addLike(id, title, author, img);

    // Toggle the like button

    // Add the like to the UI
    console.log("state.likes add", state.likes);
  } else {
    // user HAS liked current recipe

    // Remove like from the state
    state.likes.deleteLike(currentId);
    // Toggle the like button

    // Remove Like from the UI
    console.log("state.likes remove", state.likes);
  }
};

// events on .recipe
base.domElements.recipe.addEventListener("click", (event) => {
  //console.log("event.target", event.target);
  /* event will be trigered if we click on btn-decrease
    or .btn-decrease * ---> or any child element of .btn-decrease
  */
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrese num of servings btn is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    //increase num of servings btn is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // add recipe ingredients to shopping list
    controlShoppingListHandler();
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    controlLikesHandler();
  }

  //console.log("state.recipe", state.recipe.ingredients);
});

// Shopping control list
const controlShoppingListHandler = () => {
  // create a new sjpping list IF there is none yet
  if (!state.list) state.list = new ShoppingList();
  // Add each ingredient to the list

  state.recipe.ingredients.map((ing) => {
    const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    shoppingListView.renderItemHandler(item);
  });
  console.log("state.list 1", state.list);
};

// hadnle delete adn update list items event
base.domElements.shoppingList.addEventListener("click", (event) => {
  const selectedElId = event.target
    .closest(".shopping__item")
    .getAttribute("data-itemid");

  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    if (selectedElId) {
      // delete from state
      state.list.deleteItem(selectedElId);
      // delete from UI
      shoppingListView.deleteItemHandler(selectedElId);
    }
  } else if (event.target.matches(".shopping__count--value")) {
    const newCount = parseFloat(event.target.value);
    if (newCount) {
      state.list.updateCount(selectedElId, newCount);
    }
  }
});
