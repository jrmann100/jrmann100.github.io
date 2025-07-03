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
<nosecure-component/></nosecure-component>
<ripple-component d="m 6.2220957,7.1841562 c -0.2961276,0.2444863 -0.2961276,0.6394258 0,0.8839121 l 2.9460895,2.4323267 -2.9460895,2.432327 c -0.2961276,0.244485 -0.2961276,0.639426 0,0.88391 0.296127,0.244491 0.774487,0.244491 1.0706148,0 l 3.4851945,-2.877416 c 0.296127,-0.244486 0.296127,-0.639425 0,-0.883912 L 7.2927105,7.1778872 C 7.004176,6.9396697 6.5182227,6.9396697 6.2220957,7.1841562 Z M 21,3 H 3 C 1.9,3 1,3.9 1,5 v 14 c 0,1.1 0.9,2 2,2 h 18 c 1.1,0 2,-0.9 2,-2 V 5 C 23,3.9 22.1,3 21,3 Z M 20,19 H 4 C 3.45,19 3,18.55 3,18 V 6 C 3,5.45 3.45,5 4,5 h 10.5 v 1.5 c 0,0.55 0.45,1 1,1 H 21 V 18 c 0,0.55 -0.45,1 -1,1 z" text="Shell"></ripple-component>
<form class="godango" data-needs-secure hidden>
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
  </div>
  <p class="stats">
    <label>entropy ≈ <input type="text" size="3" name="entropy" disabled /> bits,</label>
    <label>length <input type="text" size="3" name="length" disabled /> chars</label>
  </p>
  <fieldset name="result">
    <input name="copy" type="button" value="copy" />
    <input name="new" type="submit" value="new" />
    <input name="output" size="20" readonly type="text" />
    <input name="edit" type="button" value="edit" />
    <!-- todo width !-->
  </fieldset>
  <textarea
    cols="40"
    rows="8"
    readonly
    placeholder="Recent passwords will show up here.&#10;Reload the page to clear the list."
  >
  </textarea>
  <!-- TODO: consider making this a tab -->
  <details class="options" open>
    <summary style="font-weight: bold">options</summary>
    <fieldset name="options">
      <div>
        <label style="display: inline-block"
          ><input name="count" type="number" min="1" max="999" /> word(s)</label
        >,
        <label style="display: inline-block"
          >separator <input name="separator" type="text" size="1"
        /></label>
      </div>
      <fieldset name="sauce">
        <legend>suffix</legend>
        <div>
          <input id="sauce-random" type="radio" name="sauce-type" value="random" />
          <label for="#sauce-random">random</label><br />
          <input id="sauce-custom" type="radio" name="sauce-type" value="custom" />
          <label for="#sauce-custom">custom:</label>
          <input type="text" required size="3" name="sauce-value" /><br />
          <input id="sauce-none" type="radio" name="sauce-type" value="none" />
          <label for="#sauce-none">none</label>
        </div>
        <aside>
          A suffix helps your passphrase meet special requirements, like including capital letters
          or numbers.<br />While these rules are meant to make passwords harder to guess, they can
          also make them harder to remember.<br />If your passphrases are sufficiently long and
          random, you can reuse the same suffix and still remember it easily.
        </aside>
      </fieldset>
    </fieldset>
  </details>
  <small
    >This is a passphrase generator based on
    <a href="https://www.eff.org/dice">EFF Dice-Generated Passphrases</a>, with added options
    including custom suffixes. It uses
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues">Web Crypto</a>
    to randomize passwords.<br /><br />Everything runs in your browser. Check out the source on
    <a href="https://github.com/jrmann100/jrmann100.github.io/blob/main/static/js/godango.js"
      >GitHub.</a
    ></small
  >
</form>
<script type="module">
  import main from '/static/apps/godango/godango.js';
  main();
</script>
<!--{{/main}}-->
