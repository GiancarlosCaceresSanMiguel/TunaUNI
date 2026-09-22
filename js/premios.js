// js/premios.js - Gestor del carrusel de reconocimientos
(function() {
  'use strict';

  const initRecognitionCards = () => {
    const list = document.querySelector('.recognition-list');
    const recognitions = window.galleryRecognitions || [];

    if (!list || recognitions.length === 0) return;

    list.innerHTML = recognitions.map((recognition, index) => `
      <article class="card event-card recognition-card">
        <div class="event-card-media">
          <img src="${recognition.src}" alt="${recognition.description}" loading="lazy">
        </div>
        <div class="event-card-body">
          <p>${recognition.description}</p>
        </div>
      </article>
    `).join('');
  };

  const initEventSlider = () => {
    const sliders = document.querySelectorAll('.event-slider-wrap');

    sliders.forEach((sliderWrap) => {
      const slider = sliderWrap.querySelector('.event-list');
      const prevButton = sliderWrap.querySelector('.event-slider-btn.prev');
      const nextButton = sliderWrap.querySelector('.event-slider-btn.next');

      if (!slider || !prevButton || !nextButton) return;

      const getScrollAmount = () => {
        const firstCard = slider.querySelector('.event-card');
        return firstCard ? firstCard.getBoundingClientRect().width + 24 : 420;
      };

      prevButton.addEventListener('click', () => {
        slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });

      nextButton.addEventListener('click', () => {
        slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
    });
  };

  const initCarousel = () => {
    const track = document.querySelector('.carousel-track');
    const slides = track ? Array.from(track.children) : [];
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    
    // Salir si no existe el carrusel en esta página
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateIndicators();
    };

    const updateIndicators = () => {
      document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
      resetAutoPlay();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
      resetAutoPlay();
    };

    const autoPlay = () => {
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      }, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlay();
    };

    // Event listeners
    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }
    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }

    // Crear indicadores si no existen
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (indicatorsContainer && indicatorsContainer.children.length === 0) {
      slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
          resetAutoPlay();
        });
        indicatorsContainer.appendChild(indicator);
      });
    }

    // Pausar autoplay al pasar el mouse
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carousel.addEventListener('mouseleave', () => autoPlay());
    }

    // Iniciar autoplay
    autoPlay();

    // Cleanup al descargar la página
    window.addEventListener('beforeunload', () => {
      clearInterval(autoPlayInterval);
    });
  };

  const initEventModal = () => {
    const cards = document.querySelectorAll('.event-card');
    const modal = document.getElementById('event-modal-overlay');
    const title = document.getElementById('event-modal-title');
    const subtitle = document.getElementById('event-modal-subtitle');
    const description = document.getElementById('event-modal-description');
    const date = document.getElementById('event-modal-date');
    const location = document.getElementById('event-modal-location');
    const image = document.getElementById('event-modal-image');
    const badge = document.getElementById('event-modal-badge');
    const closeButton = document.getElementById('event-modal-close');

    if (!modal || cards.length === 0) return;

    const eventDetails = {
      'bienvenida-cachimbos': {
        title: 'Bienvenida de Cachimbos 26-2',
        subtitle: 'Actividad de bienvenida universitaria',
        description: 'Actividad de bienvenida para recibir a los nuevos ingresantes de la promoción 26-2.',
        date: 'Viernes 11 de septiembre de 2026',
        location: 'Universidad Nacional de Ingeniería',
        image: 'img/eventos/BienvenidaCachimbos26-2.jpeg'
      },
      fituni: {
        title: 'FITUNI',
        subtitle: 'Festival Internacional de Tunas Universitarias',
        description: 'Participación de la Tuna UNI en el Festival Internacional de Tunas Universitarias 2026.',
        date: '13 y 14 de noviembre de 2026',
        location: 'Universidad Nacional de Ingeniería, Lima',
        image: 'img/eventos/proximamente-fituni.svg'
      },
      'festival-nacional': {
        title: 'Convocatoria 26-2',
        subtitle: 'Convocatoria de nuevos integrantes',
        description: 'Convocatoria abierta para quienes desean integrarse a la Tuna de la Universidad Nacional de Ingeniería.',
        date: '19 de septiembre de 2026',
        location: 'Universidad Nacional de Ingeniería, Lima',
        image: 'img/eventos/Convocatoria262.jpeg'
      },
      'certamen-psicologia-uigv': {
        title: 'V Certamen Internacional de Tunas | PsicologíaS UIGV',
        subtitle: 'Certamen internacional de tunas en Miraflores',
        description: 'Participaremos en el certamen internacional de tunas de Psicología UIGV. La programación indica viernes 25 en el Parque El Reducto N.º 2 y sábado 26 en el Anfiteatro Chabuca Granda.',
        date: 'Viernes 25 y sábado 26',
        location: 'Miraflores, Lima, Perú',
        image: 'img/eventos/CertamenPsicologiaGarcilazo.jpeg'
      }
    };

    const closeModal = () => {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    const openModal = (eventKey) => {
      const selected = eventDetails[eventKey];
      if (!selected) return;

      title.textContent = selected.title;
      subtitle.textContent = selected.subtitle;
      description.textContent = selected.description;
      date.textContent = `Fecha: ${selected.date}`;
      location.textContent = `Lugar: ${selected.location}`;
      badge.textContent = 'Próximo evento';
      image.src = selected.image || 'img/fondos/Calidad.jpg';
      image.alt = selected.title;
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
    };

    cards.forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.event));
    });

    closeButton?.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initRecognitionCards();
      initEventSlider();
      initCarousel();
      initEventModal();
    });
  } else {
    initRecognitionCards();
    initEventSlider();
    initCarousel();
    initEventModal();
  }
})();
