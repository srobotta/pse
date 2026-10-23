# Periodic table of the elements

Published by Stephan Robotta under the [CC BY 4.0 licence](https://creativecommons.org/licenses/by/4.0/).

A single-page periodic table that runs entirely in the browser with plain
JavaScript. No framework, no build step — a web server just serves the files.

## Files

- `index.html` — the page markup
- `styles.css` — all styling (plain CSS)
- `elements.js` — the element data
- `app.js` — rendering, search, and interactivity

## Run locally

Any static file server works. For example:

```bash
python3 -m http.server 8000
```
or
```
php -S localhost:8000
```

Then open http://localhost:8000/ in your browser. You can also just open
`index.html` directly from disk (might not work at some browsers).

## Deploy

Copy `index.html`, `styles.css`, `app.js`, and `elements.js` to any static
host (Nginx, Apache, GitHub Pages, S3, Netlify, …). No Node.js, PHP or other
scripting language is required.

## Preview

This single web app can be view directly at github:
https://htmlpreview.github.io/?https://github.com/srobotta/pse/blob/master/index.html

## Multi language 

The site provides the information in English, German, French, Italian and
Spanish. The language is determined by (in this order): 

1. Query parameter `lang` in the current url.
1. Configure from the parent windown `window.parent.M.cfg.language` when
used within a Moodle site.
1. Browser language.

If this site is used in an iframe (e.g. inside a Wordpress), in step 2 you
could change the check to url of the parent or search in the HTML meta data
of the parent frame.

Language specific data is in the `elements.js`, in the `index.html` and
also in the `app.js` depending where the language dependent labels are defined.

## Moodle integration

In the language section the Moodle integration is already mentioned. To
integrate the periodic table into your Moodle course, please do the following:

1. Create a new file activity.
1. Upload the zip file to that activity.
1. Click the zip file in the list and unpack the zip archive.
1. Click the zip file in the list and delete the zip archive.
1. Click the `index.html` in the list and set it as the main file.
1. Save the activity and display it.

You should see an iframe with the periodic table in your course.

## Notes

The code was originally created with the help of AI as a stand alone node
application and later transformed into a single page web application.
