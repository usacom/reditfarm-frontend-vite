export default function guest({ next, store }) {
  if (store.isLogined) {
    return next({
      name: 'home',
    });
  }

  return next();
}
