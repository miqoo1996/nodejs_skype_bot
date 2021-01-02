/**
 * @Author Michael Ishkhanyan
 * SkypeBOT class
 * Skype controller lib
 *
 *
 * [API Repository]
 * https://github.com/ocilo/skype-http
 *
 * [API Documentation]
 * https://ocilo.github.io/skype-http/index.html
 *
 * [folder="skype-http" - API GUID]
 * See this folder on the root path
 */
class SkypeBOT {
    api; // SkypeHTTP API
    dbConnection; // MysqlDB Connection

    constructor(api, dbConnection) {
        this.api = api;
        this.dbConnection = dbConnection;
    }

    fieldFixer(field) {
        return field !== "undefined" && field ? field : null;
    }

    async getContacts() {
        let users = [];

        for (const contact of await this.api.getContacts()) {
            users.push({
                parentId: process.env.SKYPE_USERNAME,
                personId: this.fieldFixer(contact.personId),
                displayName: this.fieldFixer(contact.displayName),
                phones: this.fieldFixer(contact.phones) ? JSON.stringify(contact.phones) : null,
                avatarUrl: this.fieldFixer(contact.profile.avatarUrl),
                birthday: this.fieldFixer(contact.profile.birthday),
                gender: this.fieldFixer(contact.profile.gender) === 'male' ? 1 : this.fieldFixer(contact.profile.gender) === 'fmale' ? 0 : null,
                locations: typeof contact.profile.locations != "undefined" && contact.profile.locations ? JSON.stringify(contact.profile.locations) : null,
                nickname: this.fieldFixer(contact.profile.nickname),
                company: this.fieldFixer(contact.profile.company),
                about: this.fieldFixer(contact.profile.about),
                website: this.fieldFixer(contact.profile.website),
                language: this.fieldFixer(contact.profile.language),
            });
        }

        return users;
    }

    async getConversation(id) {
        const api = this.api;
        let conversation = await api.getConversation(id);
        let apiContext = api.context;

        const query = {
            startTime: 0,
            view: "msnp24Equivalent",
            targetType: "Passport|Skype|Lync|Thread"
        };

        let messages = await api.io.get({
            uri: conversation.messages,
            jar: apiContext.cookieJar,
            qs: query,
            headers: {
                "RegistrationToken": apiContext.registrationToken.raw
            }
        });

        return JSON.parse(messages.body);
    }

    async updateContacts() {
        let contacts = await this.getContacts();

        let $this = this;

        for (let contact of contacts) {
            $this.dbConnection.query('SELECT COUNT(*) as `count`, id FROM `skype_contacts` WHERE `personId` = ? AND `parentId` = ?', [contact.personId, contact.parentId], function (error, results, fields) {
                if (error) throw error;

                if (results[0]['count'] === 0) {
                    // insert
                    $this.dbConnection.query('INSERT INTO `skype_contacts` SET ?', contact, function (error, results, fields) {
                        if (error) throw error;

                        console.log(`Contact ${contact.personId} is successfully inserted`);
                    });
                } else {
                    // update
                    let updateId = results[0]['id'];
                    $this.dbConnection.query('UPDATE `skype_contacts` SET ? WHERE id = ' + updateId, contact, function (error, results, fields) {
                        if (error) throw error;

                        console.log(`Contact #${updateId} is successfully updated`);
                    });
                }
            });
        }
    }

    async updateConversations(updateContacts) {
        let $this = this;

        const api = $this.api;

        if (updateContacts) {
            $this.updateContacts();
        }

        for (const conversation of await api.getConversations()) {
            let conv = await $this.getConversation(conversation.id);

            if (!conv?.messages || !conv.messages.length) continue; // No messages found in this conversation

            for (const message of conv.messages) {
                let data = {
                    parentId: process.env.SKYPE_USERNAME,
                    messageId: message.id,
                    originalarrivaltime: message.originalarrivaltime,
                    messagetype: message.messagetype,
                    version: message.version,
                    composetime: message.composetime,
                    skypeguid: message.skypeguid,
                    content: message.content,
                    conversationLink: message.conversationLink,
                    conversationid: message.conversationid,
                    type: message.type,
                    from: message.from,
                };

                $this.dbConnection.query('SELECT COUNT(*) as `count`, id FROM `conversations` WHERE `parentId` = ? AND `messageId` = ?', [data.parentId, data.messageId], function (error, results, fields) {
                    if (error) throw error;

                    if (results[0]['count'] === 0) {
                        // insert
                        $this.dbConnection.query('INSERT INTO `conversations` SET ?', data, function (error, results, fields) {
                            if (error) throw error;

                            console.log(`Conversation ${data.conversationid} is successfully inserted`);
                        });
                    } else {
                        // update
                        let updateId = results[0]['id'];
                        $this.dbConnection.query('UPDATE `conversations` SET ? WHERE id = ' + updateId, data, function (error, results, fields) {
                            if (error) throw error;

                            console.log(`Conversation #${updateId} is successfully updated`);
                        });
                    }
                });
            }
        }
    }
}

module.exports = {
    SkypeBOT
};
