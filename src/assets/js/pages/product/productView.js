import * as category from '../category/category';
import * as utils from '../../utils';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const activeHeading = (heading) => {
  $$('.form-header__heading').forEach((headerHeading) => {
    headerHeading.classList.remove('form-header__heading--active');
  });
  heading.classList.add('form-header__heading--active');
};

const activeContent = () => {
  $('.form-body__content--active').classList.remove(
    'form-body__content--active'
  );

  $$('.form-header__heading').forEach((headerHeading, index) => {
    if (headerHeading.classList.contains('form-header__heading--active')) {
      $$('.form-body__content')[index].classList.add(
        'form-body__content--active'
      );
    }
  });
};

const removeFormError = () => {
  $$('.form-header__error').forEach((formHeaderError) => {
    formHeaderError.remove();
  });
  $$('.form-body__error').forEach((formBodyError) => {
    formBodyError.remove();
  });
};

const resetForm = () => {
  $('.form').reset();
  if ($('.form fieldset')) {
    $('.form .form-body').innerHTML = $('.form fieldset').innerHTML;
  }
  $$('.form .form-body__images-wrapper').forEach((imgWrapper) => {
    URL.revokeObjectURL(imgWrapper.querySelector('img').src);
    imgWrapper.remove();
  });
  removeFormError();
  $('.form .btn--blue').textContent = 'Thêm';
  $('.form .btn--blue').id = 'add';
  activeHeading($('.form-header__heading:first-child'));
  activeContent();
};

const toggleForm = () => {
  $('.form').classList.toggle('hidden-animate');
  $('.form-container').classList.toggle('hidden');
};

const renderImg = (imgs) => {
  [...imgs].forEach((img) => {
    const src = URL.createObjectURL(img);
    const html = `
    <div class="form-body__images-wrapper">
      <img id="delete-image" src="${src}" alt="${img.name}" />
      <i class="fas fa-times"></i>
    </div>
    `;
    $('#images').insertAdjacentHTML('beforebegin', html);
  });
};

const toggleAction = (action) => {
  action.classList.toggle('display-n');
};

const hiddenAllAction = () => {
  $$('.table__action').forEach((action) => {
    action.classList.add('display-n');
  });
};

document.addEventListener('click', () => {
  hiddenAllAction();
});

// //////////////////////////////////////////////////////////////////
// EVENT LISTENER
$('.form')?.addEventListener('change', (e) => {
  if (e.target.files) renderImg(e.target.files);
});

$('.table')?.addEventListener('click', (e) => {
  if (e.target.closest('.table__icon-action')) {
    const action = e.target.nextElementSibling;
    if (action.classList.contains('display-n')) {
      hiddenAllAction();
      toggleAction(action);
    } else hiddenAllAction();
    e.stopPropagation();
  }
  if (e.target.closest('#details')) toggleForm();
});

$('.header-section')?.addEventListener('click', (e) => {
  if (e.target.closest('.btn--blue')) toggleForm();
});

$('.form')?.addEventListener('click', (e) => {
  if (e.target.closest('[class="form-header__heading"]')) {
    activeHeading(e.target.closest('.form-header__heading'));
    activeContent();
  }
  if (e.target.closest('[class="btn"]')) {
    toggleForm();
    resetForm();
  }
});

// //////////////////////////////////////////
// RENDER HTML
const renderFormError = (message) => {
  const [field, messageErr] = message.split(':');
  const html = `
    <div class="form-body__error">
      <i class="fas fa-exclamation-circle"></i>
      <span>${messageErr}</span>
    </div>
    `;
  $(`#${field}`).insertAdjacentHTML('afterend', html);

  const { index } = $(`#${field}`).closest('.form-body__content').dataset;
  const formHeading = $(`.form-header__heading:nth-child(${index})`);
  if (!formHeading.querySelector('.form-header__error'))
    formHeading.insertAdjacentHTML(
      'beforeend',
      `<div class="form-header__error"></div>`
    );
};

const getHTMLProductRow = (prod) => {
  const allowSell = prod.allowSell
    ? `primary">Đang bán`
    : `secondary">Không bán`;
  const updateAt = new Intl.DateTimeFormat('vi-VN', {
    timeStyle: 'short',
    dateStyle: 'long',
  }).format(new Date(prod.updateAt));

  return `
  <tr class="table__row">
    <td class="table__data">
      <div class="checkbox">
        <i class="checkbox__icon far fa-square"></i>
        <i class="checkbox__icon far fa-check-square display-n"></i>
      </div>
    </td>
    <td class="table__data">${prod.title}</td>
    <td class="table__data">${prod.category}</td>
    <td class="table__data">${prod.listPrice || ''}</td>
    <td class="table__data">${prod.originalPrice || ''}</td>
    <td class="table__data">${prod.quantity || ''}</td>
    <td class="table__data color-${allowSell}</td>
    <td class="table__data">${updateAt}</td>
    <td class="table__data">
      <i class="fas fa-ellipsis-v table__icon-action"></i>
      <span id="details" class="table__action display-n">Chi tiết</span>
    </td>
  </tr>
`;
};

const renderCreate = (prod) => {
  $('.table__body').insertAdjacentHTML('afterbegin', getHTMLProductRow(prod));
};

const renderRow = (prod) => {
  $('.table__body').insertAdjacentHTML('beforeend', getHTMLProductRow(prod));
};

const renderRows = async (products) => {
  try {
    if (products.length === 0) {
      $('.table__body').innerHTML =
        '<tr><td colspan="10">Không có sản phẩm nào</td></tr>';
      return;
    }
    const cats = await category.getAllCategory();

    products.forEach((prod) => {
      cats.forEach((cat) => {
        // eslint-disable-next-line no-param-reassign
        if (cat._id === prod.category) prod.category = cat.name;
      });
    });

    $('.table__body').innerHTML = '';
    products.forEach((prod) => {
      renderRow(prod);
    });
  } catch (err) {
    utils.renderNotification(
      'error',
      'Hiển thị dữ liệu thất bại! Hãy thử tải lại trang'
    );
  }
};

const renderDetails = (prod) => {
  const innerFormBody = $('.form-body').innerHTML;
  const formBodyContentHTML = `<fieldset disabled="disabled">${innerFormBody}</fieldset>`;
  $('.form-body').innerHTML = formBodyContentHTML;
  $('#title').value = prod.title;
  $('#isbn').value = prod.isbn;
  $('#category').textContent = prod.category;
  $('#authors').value = prod.authors.join(', ') || '';
  $('#supplier').value = prod.supplier || '';
  $('#publisher').value = prod.publisher || '';
  $('#datePublished').textContent = prod.datePublished || '';
  $('#language').textContent = prod.languageBook || '';
  $('#translator').value = prod.translator || '';
  $('#bookLayout').value = prod.bookLayout || '';
  $('#dimensions').value = prod.dimensions || '';
  $('#weight').value = prod.weight || '';
  $('#pages').value = prod.pages || '';
  $('#description').value = prod.description || '';
  $('#listPrice').value = prod.listPrice || '';
  $('#originalPrice').value = prod.originalPrice || '';
  if (prod.allowSell) $('#allowSell').classList.add('toggle-switch--checked');
  prod.images.forEach((name, index) => {
    const imgFormHTML = `
    <div class="form-body__images-wrapper">
      <img id="delete-image" src="/img/products/${name}" alt="image product ${index}"/>
      <i class="fas fa-times"></i>
    </div>
    `;
    $('#images').insertAdjacentHTML('beforebegin', imgFormHTML);
  });
};

const resetFilter = () => {
  const filterOptions = $$('.filter-option');
  filterOptions.forEach((filterOption) => {
    if (filterOption.dataset.categoryFilter) {
      // eslint-disable-next-line no-param-reassign
      filterOption.querySelector(
        '.option__selected .option__name'
      ).textContent = 'Thể loại';
    }
    if (filterOption.dataset.allowSellFilter) {
      // eslint-disable-next-line no-param-reassign
      filterOption.querySelector(
        '.option__selected .option__name'
      ).textContent = 'Trạng thái';
    }
    if (
      filterOption.dataset.listPriceFilter ||
      filterOption.dataset.originalPriceFilter
    ) {
      filterOption.reset();
    }
  });
};

export {
  renderRow,
  renderRows,
  renderCreate,
  renderDetails,
  renderFormError,
  removeFormError,
  activeHeading,
  activeContent,
  resetForm,
  resetFilter,
};
