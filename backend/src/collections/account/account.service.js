const bcrypt = require("bcryptjs");
const models = require("src/utils/models");

async function getAll() {
  const accounts = await models.Account.find();
  return accounts.map((x) => basicDetails(x));
}

async function getById(id) {
  const account = await getAccount(id);
  return basicDetails(account);
}

async function create(params) {
  // validate
  if (await models.Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  const account = new models.Account(params);
  account.verified = Date.now();

  // hash password
  account.passwordHash = hash(params.password);

  // save account
  await account.save();

  return basicDetails(account);
}

async function update(id, params) {
  const account = await getAccount(id);

  // validate (if email was changed)
  if (
    params.email &&
    account.email !== params.email &&
    (await models.Account.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = hash(params.password);
  }

  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  await account.save();

  return basicDetails(account);
}

async function _delete(id) {
  const account = await getAccount(id);
  await account.remove();
}

// helper functions

async function getAccount(id) {
  if (!models.isValidId(id)) throw "Invalid document id";
  const account = await models.Account.findById(id);
  if (!account) throw "Account not found";
  return account;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function basicDetails(account) {
  const {
    id,
    title,
    firstName,
    lastName,
    email,
    role,
    created,
    updated,
    isVerified,
  } = account;
  return {
    id,
    title,
    firstName,
    lastName,
    email,
    role,
    created,
    updated,
    isVerified,
  };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};
