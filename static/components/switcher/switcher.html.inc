<style>
  * {
    box-sizing: border-box;
    margin: 0;
  }
  /* todo vertical mode */
  :host[hidden] {
    display: none;
  }

  form {
    --cell-width: 5rem;
    border: var(--default-border);
    position: relative;
    width: fit-content;
    height: fit-content;
    display: grid;
    grid-template: auto / repeat(var(--cells), var(--cell-width));
  }

  input {
    display: block;
    font-size: inherit;
    cursor: pointer;
    margin: 0;
    opacity: 0;
  }

  .indicator {
    width: calc(var(--cell-width) - 0.2rem);
    height: calc(100% - 0.2rem);
    margin: 0.1rem;
    position: absolute;
    pointer-events: none;
    border: 0.1em solid var(--accent);
    /* border-radius: 1em; */
    visibility: hidden;
    transition: left 0.2s;
    --selected: 1;
    left: calc(var(--cell-width) * calc(var(--selected) - 1));
  }

  input:checked ~ .indicator {
    visibility: visible;
  }

  label,
  input {
    align-self: center;
    justify-self: center;
    width: 100%;
    height: 100%;
    padding: 0.5rem;
  }

  label {
    text-align: center;
    pointer-events: none;
    transition: opacity 0.1s, filter 0.3s;
  }

  .indicator {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* fixme */
  :root[data-color-scheme='light'] .indicator {
    background-color: rgba(0, 0, 0, 0.2);
  }

  /* todo branch this and see how it looks with :has() */
  input,
  label {
    --cell: 1;
    grid-column: var(--cell);
    grid-row: 1;
    width: 100%;
  }
</style>
<form></form>
