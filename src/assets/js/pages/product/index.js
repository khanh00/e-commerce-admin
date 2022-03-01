import * as category from '../category/category';
import * as productView from './productView';
import * as product from './product';
import * as utils from '../../utils';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let currentTitle;
let page = 1;
let limit = 10;
let sort = '';
let search = '';
let allProducts;
let filter = '';
let queryString = '';

if (window.location.pathname === '/products')
  (async () => {
    allProducts = await product.getAllProduct();
    utils.renderSpinner($('.table__body'));
    utils.updatePaginationInfo(allProducts.length);
    productView.renderRows(allProducts.slice(0, 9));
  })();

const getProducts = () => {
  const skip = (page - 1) * limit;
  return allProducts.slice(skip, skip + limit - 1);
};

const createFormData = async () => {
  const title = $('#title').value;
  const isbn = $('#isbn').value;
  const idCat = (
    await category.getAllCategory(`?name=${$('#category').textContent}`)
  )[0]._id;
  const authors = $('#authors').value.split(',');
  const supplier = $('#supplier').value;
  const publisher = $('#publisher').value;
  const datePublished = $('#datePublished').value;
  const languageBook = $('#language').textContent;
  const translator = $('#translator').value;
  const bookLayout = $('#bookLayout').value;
  const dimensions = $('#dimensions').value;
  const weight = $('#weight').value;
  const pages = $('#pages').value;
  const description = $('#description').value;
  const listPrice = $('#listPrice').value;
  const originalPrice = $('#originalPrice').value;
  const allowSell = $('#allowSell').classList.contains(
    'toggle-switch--checked'
  );

  const formData = new FormData();
  if (title) formData.append('title', title);
  if (isbn) formData.append('isbn', isbn);
  if (idCat) formData.append('category', idCat);
  if (authors) formData.append('authors', authors);
  if (supplier) formData.append('supplier', supplier);
  if (publisher) formData.append('publisher', publisher);
  if (datePublished) formData.append('datePublished', datePublished);
  if (languageBook) formData.append('language', languageBook);
  if (translator) formData.append('translator', translator);
  if (bookLayout) formData.append('bookLayout', bookLayout);
  if (dimensions) formData.append('dimensions', dimensions);
  if (weight) formData.append('weight', weight);
  if (pages) formData.append('pages', pages);
  if (description) formData.append('description', description);
  if (listPrice) formData.append('listPrice', listPrice);
  if (originalPrice) formData.append('originalPrice', originalPrice);
  if (allowSell) formData.append('allowSell', allowSell);
  formData.append('updateAt', Date.now());
  [...$('#images').files].forEach((img) => {
    formData.append('images', img);
  });

  return formData;
};

$('.form')?.addEventListener('click', async (e) => {
  if (e.target.closest('#add')) {
    // ADD PRODUCT
    e.preventDefault();
    try {
      utils.renderSpinner($('.form'));
      productView.removeFormError();
      const formData = await createFormData();
      await product.createProduct(formData);

      productView.resetForm();
      utils.removeSpinner($('.form'));
      utils.renderNotification('success', `Thêm sản phẩm thành công`);

      allProducts = await product.getAllProduct();
      productView.renderRows(getProducts());

      page = 1;
      utils.updatePaginationInfo(allProducts.length, page, limit);
    } catch (err) {
      utils.removeSpinner($('.form'));
      const messages = err.response.data.message.split('.');
      messages.forEach((message) => productView.renderFormError(message));
    }
  }

  if (e.target.closest('#modify')) {
    // MODIFY PRODUCT
    e.preventDefault();
    const nodes = $$('.form fieldset > *');
    $('.form .btn--blue').textContent = 'Lưu lại';
    $('.form .btn--blue').id = 'save';
    $('.form fieldset').remove();
    nodes.forEach((node) => {
      $('.form .form-body').appendChild(node);
    });
  } else if (e.target.closest('#save')) {
    //  SAVE PRODUCT
    e.preventDefault();
    try {
      utils.renderSpinner($('.form'));

      const formData = await createFormData();
      const prod = await product.getAllProduct(`?title=${currentTitle}`);
      const newProd = await product.updateProduct(prod[0]._id, formData);
      currentTitle = newProd.title;

      utils.removeSpinner($('.form'));
      utils.renderNotification('success', 'Lưu thành công');

      allProducts = await product.getAllProduct();
      productView.renderRows(getProducts());
    } catch (err) {
      utils.removeSpinner($('.form'));
      utils.renderNotification('error', 'Lưu thất bại. Vui lòng thử lại');
    }
  }
});

$('#delete')?.addEventListener('click', async (e) => {
  // DELETE PRODUCT
  try {
    utils.renderSpinner($('.table__body'));

    const checkboxesChecked = $$('.table__body .checkbox--checked');
    await Promise.all(
      [...checkboxesChecked].map(async (checkbox) => {
        const title = checkbox.parentElement.nextElementSibling.textContent;
        await product.deleteProduct(title);
      })
    );
    allProducts = await product.getAllProduct();
    productView.renderRows(getProducts());
    utils.renderNotification(
      'success',
      `Đã xóa ${checkboxesChecked.length} mục thành công`
    );

    utils.updatePaginationInfo(allProducts.length, page, limit);
  } catch (err) {
    utils.removeSpinner($('.table__body'));
    utils.renderNotification('error', err.response.data.message);
  }
});

// RENDER DETAIL PRODUCT
$('.table')?.addEventListener('click', async (e) => {
  if (e.target.closest('#details')) {
    utils.renderSpinner($('.form'));

    $('.form .btn--blue').textContent = 'Chỉnh sửa';
    $('.form .btn--blue').id = 'modify';
    currentTitle = e.target
      .closest('.table__row')
      .querySelector('.table__data:nth-child(2)').textContent;

    const prod = (await product.getAllProduct(`?title=${currentTitle}`))[0];
    const cat = await category.getCategory(prod.category);
    prod.category = cat.name;

    utils.removeSpinner($('.form'));
    productView.renderDetails(prod);
  }
});

$('.search')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  utils.renderSpinner($('.table__body'));
  search = $('.search__input').value.trim();
  if (search) {
    queryString = `?text[search]=${search}&score[meta]=textScore&`;
    allProducts = await product.getAllProduct(queryString);
  } else {
    queryString = '';
    allProducts = await product.getAllProduct();
  }

  productView.resetFilter();
  filter = '';
  document
    .querySelector('.table__icon-sort--active')
    ?.classList.remove('table__icon-sort--active');
  page = 1;
  utils.updatePaginationInfo(allProducts.length, page, limit);
  productView.renderRows(getProducts());
});

const SORT = [
  'title',
  'category',
  'listPrice',
  'originalPrice',
  'quantity',
  'allowSell',
  'updateAt',
];

[2, 3, 4, 5, 6, 7, 8].forEach((column, index) => {
  $(`.table__heading:nth-child(${column})`)?.addEventListener(
    'click',
    async (e) => {
      const iconActive = e.currentTarget.querySelector(
        '.table__icon-sort--active'
      );
      if (iconActive) {
        if (iconActive.classList.contains('fa-sort-up')) sort = SORT[index];
        if (iconActive.classList.contains('fa-sort-down'))
          sort = `-${SORT[index]}`;
      } else {
        sort = '-updateAt';
      }

      if (queryString) {
        if (queryString.search('sort') !== -1) {
          queryString = queryString.replace(/sort=(.*?)&/, `sort=${sort}&`);
        } else {
          queryString += `sort=${sort}&`;
        }
      } else queryString = `?sort=${sort}&`;

      utils.renderSpinner($('.table__body'));
      allProducts = await product.getAllProduct(queryString + filter);
      productView.renderRows(getProducts());
    }
  );
});

$('.paginate')?.addEventListener('click', async (e) => {
  const pageEl = e.target.closest('span');
  const prevPage = e.target.closest('i[class$=left]');
  const nextPage = e.target.closest('i[class$=right]');
  const infoPage = utils.getInfoPage();

  if (pageEl) {
    if (pageEl.classList.contains('current-page')) return;
    page = +pageEl.textContent;
  }
  if (prevPage) page = +$('.current-page').textContent - 1;
  if (nextPage) page = +$('.current-page').textContent + 1;

  if (page < 1) return;
  if (page > infoPage.maxPage) return;

  if (pageEl || prevPage || nextPage) {
    utils.renderSpinner($('.table__body'));
    utils.gotoPage(page);
    productView.renderRows(getProducts());
    utils.updatePaginationInfo(allProducts.length, page, limit);
  }
});

$('#limit')?.addEventListener('change', (e) => {
  limit = +$('#limit').value;
  utils.renderSpinner($('.table__body'));
  page = 1;
  utils.updatePaginationInfo(allProducts.length, page, limit);
  productView.renderRows(getProducts());
});

$('.filter-option-list')?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (
    (e.target.classList.contains('option__name') &&
      !e.target.closest('.option__selected')) ||
    e.target.classList.contains('btn')
  ) {
    if (!queryString) queryString = '?';
    const el = e.target.closest('.filter-option');

    if (el.dataset.categoryFilter) {
      const cat = e.target.textContent;
      if (cat === 'Thể loại') {
        filter = filter.replace(/category=.*?&/, '');
      } else {
        const catId = (await category.getAllCategory(`?name=${cat}`))[0]._id;
        if (filter.search('category') !== -1) {
          filter = filter.replace(/category=(.*?)&/, `category=${catId}&`);
        } else filter += `category=${catId}&`;
      }
    }

    if (el.dataset.allowSellFilter) {
      const allowSell = e.target.textContent;
      if (allowSell === 'Trạng thái') {
        filter = filter.replace(/allowSell=.*?&/, '');
      } else {
        const isAllowSell = e.target.textContent.startsWith('Đ');
        if (filter.search('allowSell') !== -1) {
          filter = filter.replace(
            /allowSell=(.*?)&/,
            `allowSell=${isAllowSell}&`
          );
        } else filter += `allowSell=${isAllowSell}&`;
      }
    }

    if (el.dataset.listPriceFilter) {
      const from = $('#fromListPrice').value;
      const to = $('#toListPrice').value;
      if (!from || !to) {
        filter = filter.replace(/listPrice\[gte\]=.*?&/, '');
        filter = filter.replace(/listPrice\[lte\]=.*?&/, '');
      } else if (filter.search('listPrice') !== -1) {
        filter = filter.replace(
          /listPrice\[gte\]=(.*?)&/,
          `listPrice[gte]=${from}&`
        );
        filter = filter.replace(
          /listPrice\[lte\]=(.*?)&/,
          `listPrice[lte]=${to}&`
        );
      } else filter += `listPrice[gte]=${from}&listPrice[lte]=${to}&`;
    }

    if (el.dataset.originalPriceFilter) {
      const from = $('#fromOriginalPrice').value;
      const to = $('#toOriginalPrice').value;
      if (!from || !to) {
        filter = filter.replace(/originalPrice\[gte\]=.*?&/, '');
        filter = filter.replace(/originalPrice\[lte\]=.*?&/, '');
      } else if (filter.search('originalPrice') !== -1) {
        filter = filter.replace(
          /originalPrice\[gte\]=(.*?)&/,
          `originalPrice[gte]=${from}&`
        );
        filter = filter.replace(
          /originalPrice\[lte\]=(.*?)&/,
          `originalPrice[lte]=${to}&`
        );
      } else filter += `originalPrice[gte]=${from}&originalPrice[lte]=${to}&`;
    }

    page = 1;
    sort = '';
    utils.renderSpinner($('.table__body'));
    allProducts = await product.getAllProduct(queryString + filter);
    utils.updatePaginationInfo(allProducts.length, page, limit);
    productView.renderRows(getProducts());
  }
});
