export default function auth({ next, store }) {
  console.log('middleware auth: ', store.isLogined);
  if (!store.isLogined) {
    return next({
      name: 'login',
    });
  }

  return next();
}
