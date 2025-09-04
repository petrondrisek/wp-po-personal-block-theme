document.addEventListener("DOMContentLoaded", () => {
    const isMobile = () => window.innerWidth <= 768;
    const expandNullLevel = document.querySelector(".expand-null-level");

    expandNullLevel.addEventListener("click", () => {
        document.querySelector(".null-level").classList.toggle("open");
    });

    document.querySelectorAll(".child-trigger").forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
        const parent = this.closest(".has-child");
        const submenu = parent.querySelector(".nested");

        if (!isMobile()) {
        document.querySelectorAll(".has-child").forEach((item) => {
            if (!item.contains(parent) && item !== parent) {
            item.classList.remove("open");
            }
        });
        }

        parent.classList.toggle("open");

        // Desktop
        if (!isMobile() && submenu) {
        submenu.style.display = "block";

        // keep height based on trigger position
        const anyFirstLevelHeight = document.querySelector('.first-level')?.offsetHeight ?? 0;
        const parentTop = parent.classList.contains('first-level') ? anyFirstLevelHeight : -anyFirstLevelHeight;

        if (parent.classList.contains('first-level')) {
            submenu.style.left = '0';
            submenu.style.top = parentTop + 'px';
        }

        // overflow detection
        const submenuRect = submenu.getBoundingClientRect();
        submenu.style.display = "";

        const overflow = submenuRect.right > window.innerWidth;
        if (overflow) {
            submenu.classList.add("left-align");
        } else {
            submenu.classList.remove("left-align");
        }
        }

        e.stopPropagation();
    });
    });

    document.addEventListener("click", (e) => {
    if (!isMobile()) {
        document.querySelectorAll(".has-child").forEach((item) =>
        item.classList.remove("open")
        );
    }
    });

    window.addEventListener("resize", () => {
    document.querySelectorAll(".has-child").forEach((item) =>
        item.classList.remove("open")
    );
    });
});