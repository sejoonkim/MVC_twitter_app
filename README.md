## Twitter style Web Application w/ MVC Design Pattern

Lessons

- NodeJS and ExpressJS
- MVC Design Pattern
- Yeoman generator
- Express generator
- Express template engine
- User Authentication
- Mongoose Schema & MongoDB

<br/>

### Yeoman generator

- https://yeoman.io/
- generic scaffolding system
- rapid creation of apps
- streamline maintenance of existing projects

<br/>

### Middleware

- How Express handles a sequence of functions

  - ```javascript
    app.get()
    app.get()
    app.use(SOME FUNC)
    app.post()
    ```

- **Series of functions** that can be called
- On every single **REQUEST** these series of functions will be executed

- `(req, res, next)`

<br/>

### Generate with express-generator

- type `express --ejs --css sass --git`
- modify package.json

  - add "description", "license"m "author", "repository", "keywords"

- `npm i`
  - install dependencies

<br/>

### Modify Application Structure

= refactoring

- modify the directory structure to follow MVC pattern

  - create `server/`
  - put `config/`, `routes/`, `views/` in them

- modify basic behaviors, and start the application

  - ```javascript
    app.set("port", process.env.PORT || 3000);
    ```
