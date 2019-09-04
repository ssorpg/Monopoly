module.exports = function(player) {
    return Object.assign({}, props, player);
}
//
// properties
//
let props = {
    name: null,
    money: 1500,
    position: 0,
    id: 0,
    uuid: null,
    player_number: null,   // this needs to go away
    remoteEndPoint: null,
    iam: function() {
        console.log('我的名字是', this.name)
    }
}
