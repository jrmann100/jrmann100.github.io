I think we need to start working on SSR for pages. Generate the layout with hydrated content instead of `load('/index')` if at the homepage.

Greying out links?

It's really hard to dynamically affect styles, and I'm not sure it's worth it. You can use the JS API, as in 509fb21eeb7c4f450419a109e9f4435ee8d68181, but you need to parse CSS selectors, which isn't performant.

Still deciding between <template> and DOMParser, or documents and fragments. I like the automatic sorting into <head> and <body> with documents, but it feels wrong.

`rm build/*` in render feels a bit dangerous. Not sure if there's a different/better way.