const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const hiddenAllOption = () => {
  $$('.option__selected').forEach((optionSelected) => {
    optionSelected.classList.remove('hidden');
  });
  $$('.option__select').forEach((optionSelect) => {
    optionSelect.classList.add('hidden');
  });
};

const toggleOption = (option, e) => {
  const optionSelectedName = option.querySelector(
    '.option__selected .option__name  '
  );
  const optionSelected = option.querySelector('.option__selected');
  const optionSelect = option.querySelector('.option__select');

  if (e.target.closest('.option__selected')) {
    hiddenAllOption();
    optionSelected.classList.add('hidden');
    optionSelect.classList.remove('hidden');
  }

  if (e.target.closest('.option__select')) {
    hiddenAllOption();
  }

  if (e.target.classList.contains('option__name')) {
    optionSelectedName.textContent = e.target.textContent;
  }
  e.stopPropagation();
};

const toggleSortIcon = (e) => {
  $$('.table__icon-sort--active').forEach((icon) => {
    if (icon.closest('.table__heading') !== e.currentTarget)
      icon.classList.remove('table__icon-sort--active');
  });

  const iconUp = e.currentTarget.querySelector('i:nth-child(1)');
  const iconDown = e.currentTarget.querySelector('i:nth-child(2)');

  if (
    !iconUp.classList.contains('table__icon-sort--active') &&
    !iconDown.classList.contains('table__icon-sort--active')
  ) {
    iconUp.classList.add('table__icon-sort--active');
  } else if (iconUp.classList.contains('table__icon-sort--active')) {
    iconUp.classList.remove('table__icon-sort--active');
    iconDown.classList.add('table__icon-sort--active');
  } else if (iconDown.classList.contains('table__icon-sort--active')) {
    iconDown.classList.remove('table__icon-sort--active');
  }
};

const toggleCheck = (checkbox) => {
  const icons = checkbox.querySelectorAll('.checkbox__icon');

  checkbox.classList.toggle('checkbox--checked');
  icons.forEach((icon) => icon.classList.toggle('display-n'));
};

const togglePopup = () => {
  const checkboxesChecked = $$('.table__body .checkbox--checked');
  if (checkboxesChecked.length === 0) {
    $('.popup-container--alert').classList.toggle('hidden');
    $('.popup--alert').classList.toggle('hidden-animate');
  } else {
    $('.popup-container--confirm').classList.toggle('hidden');
    $('.popup--confirm').classList.toggle('hidden-animate');
    $(
      '.popup--confirm .popup__message'
    ).textContent = ` Bạn có chắc muốn xóa ${checkboxesChecked.length} mục này`;
  }
};

document.addEventListener('click', (e) => {
  hiddenAllOption();
  if (e.target.closest('.option')) {
    toggleOption(e.target.closest('.option'), e);
  }
  if (e.target.closest('.toggle-switch')) {
    e.target
      .closest('.toggle-switch')
      .classList.toggle('toggle-switch--checked');
  }
});

$$('.popup').forEach((popup) => {
  popup.addEventListener('click', (e) => {
    if (e.target.closest('.btn') || e.target.closest('.popup__icon-close'))
      togglePopup();
  });
});

$('.header-section')?.addEventListener('click', (e) => {
  if (e.target.closest('.btn--red')) togglePopup();
});

$('.table')?.addEventListener('click', (e) => {
  if (e.target.closest('.checkbox')) toggleCheck(e.target.closest('.checkbox'));
});

$('.table__heading .checkbox')?.addEventListener('click', (e) => {
  $$('.table__body .checkbox').forEach((checkbox) => {
    const icons = checkbox.querySelectorAll('.checkbox__icon');

    checkbox.classList.toggle('checkbox--checked');
    icons.forEach((icon) => {
      icon.classList.toggle('display-n');
    });
  });
});

// NAVBAR
$$('.nav__item').forEach((navItem) => {
  navItem?.addEventListener('click', (e) => {
    const nextElement = navItem.nextElementSibling;
    if (!nextElement?.classList.contains('sub-navbar')) return;
    nextElement.classList.toggle('display-n');
  });
});

if (window.location.pathname === '/') {
  $('.nav__item:nth-child(1)').classList.add('nav__item--active');
}

if (
  window.location.pathname.startsWith('/products') ||
  window.location.pathname.startsWith('/categories')
) {
  $('.nav__item:nth-child(2)').classList.add('nav__item--active');
  $('.sub-navbar:nth-child(3)').classList.remove('display-n');
}

if (window.location.pathname.startsWith('/products')) {
  $('.sub-nav [href="/products"]').classList.add('sub-nav__item--active');
}

if (window.location.pathname.startsWith('/categories')) {
  $('.sub-nav [href="/categories"]').classList.add('sub-nav__item--active');
}

// NOTIFICATION
const notifications = $$('.notification');
notifications.forEach((notification) => {
  notification.addEventListener('click', (e) => {
    if (e.target.classList.contains('notification__icon-close')) {
      notification.classList.add('hidden');
    }
  });
});

// SORT IN TABLE
[2, 3, 4, 5, 6, 7, 8].forEach((column) => {
  $(`.table__heading:nth-child(${column})`)?.addEventListener(
    'click',
    toggleSortIcon
  );
});

window.addEventListener('load', () => {
  $('body').classList.remove('preload');
});

$('.bars-icon').addEventListener('click', () => {
  $('.root').classList.toggle('root--display-sidebar');
});
