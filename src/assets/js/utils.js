const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const gotoPage = (page) => {
  $('.current-page').classList.remove('current-page');
  $(`.paginate span:nth-of-type(${page})`).classList.add('current-page');
};

const updatePaginationInfo = (quantity, page = 1, limit = 10) => {
  const maxPage = Math.ceil(quantity / limit);
  const spans = $$('.pagination-info span');

  if (spans.length > 0) {
    spans[0].textContent = (page - 1) * limit + 1;
    if (page * limit > quantity) {
      spans[1].textContent = quantity;
    } else spans[1].textContent = page * limit;
    spans[2].textContent = quantity;
  }

  let html = '<i class="fas fa-chevron-left"></i>';
  for (let i = 1; i <= maxPage; i += 1) {
    if (i === page) {
      html += `<span class="current-page">${i}</span>`;
    } else html += `<span>${i}</span>`;
  }
  html += '<i class="fas fa-chevron-right"></i>';
  if ($('.paginate')) $('.paginate').innerHTML = html;
};

const getInfoPage = () => ({
  page: +$('.current-page').textContent,
  limit: 10,
  maxPage: +$('.paginate span:last-of-type').textContent,
});

const renderNotification = (status, message) => {
  $(`.notification--${status}`).classList.remove('hidden');
  $(`.notification--${status} .notification__message`).textContent = message;
  setTimeout(() => {
    $(`.notification--${status}`).classList.add('hidden');
    setTimeout(() => {
      $(`.notification--${status} .notification__message`).textContent = '';
    }, 1000);
  }, 2400);
};

const renderSpinner = (element) => {
  if (element.querySelector('.spinner')) {
    element.querySelector('.spinner').remove();
  }

  const html = `
    <div class="spinner">
      <i class="fas fa-circle-notch"></i>
    </div>
    `;
  element.insertAdjacentHTML('afterbegin', html);
};

const removeSpinner = (element) => {
  element.querySelector('.spinner').remove();
};

export {
  gotoPage,
  updatePaginationInfo,
  getInfoPage,
  renderNotification,
  renderSpinner,
  removeSpinner,
};
