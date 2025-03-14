import { initApp } from './server';

const port = process.env.PORT;

const main = async () => {
    try {
        const server = await initApp();
        server.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize the app:', error);
    }
};

main();
