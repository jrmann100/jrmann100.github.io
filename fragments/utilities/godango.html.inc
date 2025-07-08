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
<form class="godango" data-needs-secure hidden>
  <p class="stats">
    <label>entropy ≈ <input type="text" size="3" name="entropy" disabled /> bits,</label>
    <label>length <input type="text" size="3" name="length" disabled /> chars</label>
  </p>
  <fieldset name="result">
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
    <input name="copy" type="button" value="copy" />
    <input hidden name="output" size="20" readonly type="text" />
    <input hidden name="edit" type="button" value="edit" />
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
      <fieldset name="sauce">
        <legend>passphrase</legend>
        <div>
          <label style="display: inline-block"
            ><input name="count" type="number" min="1" max="999" /> word(s)</label
          >,
          <label style="display: inline-block"
            >separator <input name="separator" type="text" size="1"
          /></label>
        </div>
        <aside>
          Why use a passsphrase instead of a password?
          <a href="https://xkcd.com/936/" target="_blank">Learn more.</a><br />
        </aside>
      </fieldset>
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
