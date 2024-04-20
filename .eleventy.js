const CleanCSS = require("clean-css");
const { minify } = require("terser");
const metagen = require("eleventy-plugin-metagen");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(eleventyNavigation);

  eleventyConfig.addCollection("images", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/_content/**/*.md");
  });

  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/favicon_data");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.log(`Terser error: ${err}`);
      callback(null, code);
    }
  });

  eleventyConfig.addPairedShortcode("image", (srcSet, src, alt, sizes = "(min-width: 400px) 33.3vw, 100vw") => {
    return `<img srcset="${srcSet}" src="${src}" alt="${alt}" sizes="${sizes}" />`;
  });

  eleventyConfig.addShortcode("getYear", function () {
    const year = new Date().getFullYear();
    return `${year}`;
  });

  eleventyConfig.addShortcode("img", async function ({ src, alt, width, height, widths, className, imgDir, sizes = "100vw"}) {
    if (alt === undefined) {
      throw new Error(`Missing \`alt\` on responsive image from: ${src}`);
    }

    const IMAGE_DIR = imgDir || "./src/images/";
    const metadata = await Image(IMAGE_DIR + src, {
      widths: widths || [300, 480, 640, 1024],
      formats: ["webp", "jpeg"],
      urlPath: "/img/",
      outputDir: "_site/img",
      defaultAttributes: {
        loading: "lazy",
        decoding: "async"
      }
    });

    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

    const sources = `${Object.values(metadata).map(
      imageFormat => `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
    ).join("\n")}`;

    const img = `
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
        class="${className || ''}"
        width="${width || ''}"
        height="${height || ''}"
      >`;

    return `<picture>\n\t${sources}\n\t${img}</picture>`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts"
    },
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk"],
    passthroughFileCopy: true
  }
};
