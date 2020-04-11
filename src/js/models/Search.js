import axios from "axios";

export default class SearchModel {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.result = res.data.recipes;
      console.log("result from fetching recipes", this.result);
    } catch (error) {
      console.log("search results error", error);
    }
  }
}
