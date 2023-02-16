const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// =====RefreshToken Model=====
const refreshTokenSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
},{ timestamps: true });
refreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});
refreshTokenSchema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});

// =====Book Model=====
const bookSchema = new Schema(
  {
    bookId: Number,
    title: String,
    author: String,
    read: Boolean,
  },
  { timestamps: true }
);

// =====Joke Model=====
const jokesSchema = new Schema(
  {
    jokeId: String,
    title: String,
    content: String,
    category: String,
  },
  { timestamps: true }
);

module.exports = {
  Joke: mongoose.model("Joke", jokesSchema, "jokes"),
  Book: mongoose.model("Book", bookSchema, "books"),
  RefreshToken: mongoose.model("RefreshToken", refreshTokenSchema),
  Account: require("src/collections/account/account.model"),
};
