export function waitForSelectorAll<T extends HTMLElement>(selector: string, container?: HTMLElement, maxWait?: number) {
  const els = (container || document).querySelectorAll<T>(selector);

  if (els.length) {
    return Array.from(els);
  }

  return new Promise<T[]>((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const els = (container || document).querySelectorAll<T>(selector);

          if (els.length) {
            observer.disconnect();
            resolve(Array.from(els));
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    if (maxWait) {
      window.setTimeout(() => {
        observer.disconnect();
        resolve([]);
      }, maxWait);
    }
  });
}
