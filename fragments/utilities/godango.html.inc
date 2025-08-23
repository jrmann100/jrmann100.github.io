<!--{{head}}-->
<title>~jordan/utilities/godango</title>
<meta name="description" content="A dice-based passphrase generator designed by Jordan Mann" />
<link rel="stylesheet" href="/static/apps/godango/godango.css" />
<!--{{/head}}-->
<!--{{title}}-->
<small style="font-weight: normal; display: inline-block">utilities/</small>godango
<!--{{/title}}-->
<!--{{main}}-->
<noscript>Sorry, but you need JavaScript to use this utility. 😔</noscript>
<nosecure-component></nosecure-component>
<div class="godango-app" data-needs-secure hidden>
  <button name="configure">configure</button>
  <!-- todo: removed entropy but we should show it in options editing mode? -->
  <div class="godango-machine">
    <div class="buttonlike reel controller" role="button" tabindex="0">
      <div class="face">SPIN</div>
      <div class="face">SPIN</div>
    </div>
    <div class="reel">
      <div class="face">🍒</div>
      <div class="face">🍋</div>
    </div>
    <div class="reel">
      <div class="face">🍒</div>
      <div class="face">🍋</div>
    </div>
    <div class="reel">
      <div class="face">🍒</div>
      <div class="face">🍋</div>
    </div>
    <div class="reel">
      <div class="face">🍒</div>
      <div class="face">🍋</div>
    </div>
    <div class="reel sauce">
      <div class="face">🍒</div>
      <div class="face">🍋</div>
    </div>
  </div>
  <!-- todo: size length-value based on max length -->
  <button name="copy" type="button">copy (<span class="length-value">(23)</span>)</button>
  <script type="module">
    import main from '/static/apps/godango/godango.js';
    main();
  </script>
  <!--{{/main}}-->
</div>
