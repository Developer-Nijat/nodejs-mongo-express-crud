const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseSequence = require("mongoose-sequence");

const schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
  },
  {
    timestamps: true,
  }
);

if (!mongoose.models?.Book) {
  schema.plugin(mongooseSequence(mongoose), { inc_field: "bookId" });
}

module.exports = mongoose.model("Book", schema);
