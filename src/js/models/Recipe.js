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
      console.log("fetched single recipe", res);
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
}
