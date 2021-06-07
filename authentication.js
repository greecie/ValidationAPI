module.exports = {
  missingParameter: ({ from, to, text }) => {
    if (!from || !to || !text) {
      return {
        message: "",
        error: `${from ? "" : " <from>"}${to ? "" : " <to>"}${text ? "" : " <text>"} is missing`,
      };
    }
    return { error: "" };
  },
  validateParameter: ({ from, to, text }) => {
    let fromcheck = false;
    let tocheck =false;
    let textcheck = false;
    if (from.length < 6 || from.length > 16 || !from.match(/^-{0,1}\d+$/) ) {
      fromcheck = true;
    }
    if (to.length < 6 || to.length > 16 || !to.match(/^-{0,1}\d+$/) ) {
      tocheck = true;
    }
    if (text.length < 1 || text.length > 120) {
      textcheck = true;
    }
    if (fromcheck || tocheck || textcheck) {
      return {
        message: "",
        error: `${fromcheck ? " <from>" : ""}${tocheck ? " <to>" : ""}${textcheck ? " <text>" : ""} is invalid`,
      };
    }
    return { error: "" };
  },

};
