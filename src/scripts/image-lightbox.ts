const MIN_SCALE = 1;
const MAX_SCALE = 3.5;
const STEP_SCALE = 0.5;

export function initImageLightbox(): void {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('.notion-prose img')).filter(
    (img) => !img.closest('a, [data-no-zoom], [data-image-zoom]'),
  );
  if (images.length === 0) return;

  const mobile = window.matchMedia('(max-width: 760px)');
  let dialog: HTMLDialogElement | null = null;
  let stage: HTMLElement | null = null;
  let canvas: HTMLElement | null = null;
  let lightboxImg: HTMLImageElement | null = null;
  let scaleLabel: HTMLElement | null = null;
  let btnIn: HTMLButtonElement | null = null;
  let btnOut: HTMLButtonElement | null = null;
  let btnReset: HTMLButtonElement | null = null;
  let btnClose: HTMLButtonElement | null = null;
  let captionAlt: HTMLElement | null = null;

  let baseWidth = 360;
  let scale = 1;
  let lastTrigger: HTMLButtonElement | null = null;
  let suppressBackdropClick = false;

  const clampScale = (next: number): number =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(next * 100) / 100));

  const applyScale = (next: number, resetScroll = false) => {
    if (!dialog || !stage || !lightboxImg || !scaleLabel || !btnIn || !btnOut) return;
    const prevScale = scale;
    scale = clampScale(next);

    const centerXRatio =
      stage.scrollWidth > 0 ? (stage.scrollLeft + stage.clientWidth / 2) / stage.scrollWidth : 0.5;
    const centerYRatio =
      stage.scrollHeight > 0 ? (stage.scrollTop + stage.clientHeight / 2) / stage.scrollHeight : 0.5;

    const targetWidth = Math.max(160, Math.round(baseWidth * scale));
    lightboxImg.style.width = `${targetWidth}px`;
    const percent = Math.round(scale * 100);
    dialog.dataset.zoomScale = String(percent);
    dialog.dataset.zoomed = scale > 1.02 ? 'true' : 'false';
    scaleLabel.textContent = `${percent}%`;
    btnOut.disabled = scale <= MIN_SCALE + 0.01;
    btnIn.disabled = scale >= MAX_SCALE - 0.01;

    if (resetScroll) {
      stage.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    } else if (Math.abs(scale - prevScale) > 0.01) {
      const nextLeft = Math.max(0, centerXRatio * stage.scrollWidth - stage.clientWidth / 2);
      const nextTop = Math.max(0, centerYRatio * stage.scrollHeight - stage.clientHeight / 2);
      stage.scrollTo({ left: nextLeft, top: nextTop, behavior: 'instant' });
    }
  };

  const computeBaseAndDefaultScale = (sourceImg: HTMLImageElement) => {
    if (!stage || !lightboxImg) return { width: 360, initialScale: 1 };
    const naturalW = sourceImg.naturalWidth || lightboxImg.naturalWidth || 1200;
    const naturalH = sourceImg.naturalHeight || lightboxImg.naturalHeight || 800;
    const aspect = naturalW / Math.max(1, naturalH);
    const viewportW = Math.min(window.innerWidth, stage.clientWidth || window.innerWidth);
    const viewportH = Math.min(window.innerHeight, stage.clientHeight || window.innerHeight);
    const stageW = Math.max(240, viewportW - 24);
    const stageH = Math.max(200, viewportH - 24);

    if (mobile.matches) {
      const initialScale = aspect >= 1.35 ? 2 : 1;
      return { width: stageW, initialScale };
    }

    const fitW = Math.min(stageW, naturalW, Math.round(stageH * aspect));
    return { width: Math.max(280, fitW), initialScale: 1 };
  };

  const closeLightbox = () => {
    if (dialog?.open) dialog.close();
  };

  const ensureDialog = () => {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    dialog.dataset.imageLightbox = '';
    dialog.setAttribute('aria-label', '图片放大预览');
    dialog.innerHTML = `
      <div class="image-lightbox__bar">
        <span class="image-lightbox__scale mono" data-lightbox-scale aria-live="polite">100%</span>
        <div class="image-lightbox__actions">
          <button type="button" class="image-lightbox__btn" data-lightbox-out aria-label="缩小图片" title="缩小 (-)">−</button>
          <button type="button" class="image-lightbox__btn" data-lightbox-in aria-label="放大图片" title="放大 (+)">+</button>
          <button type="button" class="image-lightbox__btn image-lightbox__btn--text" data-lightbox-reset aria-label="重置缩放" title="适配或放大切换 (0)">复位</button>
          <button type="button" class="image-lightbox__btn image-lightbox__close" data-lightbox-close aria-label="关闭大图预览" title="关闭 (Esc)">×</button>
        </div>
      </div>
      <div class="image-lightbox__stage" data-lightbox-stage>
        <div class="image-lightbox__canvas" data-lightbox-canvas>
          <img class="image-lightbox__img" data-lightbox-img alt="" />
        </div>
      </div>
      <div class="image-lightbox__caption" data-lightbox-caption>
        <p class="image-lightbox__alt" data-lightbox-alt></p>
        <p class="image-lightbox__tip">可拖动查看 · 双击或双指缩放</p>
      </div>
    `;
    document.body.append(dialog);

    stage = dialog.querySelector<HTMLElement>('[data-lightbox-stage]');
    canvas = dialog.querySelector<HTMLElement>('[data-lightbox-canvas]');
    lightboxImg = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]');
    scaleLabel = dialog.querySelector<HTMLElement>('[data-lightbox-scale]');
    btnIn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-in]');
    btnOut = dialog.querySelector<HTMLButtonElement>('[data-lightbox-out]');
    btnReset = dialog.querySelector<HTMLButtonElement>('[data-lightbox-reset]');
    btnClose = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]');
    captionAlt = dialog.querySelector<HTMLElement>('[data-lightbox-alt]');

    btnIn?.addEventListener('click', () => applyScale(scale + STEP_SCALE));
    btnOut?.addEventListener('click', () => applyScale(scale - STEP_SCALE));
    btnReset?.addEventListener('click', () => {
      applyScale(scale > 1.05 ? 1 : 2, scale > 1.05);
    });
    btnClose?.addEventListener('click', () => closeLightbox());

    lightboxImg?.addEventListener('dblclick', (event) => {
      event.preventDefault();
      applyScale(scale > 1.2 ? 1 : 2);
    });

    // 移动端双击图片快速切换 100% / 200%
    let lastTapTime = 0;
    lightboxImg?.addEventListener(
      'touchend',
      (event) => {
        if (event.touches.length > 0) return;
        const now = performance.now();
        if (now - lastTapTime < 280) {
          event.preventDefault();
          applyScale(scale > 1.2 ? 1 : 2);
          lastTapTime = 0;
        } else {
          lastTapTime = now;
        }
      },
      { passive: false },
    );

    // 双指捏合缩放
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    stage?.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length === 2) {
          const [t1, t2] = [event.touches[0], event.touches[1]];
          pinchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          pinchStartScale = scale;
        }
      },
      { passive: true },
    );
    stage?.addEventListener(
      'touchmove',
      (event) => {
        if (event.touches.length === 2 && pinchStartDist > 10) {
          event.preventDefault();
          const [t1, t2] = [event.touches[0], event.touches[1]];
          const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          applyScale(pinchStartScale * (dist / pinchStartDist));
        }
      },
      { passive: false },
    );

    // 桌面鼠标按住拖移画布
    let panning = false;
    let panStartX = 0;
    let panStartY = 0;
    let panScrollLeft = 0;
    let panScrollTop = 0;
    stage?.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || scale <= 1.02 || !stage) return;
      panning = true;
      suppressBackdropClick = false;
      panStartX = event.clientX;
      panStartY = event.clientY;
      panScrollLeft = stage.scrollLeft;
      panScrollTop = stage.scrollTop;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-panning');
    });
    stage?.addEventListener('pointermove', (event) => {
      if (!panning || !stage) return;
      const dx = event.clientX - panStartX;
      const dy = event.clientY - panStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) suppressBackdropClick = true;
      stage.scrollLeft = panScrollLeft - dx;
      stage.scrollTop = panScrollTop - dy;
    });
    const stopPan = (event: PointerEvent) => {
      if (!panning || !stage) return;
      panning = false;
      stage.classList.remove('is-panning');
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    };
    stage?.addEventListener('pointerup', stopPan);
    stage?.addEventListener('pointercancel', stopPan);

    dialog.addEventListener('click', (event) => {
      if (suppressBackdropClick) {
        suppressBackdropClick = false;
        return;
      }
      const target = event.target as Node | null;
      if (target === dialog || target === stage || target === canvas) {
        closeLightbox();
      }
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        applyScale(scale + STEP_SCALE);
      } else if (event.key === '-') {
        event.preventDefault();
        applyScale(scale - STEP_SCALE);
      } else if (event.key === '0') {
        event.preventDefault();
        applyScale(1, true);
      }
    });

    dialog.addEventListener('close', () => {
      if (lastTrigger?.isConnected) {
        lastTrigger.focus({ preventScroll: true });
      }
      lastTrigger = null;
    });
  };

  const openLightbox = (sourceImg: HTMLImageElement, trigger: HTMLButtonElement) => {
    ensureDialog();
    if (!dialog || !lightboxImg || !captionAlt) return;
    lastTrigger = trigger;

    const src = sourceImg.currentSrc || sourceImg.src;
    const alt = sourceImg.alt?.trim() ?? '';
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    captionAlt.textContent = alt;
    captionAlt.hidden = alt.length === 0;

    if (!dialog.open) dialog.showModal();

    const syncInitial = () => {
      const { width, initialScale } = computeBaseAndDefaultScale(sourceImg);
      baseWidth = width;
      applyScale(initialScale, true);
    };

    if (sourceImg.complete && sourceImg.naturalWidth > 0) {
      syncInitial();
    } else {
      syncInitial();
      lightboxImg.addEventListener('load', syncInitial, { once: true });
    }

    btnClose?.focus({ preventScroll: true });
  };

  images.forEach((img) => {
    const parent = img.parentElement;
    if (!parent) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'guide-image-zoom';
    button.dataset.imageZoom = '';
    const alt = img.alt?.trim();
    button.setAttribute('aria-label', alt ? `点击放大查看图片：${alt}` : '点击放大查看图片');

    const hint = document.createElement('span');
    hint.className = 'guide-image-zoom__hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = '点击放大';

    parent.insertBefore(button, img);
    button.append(img, hint);

    button.addEventListener('click', () => openLightbox(img, button));
  });
}
