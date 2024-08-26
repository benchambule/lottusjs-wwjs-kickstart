import Database from 'better-sqlite3';
import { Message } from 'lottus.js';

export {
    SqliteSessionManager
}

class SqliteSessionManager {
    #db = null;

    /**
     * 
     * @param {string} database 
     * @param {object} options 
     */
    constructor(database, options){
        this.#db = new Database(database, options);
        this.#db.pragma('journal_mode = WAL');
    }

    /**
     * 
     * @param {string} identifier 
     * @returns {object}
     */
    get(identifier){
        const db = this.#db;
        let session = null;
        const session_row = db.prepare("SELECT session_id, started_at, identifier FROM session WHERE identifier = ? and finished_at IS NULL").get(identifier);

        if(session_row){
            session = {message: null, parameters: {}};

            session.started_at = session_row.started_at;
            session.identifier = session_row.identifier;

            const message_row = db.prepare("SELECT message_id, name, title, body, footer FROM message WHERE session_id = ?").get(session_row.session_id);

            if(message_row){
                session.message = new Message(message_row.name);
                session.message.title = message_row.title;
                session.message.body = message_row.body;
                session.message.footer = message_row.footer;

                const options = db.prepare("SELECT key, label, next, option_id FROM option WHERE message_id = ?").all(message_row.message_id);
                if(options){
                    for(const option of options){
                        let op = {key: option.key, label: option.label, next: option.next}
                        const _parameters = db.prepare("SELECT parameter_id, key, value FROM parameter WHERE option_id = ?").all(option.option_id);
                        let _params = {};

                        if(_parameters){
                            for(const param of _parameters){
                                _params[param.key] = param.value;
                            }
                        }

                        op.parameters = _params;

                        session.message.addOption(op);
                    }
                }

                const input = db.prepare("SELECT input_id, name, next, type FROM input WHERE message_id = ?").get(message_row.message_id);
                if(input){
                    session.message.addInput({name: input.name, type: input.type, next: input.next});
                }
            }

            const parameters = db.prepare("SELECT parameter_id, key, value from parameter WHERE session_id = ?").all(session_row.session_id);
            if(parameters){
                let params = {};
                
                if(parameters){
                    for(const param of parameters){
                        params[param.key] = param.value;
                    }
                }

                session.parameters = params;
            }
        }

        return session;
    }

    /**
     * 
     * @param {string} identifier 
     * @param {Message} message 
     * @param {object} parameters 
     */
    save(identifier, message, parameters){
        const db = this.#db;
    
        const insert_session = db.transaction((identifier, message, parameters) => {
            if(!(message instanceof Message)){
                throw new Error("Argument message must be of type Message");
            }

            if(!(typeof identifier === "string")){
                throw new Error("Argument identifier must be a string");
            }

            if(!(typeof parameters === "object")){
                throw new Error("Argument parameters must be an object");
            }

            const session_row = db.prepare("SELECT session_id FROM session WHERE identifier = ? and finished_at IS NULL").get(identifier);
            let session_id = session_row?.session_id;
            let message_id = null;
            const insert_parameter = db.prepare("INSERT INTO parameter(key, value, session_id, option_id) VALUES (:key, :value, :session_id, :option_id)");
    
            message_id = db.prepare("INSERT INTO message (name, title, body, footer, next, error) VALUES (:name, :title, :body, :footer, :next, :error)").run({
                name: message.name,
                title: message.title,
                body: message.body,
                footer: message.footer,
                next: message.form?.next,
                error: message.error
            }).lastInsertRowid;
    
            const options = message.form?.options;
            if(options){
                const insert_option = db.prepare("INSERT INTO option (key, label, next, message_id) VALUES (:key, :label, :next, :message_id)");

                for(const [key, option] of options.entries()){
                    const option_id = insert_option.run({
                        key: key,
                        label: option.label,
                        next: option.next,
                        message_id: message_id,
                    }).lastInsertRowid;

                    if(option.parameters){
                        for(const key of Object.keys(option.parameters)){
                            insert_parameter.run({
                                key: key,
                                value: option.parameters[key],
                                session_id: null,
                                option_id: option_id,
                            });
                        }
                    }
                }
            }
    
            const input = message.form?.input;
            if(input){
                const insert_input = db.prepare("INSERT INTO input (name, type, next, message_id) VALUES (:name, :type, :next, :message_id)");
                insert_input.run({
                    name: input.name,
                    type: input.type,
                    next: input.next,
                    message_id: message_id
                });
            }
    
            if(session_id){
                db.prepare("UPDATE session SET message_id = :message_id WHERE session_id = :session_id").run(
                    {message_id: message_id, session_id: session_id}
                );
            } else {
                const insert_session = db.prepare("INSERT INTO session (identifier, message_id) values (:identifier, :message_id)");
                session_id = insert_session.run({
                    identifier: identifier,
                    message_id: message_id,
                }).lastInsertRowid;
            }
    
            if(message_id){
                db.prepare("UPDATE message SET session_id = :session_id WHERE message_id = :message_id").run(
                    {message_id: message_id, session_id: session_id}
                );
            }
    
            if(parameters){
                for(const key of Object.keys(parameters)){
                    const parameter = db.prepare("SELECT parameter_id from parameter WHERE session_id = ? AND key = ? AND value = ?").get(session_id, key, parameters[key]);
    
                    if(parameter){
                        continue;
                    }
    
                    insert_parameter.run({
                        key: key,
                        value: parameters[key],
                        session_id: session_id,
                        option_id: null
                    });
                }
            }
        });

        insert_session(identifier, message, parameters);
    }

    /**
     * 
     * @param {string} identifier 
     */
    close(identifier){
        const db = this.#db;

        let session_id = db.prepare("SELECT session_id FROM session WHERE identifier = ? and finished_at IS NULL").get(identifier).session_id;

        if(session_id){
            db.prepare("UPDATE session SET finished_at = CURRENT_TIMESTAMP WHERE session_id = :session_id").run(
                {session_id: session_id}
            );
        }
    }
}
