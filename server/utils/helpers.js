module.exports = {
  /**
   *
   * @param {String} word
   * @returns The input string with all characters excluding letters, numbers and - with ""
   *
   */
  removeSpecialCharacters(word) {
    const specialCharacterRegex = /[^a-zA-Z0-9-]/g;
    return word.replace(specialCharacterRegex, "");
  },
};
