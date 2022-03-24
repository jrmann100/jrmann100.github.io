<!--{{head}}-->
<title>Welcome to Jordan's Website</title>
<meta name="description" content="Jordan made a little routing website and wants you to check it out!">
<style>
    header div.face {
        height: 10rem;
        width: 10rem;
        margin: 1rem;
    }

    header>nav>ul>li.index {
        font-weight: 900;
    }
</style>
<!--{{/head}}-->
<!--{{title}}-->
Hi, I'm Jordan Mann.
<!--{{/title}}-->
<!--{{main}}-->
<!-- todo -->
<img class="profile-photo lazy" src="https://jrmann.com/static/img/jordan.jpeg" height="250"
    alt="Photo of Jordan, looking handsome in a maroon shirt.">
<h1>
    who?
</h1>
I'm a student pursuing my passions, including art, dance, and technology.
<h1>
    where?
</h1>
I'm from the Bay Area, but it often feels as though I'm living in cyberspace. You can find me on <a
    href="https://github.com/jrmann100">GitHub</a>, <a href="https://jsfiddle.net/user/jrmann100">JSFiddle</a>, or
<a href="https://stackoverflow.com/users/9068081/jordan-mann">Stack Overflow</a>. Email: first name at last name dot
com.
<h1>
    what?
</h1>
You can take a look at my <a target="_blank"
    href="https://docs.google.com/document/d/19HvlGXLH77AvFYCLOAfuUHSBb-Ko73WLqq1zqfBmN28/edit?usp=sharing">résumé</a>,
or visit the galleries for <a href="https://jrmann.com/gallery/software">software design</a>, <a
    href="https://jrmann.com/gallery/art">art</a>, and <a href="https://jrmann.com/gallery/dance">dance</a>.
<h1>
    how?
</h1>
I teach myself everything in project form, and most often I'm looking to find opportunities that will make a
difference in the world while also pushing me in a new direction. I treat my programming like an art, germinating
projects in my mind, visualizing them in sketchbooks, and finally realizing work with code.
<h1>
    when? why?
</h1>
When I picked up <i><a target="_blank" href="https://www.manning.com/books/hello-world">Hello World!</a></i> at age
ten, I fell in love with the art of programming. I've experimented with user interfaces all my life, and being able
to create my own (a few syntax errors notwithstanding) felt like magic. I've since expanded my skills from the
Python language to include the HTML, JavaScript, and CSS you're reading right now, and I've learned the command line
and rudimentary embedded development through other projects.
<script>
    document.documentElement.addEventListener("mousemove", (e) => {
        const els = document.querySelectorAll("header .face svg");
        const face_rect = els[0].getBoundingClientRect();

        // The function approaches 1 and -1, so that there isn't a dramatic effect at the bottom of the page.

        const cap = (x) => 2 / Math.PI * Math.atan(2 * x);
        const chx = cap((e.clientX - (face_rect.x + (face_rect.width / 2))) / face_rect.width);
        const chy = cap((e.clientY - (face_rect.y + (face_rect.height / 2))) / face_rect.height);

        window.requestAnimationFrame(() =>
            els.forEach((el, n) => {
                el.style.transform = `perspective(100rem) rotateY(${chx * 20 * (n + 1) / els.length}deg) rotateX(${chy * -20 * (n + 1) / els.length}deg) translateZ(${n * 0.5}rem)`;
                // Changed to white for some wacky box-shadow stuff. Was rgba(0,0,0,0.2).
                el.style.filter = `drop-shadow(${chx * 0.5}rem ${Math.abs(chy) * 0.5}rem 0.5rem var(--shadow-color))`
            }))
    });
</script>
<!--{{/main}}-->