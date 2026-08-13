(() => {
    function getLibraryId() {
        const hash = window.location.hash || "";
        const q = hash.indexOf("?");

        if (q === -1) return null;

        const params = new URLSearchParams(hash.substring(q + 1));

        return params.get("topParentId") || params.get("parentId");
    }

    function applyLibraryBackground() {
        const libraryId = getLibraryId();

        const container = document.querySelector(".backgroundContainer");

        if (!container || !window.ApiClient) {
            return;
        }

        if (!libraryId) {
            container.style.removeProperty("background-image");
            container.classList.remove("videomania-active");
            return;
        }

        const url = window.ApiClient.getImageUrl(libraryId, {
            type: "Backdrop",
            index: 0,
            maxWidth: 1920,
            quality: 90
        });

        if (!url) return;

        container.style.backgroundImage = `url("${url}")`;
        container.classList.add("videomania-active");
    }

    window.addEventListener("hashchange", () => {
        setTimeout(applyLibraryBackground, 300);
    });

    setTimeout(applyLibraryBackground, 1000);

    console.log("[Videomania] Library backgrounds enabled");
})();
