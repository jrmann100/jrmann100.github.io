
const fs = require("fs.promises");

// Create and clean build folder.
(async () => {
    try { await fs.stat("build"); await fs.rm("build", { recursive: true }) } catch { };
    await fs.mkdir("build", { recursive: true });
    await fs.cp("static", "build/static", { recursive: true });
    await fs.cp("fragments", "build", { recursive: true });
    const layout = evalScriptTemplates(await fs.readFile("layout.html", "utf8"));
    transform("build", layout);
})();

// eval is unsafe!!
function evalScriptTemplates(html) {
return html.replace(
    /<script-template>(.|\n)*<\/script-template>/gi,
    match => eval(match.replace(/<\/?script-template>/gi, "")));
}

async function transform(path, layout) {
    const stat = await fs.stat(path);

    if (stat.isFile() && path.endsWith(".html.inc")) {
        // const text = evalScriptTemplates(await fs.readFile(path, "utf8"));

        let head;
        const body = text.replace(/<!--head-->(.|\n)*<!--\/head-->/, (match => {
            head = match;
            return "";
        }));
        await fs.writeFile(
            path.replace(".html.inc", ".html"),
            layout.replace(/<!--head-->(.|\n)*<!--\/head-->/, head ?? "").replace(/<!--main-->(.|\n)*<!--\/main-->/, body),
            "utf8");
    }
    else if (stat.isDirectory())
        await Promise.all(
            (await fs.readdir(path))
                .map(subpath => path + "/" + subpath)
                .map(somepath => transform(somepath, layout)));
};

console.log("rendered!");

