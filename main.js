var ASSET_MANAGER = new AssetManager();
var gameEngine = new GameEngine();

function restart() {
    gameEngine.entities = [];
    gameEngine.tick = 0;
    //var speed = 150;

    var anchor = document.getElementById("anchor").checked;
    var speed = parseInt(document.getElementById("speed").value, 10);
    var num = document.getElementsByName("num");
    for (var i = 0; i < num.length; i++) {
        if (num[i].checked) {
            num = parseInt(num[i].value);
            break;
        };
    };

    var circle = new Circle(gameEngine, 0, 0, { x: 0, y: 0 }, 1000, anchor ? 0 : false);
    gameEngine.addEntity(circle);

    switch (num) {
        case 4:
            circle = new Circle(gameEngine, 0, -300, { x: speed, y: 0 }, 12, false);
            gameEngine.addEntity(circle);
        case 3:
            circle = new Circle(gameEngine, -300, 0, { x: 0, y: -speed }, 12, false);
            gameEngine.addEntity(circle);
        case 2:
            circle = new Circle(gameEngine, 0, 300, { x: -speed, y: 0 }, 12, false);
            gameEngine.addEntity(circle);
        case 1:
            circle = new Circle(gameEngine, 300, 0, { x: 0, y: speed }, 12, false);
            gameEngine.addEntity(circle);
            break;
        case 0:
            circle = new Circle(gameEngine, -300, 0, { x: 0, y: -speed }, 12, false);
            gameEngine.addEntity(circle);
            circle = new Circle(gameEngine, 300, 0, { x: 0, y: speed }, 12, false);
            gameEngine.addEntity(circle);
            break;
    };

    var center = new Center(gameEngine);
    gameEngine.addEntity(center);
};

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    gameEngine.init(ctx);

    restart();

    gameEngine.start();
});
