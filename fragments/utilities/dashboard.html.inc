<!--{{head}}-->
<title>~jordan/utilities/dashboard</title>
<meta name="description" content="Various info widgets formatted neatly for your convenience" />
<style>
  header nav li.dashboard,
  header nav li.utilities {
    font-weight: 900;
  }

  div.wrapper {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    justify-content: center;
    gap: 2em;
    white-space: nowrap; /* checkme - otherwise there are different heights in same row */
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
    border: var(--default-border);
    padding: 0.1rem;
    width: 100%;
  }

  h2 {
    font-size: 5em;
  }

  /* I am so proud of this */
  /* checkme: what is the behavior in firefox which is not webkit? */
  progress::-webkit-progress-bar {
    background-image: repeating-linear-gradient(
      to right,
      transparent,
      transparent 1%,
      var(--black) 1%,
      var(--black) 10%
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
    <h2><span class="icon">🗓</span> <span class="value">????</span></h2>
    <progress></progress>
  </fieldset>
  <fieldset name="time">
    <legend>time</legend>
    <h2><span class="icon">🕛</span> <span class="value">????</span></h2>
    <progress></progress>
  </fieldset>
  <fieldset name="battery" hidden>
    <legend>battery</legend>
    <h2><span class="icon">🔌</span> <span class="value">???</span></h2>
    <progress></progress>
  </fieldset>
</div>
<script type="module">
  import { main } from '/static/js/dashboard.js';
  main();
</script>
<!--{{/main}}-->
