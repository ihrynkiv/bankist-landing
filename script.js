'use strict';
//Variables
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('header');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Create a cookie message
const createCookieMessage = function () {
  const header = document.querySelector('.header');
  const message = document.createElement('div');
  message.classList.add('cookie-message');
  message.innerHTML =
    'We use cookied for improved functiomality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

  header.after(message);

  const btnCloseCookie = document.querySelector('.btn--close--cookie');
  btnCloseCookie.addEventListener('click', function () {
    message.remove();
    localStorage.setItem('cookie', 'agree');
  });
};

if (!localStorage.getItem('cookie')) {
  createCookieMessage();
}

//Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });

  tabsContent.forEach(tabContent => {
    tabContent.classList.remove('operations__content--active');
  });

  //Add active classes
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Nav fade animation
nav.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    nav.querySelectorAll('.nav__link').forEach(el => {
      if (el !== link) el.style.opacity = 0.5;
    });
    nav.querySelector('img').style.opacity = 0.5;
  }
});

nav.addEventListener('mouseout', function (e) {
  nav.querySelectorAll('.nav__link').forEach(el => {
    el.style.opacity = 1;
  });
  nav.querySelector('img').style.opacity = 1;
});

//Sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [{ isIntersecting }] = entries;
  if (!isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal Section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [{ isIntersecting, target }] = entries;

  if (!isIntersecting) return;

  target.classList.remove('section--hidden');
  observer.unobserve(target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  //section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//Lazy Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [{ isIntersecting, target }] = entries;

  if (!isIntersecting) return;

  target.src = target.dataset.src;
  target.addEventListener('load', function () {
    target.classList.remove('lazy-img');
  });
  observer.unobserve(target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => [imgObserver.observe(img)]);

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const maxSlide = slides.length;
  let curSlide = 0;

  const createDots = function () {
    for (let i = 0; i < maxSlide; i++) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<buuton class="dots__dot" data-slide="${i}"></buuton>`
      );
    }
  };

  const activateDot = function (slide = 0) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide = 0) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    activateDot(slide);
  };

  const init = function () {
    createDots();
    goToSlide();
    activateDot();
  };

  init();

  const prevSlide = function () {
    curSlide = curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide - 1;
    goToSlide(curSlide);
  };

  const nextSlide = function () {
    curSlide = (curSlide + 1) % maxSlide;
    goToSlide(curSlide);
  };

  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = +e.target.dataset.slide;
      goToSlide(curSlide);
    }
  });
};

slider();
