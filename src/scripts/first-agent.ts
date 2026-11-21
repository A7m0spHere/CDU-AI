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
