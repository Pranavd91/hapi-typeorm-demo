import * as Hapi from '@hapi/hapi';
import { Server , ResponseToolkit, Request } from "@hapi/hapi";
import 'colors';
import { get } from 'node-emoji';


const init = async () => {
    const server: Server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit) => {
            return 'Hello World!';
        }
    });

    await server.start();
    console.log(get('rocket'));
    console.log(`${get('rocket')} Server running on ${server.info.uri}`.green);

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);

})

init();