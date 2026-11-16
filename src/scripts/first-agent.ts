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

  tutorial.querySelectorAll<HTMLImageElement | HTMLVideoElement>('[data-media-content]').forEach(media => {
    media.addEventListener('error', () => {
      media.hidden = true;
      const figure = media.closest<HTMLElement>('[data-agent-media]')!;
      figure.dataset.mediaState = 'pending';
      figure.querySelector<HTMLElement>('[data-media-placeholder]')!.hidden = false;
    });
    if (media instanceof HTMLImageElement && media.complete && media.naturalWidth === 0) media.dispatchEvent(new Event('error'));
    if (media instanceof HTMLVideoElement && media.error) media.dispatchEvent(new Event('error'));
  });
}
