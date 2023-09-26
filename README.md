# UNO-card-game
<h2> Getting Started </h2>
Via GitHub clone this repository then to run the server and client. Before this you need to start docker, in particular the mongo instance.

`mongo`: 
To run the mongo instance locally, follow these steps:

- Navigate to the mongo folder of the project.
- Open the Docker program, and wait for it to be ready.
- Run the command `docker compose up` to boot the images.

You can check the database at the following link: `http://localhost:8081`.

`Server`:
To run the server locally, follow these steps:

- Navigate to the server folder of the project.
- Run the command `npm install` to install all the necessary dependencies.
- Run the command `npm run build` to compile the Typescript code.
- Finally, run the command `npm start` to start the server.

The server will be listening at `http://localhost:3000`.

`Client`:
To run the client locally, follow these steps:

- Navigate to the client folder of the project.
- Run the command `npm install` to install all the necessary dependencies.
- Run the command `npm run dev` to start the client.

Each client instance that is launched will be given the URL in which it is running in the console.