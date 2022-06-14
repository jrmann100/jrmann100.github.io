<!--{{head}}-->
<title>Welcome to Jordan's Website</title>
<meta name="description" content="Jordan made a little routing website and wants you to check it out!" />
<style>
  header>nav>ul>li.home {
    font-weight: 900;
  }

  img.profile-photo {
    margin: 1rem;
    box-shadow: 0.1rem 0.5rem 0.5rem rgb(0 0 0 / 50%);
    mix-blend-mode: luminosity;
    object-fit: cover;
  }

  @media (min-aspect-ratio: 30001/40000) {
    main {
      column-count: 2;
    }

    section {
      break-inside: avoid-column;
    }

    /* figure.profile-figure {
      float: right;
    } */
  }


  figure.profile-figure {
    margin: auto;
    width: fit-content;
    padding: 0.5rem;
  }

  figure.profile-figure figcaption {
    text-align: center;
    font-style: italic;
  }

  @media (max-aspect-ratio: 30000/40000) {
    figure.profile-figure img {
      margin: 1rem auto;
      width: 200px;
      height: 200px;
      object-position: top;
    }
  }
</style>
<!--{{/head}}-->
<!--{{title}}-->
jordan mann
<!--{{/title}}-->
<!--{{main}}-->
<!-- todo -->
<section>
  <h2>who?</h2>
  <ul>
    <li>I'm a student (he/him) at Dartmouth College.</li>
    <li>I'm from the California Bay Area.</li>
    <!-- todo links -->
    <li>I'm passionate about art, dance, and technology.</li>
  </ul>
  <br />
  <h2>what?</h2>
  <p>
    You're looking at it! I designed and developed nearly 100% of this website from scratch.<sup><a
        href="https://github.com/jrmann100/jrmann100.github.io">[source]</a></sup>
  </p>
  <p>
    <b>Also: see my <a href="/resume.html">résumé.</a></b>
  </p>
  <br />
</section>
<section>
  <h2>where?</h2>
  <figure>
    <ul>
      <!-- todo icons. discord? -->
      <li><a href="https://github.com/jrmann100">GitHub</a></li>
      <li><a href="https://jsfiddle.net/user/jrmann100">JSFiddle</a></li>
      <li><a href="https://stackoverflow.com/users/9068081/jordan-mann">Stack Overflow</a></li>
      <li><a href="https://news.ycombinator.com/user?id=jrmann100">Hacker News</a></li>
      <li>Email: first name at last name dot com</li>
    </ul>
  </figure>
  <br />
</section>
<section>
  <h2>how?</h2>
  <p>I teach myself through projects that make a difference in the world.</p>
  <p>
    Whether I'm working with code or with my hands, I design in my sketchbook before
    realizing products with visuals, sounds, and movements.
  </p>
  <br />
</section>
<section>
  <h2>when? why?</h2>
  I've loved designing interfaces ever since I read
  <i><a target="_blank" href="https://www.manning.com/books/hello-world">Hello World!</a></i> at age
  ten. My driving motivation is to create, and programming is a vehicle of that process in the same
  way any other art is.
</section>
<section>
  <figure class="profile-figure">
    <img class="profile-photo" src="/static/img/jordan.webp" height="420" width="280"
      alt="Photo of Jordan, looking handsome in a maroon shirt." />
    <figcaption>that's me!</figcaption>
  </figure>
</section>
<!--{{/main}}-->