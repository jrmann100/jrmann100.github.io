/**
 * @file Clipboard helper. Parses and renders data of various formats from the clipboard.
 * @author Jordan Mann
 */

/**
 * Add a listener to render data from the clipboard on paste.
 */
export default function main() {
  document.body.addEventListener('paste', (ev) => {
    ev.preventDefault();
    /**
     * @type {HTMLElement | null}
     */
    const outputs = document.querySelector('#outputs');
    if (outputs === null) {
      throw new Error('Could not found output container.');
    }

    let items = ev.clipboardData?.items;

    if (items === undefined) {
      outputs.innerHTML =
        '<span style="color: var(--bad)">Error: received no clipboard data.</span>';
      return;
    }

    outputs.replaceChildren();

    for (const item of items) {
      const figure = document.createElement('figure');
      const caption = document.createElement('figcaption');
      caption.textContent = item.kind + ': ' + item.type;
      figure.append(caption);
      if (item.kind === 'string') {
        /**
         * @type {HTMLIFrameElement | undefined}
         */
        let frame;
        const type = item.type;
        if (type === 'text/html') {
          frame = document.createElement('iframe');
          figure.append(frame);
        }
        const ta = document.createElement('textarea');

        /**
         * Display useful controls for a set of links.
         * @param {Set<string>} links to render controls for.
         * @param {boolean} copy whether to render a button to copy the links.
         * If we're just pasting a list of links, we don't need to copy them again.
         */
        const handleLinks = (links, copy = true) => {
          if (links.size > 1) {
            const openLinksButton = document.createElement('button');
            openLinksButton.textContent = `open ${links.size} links`;
            openLinksButton.addEventListener('click', () =>
              links.forEach((link) => window.open(link, '_blank'))
            );

            figure.append(openLinksButton);

            if (copy) {
              const copyLinksButton = document.createElement('button');
              copyLinksButton.textContent = `copy ${links.size} links`;
              copyLinksButton.addEventListener('click', () => {
                navigator.clipboard.writeText([...links].join('\n'));
              });
              figure.append(copyLinksButton);
            }
          }
        };

        // trying to make the callback async was causing issues
        // with the DataTransferItemList/DataTransferItems being freed
        // possibly related to https://stackoverflow.com/a/13443728/9068081
        new Promise((res) => item.getAsString(res)).then((string) => {
          // TODO: ignore anchor links?
          if (type === 'text/plain') {
            const lines = [...string.matchAll(/\n/g)].length;
            if (lines > 1) {
              caption.textContent += ` (${lines + 1} lines)`;
            }

            // split by whitespace and try to parse URLs; check for host otherwise "protocol:" will match
            // todo: should we handle commas and other separators?
            const links = new Set(
              string.split(/\s+/).filter((/** @type {string} */ line) => {
                try {
                  return new URL(line).host;
                } catch {
                  return false;
                }
              })
            );
            handleLinks(links, false);
          }

          if (frame instanceof HTMLIFrameElement) {
            frame.srcdoc = string;
            frame.addEventListener('load', () => {
              const contentDocument = frame?.contentDocument ?? undefined;
              if (contentDocument === undefined) {
                return;
              }
              // prefer to open links in the parent window if possible without overriding another <base>
              if (contentDocument.querySelector('base') === null) {
                const base = document.createElement('base');
                base.target = '_parent';
                contentDocument.head.append(base);
              }
              /**
               * Set of valid URLs linked in the document.
               * @type {Set<string>}
               */
              const links = new Set(
                [...contentDocument.querySelectorAll('a')]
                  .map((link) => link.href)
                  .filter((href) => {
                    // guard against anchor links and other non-URL hrefs
                    try {
                      new URL(href);
                      return true;
                    } catch {
                      return false;
                    }
                  })
              );
              handleLinks(links);
            });
          }
          try {
            // try to parse as JSON and pretty-print it
            const json = JSON.parse(string);
            ta.style.fontFamily = 'monospace';
            ta.style.whiteSpace = 'pre-wrap';
            ta.textContent = JSON.stringify(json, null, 2);
          } catch {
            ta.textContent = string;
          }

          // scale to fit content up to 10em
          ta.style.height = `${ta.scrollHeight}px`;
          ta.style.maxHeight = '10em';
        });
        figure.append(ta);
      } else if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file !== null) {
          const img = document.createElement('img');
          img.alt = 'Image pasted from clipboard';
          img.src = URL.createObjectURL(file);
          figure.append(img);
        }
      }
      outputs.append(figure);
    }
  });
}
