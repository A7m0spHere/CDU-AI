const tutorial = document.querySelector<HTMLElement>('[data-first-agent]');
if (tutorial) {
  const picker = tutorial.querySelector<HTMLFieldSetElement>('[data-agent-picker]')!;
  const inputs = [...picker.querySelectorAll<HTMLInputElement>('input')];
  const panels = [...tutorial.querySelectorAll<HTMLElement>('[data-agent-tool]')];
  const updateTool = () => {
    const selected = inputs.find(input => input.checked)!.value;
    panels.forEach(panel => { panel.hidden = panel.dataset.agentTool !== selected; });
    tutorial.dataset.agentReady = 'true';
  };
  inputs.forEach(input => input.addEventListener('change', updateTool));
  updateTool();
  picker.hidden = false;

  tutorial.querySelectorAll<HTMLImageElement>('img[data-media-content]').forEach(image => {
    image.addEventListener('error', () => {
      image.hidden = true;
      const zoom = image.closest<HTMLElement>('[data-image-zoom]');
      if (zoom) zoom.hidden = true;
      const figure = image.closest<HTMLElement>('[data-agent-media]')!;
      figure.dataset.mediaState = 'pending';
      figure.querySelector<HTMLElement>('[data-media-placeholder]')!.hidden = false;
    });
    if (image.complete && image.naturalWidth === 0) image.dispatchEvent(new Event('error'));
  });
}

function initPermissionDrawer(): void {
  const dialog = document.getElementById('first-agent-permission-drawer');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const openButtons = [...document.querySelectorAll<HTMLButtonElement>(`[data-first-agent-drawer-open="${dialog.id}"]`)];
  const closeButtons = [...dialog.querySelectorAll<HTMLButtonElement>('[data-first-agent-drawer-close]')];
  const setExpanded = (expanded: boolean) => {
    openButtons.forEach(button => button.setAttribute('aria-expanded', String(expanded)));
  };

  for (const button of openButtons) {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (dialog.open) return;
      dialog.showModal();
      setExpanded(true);
    });
  }

  for (const button of closeButtons) {
    button.addEventListener('click', () => dialog.close());
  }

  dialog.addEventListener('close', () => {
    dialog.returnValue = '';
    setExpanded(false);
  });

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (event: PointerEvent) => {
      if (event.target !== dialog) return false;
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    let outsidePointerId: number | null = null;
    dialog.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) {
        outsidePointerId = null;
        return;
      }
      outsidePointerId = isOutside(event) ? event.pointerId : null;
    });
    dialog.addEventListener('pointerup', (event) => {
      const shouldClose = outsidePointerId === event.pointerId && isOutside(event);
      if (outsidePointerId === event.pointerId) {
        outsidePointerId = null;
      }
      if (shouldClose) {
        dialog.close();
      }
    });
    dialog.addEventListener('pointercancel', (event) => {
      if (outsidePointerId === event.pointerId) {
        outsidePointerId = null;
      }
    });
    dialog.addEventListener('close', () => {
      outsidePointerId = null;
    });
  }
}

initPermissionDrawer();
