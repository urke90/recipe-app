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
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
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
    const units = [...unitShort, "kg", "g"];
    const newIngredients = this.ingredients.map((el) => {
      // 1. Uniform units

      let ingredient = el.toLowerCase();
      unitsLong.map((unitL, i) => {
        ingredient = ingredient.replace(unitL, unitShort[i]);
      });
      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // 3. Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));
      //console.log("arrIng", arrIng);
      //console.log("unitIndex", unitIndex);

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2]
        // Ex. 4 cups, arrCount is [4]
        // Ex. 1-1/3 cup, means it is 1 + 1/3
        const arrCount = arrIng.slice(0, unitIndex);
        //console.log("ulazi ovdde");
        //console.log("arrCount", arrCount);

        let count;

        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
        //console.log("objIng BEFORE", objIng);
      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit but the 1st element is the number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
    //console.log("ingredients", this.ingredients);
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    // Ingredients
    this.ingredients.map((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
