// --- Lógica del Menú ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2');
            header.classList.remove('py-3');
        } else {
            header.classList.add('py-3');
            header.classList.remove('py-2');
        }
    });

   // --- Lógica de la Galería de Imágenes y Modal ---
    const modal = document.getElementById('image-modal');
    if (!modal) return; // Si no hay modal en la página, no hacer nada más.

    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    let currentThumbnails = [];
    let currentIndex = 0;

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const mainImage = card.querySelector('.main-image');
        const thumbnails = Array.from(card.querySelectorAll('.thumbnail-image'));

        // Lógica para cambiar la imagen principal al hacer clic en una miniatura
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', (e) => {
                // Previene que el evento de clic se propague a elementos padres
                e.stopPropagation(); 
                const newSrc = thumb.src;
                if (mainImage) {
                    mainImage.src = newSrc;
                }
                // Actualiza el borde de la miniatura activa
                thumbnails.forEach(t => t.classList.replace('border-pink-500', 'border-transparent'));
                thumb.classList.replace('border-transparent', 'border-pink-500');
            });
        });

        // Lógica para abrir el modal
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                // Obtiene todas las imágenes de ESTE producto (incluyendo la principal si no es una miniatura)
                const allImages = thumbnails.length > 0 ? thumbnails : [mainImage];
                currentThumbnails = allImages.map(t => t.src);
                
                // Encuentra el índice de la imagen actual
                currentIndex = currentThumbnails.indexOf(mainImage.src);
                if (currentIndex === -1) currentIndex = 0; // Fallback por si acaso

                // Muestra la imagen y el modal
                modalImage.src = mainImage.src;
                modal.classList.remove('hidden');

                // Muestra u oculta los botones de navegación si hay más de una imagen
                if (currentThumbnails.length > 1) {
                    modalPrev.classList.remove('hidden');
                    modalNext.classList.remove('hidden');
                } else {
                    modalPrev.classList.add('hidden');
                    modalNext.classList.add('hidden');
                }
            });
        }
    });

    // Función para cambiar de imagen en el modal
    function showImage(index) {
        modalImage.src = currentThumbnails[index];
    }

    // Event listeners para los botones del modal
    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se cierre el modal al hacer clic en el botón
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentThumbnails.length - 1;
            showImage(currentIndex);
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se cierre el modal al hacer clic en el botón
            currentIndex = (currentIndex < currentThumbnails.length - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        });
    }

    // Event listeners para cerrar el modal
    if (closeModal) {
        closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));
    }
    
    modal.addEventListener('click', (e)=> {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Event listeners para el teclado (Esc y flechas)
    document.addEventListener('keydown', (e)=> {
        if (modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') {
            modal.classList.add('hidden');
        }
        if (e.key === 'ArrowLeft' && currentThumbnails.length > 1) {
            modalPrev.click();
        }
        if (e.key === 'ArrowRight' && currentThumbnails.length > 1) {
            modalNext.click();
        }
    });

    // --- Lógica del Video Interactivo (Corregida) ---
    const interactiveVideos = document.querySelectorAll('.interactive-video');
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    interactiveVideos.forEach(video => {
        // Para PC: un clic reproduce el video y activa el sonido.
        if (!isMobile) {
            video.addEventListener('click', () => {
                // Dejamos que el navegador maneje el play/pause por defecto.
                // Solo nos aseguramos de que el sonido esté activado.
                video.muted = false;
            });
        }
        // Para Móviles: no hacemos nada. El navegador usa su comportamiento 
        // estándar (clic para play/pause, controles para el sonido), que es lo esperado.
    });


    // --- Lógica del Formulario de Contacto (AJAX) ---
    const contactForm = document.getElementById('contact-form-js');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            
            // !! IMPORTANTE: Reemplaza con tu ID de Formspree
            const formAction = "https://formspree.io/f/YOUR_FORM_ID"; 

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

