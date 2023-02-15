const mongoose = require("mongoose");

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose
  .connect(
    process.env.MONGODB_URI,
    connectionOptions
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error: ", err));

mongoose.Promise = global.Promise;
