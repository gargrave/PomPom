# PomPom

A super simple pomodoro-style timer written in Angular 1.4 & TypeScript. I mostly wrote this as a way to get some practice using TypeScript with Angular. It is extremely feature-simple, so if you're looking for a life-changing pomodoro app, you have probably come to the wrong place.

One very useful thing about it is that the background color transitions from bright green to red as your time ticks down--I like to keep it open on my secondary monitor, and this lets me get a rough idea of how much time I have left without actually looking away from my main task.

## Overview

It uses the following libraries and technologies:

- Angular 1.4
- TypeScript
- Sass
- Bootstrap/jQuery
- Grunt

The primary source folder is the `app` folder, with build and dist tasks dumping to `app-build` and `app-dist` respectively.

## Grunt Tasks

There are really only three Grunt tasks you should need to run:

- `watch` - Watches for changes in Sass and Typescript source files, and compiles them as necessary. Note that there is no server module wired up in Grunt, so you will not have the luxury of auto-refresh out of the box, unfortunately (it's easy enough to add in, though).
- `build` - Builds the Sass and Typescript files into the `app-build` directory for running locally during dev. By default, `index.html` references the files here. You most likely shouldn't need to use this if you are using the `watch` task (outside of doing an initial build, perhaps).
- `dist` - Builds and bundles everything with minification into the `app-dist` folder, and updates `index.html` to refer to the new dist files. Use this when you're ready to deploy.

## A Few Notes

Ok, so I didn't follow all of the best practices with this app:

- No tests. Honestly, it's a one-file app that I just wrote for fun, so try not to shame me for this (not _too much_, at least).
- If you look closely, you might spot a couple jQuery selectors used within my Angular controller for DOM manipulation. FWIW, yes I know this is a crime against humanity, but again, for a simple project like this, I am not overly concerned about it.
- The external libs (Angular & Bootstrap/jQuery) are simply bundled with the app, rather than using a CDN or anything. It is small and simple enough that I did not see any compelling reason to link to online resources in this case.
