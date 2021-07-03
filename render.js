const fs = require("fs.promises");
const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const outputLocation = "build"; // maybe commander.js

(async () => {
    const templateString = await fs.readFile(path.join(__dirname, "layout.html"), "utf8");
    // const fragment = await fs.readFile(path.join(__dirname, "fragments/index.html.inc"), "utf8");

    try { await fs.access(outputLocation); } catch (e) {
        await fs.mkdir("build")
    }

    const fragments = (await tree("fragments"))["fragments"];
    // await fs.rm(path.join(__dirname, outputLocation), {recursive: true}); // this is dangerous!

    const buildItems = await fs.readdir(path.join(__dirname, outputLocation));
    await Promise.all(buildItems.map(async item => await fs.rm(path.join(__dirname, outputLocation, item), { recursive: true })));
    await transformTree(fragments, path.join(__dirname, outputLocation), templateString);

})()

async function transformTree(fragments, location, templateString) {
    Object.entries(fragments).forEach(async ([key, value]) => {
        if (typeof value === 'string') {
            const transformed = transform(templateString, value);
            const filePath = path.join(location, key.replace('.inc', ''));
            console.log(`Rendered ${filePath}`);
            return await fs.writeFile(filePath, transformed);
        } else {
            const descendedPath = path.join(location, key);
            try { await fs.access(descendedPath); } catch (e) {
                await fs.mkdir(descendedPath);
            }
            return transformTree(value, descendedPath, templateString);
        }
    })
}

function transform(templateString, fragmentString) {
    const dom = new JSDOM(templateString);
    const document = dom.window.document;
    const fragment = new JSDOM(fragmentString).window.document;
    const main = document.querySelector("main#layout");
    main.append(...fragment.body.children);
    document.head.querySelectorAll("[data-is-fragment=yes]").forEach(el => el.remove());
    fragment.head.querySelectorAll("*").forEach(el => el.dataset["isFragment"] = "yes");
    document.head.append(...fragment.head.children);
    return dom.serialize();
}
//     // return template.replace(/^.*<!--{{ main content }}-->.*$/gm, fragment)

async function tree(location) {
    const stat = await fs.stat(location);
    if (stat.isFile()) return { [path.basename(location)]: await fs.readFile(location, "utf8") };
    else if (stat.isDirectory()) {
        const contents = await fs.readdir(location);
        return {
            [path.basename(location)]: (await Promise.all(contents
                .map(filename => path.join(location, filename))
                .map(tree)))
                .reduce((acc, e) => acc = { ...acc, ...e }, {})
        };
    }
    // const files = await fs.readdir(path);

}