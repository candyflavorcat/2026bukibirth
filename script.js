function generateImagePaths(prefix, start, end, extension = 'jpg') {
    const images = [];
    for (let i = start; i <= end; i++) {
        images.push(`images/${prefix}${i.toString().padStart(3, '0')}.${extension}`);
    }
    return images;
}

const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const leftImage = document.getElementById('leftImage');
const rightImage = document.getElementById('rightImage');
const pageCounter = document.getElementById('pageCounter');

const images = generateImagePaths('photo', 0, 126);
let currentPage = 0;

function preloadImages() {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function isMobile() {
    return window.innerWidth <= 768;
}

function updatePages() {
    if (isMobile()) {
        rightImage.src = images[currentPage];
        leftImage.src = '';
    } else {
        leftImage.src = images[currentPage] || '';
        rightImage.src = images[currentPage + 1] || '';
    }
    updatePageCounter();
}

function updatePageCounter() {
    pageCounter.innerHTML = `
      <input id="pageInput" type="number" min="0" max="${images.length-1}" value="${currentPage}">
      / ${images.length - 1}
    `;

    const input = document.getElementById('pageInput');
    input.addEventListener('change', () => {
        currentPage = parseInt(input.value) || 0;
        if (currentPage % 2 !== 0 && !isMobile()) currentPage--;
        updatePages();
    });
}

function handleClick(e) {
    if (isMobile()) {
        const half = rightPage.clientWidth / 2;
        if (e.offsetX < half) currentPage--;
        else currentPage++;
    } else {
        if (e.currentTarget.id === 'leftPage') currentPage -= 2;
        else currentPage += 2;
    }

    currentPage = Math.max(0, Math.min(currentPage, images.length - 1));
    updatePages();
}

function handleKey(e) {
    if (e.key === 'ArrowLeft') currentPage -= isMobile() ? 1 : 2;
    if (e.key === 'ArrowRight') currentPage += isMobile() ? 1 : 2;
    currentPage = Math.max(0, Math.min(currentPage, images.length - 1));
    updatePages();
}

leftPage.addEventListener('click', handleClick);
rightPage.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKey);

window.addEventListener('resize', updatePages);

preloadImages();
updatePages();
