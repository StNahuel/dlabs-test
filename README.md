# December Labs Test

## How to install the API

    - Download repository.
    - Add "default.json" file to "/config" folder.
    - Run "npm install".
    - For Node server run "npm run start".
    - For Nodemon server run "npm run server".

## Known limitations

    - The exchange money feature is incomplete due to time.
    - Scenarios like an user with 2 bank accounts with the same currency are not contemplated.

## Possible improvements

    - Transaction code could be improved.
    - For the money exchange feature I think the best solution is an external API, but couldn't find one that helps quickly.
    - Currency model could be improved
    
    Note: Maybe the whole login part wasn't necessary

### Tech

    - node
    - express
    - express-validator
    - bcryptjs
    - cors
    - config
    - jsonwebtoken
    - mongoDB
    - mongoose
