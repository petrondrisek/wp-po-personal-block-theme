(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const NAV_OPEN_BTN = document.querySelector(".wp-block-navigation__responsive-container-open");
        const NAV_CLOSE_BTN = document.querySelector(".wp-block-navigation__responsive-container-close");
        const NAV = document.querySelector(".wp-block-navigation__responsive-container");

        if (!NAV_OPEN_BTN || !NAV_CLOSE_BTN || !NAV) return;

        const NAV_PARENT = NAV.parentElement;

        // Wordpress interactivity
        [NAV_OPEN_BTN, NAV_CLOSE_BTN].forEach(el => {
            el.removeAttribute("data-wp-on-async--click");
            el.removeAttribute("data-wp-on--keydown");
        });

        const toggleMenu = (e) => {
            e.preventDefault();

            const isOpen = NAV_OPEN_BTN.classList.toggle("open");
            NAV_CLOSE_BTN.classList.toggle("open", isOpen);
            document.documentElement.classList.toggle("has-modal-open", isOpen);

            NAV.classList.remove(isOpen ? "close" : "open");
            void NAV.offsetWidth;
            NAV.classList.add(isOpen ? "open" : "close");

            // SVG button icon animation
            const updateSvgRects = (selector, transforms) => {
                const rects = document.querySelectorAll(`${selector} svg rect`);
                if (rects.length < 2) return;

                rects.forEach((rect, i) => {
                    rect.style.transition = "transform .6s ease-in-out";
                    rect.style.transform = transforms[i];
                });
            };

            updateSvgRects(".wp-block-navigation__responsive-container-open", [
                isOpen ? "rotate(45deg) translate(4px, -8px)" : "",
                isOpen ? "rotate(135deg) translate(-12px, -32px)" : ""
            ]);

            updateSvgRects(".wp-block-navigation__responsive-container-close", [
                isOpen ? "rotate(45deg) translate(4px, -8px)" : "",
                isOpen ? "rotate(135deg) translate(-12px, -32px)" : ""
            ]);
        };

        NAV_OPEN_BTN.addEventListener("click", toggleMenu);
        NAV_CLOSE_BTN.addEventListener("click", toggleMenu);

        // Resize
        const handleResize = () => {
            NAV.classList.remove("close");

            if (window.innerWidth < 600 && NAV.parentElement !== document.body) {
                document.body.appendChild(NAV);
            } else if (window.innerWidth >= 600 && NAV.parentElement !== NAV_PARENT) {
                NAV_PARENT.appendChild(NAV);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();
    });
})();
