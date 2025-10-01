document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');

    // Lógica para el menú móvil
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Lógica para encoger el header al hacer scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.classList.add('py-1');
                header.classList.remove('py-3');
            } else {
                header.classList.remove('py-1');
                header.classList.add('py-3');
            }
        });
    }

    // --- Lógica para el MODAL de imágenes ---
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const mainProductImages = document.querySelectorAll('.main-image');

    mainProductImages.forEach(image => {
        image.addEventListener('click', () => {
            if (imageModal && modalImage) {
                modalImage.src = image.src;
                imageModal.classList.remove('hidden');
            }
        });
    });
    
    // Cierra el modal con el botón X o al hacer clic fuera
    if (closeModal) {
        closeModal.addEventListener('click', () => imageModal.classList.add('hidden'));
    }
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) imageModal.classList.add('hidden');
        });
    }

    // Añadida la funcionalidad para cerrar el modal con la tecla 'Escape'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
            imageModal.classList.add('hidden');
        }
    });

    // --- Lógica para las MINIATURAS (Thumbnails) ---
    const thumbnailImages = document.querySelectorAll('.thumbnail-image');

    thumbnailImages.forEach(thumbnail => {
        thumbnail.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            if (!productCard) return;

            const mainImage = productCard.querySelector('.main-image');
            if (!mainImage) return;

            mainImage.src = event.target.src;

            const allThumbnailsInCard = productCard.querySelectorAll('.thumbnail-image');
            allThumbnailsInCard.forEach(thumb => {
                thumb.classList.remove('border-pink-500');
                thumb.classList.add('border-transparent');
            });
            event.target.classList.add('border-pink-500');
            event.target.classList.remove('border-transparent');
        });
    });

    // --- Lógica para quitar/poner mute al video al hacer clic ---
    const interactiveVideos = document.querySelectorAll('.interactive-video');

    interactiveVideos.forEach(video => {
        video.addEventListener('click', (event) => {
            // Este truco evita que se active/desactive el sonido si se hace clic en la barra de controles
            const rect = video.getBoundingClientRect();
            if (event.clientY < rect.bottom - 40) { // 40px es la altura aproximada de los controles
                 video.muted = !video.muted;
            }
        });
    });

    // --- Lógica del Formulario de Contacto (AJAX) ---
    const contactForm = document.getElementById('contact-form-js');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            
            // !! IMPORTANTE: Reemplaza con tu ID de Formspree
            const formAction = "https://formspree.io/f/xrbyqdwl"; 

            formStatus.textContent = "Enviando...";
            formStatus.className = 'text-center text-gray-600 mt-4';

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = "¡Gracias por tu mensaje! Redirigiendo...";
                    formStatus.className = 'text-center text-green-600 mt-4 font-bold';
                    contactForm.reset();
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2500); // Espera 2.5 segundos antes de redirigir
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! Hubo un problema al enviar tu formulario.";
                        }
                        formStatus.className = 'text-center text-red-600 mt-4 font-bold';
                    })
                }
            }).catch(error => {
                formStatus.textContent = "Oops! Hubo un problema de red.";
                formStatus.className = 'text-center text-red-600 mt-4 font-bold';
            });
        });
    }
});

