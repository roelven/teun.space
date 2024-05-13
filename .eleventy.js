const CleanCSS = require("clean-css");
const metagen = require("eleventy-plugin-metagen");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const util = require("util");
const { minify } = require("terser");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('dump', obj => util.inspect(obj, { depth: null }));
};

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(eleventyNavigation);

  const contentDir = "./src/_content/";

  eleventyConfig.addCollection("images", function(collectionApi) {
    return collectionApi.getFilteredByGlob(contentDir + "*.md");
  });

  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/favicon_data");

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("EEE, MMM dd'th' yyyy");
  });

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

  eleventyConfig.addNunjucksAsyncShortcode("img", async function (src, alt, widths = [300, 480, 640, 1024], className = "", sizes = "100vw", displayFullImage = false) {
    if (!src) {
      console.error("Source is undefined in img shortcode.");
      return ""; // Gracefully handle missing src
    }
    if (!alt) {
      console.error(`Missing \`alt\` attribute for image: ${src}`);
      return ""; // Gracefully handle missing alt
    }

    // Build the full path to the image using the content directory
    const fullPathToImage = `${contentDir}${src}`;

    console.log("Full path to image:", fullPathToImage);

    try {
      const metadata = await Image(fullPathToImage, {
        widths: widths,
        formats: ["webp", "jpeg"],
        urlPath: "/img/",
        outputDir: `./_site/img/`, // Adjust as necessary
        defaultAttributes: {
          loading: "lazy",
          decoding: "async"
        }
      });

      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
        class: className
      };

      // Modify the style to display the full image if required
      if (displayFullImage) {
        imageAttributes.style = "object-fit: contain; width: 100%; height: auto;";
      }

      // Generate the picture element HTML
      return Image.generateHTML(metadata, imageAttributes);
    } catch (error) {
      console.error("Error processing image:", error);
      return ""; // Return an empty string in case of an error
    }
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
