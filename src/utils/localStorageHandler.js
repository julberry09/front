const localStorageHandler = {
  getItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(localStorage.getItem(key)) : null;
  },
  setItem(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};
export default localStorageHandler;
