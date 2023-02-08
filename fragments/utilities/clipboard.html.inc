<!--{{head}}-->
<title>~jordan/utilities/clipboard</title>
<style>
  iframe {
    all: revert;
    background: canvas;
  }
</style>
<!--{{/head}}-->
<!--{{title}}-->
<small style="font-weight: normal">utilities/</small>clipboard
<!--{{/title}}-->
<!--{{main}}-->
<noscript
  >This is a live-updating dashboard; as such, you need to enable JavaScript for it to
  work.</noscript
>
<input type="text" placeholder="paste here" id="pasteboard" maxlength="0" autofocus />
<div id="outputs"></div>
<script>
  document.querySelector('#pasteboard').addEventListener('paste', (ev) => {
    ev.preventDefault();
    const outputs = document.querySelector('#outputs');
    outputs.replaceChildren();
    for (const item of ev.clipboardData.items) {
      console.log(item);
      const figure = document.createElement('figure');
      let data = [];
      const caption = document.createElement('figcaption');
      caption.textContent = item.kind + ': ' + item.type;
      if (item.kind === 'string') {
        let frame;
        if (item.type === 'text/html') {
          frame = document.createElement('iframe');
          data.push(frame);
        }
        const ta = document.createElement('textarea');
        new Promise((res) => item.getAsString(res)).then((string) => {
          if (frame instanceof HTMLIFrameElement) {
            frame.src = 'data:text/html;charset=utf-8,' + encodeURI(string);
          }
          ta.textContent = string;
        });
        data.push(ta);
      } else if (item.kind === 'file' && item.type.startsWith('image/')) {
        img = document.createElement('img');
        // todo alt
        img.src = URL.createObjectURL(item.getAsFile());
        data.push(img);
      }
      figure.append(...data, caption);
      outputs.append(figure);
    }
  });
</script>
<!--{{/main}}-->
