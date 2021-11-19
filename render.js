
const fs = require("fs.promises");

// Create and clean build folder.
(async () => {
    try { await fs.stat("build"); await fs.rm("build", { recursive: true }) } catch { };
    await fs.mkdir("build", { recursive: true });
    await fs.cp("static", "build/static", { recursive: true });
    await fs.cp("fragments", "build", { recursive: true });
    const layout = await fs.readFile("layout.html", "utf8");
    transform("build", layout);
})();

const regionRegex = /<!--{{(?<open>.+)}}-->(?<content>(.|\n)*?)<!--{{(?<close>\/.+)}}-->/i;

// todo: document and test. EXTENSIVELY.
async function transform(path, layout) {
    const stat = await fs.stat(path);

    if (stat.isFile() && path.endsWith(".html.inc")) {
        let text = await fs.readFile(path, "utf8");

        let result = layout;
        
        let fragmentRegions = {};
        while ((region = regionRegex.exec(text)) !== null) {
            text = text.substring(0, region.index) + text.substring(region.index + region[0].length);
            if (!("/" + region.groups?.open === region.groups?.close)) throw new Error("fragment's region tags don't match!", region.groups?.open, region.groups?.close);
            const label = region.groups?.open;
            fragmentRegions[label] = region[0];

            const layoutMatch = result.match(new RegExp(`<!--{{${label}}}-->(.|\n)*<!--{{/${label}}}-->`, "i"));
            if (layoutMatch === null) throw new Error("could not find matching region in layout for", label);
            result = result.substring(0, layoutMatch.index) + region[0] + result.substring(layoutMatch.index + layoutMatch[0].length);
        }
        
        

        await fs.writeFile(
            path.replace(".html.inc", ".html"),
            result,
            "utf8");
    }
    else if (stat.isDirectory())
        await Promise.all(
            (await fs.readdir(path))
                .map(subpath => path + "/" + subpath)
                .map(somepath => transform(somepath, layout)));
};

console.log("rendered!");

