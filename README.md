# Jordan's Personal Website

This is a crazy, overreaching sort of project, with the goal of creating a fun and interesting personal website entirely from scratch.

I started by writing a simple static site generator, which takes a template ([layout.html](layout.html)) and inserts sections of different pages into pre-arranged slots (`head`, `title`, `main`).

When JavaScript is available, the site turns into a single-page app, switching out those slots instead of redirecting between pages normally (which introduces all sorts of complexities regarding event listeners, timers, etc.)

It's also a project in universal design and accessibility. I wanted the site to be usable without JavaScript (and, in some cases, on print) and compliant with current standards for accessibility and performance (W3C, Lighthouse) so as to be usable by everyone… who has their browser updated.

So, the goal isn't to have a content-complete, polished website—I'll simply never get there. I'm seeking novely and challenge, implementing features to get experience with new technologies (CSS cascade layers, Web Components) as much as to make everything functional. Reading the code should be as satisfying as the browsing experience… so long as I get around to document it.

## Making it work

You can `git clone` this repository and open it in VSCode to get it running.

As of the time of writing this, you shouldn't need any external depencies to build the site, but you will need a few tools to develop and test it.

VSCode should prompt you to install some extensions, and you can `yarn install` [nodemon](https://nodemon.io) (automatic building) and [prettier](https://prettier.io) (linting)

You can probably preview the site over HTTP with no issues by using `python3 -m http.server --directory build`, but there are a couple of experimental web features which need HTTPS. So I have set up the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), which will be recommended/configured when you open the project in VSCode. You can change `.vscode/settings.json` to point to a self-signed certificate of your own making, start it from the status bar, and it should open the site automatically!

## Other details

You'll notice [Typescript](https://www.typescriptlang.org) is included in the `package.json` development dependency list, but there are no `.ts` files in the project to build! Mostly this is because I did not want to factor compiling JavaScript into my little engine, but also because Typescript introduces lots of unsolvable riddles which encourage me to keep working on the project.

In all seriousness, Typescript checks that I don't ignore optional values (along with other issues), and encourages me to make [detailed comments](https://jsdoc.app) about what my functions do.

Now go explore the code! Good places to start: [render.js](render.js) and [routing.js](static/js/lib/routing.js), [layout.html](layout.html), [layout.js](static/js/layout.js), or [global.css](static/css/global.css).

## Attributions
There is a tiny amount of code which I did borrow verbatim for this site: Josh W. Comeau's [CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset). I had picked up most of these strategies already, but it felt better to include a resource which explains all of them in depth. Thanks Josh!

Additionally, the color themes are curated from [Huemint](https://huemint.com/), and [godango](https://home.jrmann.com/utilities/godango.html) uses the [EFF Long Wordlist](https://www.eff.org/dice).
