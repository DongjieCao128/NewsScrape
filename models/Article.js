var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true, 
    unique:true, 
    match:[/^(?:(?!react).)+$/ig, "no bad react"]
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note1"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;