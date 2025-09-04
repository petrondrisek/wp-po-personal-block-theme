var activeSliders = [];

const FLICKITY_INIT_CLASSNAME = 'flickity';
const FLICKITY_PHONE_CLASSNAME = 'slider-phone';
const FLICKITY_TABLET_CLASSNAME = 'slider-tablet';
const FLICKITY_DESKTOP_CLASSNAME = 'slider-desktop';
const PROGRESS_BAR_CLASSNAME = 'progress';
const TAILWIND_MD = 768;
const TAILWIND_LG = 1024;

/**
 * Get Flickity options based on slider attributes
 * @param {HTMLElement} slider
 * @returns {object} Flickity options
*/
function getFlickityOptions(slider) {
    const draggable = slider.parentElement.getAttribute('data-swipe') === 'true';
    const pageDots = slider.parentElement.getAttribute('data-dots') === 'true';
    const prevNextButtons = slider.parentElement.getAttribute('data-arrows') === 'true';
    const autoPlay = slider.parentElement.getAttribute('data-autoplay') === 'true';

    return {
        draggable,
        freeScroll: false,
        prevNextButtons,
        pageDots,
        wrapAround: true,
        arrows: false,
        autoPlay: autoPlay ? 3000 : false
    };
}

/**
 * Sleep using Promise
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Destroy Flickity slider
 * @param {HTMLElement} slider
 * @param {Flickity} sliderFlickity
*/
async function destroySlider(slider, sliderFlickity) {
    if(!activeSliders.find((s) => s.slider === slider)) return;

    try {
        sliderFlickity.destroy();

        const childs = Array.from(slider.children);
        if (!childs.length) {
            console.warn('No child elements found to reset transform.');
            return;
        }

        await wait(100);

        childs.forEach((child) => fixStyle(child, false));

        activeSliders = activeSliders.filter((s) => s.slider !== slider);

    } catch (error) {
        console.error('Error during slider cleanup:', error);
    }
}

function fixStyle(slide, on){
    slide.style.position = on ? 'absolute' : ``;
    slide.style.top = on ? '0' : '';
    slide.style.left = on ? '0' : '';
    slide.style.width = on ? '100%' : '';

    if(!on){
        slide.style.transform = 'translateX(0)';
    }
}

/**
 * Initializa Flickity slider for specific element
 * @param {HTMLElement} slider
 * @param {object} options - Flickity options
 */
async function initSlider(slider, options = {}) {
    if(activeSliders.find((s) => s.slider === slider)) return;

    if (!slider) {
        console.warn('Slider element not found!');
        return;
    }

    let fl;

    try {
        fl = new Flickity(slider, options);

        activeSliders.push({ slider, sliderFlickity: fl });

        const childs = slider.querySelectorAll('div.flickity-slider > *');

        slider.parentElement.querySelector(`.${PROGRESS_BAR_CLASSNAME}`).style.width = 1 / childs.length * 100 + "%";

        fl.on('change', (index) => {
            slider.parentElement.querySelector(`.${PROGRESS_BAR_CLASSNAME}`).style.width = ((index + 1) / childs.length) * 100 + "%";
        });

        await wait(500);
        childs.forEach((child) => fixStyle(child, true));
        
    } catch (error) {
        console.error('Flickity initialization failed:', error);
        return;
    }
}


function debounce(func, limitMS) {
    let timer = null;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, ...args);
        }, limitMS);
    };
}

// initialization
window.addEventListener('DOMContentLoaded', () => {
  const resizeInit = () => {
    const width = window.innerWidth;

    let phoneSwipable = [];
    let tabletSwipable = [];
    let desktopSwipable = [];
      
    try {
        const flickitySliders = [...document.querySelectorAll(`.${FLICKITY_INIT_CLASSNAME}`)];
        phoneSwipable = flickitySliders.filter((slider) => slider.classList.contains(FLICKITY_PHONE_CLASSNAME));
        tabletSwipable = flickitySliders.filter((slider) => slider.classList.contains(FLICKITY_TABLET_CLASSNAME));
        desktopSwipable = flickitySliders.filter((slider) => slider.classList.contains(FLICKITY_DESKTOP_CLASSNAME));
    } catch (error) {
        console.error('Error during slider initialization:', error);
        return;
    }

    // Tailwind MD
    if(width < TAILWIND_MD){
        const allSwipable = [...phoneSwipable, ...tabletSwipable, ...desktopSwipable];
        allSwipable.forEach((slider) => initSlider(slider, getFlickityOptions(slider)));
    } 
    
    // Tailwind MD - Tailwind lG
    else if(width >= TAILWIND_MD && width < TAILWIND_LG) {
        const deleteInactive = activeSliders.filter(
            (s) => s.slider.classList.contains(FLICKITY_PHONE_CLASSNAME)
        );

        deleteInactive.forEach((slider) => destroySlider(slider.slider, slider.sliderFlickity));

        (tabletSwipable || []).forEach((slider) => initSlider(slider, getFlickityOptions(slider)));
        (desktopSwipable || []).forEach((slider) => initSlider(slider, getFlickityOptions(slider)));
    }

    // Tailwind > lg
    else if(width >= TAILWIND_LG) {
        const deleteInactive = activeSliders.filter(
            (s) => {
                return (
                    s.slider.classList.contains(FLICKITY_PHONE_CLASSNAME) ||
                    s.slider.classList.contains(FLICKITY_TABLET_CLASSNAME)
                );
            }
        );

        deleteInactive.forEach((slider) => destroySlider(slider.slider, slider.sliderFlickity));

        (desktopSwipable || []).forEach((slider) => initSlider(slider, getFlickityOptions(slider)));
    }
  };

  window.addEventListener('resize', debounce(resizeInit, 300));

  resizeInit();

});
