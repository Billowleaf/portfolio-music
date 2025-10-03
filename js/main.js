document.addEventListener('DOMContentLoaded', function() {
    // --- Global Variables ---
    let carouselImages = [];
    let galleryPhotos = []; // To store all photos for the lightbox
    let currentCarouselIndex = 0;
    let currentLightboxIndex = 0;

    // --- DOM Elements ---
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselPrevBtn = document.querySelector('.carousel-button.prev');
    const carouselNextBtn = document.querySelector('.carousel-button.next');
    const landscapeGrid = document.getElementById('landscape-grid');
    const portraitGrid = document.getElementById('portrait-grid');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const closeModalBtn = document.querySelector('.close-button');
    const modalPrevBtn = document.querySelector('.prev-slide');
    const modalNextBtn = document.querySelector('.next-slide');

    // --- Carousel Logic ---
    function showCarouselImage(index) {
        if (carouselImages.length === 0) return;
        carouselSlide.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextCarouselImage() {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
        showCarouselImage(currentCarouselIndex);
    }

    function prevCarouselImage() {
        currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
        showCarouselImage(currentCarouselIndex);
    }

    // --- Lightbox Logic ---
    function openLightbox(index) {
        currentLightboxIndex = index;
        modal.style.display = 'block';
        showLightboxImage(currentLightboxIndex);
    }

    function closeLightbox() {
        modal.style.display = 'none';
    }

    function showLightboxImage(index) {
        if (galleryPhotos.length === 0) return;
        modalImg.src = galleryPhotos[index].urls.regular;
        modalImg.alt = galleryPhotos[index].alt_description || 'Enlarged photo';
    }

    function nextLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryPhotos.length;
        showLightboxImage(currentLightboxIndex);
    }

    function prevLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
        showLightboxImage(currentLightboxIndex);
    }

    // --- Unsplash API Logic ---
    const unsplashUsername = 'mylesgrim';
    const unsplashApiKey = 'au89b-uzNmiDMdjtZ_M0zKioic_ePM8jpc6qEQrCNWw';

    async function fetchUnsplashPhotos() {
        landscapeGrid.innerHTML = '';
        portraitGrid.innerHTML = '';

        try {
            const response = await fetch(`https://api.unsplash.com/users/${unsplashUsername}/photos?client_id=${unsplashApiKey}&per_page=30`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const photos = await response.json();

            galleryPhotos = photos; // Store all photos
            populateGrids(photos);
            setupCarousel(photos);

        } catch (error) {
            console.error("Error fetching photos from Unsplash:", error);
            landscapeGrid.innerHTML = '<p style="color: #F8F8F8;">Failed to load images from Unsplash.</p>';
        }
    }

    function populateGrids(photos) {
        photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.dataset.index = index; // Use index for lightbox

            const img = document.createElement('img');
            img.src = photo.urls.small;
            img.alt = photo.alt_description || 'Unsplash Photo';

            const overlay = document.createElement('div');
            overlay.className = 'overlay';

            if (photo.description) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = photo.description;
                overlay.appendChild(description);
            }

            photoItem.appendChild(img);
            photoItem.appendChild(overlay);

            photoItem.addEventListener('click', () => openLightbox(index));

            if (photo.width > photo.height) {
                landscapeGrid.appendChild(photoItem);
            } else {
                portraitGrid.appendChild(photoItem);
            }
        });
    }

    function setupCarousel(photos) {
        carouselImages = photos.slice(0, 5).map(photo => {
            const img = document.createElement('img');
            img.src = photo.urls.regular;
            img.alt = photo.alt_description || 'Carousel Image';
            return img;
        });

        carouselSlide.innerHTML = '';
        carouselImages.forEach(img => carouselSlide.appendChild(img));

        if (carouselImages.length > 0) {
            showCarouselImage(0);
            setInterval(nextCarouselImage, 5000);
        }
    }

    // --- Event Listeners ---
    carouselNextBtn.addEventListener('click', nextCarouselImage);
    carouselPrevBtn.addEventListener('click', prevCarouselImage);

    closeModalBtn.addEventListener('click', closeLightbox);
    modalNextBtn.addEventListener('click', nextLightboxImage);
    modalPrevBtn.addEventListener('click', prevLightboxImage);

    // Close modal by clicking background
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (modal.style.display === 'block') {
            if (event.key === 'ArrowRight') {
                nextLightboxImage();
            } else if (event.key === 'ArrowLeft') {
                prevLightboxImage();
            } else if (event.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Initial fetch
    fetchUnsplashPhotos();
});