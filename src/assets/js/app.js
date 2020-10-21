import "core-js/features/number/is-nan";
import svg4everybody from "svg4everybody";
import smoothscroll from 'smoothscroll-polyfill';
import 'particles.js';
import Swiper, { Navigation, Autoplay } from "swiper";

let headerLinks = document.querySelectorAll('.menu-header__link');
for (let link = 0; link < headerLinks.length; link++) {
  headerLinks[link].onclick = function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({block: "start", behavior: "smooth"})
  }
}
document.addEventListener("DOMContentLoaded", () => {
  svg4everybody();
  smoothscroll.polyfill();
});
Swiper.use([Navigation, Autoplay]);
const offersSlider = new Swiper(".section-offers-slider", {
  speed: 300,
  slidesPerView: 1,
  spaceBetween: 36,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  autoHeight: true,
  navigation: {
    nextEl: ".section-offers-slider-arrows-item__next",
    prevEl: ".section-offers-slider-arrows-item__prev",
  },
  breakpoints: {
    1477: {
      slidesPerView: 4,
    },
    1070: {
      slidesPerView: 3,
    },
    550: {
      slidesPerView: 2,
    },
  },
});
const particlesSettings = {
  "particles": {
    "number": {
      "value": 137,
      "density": {
        "enable": true,
        "value_area": 1025.8919341219544
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 4
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.1183721462448409,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 173.61248115909999,
      "color": "#ffffff",
      "opacity": 0.3,
      "width": 0.7891476416322727
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 0.4771227850808645
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
};
particlesJS('particles-left', particlesSettings)
particlesJS('particles-right', particlesSettings)
// ВЕРХНЕЕ МЕНЮ
const burger = document.querySelector(".burger");
const menuHeader = document.querySelector(".menu-header");
const sectionHeader = document.querySelector(".section-header");
const html = document.querySelector("html");
const body = document.querySelector("body");
burger.onclick = function () {
  this.classList.toggle("burger--active");
  menuHeader.classList.toggle("menu-header--active");
  sectionHeader.classList.toggle("section-header--active");
  html.classList.toggle("lock");
  body.classList.toggle("lock");
};
menuHeader.onclick = function () {
  this.classList.toggle("menu-header--active");
  burger.classList.toggle("burger--active");
  sectionHeader.classList.toggle("section-header--active");
  html.classList.toggle("lock");
  body.classList.toggle("lock");
};

function whichTransitionEvent() {
  let t;
  const el = document.createElement("fakeelement");

  const transitions = {
    transition: "transitionend",
    OTransition: "oTransitionEnd",
    MozTransition: "transitionend",
    WebkitTransition: "webkitTransitionEnd",
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}
// АНИМАЦИЯ ПРЕЛОАДЕРА
const transitionEvent = whichTransitionEvent();
const preloaderWrap = document.querySelector(".preloader-wrap");
const pace = document.querySelector(".pace");
preloaderWrap.addEventListener(transitionEvent, function () {
  this.parentNode.removeChild(this);
  pace.parentNode.removeChild(pace);
});
