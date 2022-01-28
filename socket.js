const Server = require('http');
const sio = require('socket.io');

const server = Server.createServer();
const socket = sio(server, {
  cors: {
    origin: '*',
  },
});

function getTime() {
  const date = new Date();
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map(v => (v + '').padStart(2, '0')).join(':');
}

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
      });
    
      client.on('call', (request) => {
        try {
          request.client = client.id;
          console.log(getTime() + ' >> [CALL] "' + request.uuid + '" from "' + request.client + '" to "' + request.point + '"');
          clients.filter(v => v.point === request.point).forEach(v => v.client.emit('call', request));
        } catch (error) {
          console.log(getTime() + ' >> [ERROR - socket.call] ' + error);
          client.emit('socket:error', { error: error.stack, note: '[ERROR - socket.call] ' + error + '.', event: 'call', request });
        }
      });
    
      client.on('call:response', (request) => {
        try {
          console.log(getTime() + ' >> [CALL:RESPONSE - ' + request.status.toUpperCase() + '] "' + request.uuid + '" from "' + client.id + '" to "' + request.client + '"');
          clients.find(v => v.id === request.client).client.emit('call:response', request);
        } catch (error) {
          console.log(getTime() + ' >> [ERROR - socket.call:response] ' + error);
          client.emit('socket:error', { error: error.stack, note: '[ERROR - socket.call:response] ' + error + '.', event: 'call:response', request });
          clients.find(v => v.id === request.client).client.emit('socket:error', { error: error.stack, note: '[ERROR - socket.call:response] ' + error + '.', event: 'call:response', request });
        }
      });

      client.on('data', () => {
        const data = {};
        data.clients = clients.map(v => {return {id: v.id, point: v.point, config: v.config}});
        data.connect = {
          prot: 'http:',
          ips: Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []),
          port: 3001,
        };
        data.connect.ip = ips[0];
        data.connect.url = data.connect.prot + '//' + data.connect.ip + ':' + data.connect.port;
        client.emit('data:response', data);
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
      client.emit('socket:error', { error: error.stack, note: '[ERROR - socket] ' + error + '.' });
    }
  });
} catch (error) {
  console.log('Sdfsf');
  console.log(error);
  socket.emit('socket:error', { error, note: 'Fatal error, server stopped.' });
  throw error;
}

server.listen(3001, '0.0.0.0', () => {
  console.log('Server listing on port 3001');
});