export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // save the data in local storage
    this.persistData();

    return like;
  }

  deleteLike(id) {
    //delete using filter method
    this.likes.filter((like) => like.id !== id);
    // delete using splice method
    // const index = this.likes.findIndex((like) => like.id === id);
    // this.likes.splice(index, 1);

    // save the data to the local storage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));

    if (storage) this.likes = storage;
  }
}
