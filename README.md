# Sails.js + React.js Examples

Inspired by the React.js tutorials, these examples shows ways to integrate Sails.js as the real time persistent backend model to a React.js frontend. Two examples are provided: a markdown chat application and the TodoMVC application. Both showcasing the real time capabilities for multiple clients.

#### References
* [Sails Tutorial](https://www.youtube.com/watch?v=uxojCaDSyZA)
* [React Tutorial](http://facebook.github.io/react/docs/tutorial.html)
* [React Animation](http://facebook.github.io/react/docs/animation.html)
* [React TodoMVC](https://github.com/tastejs/todomvc/tree/gh-pages/architecture-examples/react)
* [RequireJS](http://requirejs.org/)

## Run Instructions

#### Prerequisites
* git
* [nodejs](http://nodejs.org)
* [npm](http://npmjs.org)
* [bower](http://bower.io)


```bash
git clone https://github.com/mixxen/sails-react-example.git
cd sails-react-example
npm install
bower install
node app.js
open http://localhost:1337
```

## Start from Scratch
1. Install Sails

   ```
   sudo npm -g install sails
   ```

2. Create new Sails project

   ```
   sails new sails-react-example --linker
   ```

3. Change directory to sails-react-example

4. Install grunt-react

   ```
   npm install grunt-react
   ```

4. Edit Gruntfile.js to support jsx files (see Gruntfile.js file for examples)

5. Pull these components from Bower
   * Bootstrap
   * jQuery
   * React
   * Showdown
   * Timeago
   * RequireJS

6. Edit Gruntfile.js to include RequireJS. RequireJS will handle loading of js libraries.

7. Create assets/linker/styles/styles.css for styles and animation css 

8. Create Comment model and controller

   ```
   sails generate comment
   ```
9. Edit views/home/index.ejs and put ```<div class="container" id="container"></div>``` somewhere

10. Rename assets/linker/js/app.js to assets/linker/js/app.jsx and start coding. Be sure to call ```renderCompoenent``` somewhere and reference the div in previous step. Example:

   ```javascript
   React.renderComponent(
     <CommentBox url="/comment" data={message} />,
     document.getElementById('container')
   );
   ```

## Screenshots

![alt tag](todosmvc.png)

## Todo

* Add passport authentication
