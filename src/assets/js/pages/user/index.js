import * as user from './user';
import * as userView from './userView';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$('#login')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    userView.removeErrorLogin();

    const email = $('#email').value;
    const password = $('#password').value;

    const status = await user.login(email, password);
    if (status === 'success') {
      window.location.assign('/products');
    }
  } catch (err) {
    userView.renderErrorLogin(err);
  }
});

$('#logout')?.addEventListener('click', async () => {
  try {
    const status = await user.logout();
    if (status === 'success') {
      window.location.assign('/login');
    }
  } catch (err) {
    userView.renderErrorLogout();
  }
});
