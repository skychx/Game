// 赢法数组
var wins = [];
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

// 赢法种类的索引(遍历所有可能赢的情况)

// 运行下面的循环，会有这几种赢的情况
// wins[0][0][0] = true;
// wins[0][1][0] = true;
// wins[0][2][0] = true;
// wins[0][3][0] = true;
// wins[0][4][0] = true;   

// 所有横线赢法
var count = 0;

for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

// 所有竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) { // k表示五子相连
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

// 斜线
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) { // k表示五子相连
            wins[j + k][i + k][count] = true;
        }
        count++;
    }
}

// 反斜线
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) { // k表示五子相连
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

console.log(count);

var newGame = function() {
    var me = true;
    var over = false; //判断游戏是否结束

    var chess = document.getElementById("chess");

    // 开始前重新绘制图像达到刷新界面的目的
    chess.height = chess.height;
    chess.width = chess.width;
    var context = chess.getContext("2d");


    // 计数数组
    var chessBoard = [];
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }


    // 赢法的统计数组
    // 我的
    var myWin = [];
    // 计算机的
    var computerWin = [];

    for (var i = 0; i < count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0;
    }

    // 添加背景水印
    var logo = new Image();
    logo.src = "img.png";
    // 调用回调函数加载
    logo.onload = function() {
        context.drawImage(logo, 0, 0, 450, 450);
        drawChessBoard();
    }

    // 画棋盘格
    context.strokeStyle = "#bfbfbf";
    var drawChessBoard = function() {
        for (var i = 0; i < 15; i++) {
            context.moveTo(15 + i * 30, 15);
            context.lineTo(15 + i * 30, 435);
            context.stroke();
            context.moveTo(15, 15 + i * 30);
            context.lineTo(435, 15 + i * 30);
            context.stroke();
        }
    }

    // 绘制黑白棋子
    var oneStep = function(i, j, me) {
        context.beginPath();
        context.arc(15 + i * 30, 15 + j * 30, 13, 0, Math.PI * 2);
        context.closePath();
        // 渐变设置偏移量
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
        if (me) {
            gradient.addColorStop(0, '#0a0a0a');
            gradient.addColorStop(1, '#636766');
        } else {
            gradient.addColorStop(0, '#d1d1d1');
            gradient.addColorStop(1, '#f9f9f9');
        }
        context.fillStyle = gradient;
        context.fill();
    }


    // 定义计算机AI程序
    var computerAI = function() {
        var myScore = [];
        var computerScore = [];

        // 最高分和最高分点坐标,计算机落子坐标就是[u,v]
        var max = 0;
        var u = 0,
            v = 0;

        // 棋盘每个点得分归0
        for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (var j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (chessBoard[i][j] === 0) {
                    for (var k = 0; k < count; k++) { //遍历所有赢法
                        if (wins[i][j][k]) { // 同一个位置上有多个赢法时分数会进行累加
                            switch (myWin[k]) {
                                case 1:
                                    myScore[i][j] += 200;
                                    break;
                                case 2:
                                    myScore[i][j] += 500;
                                    break;
                                case 3:
                                    myScore[i][j] += 2000;
                                    break;
                                case 4:
                                    myScore[i][j] += 10000;
                                    break;
                            }
                            switch (computerWin[k]) {
                                case 1:
                                    computerScore[i][j] += 220;
                                    break;
                                case 2:
                                    computerScore[i][j] += 520;
                                    break;
                                case 3:
                                    computerScore[i][j] += 2200;
                                    break;
                                case 4:
                                    computerScore[i][j] += 20000;
                                    break;
                            }
                        }
                    }
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] === max) {
                        if (computerScore[i][j] > computerScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                    if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    } else if (computerScore[i][j] === max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }
        oneStep(u, v, false);
        chessBoard[u][v] = 2;
        for (var k = 0; k < count; k++) {
            if (wins[u][v][k]) {
                computerWin[k]++;
                myWin[k] = 6;
                if (computerWin[k] === 5) {
                    document.getElementById("winner").innerText = "你输了！";
                    over = true;
                }
            }
        }
        // 如果还没有结束，把下棋的权利移交计算机
        if (!over) {
            me = !me;
        }
    }

    // 鼠标点击落子实现
    chess.onclick = function(e) {
        if (over) {
            return;
        }
        if (!me) {
            return;
        }
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        if (chessBoard[i][j] === 0) {
            oneStep(i, j, me);
            chessBoard[i][j] = 1;

            // 下面是判断我方棋子赢法
            for (var k = 0; k < count; k++) {
                if (wins[i][j][k]) {
                    myWin[k]++;
                    computerWin[k] = 6;
                    if (myWin[k] === 5) {
                        document.getElementById("winner").innerText = "你赢了！";
                        over = true;
                    }
                }
            }
            // 如果还没有结束，把下棋的权利移交计算机
            if (!over) {
                me = !me;
                computerAI();
            }
        }
    }
}

window.onload = function() {
    newGame();
}

// 点击事件
document.getElementById("btn").onclick = function(e) {
    newGame();
    document.getElementById("winner").innerText = " ";
}