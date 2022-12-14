<template>
    <div>
        <h1>Client</h1>
        <h2 v-if="connected">Connected</h2>
        
        
        <div class="scene">
            <div class="tank" v-for="(t,idx) in tanks" :style="{ left: t.x + 'px', top: t.y + 'px', transform: 'rotate(' + t.rotation + 'deg)'}" :key="'tank-' + idx">
                <div class="tank_id">{{t.tank_id}}</div>
            </div>
            <div class="tank" :style="{ left: my_tank.x + 'px', top: my_tank.y + 'px', transform: 'rotate(' + my_tank.rotation + 'deg)'}">
                <div class="tank_id">{{my_tank.tank_id}}</div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import Tank from '../backend/Tank.js';


  export default {
    name: 'Server',
    data() {
        return {
            tanks: [],  //other tanks
            my_tank: {},
            connected: false,
            my_id: "",
            url: 'wss://socketsbay.com/wss/v2/1/demo/', //instead of the "Demo" api key, you should create your own on https://socketsbay.com/
            socket: {},
            
        }
    },
    methods: {
        init_server() {
            this.socket = new WebSocket(this.url);
            
            this.socket.onopen = () => {
                this.connected = true;
                //send my tank info!
                this.my_tank = new Tank( this.my_id );
                var _data    = { cmd: "new_tank", tank_id: this.my_id };
                this.socket.send( JSON.stringify(_data) );
            };
            
            this.socket.onmessage = ( message ) => {
                var _data = JSON.parse(message.data);
                if( _data.cmd == "list_tanks" ){
                    this.tanks = _data.tanks.filter( x=> x.tank_id != this.my_id );
                }
            };

            window.onkeydown = (e) => {
                var key     = e.keyCode ? e.keyCode : e.which;
                
                // //key down
                if( key == 40 ) { this.my_tank.move_down (); this.my_tank.send_to_server(this.socket); }
                //key up
                if( key == 38 ) { this.my_tank.move_up   (); this.my_tank.send_to_server(this.socket); }
                //key left
                if( key == 37 ) { this.my_tank.move_left (); this.my_tank.send_to_server(this.socket); }
                // //key right
                if( key == 39 ) { this.my_tank.move_right(); this.my_tank.send_to_server(this.socket); }
            }
        }
    },
    mounted(){
        this.my_id = prompt('Tank name, commander?');
        this.init_server();
    }
  }
  </script>
  
  <style scoped lang="less">
    .scene{
        border: 1px solid black;
        margin: 20px auto;
        position: relative;
        height: 640px;
        width: 960px;
        background: url(../assets/background.png);
        overflow: hidden;
    }
    .tank{
        position: absolute;
        width: 76px;
        height: 89px;
        background: url(../assets/tank.png);
        transition: 0.3s all linear;
        .tank_id{
            position: absolute;
            left: 0;
            right: 0;
            top: -20px;
            height: 20px;
            background: black;
            color: white;
            line-height: 20px;
            opacity: 0.7;
        }
    }
  </style>
  