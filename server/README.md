# React & urql Tutorial (Server)

This is the server as part of the sample project that belongs
to the [React & urql Tutorial](https://www.howtographql.com/react-urql/0-introduction/)
on How to GraphQL.

More instructions can be found in the root folder of this repository (`../`),
but if you're here, you're likely looking to do the following:

### 1. Install dependencies & Deploy the Prisma database API

Install the Prisma CLI globally with Yarn or npm:

```sh
yarn global add prisma
# or with npm:
npm i -g prisma
```

Also, run the following commands:

```sh
# install server dependencies & deploy
cd react-urql/server
yarn install
prisma deploy
```

Then, follow these steps in the interactive CLI wizard:

1. Select **Demo server**
1. **Authenticate** with Prisma Cloud in your browser (if necessary)
1. Back in your terminal, **confirm all suggested values**

<details>
 <summary>Alternative: Run Prisma locally via Docker</summary>

1. Ensure you have Docker installed on your machine. If not, you can get it from [here](https://store.docker.com/search?offering=community&type=edition).
1. Create `docker-compose.yml` for MySQL (see [here](https://www.prisma.io/docs/prisma-server/database-connector-POSTGRES-jgfr/) for Postgres):
    ```yml
    version: '3'
    services:
      prisma:
        image: prismagraphql/prisma:1.23
        restart: always
        ports:
        - "4466:4466"
        environment:
          PRISMA_CONFIG: |
            port: 4466
            databases:
              default:
                connector: mysql
                host: mysql
                port: 3306
                user: root
                password: prisma
                migrations: true
      mysql:
        image: mysql:5.7
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: prisma
        volumes:
          - mysql:/var/lib/mysql
    volumes:
      mysql:
    ```
1. Run `docker-compose up -d`
1. Run `prisma deploy`

</details>

### 2. Start the server

To start the server, all you need to do is execute the `start` script by running the following command inside the `server` directory:

```sh
yarn start
```

### 3. Start the app

Now follow the instructions in "4. Run the app" in the [`README.md`](../README.md) in the root folder.
