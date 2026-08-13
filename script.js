// ============================================================
// MOBILE MENU
// ============================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// EXTRA LICENSES TOGGLE
// ============================================================
function toggleExtraLicenses() {
    const wrapper = document.getElementById('extraLicenses');
    const arrow   = document.getElementById('showMoreArrow');
    const text    = document.getElementById('showMoreText');
    const isOpen  = wrapper.classList.contains('open');

    if (isOpen) {
        wrapper.style.maxHeight = '0';
        wrapper.classList.remove('open');
        arrow.style.transform = 'rotate(0deg)';
        text.textContent = 'Смотреть другие';
    } else {
        wrapper.classList.add('open');
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
        text.textContent = 'Скрыть';
    }
}

// ============================================================
// LICENSE MODAL
// ============================================================
function showLicenseModal(title, imgSrc) {
    const body = document.getElementById('licenseModalBody');
    body.innerHTML = `
        <p class="modal-img-title gradient-text">${title}</p>
        <img src="${imgSrc}" alt="${title}" class="license-full-img">
    `;
    document.getElementById('licenseModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLicenseModal(event) {
    if (!event || event.target.id === 'licenseModal' || event.target.classList.contains('modal-close')) {
        document.getElementById('licenseModal').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================================
// SUCCESS MODAL
// ============================================================
function closeSuccessModal(event) {
    if (!event || event.target.id === 'successModal' || event.target.classList.contains('modal-close')) {
        document.getElementById('successModal').classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('contactForm').reset();
    }
}

// ============================================================
// FORM SUBMIT — Web3Forms
// ============================================================
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn     = document.getElementById('submitBtn');
    const btnText = document.getElementById('submitBtnText');
    const errDiv  = document.getElementById('formError');

    // Validation
    let isValid = true;
    this.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!field.value.trim()) isValid = false;
    });
    if (!isValid) {
        errDiv.textContent = 'Пожалуйста, заполните все обязательные поля.';
        errDiv.classList.add('visible');
        return;
    }

    // Loading state
    btn.disabled = true;
    btnText.textContent = 'Отправляем…';
    errDiv.classList.remove('visible');

    // Собираем значения полей
    const name    = (this.querySelector('[name="name"]').value    || '').trim();
    const phone   = (this.querySelector('[name="phone"]').value   || '').trim();
    const email   = (this.querySelector('[name="email"]').value   || '').trim();
    const message = (this.querySelector('[name="message"]').value || '').trim();

    // Формируем тело письма в нужном формате
    const body = [
        `Оставлена заявка от: ${name}`,
        `Обращение на тему: ${message}`,
        `Обратная связь с ${name}: ${phone}${email ? ', ' + email : ''}`,
    ].join('\n\n');

    // Собираем FormData с отформатированным сообщением
    const fd = new FormData();
    fd.append('access_key', this.querySelector('[name="access_key"]').value);
    fd.append('subject',    this.querySelector('[name="subject"]').value);
    fd.append('from_name',  this.querySelector('[name="from_name"]').value);
    fd.append('message',    body);

    try {
        const res  = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body:   fd
        });
        const data = await res.json();

        if (data.success) {
            document.getElementById('successModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            this.reset();
        } else {
            errDiv.textContent = 'Ошибка отправки. Попробуйте ещё раз или позвоните нам: +7 (3952) 505-333.';
            errDiv.classList.add('visible');
        }
    } catch {
        errDiv.textContent = 'Нет соединения с интернетом. Проверьте сеть и попробуйте снова.';
        errDiv.classList.add('visible');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Отправить заявку';
    }
});

// Close modals on ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeLicenseModal();
        closeSuccessModal();
    }
});

// ============================================================
// PORTFOLIO SWIPER
// ============================================================
if (typeof Swiper !== 'undefined' && document.querySelector('.portfolio-swiper')) {
    new Swiper('.portfolio-swiper', {
        loop: true,
        grabCursor: true,
        slidesPerView: 1.2,
        spaceBetween: 20,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.portfolio-pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.portfolio-btn-prev',
            nextEl: '.portfolio-btn-next',
        },
        breakpoints: {
            640: {
                slidesPerView: 2.1,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 32,
            },
        },
    });
}

// ============================================================
// PORTFOLIO LIGHTBOX
// ============================================================
(function () {
    const portfolioImages = [
        { src: 'фото%20сайт/IMG_20181213_140658.jpg', title: 'Строительство подстанции' },
        { src: 'фото%20сайт/IMG_20181213_140737.jpg', title: 'Монтаж опоры ВЛ' },
        { src: 'фото%20сайт/IMG_2924.JPG',           title: 'Подстанция, вид при сдаче' },
        { src: 'фото%20сайт/IMG_3328.JPG',           title: 'Силовой трансформатор' },
        { src: 'фото%20сайт/IMG_3364.JPG',           title: 'Панорама подстанции' },
        { src: 'фото%20сайт/IMG_3370.JPG',           title: 'Оборудование ОРУ' },
        { src: 'фото%20сайт/IMG_3402.JPG',           title: 'Ошиновка подстанции' },
        { src: 'фото%20сайт/IMG_3408.JPG',           title: 'Монтаж трансформатора' },
        { src: 'фото%20сайт/IMG_3432.JPG',           title: 'Монтаж портала ПС' },
        { src: 'фото%20сайт/IMG_5740.JPG',           title: 'Монтаж кабелей' },
        { src: 'фото%20сайт/IMG_5758.JPG',           title: 'Подстанция, зимний период' },
        { src: 'фото%20сайт/IMG_5794.JPG',           title: 'Первичное оборудование' },
        { src: 'фото%20сайт/IMG_5823.JPG',           title: 'Силовой трансформатор' },
        { src: 'фото%20сайт/IMG_5829.JPG',           title: 'Прокладка кабелей' },
        { src: 'фото%20сайт/IMG_5855.JPG',           title: 'Шкаф РЗА' },
        { src: 'фото%20сайт/%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20WhatsApp%202025-01-13%20%D0%B2%2008.55.10_95c4c911.jpg', title: 'Панорама ВЛ 110 кВ' },
    ];

    const total   = portfolioImages.length;
    let   current = 0;

    const lb      = document.getElementById('portfolioLightbox');
    const lbImg   = document.getElementById('plightboxImg');
    const lbTitle = document.getElementById('plightboxTitle');
    const lbCount = document.getElementById('plightboxCounter');

    function showSlide(index) {
        current = ((index % total) + total) % total;
        const item = portfolioImages[current];
        // Re-trigger entrance animation
        lbImg.classList.remove('plightbox-img-anim');
        void lbImg.offsetWidth;
        lbImg.classList.add('plightbox-img-anim');
        lbImg.src             = item.src;
        lbImg.alt             = item.title;
        lbTitle.textContent   = item.title;
        lbCount.textContent   = (current + 1) + '\u00a0/\u00a0' + total;
    }

    function openLightbox(index) {
        showSlide(index);
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click on any card (works with Swiper loop clones via data-portfolio-index)
    const swiperEl = document.querySelector('.portfolio-swiper');
    if (swiperEl) {
        swiperEl.addEventListener('click', function (e) {
            const card = e.target.closest('[data-portfolio-index]');
            if (card) openLightbox(parseInt(card.dataset.portfolioIndex, 10));
        });
    }

    document.getElementById('plightboxCloseBtn').addEventListener('click', closeLightbox);
    document.getElementById('plightboxPrevBtn').addEventListener('click', function () { showSlide(current - 1); });
    document.getElementById('plightboxNextBtn').addEventListener('click', function () { showSlide(current + 1); });
    document.getElementById('plightboxBackdrop').addEventListener('click', closeLightbox);

    // Keyboard: Escape / arrows
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  showSlide(current - 1);
        if (e.key === 'ArrowRight') showSlide(current + 1);
    });

    // Swipe support inside lightbox
    let touchStartX = 0;
    lb.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            dx < 0 ? showSlide(current + 1) : showSlide(current - 1);
        }
    }, { passive: true });
})();

// ============================================================
// PROJECTS SWIPER
// ============================================================
if (typeof Swiper !== 'undefined' && document.querySelector('.projects-swiper')) {
    new Swiper('.projects-swiper', {
        loop: true,
        grabCursor: true,
        slidesPerView: 1.2,
        spaceBetween: 20,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.projects-pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.projects-btn-prev',
            nextEl: '.projects-btn-next',
        },
        breakpoints: {
            640: {
                slidesPerView: 2.1,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 32,
            },
        },
    });
}

// ============================================================
// PROJECTS LIGHTBOX
// ============================================================
(function () {
    const projectsImages = [
        { src: 'Примеры проектов/Снимок экрана 2026-07-03 195528.png', title: 'Схема электроснабжения объекта' },
        { src: 'Примеры проектов/Снимок экрана 2026-07-03 195700.png', title: 'Чертёж ВЛ 110 кВ' },
        { src: 'Примеры проектов/Снимок экрана 2026-07-03 195743.png', title: 'План подстанции 35/10 кВ' },
        { src: 'Примеры проектов/Снимок экрана 2026-07-03 195956.png', title: 'Геодезический план трассы' },
        { src: 'Примеры проектов/Снимок экрана 2026-07-03 200117.png', title: 'Схема электрических сетей' },
        { src: 'Примеры проектов/Снимок экрана 2026-07-03 200223.png', title: 'Генеральный план сети' },
        { src: 'Дополнительно/Снимок экрана 2026-07-15 191458.png', title: 'Схема учёта электроэнергии, шкаф ВУ 0,4 кВ' },
        { src: 'Дополнительно/Снимок экрана 2026-07-15 191551.png', title: 'Подъём КЛ 6 кВ на опоре ВЛ' },
        { src: 'Дополнительно/Снимок экрана 2026-07-15 191616.png', title: 'Общий вид анкерно-угловых опор ВЛ' },
        { src: 'Дополнительно/Снимок экрана 2026-07-15 191715.png', title: 'Шкаф вводного устройства ЩВУ' },
    ];

    const total   = projectsImages.length;
    let   current = 0;

    const lb      = document.getElementById('projectsLightbox');
    const lbImg   = document.getElementById('projLightboxImg');
    const lbTitle = document.getElementById('projLightboxTitle');
    const lbCount = document.getElementById('projLightboxCounter');

    function showSlide(index) {
        current = ((index % total) + total) % total;
        const item = projectsImages[current];
        lbImg.classList.remove('plightbox-img-anim');
        void lbImg.offsetWidth;
        lbImg.classList.add('plightbox-img-anim');
        lbImg.src           = item.src;
        lbImg.alt           = item.title;
        lbTitle.textContent = item.title;
        lbCount.textContent = (current + 1) + '\u00a0/\u00a0' + total;
    }

    function openLightbox(index) {
        showSlide(index);
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    const swiperEl = document.querySelector('.projects-swiper');
    if (swiperEl) {
        swiperEl.addEventListener('click', function (e) {
            const card = e.target.closest('[data-projects-index]');
            if (card) openLightbox(parseInt(card.dataset.projectsIndex, 10));
        });
    }

    document.getElementById('projCloseBtn').addEventListener('click', closeLightbox);
    document.getElementById('projPrevBtn').addEventListener('click', function () { showSlide(current - 1); });
    document.getElementById('projNextBtn').addEventListener('click', function () { showSlide(current + 1); });
    document.getElementById('projBackdrop').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  showSlide(current - 1);
        if (e.key === 'ArrowRight') showSlide(current + 1);
    });

    let touchStartX = 0;
    lb.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            dx < 0 ? showSlide(current + 1) : showSlide(current - 1);
        }
    }, { passive: true });
})();
