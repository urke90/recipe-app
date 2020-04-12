export const domElements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultsList: document.querySelector(".results__list"),
  searchResultsContainer: document.querySelector(".results"),
  searchResultPagination: document.querySelector(".results__pages"),
};

export const elementStrings = {
  loader: "loader",
};

export const renderLoaderHandler = (parentElement) => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parentElement.insertAdjacentHTML("afterbegin", loader);
};

export const removeLoaderHandler = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentNode.removeChild(loader);
  }
};
