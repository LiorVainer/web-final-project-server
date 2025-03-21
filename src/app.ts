import { initServer } from './server';
import { ENV } from './env/env.config';

const port = ENV.PORT;

const main = async () => {
    try {
        const { server } = await initServer();
        server.listen(port, () => {
            console.log(`server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize the server:', error);
    }
};

main();
