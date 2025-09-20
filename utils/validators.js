// utils/validators.js
const nameValid = (name) => typeof name === 'string' && name.trim().length >= 20 && name.trim().length <= 60;
const addressValid = (addr) => {
  if (addr === undefined || addr === null) return true; 
  return typeof addr === 'string' && addr.length <= 400;
};
const passwordValid = (pw) => {
  if (typeof pw !== 'string') return false;
  if (pw.length < 8 || pw.length > 16) return false;

  const upper = /[A-Z]/;
  const special = /[^A-Za-z0-9]/;
  return upper.test(pw) && special.test(pw);
};
const emailValid = (email) => {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

module.exports = { nameValid, addressValid, passwordValid, emailValid };
