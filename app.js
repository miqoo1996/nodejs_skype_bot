import dotenv from "dotenv";
import mysql from "mysql";
import {connect} from "skype-http";
import {SkypeBOT} from "./lib/Skype";

dotenv.config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return false;
    }

    console.log('connected as id ' + connection.threadId);
});

connection.query("SET GLOBAL sql_mode = '';");

// Run Skype BOT
async function run() {
    const api = await connect({
        credentials: {
            username: process.env.SKYPE_USERNAME,
            password: process.env.SKYPE_PASSWORD
        }
    });

    const bot = new SkypeBOT(api, connection);

    await bot.updateConversations(true);

    bot.api.listen();
}

run().then(() => {
    console.log("SkypeBOT is ready!");
    // connection.end();
}).catch((e) => {
    // console.log("SkypeBOT err", e);
    console.log("Please check your username/password and verify your Skype account!");
    console.log("Before running again, Please login on https://login.live.com to verify your Skype account.");
    // connection.end();
});