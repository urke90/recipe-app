// Global app controller
import SearchModel from "./models/Search";
import * as searchView from "./views/searchView";
import * as base from "./views/base";

/* Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};

// recipe search handler
const searchForRecipeHandler = async () => {
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
    await state.search.getResults();
    console.log(state.search.results);
    // 5. Render results on UI
    searchView.renderSearchResultsHandler(state.search.results);
    base.removeLoaderHandler();

    //
  }
};
// search form submit
base.domElements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  searchForRecipeHandler();
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
