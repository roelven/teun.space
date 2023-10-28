# Eleventy Photo Gallery

A starter site for creating your own photo or art gallery using the [Eleventy](https://github.com/11ty/eleventy) static site generator.

- [Live demo](https://eleventy-gallery.netlify.app/) - View the project live
- [Deploy on Netlify](https://app.netlify.com/) - Host your own custom gallery

## Getting Started
Quickly generate a [highly performant](https://github.com/tannerdolby/eleventy-photo-gallery/blob/master/CONTRIBUTING.md#lighthouse-audit-scores) photo gallery from this template by clicking the green [Use Template](https://github.com/tannerdolby/eleventy-photo-gallery/generate) button. Creating a template repository provides the same directory structure and files as the original project.

## Features 
- Build-time image transformations and responsive image markup with @11ty/eleventy-img
- High performance site with 100s across the board on each page
- Home page with CSS Grid representing gallery of images
- Featured image page
- Gallery page
- About me page
- Sass

## Local Setup
1. Clone this repo: `git clone https://github.com/tannerdolby/eleventy-photo-gallery.git`
2. Navigate to your local copy of the project: `cd eleventy-photo-gallery`
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Serve locally: `npm run start` or `npm run dev`

## Usage
Add images to a folder in your project and then supply image metadata. To add images to the home page gallery and featured image pages. Edit `_data/gallery.json` to include image metadata like this:

```
{
    "title": "Terrace with green plants on night street",
    "date": "October 20, 2020",
    "credit": "Photo by Aldiyar Seitkassymov",
    "linkToAuthor": "https://www.pexels.com/photo/terrace-with-green-plants-on-night-street-3100835/",
    "src": "terrace-window.jpg",
    "alt": "Terrace outside shop window with green plants and pink tree on night street",
    "widths": [320, 640, 1024],
    "sizes": "(min-width: 450px) 33.3vw, 100vw",
    "class": "my-img",
    "width": 1024,
    "height": 768,
    imgDir: "./src/images/"
}
```

Once the image data is supplied within the global data file `_data/gallery.json` then the home page gallery images and featured image pages will display responsive images with `<picture>` after the sets of images are generated by `img`.

Or simply define the image metadata in frontmatter or directly inside the shortcode. Any of the options work to generate responsive images (if not already generated) with the corresponding markup. If the image is already generated in your project files, the utility will only render the responsive image markup with `<picture>`.

### Creating responsive images in templates

1. Get a large image from somewhere (your file system, a stock photo website, etc)
2. Add the original image to the `src/images/` folder (or a folder of your choice).
3. Use the `img` shortcode to generate responsive image markup
4. This performs image transformations at build-time, creating varying image dimensions the specified formats (`.jpg`, `.webp`, etc) from the original image, which outputs to the specified `outputDir` in the `img` shortcode within .eleventy.js:
 
```
{% img 
    src="car.jpg",
    alt="A photo of a car",
    sizes="(max-width: 450px) 33.3vw, 100vw",
    className="my-img",
%}
```

If you have already transformed an image and wish to only generate the responsive image markup using `<picture>`, simply use the `img` shortcode again anywhere within your templates to generate the responsive image markup.

## Compiling Sass to CSS
All of the projects CSS is compiled from Sass at build-time. The main Sass file is `src/_includes/sass/style.scss` and thats where partials, mixins, and variables are loaded in with `@use` rules. 

If you want to change up the styles, you can write Sass (_or CSS_) directly in `style.scss` for the changes to be compiled and used. Otherwise, if you want to continue using a "modular" approach like the project follows. You can:

1. Create a new partial file in a specific directory ('sass/partials', 'sass/mixins', 'sass/vars') like `_some-file.scss` where the underscore prefixed at the beginning signals that the file is a [partial](https://sass-lang.com/documentation/at-rules/use#partials). These files are meant to be loaded as modules and not directly compiled.

2. Write Sass code and style away!

3. Load the stylesheets with a `@forward` rule in the [index files](https://sass-lang.com/documentation/at-rules/use#index-files) like `@forward "./some-file";` within `_index.scss` within the directory so they can be loaded with `@use` in the scss file that is compiled to CSS.

4. Load the stylesheets using `@use` rules from the directory in which you need a specific file. Therefore, if I created a new file within `sass/mixins` called `_url-short.scss` and wanted to load that file in `style.scss`, I would use `@use "mixins" as *` to load the stylesheets within the `mixins` directory as one module while also ensuring the module isn't loaded with a namespace. 

_Read more about loading members and namespaces here in [Sass docs](https://sass-lang.com/documentation/at-rules/use#loading-members)_

## Contributing 
Feel free to contribute to this project by suggesting a new feature or modification. I built this template for others to use, so let me know what you'd like to see added/modified. 

- Open an [issue](https://github.com/tannerdolby/11ty-photo-gallery/issues) for any features/modifications you'd like to see! 
- Have a look at the [contributing guidelines](https://github.com/tannerdolby/11ty-photo-gallery/blob/master/CONTRIBUTING.md) before submitting a PR!
