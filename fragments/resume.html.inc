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
</style>
<!--{{/head}}-->
<!--{{main}}-->
<a
  class="download"
  href="https://docs.google.com/document/d/1LMeAQejdKMmpCnJWJKiW07LByC2kkj8UoMS4PSEpl68/export?format=pdf"
>
  <button class="buttonsize-small">📥&ensp;Download a PDF</button>
</a>
<iframe
  width="500"
  height="500"
  src="https://docs.google.com/viewer?embedded=true&url=https://docs.google.com/document/d/1LMeAQejdKMmpCnJWJKiW07LByC2kkj8UoMS4PSEpl68/export?format=pdf"
></iframe>
<script>
  // intercept print shortcut to open printable viewer
  // standard drive preview viewer is not printable for some reason!
  // so use this workaround which previews the pdf it just exported
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      window.open(
        'https://docs.google.com/viewerng/viewer?url=https://docs.google.com/document/d/1LMeAQejdKMmpCnJWJKiW07LByC2kkj8UoMS4PSEpl68/export?format%3Dpdf'
      );
    }
  });
</script>
<!--{{/main}}-->
