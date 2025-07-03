<!--{{title}}-->
<span data-only-print>Jordan Mann</span>
<span data-only-screen>résumé</span>
<!--{{/title}}-->
<!--{{head}}-->
<title>Jordan Mann - Résumé</title>
<style>
  header nav li.resume {
    font-weight: 900;
  }

  .download {
    float: right;
    margin-bottom: 1rem;
  }

  iframe {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1.3;
    border: 0;
  }

  .status {
    opacity: 0.7;
    margin-bottom: 1rem;
  }
</style>
<!--{{/head}}-->
<!--{{main}}-->
<a
  class="download"
  href="https://docs.google.com/document/d/1LcOpwM2IJcIhgiO-hPV5Ddg9txtqIGaY_wQ8Z6zRfO4/export?format=pdf"
>
  <button class="buttonsize-small">📥&ensp;Download a PDF</button>
</a>
<span class="status"
  >Loading PDF - this may take a few tries&hellip;<br /><noscript
    ><a href=".">Reload manually</a></noscript
  ></span
>
<iframe
  width="500"
  height="500"
  src="https://docs.google.com/viewer?embedded=true&url=https://docs.google.com/document/d/1LcOpwM2IJcIhgiO-hPV5Ddg9txtqIGaY_wQ8Z6zRfO4/export?format=pdf"
>
</iframe>
<script>
  // fixme: needs to execute in its own scope since unloading / reloading calls 'let interval' twice
  // not sure how to address this, ideally every script is a module and we just make the pattern
  // used in godango part of the spec
  {
    let interval = setInterval(() => (document.querySelector('iframe').src += ''), 2000);

    document.querySelector('iframe').addEventListener('load', (ev) => {
      clearInterval(interval);
      document.querySelector('.status').remove();
    });

    // if ctrl + p or cmd + p is the browser's print keybinding,
    // suppress it and open the PDF in a new tab instead.
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.open(
          'https://docs.google.com/viewerng/viewer?url=https://docs.google.com/document/d/1LcOpwM2IJcIhgiO-hPV5Ddg9txtqIGaY_wQ8Z6zRfO4/export?format%3Dpdf'
        );
      }
    });

    // if the user tries to print the page using a different method,
    // we can't prevent the dialog from showing up in this tab
    // unless we redirect.
    window.addEventListener('beforeprint', (e) => {
      window.location.href =
        'https://docs.google.com/viewerng/viewer?url=https://docs.google.com/document/d/1LcOpwM2IJcIhgiO-hPV5Ddg9txtqIGaY_wQ8Z6zRfO4/export?format%3Dpdf';
    });
  }
</script>
<!--{{/main}}-->
