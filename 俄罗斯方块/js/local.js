// 本地游戏逻辑

var Local = function() {
    // 游戏对象
    var game;

    // 时间间隔
    var INTERVAL = 500;
    // 定时器
    var timer = null;

    // 游戏总时间计数器
    var timeCount = 0;

    var time = 0;

    // 绑定键盘事件
    var bindKeyEvent = function() {
        document.onkeydown = function(e) {
            if (e.keyCode == 38) { // up
                game.rotate();
            } else if (e.keyCode == 39) { //right
                game.right();
            } else if (e.keyCode == 40) { //down
                game.down();
            } else if (e.keyCode == 37) { //left
                game.left();
            } else if (e.keyCode == 32) { //space
                game.fall();
            }
        }
    }

    var bindClickEvent = function() {
        document.onclick = function(e) {
            var target = e.target.getAttribute("id")
            if (target === "up") {
                game.rotate();
            } else if (target === "right") {
                game.right();
            } else if (target === "down") {
                game.down();
            } else if (target === "left") {
                game.left();
            } else if (target === "fall") {
                game.fall();
            } else if (target === "newGame") {
                document.getElementById("gameOver").innerText = "";
                document.getElementById("time").innerText = "0";
                document.getElementById("score").innerText = "0";
                stop();
                time = 0;
                start();

            }
        }
    }

    // 移动
    var move = function() {
        timeFunc();
        if (!game.down()) {
            game.fixed();
            var line = game.checkClear();
            if (line) {
                game.addScore(line);
            }
            var gameOver = game.checkGameOver();
            if (gameOver) {
                game.gameOver(false);
                stop();
            } else {
                game.performNext(generateType(), generateDir());
            }
        }
    }

    // 计时函数
    var timeFunc = function() {
        timeCount = timeCount + 1;
        if (timeCount === 2) {
            timeCount = 0;
            time = time + 1;
            game.setTime(time);
        }
    }

    // 随机生成一个方块种类
    var generateType = function() {
        return Math.floor(Math.random() * 7);
    }

    // 随机生成一个旋转次数
    var generateDir = function() {
        return Math.floor(Math.random() * 4);
    }

    // 开始
    var start = function() {
        var doms = {
            gameDiv: document.getElementById("game"),
            nextDiv: document.getElementById("next"),
            scoreDiv: document.getElementById("score"),
            resultDiv: document.getElementById("gameOver")
        }
        game = new Game();
        game.init(doms, generateType(), generateDir());
        bindKeyEvent();
        bindClickEvent();
        game.performNext(generateType(), generateDir());
        timer = setInterval(move, INTERVAL);
    }

    // 结束
    var stop = function() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;
    }

    // 导出API
    this.start = start;

}