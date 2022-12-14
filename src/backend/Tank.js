
class Tank{
    constructor( _tankId ){
        this.tank_id    = _tankId;
        this.x          = 0;
        this.y          = 0;
        this.rotation   = 0;
    }

    move_left(){
        this.x       -= 5;
        this.rotation = 90;
    }

    move_right(){
        this.x       += 5;
        this.rotation = -90;
    }

    move_up(){
        this.y       -= 5;
        this.rotation = 180;
    }

    move_down(){
        this.y += 5;
        this.rotation = 0;
    }
    send_to_server(socket) {
        var _data = { "cmd" : "move_tank", "tank_id": this.tank_id, "x": this.x, "y": + this.y, "rotation": this.rotation };
        socket.send( JSON.stringify(_data) );
    }

}

module.exports = Tank // 👈 Export class