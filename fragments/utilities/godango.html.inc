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
<!-- todo: I know tabs aren't the right pattern but I am not sure what is -->
<tabs-component data-id="godango-tab">
  <tabs-tab-component data-id="godango">
    <div class="godango-app centering" data-needs-secure hidden>
      <div class="bar">
        <!-- todo: removed entropy but we should show it in options editing mode? -->
        <div class="godango-machine"></div>
      </div>
      <script type="module">
        import main from '/static/apps/godango/godango.js';
        main();
      </script>
    </div>
  </tabs-tab-component>
  <tabs-tab-component data-id="options"> watever </tabs-tab-component>
</tabs-component>
<!--{{/main}}-->
