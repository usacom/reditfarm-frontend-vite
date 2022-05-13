export default function register({ next, store, to }) {
  if (!store.isLogined && to.query.code) {
    if (to.name === "home") {
      return next({ name: "register", query: to.query });
    }
  }

  return next();
}
