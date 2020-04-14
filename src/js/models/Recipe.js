import axios from "axios";

export default class RecipeModel {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      const recipe = res.data.recipe;
      this.title = recipe.title;
      this.author = recipe.publisher;
      this.img = recipe.image_url;
      this.url = recipe.source_url;
      this.ingredients = recipe.ingredients;
    } catch (error) {
      console.log("error from fetching single recipe", error);
      console.log("something went wrong!", error);
    }
  }

  calcCookingTime() {
    // Assuming that we need 15 min for each 3 ingredients
    // number of ingredients
    const numIng = this.ingredients.length;
    // how many 50 mins periods there are
    const periodMins = Math.ceil(numIng / 3);
    this.time = periodMins * 15;
  }

  calcServings() {
    this.serving = 4;
  }

  parseIngredients() {
    const unitLong = [
      "tablespoons",
      "tablespoon",
      "ounce",
      "ounces",
      "teaspoon",
      "teaspoons",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const newIngredients = this.ingredients.map((el) => {
      // 1. Uniform units
      let ingredient = el.toLowerCase();
      unitLong.map((unitL, i) => {
        ingredient.replace(unitL, unitShort[i]);
      });
      // 2. Remove parentheses
      ingredient.replace(/ *\([^)]*\) */g, "");
      // 3. Parse ingredients into count, unit and ingredient

      return ingredient;
    });
    this.ingredients = newIngredients;
  }
}
