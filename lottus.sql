CREATE TABLE IF NOT EXISTS session (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT,
    message_id INTEGER,
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    finished_at TEXT,
    bot TEXT,

    FOREIGN KEY(message_id) REFERENCES message(message_id)
);


CREATE TABLE IF NOT EXISTS message (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    title TEXT,
    footer TEXT,
    body TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    session_id INTEGER,
    next TEXT,
    error TEXT,

    FOREIGN KEY(session_id) REFERENCES session(session_id)
);


CREATE TABLE IF NOT EXISTS option (
    option_id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT,
    label TEXT,
    next TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    message_id INTEGER,

    FOREIGN KEY(message_id) REFERENCES message(message_id)
);


CREATE TABLE IF NOT EXISTS input (
    input_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    next TEXT,
    type TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    message_id INTEGER,

    FOREIGN KEY(message_id) REFERENCES message(message_id)
);


CREATE TABLE IF NOT EXISTS parameter (
    parameter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT,
    value TEXT,
    session_id INTEGER,
    option_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(session_id) REFERENCES session(session_id),
    FOREIGN KEY(option_id) REFERENCES option(option_id)
);