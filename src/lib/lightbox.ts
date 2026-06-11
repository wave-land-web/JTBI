import Swiper from 'swiper'
import { Keyboard, Navigation } from 'swiper/modules'
import 'swiper/css'

/**
 * Pause any playing media inside `scope` (Mux players and native videos).
 * Optional-chains `pause` to guard custom elements that haven't upgraded yet.
 */
function pauseMedia(scope: HTMLElement) {
  scope
    .querySelectorAll<HTMLElement & { pause?: () => void }>('mux-player, video')
    .forEach((el) => el.pause?.())
}

function initLightboxWrapper(wrapper: HTMLElement) {
  const dialog = wrapper.querySelector<HTMLDialogElement>('[data-lightbox]')
  const swiperEl = wrapper.querySelector<HTMLElement>('[data-lightbox-swiper]')
  const triggers = Array.from(
    wrapper.querySelectorAll<HTMLButtonElement>('[data-lightbox-trigger]'),
  )
  const closeBtn = wrapper.querySelector<HTMLButtonElement>('[data-lightbox-close]')
  const prevEl = wrapper.querySelector<HTMLButtonElement>('[data-lightbox-prev]')
  const nextEl = wrapper.querySelector<HTMLButtonElement>('[data-lightbox-next]')

  if (!dialog || !swiperEl || triggers.length === 0) return

  let swiper: Swiper | null = null

  function ensureSwiper() {
    if (swiper) return swiper
    swiper = new Swiper(swiperEl as HTMLElement, {
      modules: [Navigation, Keyboard],
      loop: triggers.length > 1,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl, nextEl },
      slidesPerView: 1,
      spaceBetween: 0,
    })
    // Stop video playback when navigating away from a slide (pausing the whole
    // swiper is robust against loop reordering).
    swiper.on('slideChange', () => pauseMedia(swiperEl as HTMLElement))
    return swiper
  }

  triggers.forEach((trigger, i) => {
    trigger.addEventListener('click', () => {
      if (!dialog.open) dialog.showModal()
      const sw = ensureSwiper()
      sw.update()
      if (triggers.length > 1) sw.slideToLoop(i, 0)
      else sw.slideTo(i, 0)
    })
  })

  closeBtn?.addEventListener('click', () => dialog.close())

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })

  // Fires for the close button, backdrop click, AND Esc — stop playback on all.
  dialog.addEventListener('close', () => pauseMedia(dialog))
}

export function initLightbox(wrapperSelector: string) {
  const initAll = () => {
    document.querySelectorAll<HTMLElement>(wrapperSelector).forEach(initLightboxWrapper)
  }

  initAll()
  document.addEventListener('astro:after-swap', initAll)
}
