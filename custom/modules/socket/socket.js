const FS = require('fs');
const Path = require('path');

function getTime() {
  const date = new Date();
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map(v => (v + '').padStart(2, '0')).join(':');
}

export default function (socket) {
  console.log('socket start');
  /**
   * @typedef {Object} T_SocketClient
   * @property {import('socket.io').Socket} client
   * @property {string} id
   * @property {string} [point]
   * @property {Object} config
   */

  /** @type {T_SocketClient[]} */
  const clients = [];
  try {
    socket.on('connection', (client) => {
      try {
        console.log(getTime() + ' >> [CONNECTION] client "' + client.id + '"');
        clients.push({
          client,
          id: client.id,
          point: null,
          config: {},
        });
      
        client.on('info:response', ({ point, config }) => {
          console.log(getTime() + ' >> [INFO:RESPONSE] "' + client.id + '" registry point "' + point + '"');
          const data = clients.find(v => v.id === client.id);
      
          data.point = point;
          data.config = config;
          socket.emit('event', {event: 'socket_info', params: [{ action: 'info', client: client.id, clients: clients.map(v => {return {id: v.id, point: v.point, config: v.config}}) }]});
        });
      
        client.on('call', (request) => {
          try {
            request.client = client.id;
            console.log(getTime() + ' >> [CALL] "' + request.uuid + '" from "' + request.client + '" to "' + request.point + '"');
            clients.filter(v => v.point === request.point).forEach(v => v.client.emit('call', request));
          } catch (error) {
            console.log(getTime() + ' >> [ERROR - socket.call] ' + error);
            client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.call] ' + error + '.', event: 'call', request });
          }
        });

        client.on('event', (request) => {
          try {
            console.log(getTime() + ' >> [EVENT] from "' + client.id + '" as event ' + (Array.isArray(request.event) ? request.event.join(', ') : request.event));
            socket.emit('event', request);
          } catch (error) {
            console.log(getTime() + ' >> [ERROR - socket.event] ' + error);
            client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.event] ' + error + '.', event: 'event', request });
            clients.find(v => v.id === request.client).client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.call:response] ' + error + '.', event: 'call:response', request });
          }
        });
      
        client.on('call:response', (request) => {
          try {
            console.log(getTime() + ' >> [CALL:RESPONSE - ' + request.status.toUpperCase() + '] "' + request.uuid + '" from "' + client.id + '" to "' + request.client + '"');
            clients.find(v => v.id === request.client).client.emit('call:response', request);
          } catch (error) {
            console.log(getTime() + ' >> [ERROR - socket.call:response] ' + error);
            client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.call:response] ' + error + '.', event: 'call:response', request });
            clients.find(v => v.id === request.client).client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.call:response] ' + error + '.', event: 'call:response', request });
          }
        });

        client.on('data', (request) => {
          try {
            const file = '../../../plugins/data/socket/' + request.file + '.json';
            let value = null;
            if (request.value === null) {
              if (FS.existsSync(file)) value = require(file);
            } else {
              value = request.value;
              FS.writeFileSync(file, JSON.stringify(value, null, 2));
            }

            console.log(getTime() + ' >> [DATA] from "' + client.id);
            socket.emit('event', {event: ['data_' + request.file, 'data'], params: [{ value, file: request.file, client: client.id, clients: clients.map(v => {return {id: v.id, point: v.point, config: v.config}}) }]});
          } catch (error) {
            console.log(getTime() + ' >> [ERROR - socket.call:response] ' + error);
            client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.call:response] ' + error + '.', event: 'call:response', request });
            clients.find(v => v.id === request.client).client.emit('socket_error', { error: error.stack, note: '[ERROR - socket.data] ' + error + '.', event: 'data', request });
          }
        });
      
        client.on('disconnect', () => {
          console.log(getTime() + ' >> [DISCONNECT] client "' + client.id + '"');
          clients.splice(clients.findIndex(v => v.id === client.id), 1);
      
          socket.emit('event', {event: 'socket_disconnect', params: [{ action: 'remove', client: client.id, clients: clients.map(v => {return {id: v.id, point: v.point, config: v.config}}) }]});
        });
      
        client.emit('info', {id: client.id});
        socket.emit('event', {event: 'socket_connect', params: [{ action: 'add', client: client.id, clients: clients.map(v => {return {id: v.id, point: v.point, config: v.config}}) }]});
      } catch (error) {
        console.log(getTime() + ' >> [ERROR - socket] ' + error);
        client.emit('socket_error', { error: error.stack, note: '[ERROR - socket] ' + error + '.' });
      }
    });
  } catch (error) {
    console.log(error);
    socket.emit('socket_error', { error, note: 'Fatal error, server stopped.' });
    throw error;
  }
};