const mongoose = require("mongoose");
const moment = require("moment");
// moment is not recommended

const isISODate = (str) => {
  const isoDateRegExp = new RegExp(
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
  );
  return isoDateRegExp.test(str);
};

module.exports = function queryBuilderForGroupBy(request) {
  const query = {};
  const ignoreList = ["_sort", "_start", "_limit"];

  Object.entries(request).map(([key, value]) => {
    if (!ignoreList.includes(key)) {
      let k, v;

      if (key.startsWith("_id")) {
        k = "_id";

        value = mongoose.Types.ObjectId(value);
      } else {
        [k, v] = key.split("_");
      }

      if (key.startsWith("isDeleted")) {
        if (value === "true" || value === "false") {
          value = Boolean(value);
        }
      }

      if (["gt", "lt", "gte", "lte", "eq"].includes(v)) {
        if (isISODate(value)) {
          value = moment(value).toDate();
        } else if (value && moment(new Date(value)).isValid()) {
          value = moment(value).toDate();
        } else if (!isNaN(parseFloat(value)) && !isISODate(value)) {
          value = parseFloat(value);
        }
      }

      if (k === "id") {
        k = "_id";
      }

      if (!query[k]) {
        query[k] = {};
      }

      if (v === "contains") {
        v = "regex";
        query[k]["$" + v] = value.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
        query[k]["$options"] = "i";
      } else if (v === "containss") {
        v = "regex";
        query[k]["$" + v] = value.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
      } else if (v === "ncontains") {
        v = "regex";
        query[k]["$" + v] = `^((?!${value}).)*$`;
        query[k]["$options"] = "i";
      } else if (v === "in" || v === "nin") {
        if (typeof value === "string") {
          value = JSON.parse(value);
        }
        query[k]["$" + v] = value;
      } else if (v === "null") {
        if (value) {
          query[k] = null;
        } else {
          query[k]["$ne"] = null;
        }
      } else if (v) {
        query[k]["$" + v] = value;
      } else {
        query[k] = value;
      }
    }
  });

  return query;
};
