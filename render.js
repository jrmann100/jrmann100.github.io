const fs = require("fs.promises");
const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { program } = require("commander");

program
    .requiredOption("-l, --layout [file]", "layout file", "layout.html")
    .requiredOption("-i, --input [directory]", "fragments source directory", "fragments")
    .requiredOption("-o, --output [directory]", "build directory", "build")
    .option("-C, --no-clean", "do not clean build folder on build")
    .action(async (options, command) => {
        const templateString = await fs.readFile(path.join(__dirname, options.layout), "utf8");

        // Create and clean build folder.
        try { await fs.access(options.output); } catch (e) {
            await fs.mkdir(options.output, { recursive: true })
        }

        const fragments = (await tree(options.input))[path.basename(options.input)];

        const buildItems = await fs.readdir(path.join(__dirname, options.output));

        // effectively rm build/*. this is dangerous!!!
        if (options.clean) {
            console.log("Cleaning build directory...");
            await Promise.all(buildItems.map(async item => await fs.rm(path.join(__dirname, options.output, item), { recursive: true })));
        } else {
            console.log("Not cleaning build directory. Old files may remain.")
        }
        // Render and populate build folder.
        await transformTree(fragments, path.join(__dirname, options.output), templateString);
    });

program.parse();

async function transformTree(fragments, location, templateString) {
    Object.entries(fragments).forEach(async ([key, value]) => {
        if (typeof value === "string") {
            const transformed = transform(templateString, value);
            const filePath = path.join(location, key.replace(".inc", ""));
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
    main.innerHTML += "\n<!-- This content is server-side-rendered. -->\n";
    main.append(...fragment.body.children);
    document.head.querySelectorAll("[data-is-fragment=yes]").forEach(el => el.remove());
    fragment.head.querySelectorAll("*").forEach(el => el.dataset["isFragment"] = "yes");
    document.head.append(...fragment.head.children);
    return dom.serialize();
}

async function tree(location) {
    const stat = await fs.stat(location);
    if (stat.isFile() && path.basename(location).endsWith(".html.inc")) return { [path.basename(location)]: await fs.readFile(location, "utf8") };
    else if (stat.isDirectory()) {
        const contents = await fs.readdir(location);
        return {
            [path.basename(location)]: (await Promise.all(contents
                .map(filename => path.join(location, filename))
                .map(tree)))
                .reduce((acc, e) => acc = { ...acc, ...e }, {})
        };
    }
}
