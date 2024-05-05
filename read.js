document.addEventListener("DOMContentLoaded", function () {

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const showAllBtn = document.getElementById("mode");
    const showSizeBtn = document.getElementById("size");
    const fullscreenBtn = document.getElementById("fullscreen");
    const counter = document.getElementById("counter");

    let currentIndex = 0;
    let isShowAll = false;

    async function preloadAllImages(e) {
        let t = e.map((e) =>
            new Promise((t, n) => {
                let o = new Image();
                o.onload = () => t();
                o.onerror = n;
                o.src = e;
            })
        );
        try {
            await Promise.all(t);
            console.log("Todas las imágenes se han precargado correctamente.");
        } catch (n) {
            console.error("Error al precargar imágenes:", n);
        }
    }

    function showAllImages() {
        const imgContainer = document.getElementById("reader");
        if (imgContainer) {
            imgContainer.innerHTML = images.map((e) => `<img src="${e}">`).join("");
            counter.innerHTML = `${images.length}&nbsp;páginas`;
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            showSizeBtn.style.display = "none";
            showAllBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 5m0 1a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1z"></path><path d="M22 17h-1a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h1"></path><path d="M2 17h1a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1h-1"></path></svg> Modo página`;
        }
    }

    function showImage() {
        const imgContainer = document.getElementById("reader");
        if (imgContainer) {
            imgContainer.innerHTML = `<img src="${images[currentIndex]}">`;
            counter.innerHTML = `Página&nbsp;${currentIndex + 1}&nbsp;de&nbsp;${images.length}`;
            prevBtn.style.display = "inline";
            nextBtn.style.display = "inline";
            showSizeBtn.style.display = "inline";
            showAllBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19 8v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1z"></path><path d="M7 22v-1a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v1"></path><path d="M17 2v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1"></path></svg> Modo cascada';
        }
    }

    function toggleMode() {
        (isShowAll = !isShowAll) ? showAllImages() : showImage();
    }

    function toggleSize() {
        const imgContainer = document.getElementById("reader");
        if (imgContainer) {
            imgContainer.classList.toggle("size");
        }
    }

    function toggleFullscreen() {
        document.fullscreenElement ? (document.exitFullscreen(), fullscreenBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path><path d="M4 16v2a2 2 0 0 0 2 2h2"></path><path d="M16 4h2a2 2 0 0 1 2 2v2"></path><path d="M16 20h2a2 2 0 0 0 2 -2v-2"></path></svg> Pantalla completa') : (document.documentElement.requestFullscreen(), fullscreenBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 9l4 0l0 -4"></path><path d="M3 3l6 6"></path><path d="M5 15l4 0l0 4"></path><path d="M3 21l6 -6"></path><path d="M19 9l-4 0l0 -4"></path><path d="M15 9l6 -6"></path><path d="M19 15l-4 0l0 4"></path><path d="M15 15l6 6"></path></svg> Salir de pantalla completa');
    }

    preloadAllImages(images);

    const KEYS = {
        ARROW_LEFT: "ArrowLeft",
        ARROW_RIGHT: "ArrowRight",
        C: "c",
        T: "t",
        P: "p",
    };

    function handleKeyboardEvent(e) {
        let t = e.key;
        t === KEYS.ARROW_LEFT ? showPreviousImage() : t === KEYS.ARROW_RIGHT ? showNextImage() : t === KEYS.C ? toggleMode() : t === KEYS.T ? toggleSize() : t === KEYS.P && toggleFullscreen();
    }

    function showNextImage() {
        currentIndex < images.length - 1 && (currentIndex++, showImage());
    }

    function showPreviousImage() {
        currentIndex > 0 && (currentIndex--, showImage());
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", showNextImage);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", showPreviousImage);
    }

    if (showAllBtn) {
        showAllBtn.addEventListener("click", toggleMode);
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", toggleFullscreen);
    }

    if (showSizeBtn) {
        showSizeBtn.addEventListener("click", toggleSize);
    }

    const imgContainer = document.getElementById("reader");
    if (imgContainer) {
        imgContainer.addEventListener("click", () => {
            if (!isShowAll) {
                showNextImage();
                let e = document.getElementById("reader");
                e.scrollIntoView();
            }
        });
    }

    showImage();
});
