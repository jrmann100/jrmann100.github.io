
const fs = require("fs.promises");

// Create and clean build folder.
(async () => {
    try { await fs.stat("build"); await fs.rm("build", { recursive: true }) } catch {};
    await fs.mkdir("build", { recursive: true });
    await fs.cp("static", "build/static", { recursive: true });
    await fs.cp("fragments", "build", { recursive: true });
    const layout = await fs.readFile("layout.html", "utf8");
    transform("build", layout);
})();

// const fragments = (await tree("fragments"));
// console.log(fragments);

async function transform(path, layout) {
    const stat = await fs.stat(path);
    if (stat.isFile() && path.endsWith(".html.inc"))
        await fs.writeFile(
            path.replace(".html.inc", ".html"),
            layout.replace("<!--content-->", await fs.readFile(path, "utf8")),
            "utf8");
    else if (stat.isDirectory())
        await Promise.all(
            (await fs.readdir(path))
            .map(subpath => path + "/" + subpath)
            .map(somepath => transform(somepath, layout)));
};

