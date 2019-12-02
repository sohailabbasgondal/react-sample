import Raven from "raven-js";
function init() {
  Raven.config("https://d4a857a59d234d28ba1e46744de315c4@sentry.io/1800208", {
    release: "1.0.0",
    environment: "developement-test"
  }).install();
}

function log(error) {
  //Raven.captureException(error);
}

export default {
  init,
  log
};
