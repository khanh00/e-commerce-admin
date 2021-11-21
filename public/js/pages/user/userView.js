import * as utils from '../../utils';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const renderErrorLogin = (err) => {
  $('.login__error').textContent = err.response.data.message;
  $('.login__error').classList.remove('display-n');
};

const removeErrorLogin = () => {
  $('.login__error').classList.add('display-n');
};

const renderErrorLogout = () => {
  utils.renderNotification('error', 'Đăng xuất thất bại. Vui lòng thử lại');
};

export { renderErrorLogin, removeErrorLogin, renderErrorLogout };
