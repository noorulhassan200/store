/* This all of are helper function */
const userModel = require("../models/users");

exports.toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

exports.validateEmail = function (mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  } else {
    return false;
  }
};

exports.emailCheckInDatabase = async function (email) {
  try {
    const user = await userModel.findOne({ email: email });
    return user ? true : false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.phoneNumberCheckInDatabase = async function (phoneNumber) {
  try {
    const user = await userModel.findOne({ phoneNumber: phoneNumber });
    return user ? true : false;
  } catch (err) {
    console.log(err);
    return false;
  }
};