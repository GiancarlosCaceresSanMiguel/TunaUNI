// js/header.js - Cargar y gestionar el header dinámico
(function() {
  'use strict';

  const loadHeader = () => {
    const placeholder = document.querySelector('.header-placeholder');
    if (!placeholder) return;

    fetch('components/header.html')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar el header');
        return response.text();
      })
      .then(data => {
        placeholder.innerHTML = data;
        initHeader();
      })
      .catch(err => {
        console.error('Error al cargar el header:', err);
        // Fallback: crear un header básico en caso de error
        createFallbackHeader(placeholder);
      });
  };

  const initHeader = () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const header = document.querySelector('.modern-header');

    if (!toggle || !nav) return;

    // Toggle del menú
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });

    // Cerrar menú al hacer click en un link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        nav.classList.remove('open');
      });
    });

    // Cerrar menú al hacer click afuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.modern-header')) {
        toggle.classList.remove('open');
        nav.classList.remove('open');
      }
    });

    // Agregar clase 'scrolled' al hacer scroll
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  };

  const createFallbackHeader = (placeholder) => {
    placeholder.innerHTML = `
      <header class="modern-header">
        <div class="container">
          <div class="logo">
            <a href="index.html" style="display: flex; align-items: center; gap: 0.8rem; color: white; text-decoration: none;">
              <span style="font-size: 1.4rem; color: #c9a227; font-weight: 700;">Tuna Ingeniería</span>
            </a>
          </div>
          <nav class="nav-links">
            <a href="index.html">Inicio</a>
            <a href="historia.html">Historia</a>
            <a href="integrantes.html">Integrantes</a>
            <a href="galeria.html">Anuncios</a>
            <a href="contacto.html">Contacto</a>
          </nav>
          <button class="menu-toggle" aria-label="Menú">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>
      </header>
    `;
    initHeader();
  };

  // Cargar header cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();
