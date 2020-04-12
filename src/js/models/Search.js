import axios from "axios";

// class that feteches recepies accordingly to the query(pizza,pasta...) that we input
export default class SearchModel {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.results = res.data.recipes;
      //console.log("result from fetching recipes", this.results);
    } catch (error) {
      console.log("search results error", error);
    }
  }
}
