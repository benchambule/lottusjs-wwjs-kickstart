## Install dependencies
```shell
npm i better-sqlite3
npm i 'github:benchambule/lottus.js#main'
```

## Initialize sqlite database
```shell
cat lottus.sql | sqlite3 lottus.db
```

## Test application via CLI
```shell
node cli/bot-cli.js
```

## Run WhatsApp bot

```shell
node index.js
```