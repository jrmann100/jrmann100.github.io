<!--{{title}}-->
rippling card test
<!-- delme -->
<!--{{/title}}-->
<!--{{head}}-->
<style>
  main {
    display: flex;
    gap: 1rem;
  }
</style>
<!--{{/head}}-->
<!--{{main}}-->
<ripple-component
  d="m 6.2220957,7.1841562 c -0.2961276,0.2444863 -0.2961276,0.6394258 0,0.8839121 l 2.9460895,2.4323267 -2.9460895,2.432327 c -0.2961276,0.244485 -0.2961276,0.639426 0,0.88391 0.296127,0.244491 0.774487,0.244491 1.0706148,0 l 3.4851945,-2.877416 c 0.296127,-0.244486 0.296127,-0.639425 0,-0.883912 L 7.2927105,7.1778872 C 7.004176,6.9396697 6.5182227,6.9396697 6.2220957,7.1841562 Z M 21,3 H 3 C 1.9,3 1,3.9 1,5 v 14 c 0,1.1 0.9,2 2,2 h 18 c 1.1,0 2,-0.9 2,-2 V 5 C 23,3.9 22.1,3 21,3 Z M 20,19 H 4 C 3.45,19 3,18.55 3,18 V 6 C 3,5.45 3.45,5 4,5 h 10.5 v 1.5 c 0,0.55 0.45,1 1,1 H 21 V 18 c 0,0.55 -0.45,1 -1,1 z"
  text="Shell"
></ripple-component>
<ripple-component
  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"
  text="Account"
></ripple-component>
<ripple-component
  d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"
  text="Grades"
></ripple-component>
<script type="module">
  import createComponent from '/static/components/components.js';
  await createComponent('ripple', {
    html: true,
    css: 'local',
    js: true
  });
</script>
<!--{{/main}}-->
