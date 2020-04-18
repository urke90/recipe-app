import * as base from "./base";

export const renderItemHandler = (item) => {
  const itemMarkup = `
        <li class="shopping__item" data-itemid="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count--value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
  base.domElements.shoppingList.innerHTML += itemMarkup;
};

export const deleteItemHandler = (id) => {
  const itemToDelete = document.querySelector(`[data-itemid="${id}"]`);
  itemToDelete.parentElement.removeChild(itemToDelete);
};
