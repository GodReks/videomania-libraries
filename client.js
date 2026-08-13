(() => {
    const BG_ID = "videomania-library-bg";
    const OVERLAY_ID = "videomania-library-overlay";

    function getLibraryId() {
        const hash = window.location.hash || "";

        const queryIndex = hash.indexOf("?");
        if (queryIndex === -1) return null;

        const params = new URLSearchParams(hash.substring(queryIndex + 1));

        return (
            params.get("topParentId") ||
            params.get("parentId") ||
            null
        );
    }

    function getApiClient() {
        return window.ApiClient || null;
    }

    function getBackdropUrl(itemId) {
        const api = getApiClient();

        if (!api || !itemId) return null;

        try {
            return api.getImageUrl(itemId, {
                type: "Backdrop",
                index: 0,
                maxWidth: 1920,
                quality: 90
            });
        } catch (error) {
            console.error("[Videomania] Backdrop URL error:", error);
            return null;
        }
    }

    function ensureElements() {
        let bg = document.getElementById(BG_ID);
        let overlay = document.getElementById(OVERLAY_ID);

        if (!bg) {
            bg = document.createElement("div");
            bg.id = BG_ID;
            document.body.appendChild(bg);
        }

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = OVERLAY_ID;
            document.body.appendChild(overlay);
        }

        return { bg, overlay };
    }

    function hideBackground() {
        const bg = document.getElementById(BG_ID);
        const overlay = document.getElementById(OVERLAY_ID);

        bg?.classList.remove("active");
        overlay?.classList.remove("active");
    }

    function updateBackground() {
        const libraryId = getLibraryId();

        if (!libraryId) {
            hideBackground();
            return;
        }

        const url = getBackdropUrl(libraryId);

        if (!url) {
            hideBackground();
            return;
        }

        const { bg, overlay } = ensureElements();

        /* Précharge pour éviter un flash */
        const image = new Image();

        image.onload = () => {
            bg.style.backgroundImage = `url("${url}")`;
            bg.classList.add("active");
            overlay.classList.add("active");
        };

        image.onerror = () => {
            console.warn(
                "[Videomania] Aucun backdrop exploitable pour",
                libraryId
            );
            hideBackground();
        };

        image.src = url;
    }

    let timer;

    function scheduleUpdate() {
        clearTimeout(timer);
        timer = setTimeout(updateBackground, 150);
    }

    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("popstate", scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    scheduleUpdate();

    console.log("[Videomania] Libraries mod loaded");
})();
