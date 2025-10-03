document.addEventListener('DOMContentLoaded', function() {
    // --- Carousel Logic ---
    const carouselSlide = document.querySelector('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let carouselImages = [];
    let currentIndex = 0;

    function showImage(index) {
        if (carouselImages.length === 0) return;
        const newTransform = `translateX(-${index * 100}%)`;
        carouselSlide.style.transform = newTransform;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % carouselImages.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(currentIndex);
    }

    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);

    // --- Unsplash API Logic ---
    // User's credentials
    const unsplashUsername = 'mylesgrim';
    const unsplashApiKey = 'au89b-uzNmiDMdjtZ_M0zKioic_ePM8jpc6qEQrCNWw';

    async function fetchUnsplashPhotos() {
        // Clear existing grid content
        document.getElementById('landscape-grid').innerHTML = '';
        document.getElementById('portrait-grid').innerHTML = '';

        try {
            const response = await fetch(`https://api.unsplash.com/users/${unsplashUsername}/photos?client_id=${unsplashApiKey}&per_page=30`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const photos = await response.json();

            // Populate gallery and carousel
            populateGrids(photos);
            setupCarousel(photos);

        } catch (error) {
            console.error("Error fetching photos from Unsplash:", error);
            document.getElementById('landscape-grid').innerHTML = '<p>Failed to load images from Unsplash.</p>';
        }
    }

    function populateGrids(photos) {
        const landscapeGrid = document.getElementById('landscape-grid');
        const portraitGrid = document.getElementById('portrait-grid');

        photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.urls.small;
            img.alt = photo.alt_description || 'Unsplash Photo';

            // Simple sorting based on image orientation
            if (photo.width > photo.height) {
                landscapeGrid.appendChild(img);
            } else {
                portraitGrid.appendChild(img);
            }
        });
    }

    function setupCarousel(photos) {
        // Use the first 5 images for the carousel, or fewer if not available
        carouselImages = photos.slice(0, 5).map(photo => {
            const img = document.createElement('img');
            img.src = photo.urls.regular;
            img.alt = photo.alt_description || 'Carousel Image';
            return img;
        });

        carouselSlide.innerHTML = ''; // Clear placeholder
        carouselImages.forEach(img => carouselSlide.appendChild(img));

        if (carouselImages.length > 0) {
            showImage(0);
            // Auto-advance the carousel every 5 seconds
            setInterval(nextImage, 5000);
        }
    }

    // Initial fetch
    fetchUnsplashPhotos();
});