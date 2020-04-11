// Global app controller
import axios from "axios";

const getResults = async (query) => {
  try {
    const res = await axios(
      `https://forkify-api.herokuapp.com/api/search?q=${query}`
    );
    console.log(res.data.recipes);
  } catch (error) {
    alert(error);
  }
};
getResults("pizza");
