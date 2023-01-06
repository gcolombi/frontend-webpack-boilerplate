# Frontend webpack boilerplate

![node-current (scoped)](https://img.shields.io/node/v/?color=informational&style=plastic)
![webpack-current](https://img.shields.io/badge/webpack-v5.75.0-informational?style=for-the-badge&&logo=webpack)
[![GitHub License](https://img.shields.io/github/license/gcolombi/frontend-webpack-boilerplate?color=informational&style=for-the-badge)](https://github.com/gcolombi/frontend-webpack-boilerplate/blob/master/LICENSE)
[![barba](https://img.shields.io/badge/barba-v2.9.7-green?style=for-the-badge)](https://github.com/barbajs/barba)
[![loadx](https://img.shields.io/badge/loadx-v0.1.1-green?style=for-the-badge)](https://github.com/cesarwbr/loadx)
[![locomotive-scroll](https://img.shields.io/badge/locomotive--scroll-v4.1.4-green?style=for-the-badge)](https://github.com/locomotivemtl/locomotive-scroll)
[![vanilla-lazyload](https://img.shields.io/badge/vanilla--lazyload-v17.8.3-green?style=for-the-badge)](https://github.com/verlok/vanilla-lazyload)

<div align="center">
    <img src="https://github.com/devicons/devicon/blob/master/icons/webpack/webpack-original-wordmark.svg" title="Webpack" alt="Webpack" width="300" height="300"/>
</div>

<div align="center">
    <img src="https://github.com/devicons/devicon/blob/master/icons/sass/sass-original.svg" title="Saas" alt="Saas" width="40" height="40"/>&nbsp;
    <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="Javascript" alt="Javascript" width="40" height="40"/>&nbsp;
    <img src="https://github.com/devicons/devicon/blob/master/icons/babel/babel-original.svg" title="Babel" alt="Babel" width="40" height="40"/>
</div>

## Features

* Uses [Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll) for detection of elements in viewport & smooth scrolling with parallax effects.
* Uses [Barba](https://github.com/barbajs/barba) for create fluid and smooth transitions between your website's pages.
* Uses [Vanilla lazyload](https://github.com/verlok/vanilla-lazyload) for speeds up your web application by deferring the loading of your below-the-fold images.
* **CSS architecture** containing generic and base style, custom configuration, grid, utilities, mixins etc.
* **Dynamic javascript modules** rendering (example.js file as a reference).
* Configuration per **environment**
    * `development` - [`sourcemaps`](https://webpack.js.org/configuration/devtool/), [`browser synced developmentment server`](https://webpack.js.org/configuration/dev-server/)
    * `production` - [`minification`](https://webpack.js.org/plugins/terser-webpack-plugin/), [`sourcemaps`](https://webpack.js.org/configuration/devtool/)
* The built CSS / JavaScript files will respect the **configured supported browser versions** using the following tools:
    * [`autoprefixer`](https://github.com/postcss/autoprefixer) - automatically adds vendor prefixes to CSS rules
    * [`babel-preset-env`](https://babeljs.io/docs/en/babel-preset-env) - smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (*and optionally, browser polyfills*) are needed by your target environment(s).
* Support for **assets optimization** for production environment with ability to configure:
    * **Code Minification** of *JavaScript* and *CSS* processed files.
    * **Optimize Assets Loading** - inline and embed **images** / **fonts** files having file size below a *configurable* threshold value.
* Latest [Webpack 5](https://github.com/webpack/webpack) - *JavaScript* module bundler.
* Latest [SASS/PostCSS](https://github.com/sass/sass) compiler based on Dart `sass`.
* Latest [Babel 7](https://github.com/babel/babel) JavaScript compiler
* Configured and ready to use **Webpack Dev Server** plugin for faster local development - [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)
* Integration with [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - _Visualize size of webpack output files with an interactive zoomable treemap._

## Requirements

* `node`: `>=14`
* `yarn` or `npm`

## Installation

Yarn
```sh 
git clone ... project-name
cd project-name
yarn install
```

NPM
```sh 
git clone ... project-name
cd project-name
npm install
```

Replace the original remote repository with your project's repository.

Update the following files to suit your project:

* [`README.md`](https://github.com/gcolombi)
* [`package.json`](https://github.com/gcolombi):
    * name: `frontend-webpack-boilerplate`
    * description: `Starter project template boilerplate ...`
    * author: `Gérard Colombi`
* [`site.webmanifest`](https://github.com/gcolombi)
    * name: `Frontend webpack boilerplate`
    * short_name: `Boilerplate`

# Development

## Assets Source

* _SASS/SCSS/PostCSS_: `src/assets/styles/`
* _JavaScript_: `src/assets/scripts/`
* _Image_: `src/assets/images/`
* _Font_: `src/assets/fonts/`
* _HTML_: `src/templates/`
    * It will **automatically** build **all HTML files** placed under `src/templates/` in dist directory.

## Build/Compile Assets

### Start a development server

Yarn
```sh
yarn dev
```

NPM
```sh
npm run dev
```

### One time build assets

Yarn
```sh
yarn build
```

NPM
```sh
npm run build
```

### Compile and watch assets

Yarn
```sh
yarn watch
```

NPM
```sh
npm run watch
```

# Production 

## Build Assets

Yarn
```sh
yarn production
```

NPM
```sh
npm run production
```

## Built Assets Source

* _CSS_: `dist/assets/`
* _JavaScript_: `dist/assets/`
* _Images_: `dist/assets/images/`
* _Fonts_: `dist/assets/fonts/`
* _HTML_: `dist/`

# Additional Tool

## Run Assets Bundle Analyzer

Yarn
```sh
yarn stats
```

NPM
```sh
npm run stats
```

> This will open the visualisaion on the default configuraiton URL `localhost:8888`.