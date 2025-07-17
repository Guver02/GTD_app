require('dotenv').config();

 const config = {
    env:process.env.NODE_ENV||'development',

    port:process.env.PORT||3000,

    secretKey: process.env.SECRET_KEY,

    uriLink: process.env.URI_LINK,
    dbUser:process.env.DB_USER,
    dbPassword:process.env.DB_PASSWORD,
    dbHost:process.env.DB_HOST,
    dbName:process.env.DB_NAME,
    devDbPort:process.env.DEV_DB_PORT,

    dbPort:process.env.DB_PORT,


    dbNameTest: process.env.DB_NAME_TEST,
    uriLinkTest: process.env.URI_LINK_TEST,
}

 module.exports= config
