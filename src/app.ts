import { initServer } from './server';

const port = process.env.PORT;

const main = async () => {
    try {
        const { server, app } = await initServer();
        server.listen(port, () => {
            console.log(`server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize the server:', error);
    }
};

main();
