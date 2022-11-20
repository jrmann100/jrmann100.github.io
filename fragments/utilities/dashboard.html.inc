<!--{{head}}-->
<title>~jordan/utilities/dashboard</title>
<meta name="description" content="Simple daily dashboard" /><!-- todo -->
<style>
  header nav li.dashboard {
    font-weight: 900;
  }

  div.wrapper {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  fieldset {
    flex: 1;
    display: inline-block;
  }

  fieldset[hidden] {
    display: none;
  }

  progress {
    /* checkme move to interactivity.css? */
    appearance: none;
    border: 0.1rem solid var(--black);
    padding: 0.1rem;
    width: 100%;
  }

  h1 {
    font-size: 5rem;
  }

  progress::-webkit-progress-bar {
    background-image: repeating-linear-gradient(
      to right,
      transparent,
      transparent 1%,
      var(--black) 1%,
      var(--black) 10% /* checkme aesthetic */
    );
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
  }

  progress::-webkit-progress-value {
    background-color: var(--accent);
  }

  fieldset[name='time'] progress::-webkit-progress-value {
    transition: width 1s ease;
  }
</style>
<!--{{/head}}-->
<!--{{title}}-->
<small style="font-weight: normal; display: inline-block">utilities/</small>dashboard
<!--{{/title}}-->
<!--{{main}}-->
<noscript
  >This is a live-updating dashboard; as such, you need to enable JavaScript for it to
  work.</noscript
>
<div class="wrapper" data-needs-js hidden>
  <fieldset name="date">
    <legend>date</legend>
    <h1><span class="icon">🗓</span> <span class="value">????</span></h1>
    <progress></progress>
  </fieldset>
  <fieldset name="time">
    <legend>time</legend>
    <h1><span class="icon">🕛</span> <span class="value">????</span></h1>
    <progress></progress>
  </fieldset>
  <fieldset name="battery" hidden>
    <legend>battery</legend>
    <h1><span class="icon">🔌</span> <span class="value">???</span></h1>
    <progress></progress>
  </fieldset>
</div>
<script type="module">
  import { main } from '/static/js/dashboard.js';
  main();
</script>
<!--{{/main}}-->