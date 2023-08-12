import * as Hapi from '@hapi/hapi';
import { Server , ResponseToolkit, Request } from "@hapi/hapi";
import 'colors';
import { get } from 'node-emoji';
//import { AppDataSource } from './db/connection';
import { Repository } from 'typeorm/repository/Repository';
//import { UsersEntity1 } from './entities/users.entity';
import { Connection } from 'typeorm';
import { UsersEntity } from './entities/users.entity copy';
const { createConnection } = require('typeorm');
const ormConfig = require('./ormconfig.json');


const init = async () => {
    const server: Server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });


    server.route({
        method: 'GET',
        path: '/user1',
        handler: async (request, h) => {
            let connection;
            try {
              connection = await createConnection(ormConfig);
              const userRepository = connection.getRepository(UsersEntity);
              const users = await userRepository.find();
              return users;
            } catch (error) {
              console.error(error);
              return h.response('Internal server error').code(500);
            } finally {
            //   if (connection instanceof Connection) {
            //     await connection.close();
            //   }
            }
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