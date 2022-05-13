export default function auth({ next, store }) {
  if (!store.isLogined) {
    return next({
      name: 'login',
    });
  }

  return next();
}
