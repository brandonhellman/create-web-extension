export function waitForEl<T extends HTMLElement>(selector: string, container?: HTMLElement, maxWait?: number) {
  const el = (container || document).querySelector<T>(selector);

  if (el) {
    return el;
  }

  return new Promise<T | null>((resolve) => {
    let timeout: number;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const el = (container || document).querySelector<T>(selector);

          if (el) {
            window.clearTimeout(timeout);
            observer.disconnect();
            resolve(el);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    if (maxWait) {
      timeout = window.setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, maxWait);
    }
  });
}
