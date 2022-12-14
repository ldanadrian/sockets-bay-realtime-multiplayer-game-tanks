<template>
    <div>
      <h1>Server</h1>
      <h2 v-if="connected">Connected</h2>
      <ul class="log">
        <li v-for="(log_item,idx) in log" :key="'log-' + idx">{{log_item}}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import Tank from '../backend/Tank.js';


  export default {
    name: 'Server',
    data() {
        return {
            tanks: [],
            connected: false,
            log:[],
            url: 'wss://socketsbay.com/wss/v2/1/demo/',
            socket: {},
        }
    },
    methods: {
        send_tank_list() {
            var _data = { "cmd" : "list_tanks", "tanks": this.tanks };
            this.socket.send( JSON.stringify(_data) );
        },
        init_server() {
            this.socket = new WebSocket(this.url);
            
            this.socket.onopen = () => {
                this.connected = true;
            };
            
            this.socket.onmessage = ( message ) => {
                var _data = JSON.parse(message.data);
                console.log("am primit", _data);  
                
                if( _data.cmd == "new_tank" ) {
                    this.tanks.push( new Tank( _data.tank_id) );
                    this.log.push(`Tank with id ${_data.tank_id} joined the game!`);
                    
                    this.send_tank_list();
                }
                if( _data.cmd == "move_tank" ) {
                    var tank        = this.tanks.find( x=> x.tank_id == _data.tank_id );
                    tank.x          = _data.x;
                    tank.y          = _data.y;
                    tank.rotation   = _data.rotation;
                    //
                    this.send_tank_list();
                }
                if( _data.cmd == "tank_exit" ) {
                    this.tanks = this.tanks.filter( x=> x.tank_id != _data.tank_id );
                    this.log.push(`Tank with id ${_data.tank_id} left the game!`);
                    this.send_tank_list();
                }
                if( _data.cmd == "list_tanks" ) {
                    this.send_tank_list();
                }
            };
        }
    },
    mounted(){
        this.init_server();
    }
  }
  </script>
  
  <style scoped lang="less">
    ul.log{
        text-align: left;
    }
  </style>
  