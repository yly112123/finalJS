//默认行数
var default_line = 10;
//默认列数
var default_column = 10;
//默认地雷数
var default_minesCount = 20;
//随机生成的地雷矩阵
var minesArray = new Array();
//周围地雷数的数字颜色数组
var roundMineColors = ["blue", "orange", "red"];
//获取开始按钮
var begin = document.getElementById("start");
//获取当前玩家姓名
var currentName=document.getElementById('name').innerHTML;
//实际的行、列、地雷数
var line,column,minesCount;
var currentscore=0;//当前得分
//游戏状态 初始化0，进行中为1，暂停为2，结束为-1
var gameState = 0;
//时间记录
var timeHandler;
initMes();
//禁用右键菜单键
window.oncontextmenu = function(){
	return false;
};

begin.addEventListener("click", function(){
	
	if(gameState == 0 || gameState == -1){
		clear();
		init();
	}

}, false);

document.getElementById("pause").addEventListener("click", (function(){
	var pause = false;
	return function(){
		if(gameState != 1 && gameState != 2){
			alert("游戏已结束，请重新开始");
			return;
		}
		!pause && (pauseGame() || true) || proceedGame();
		pause = !pause; 
	};
})(), false);

document.getElementById("restart").addEventListener("click", function(){
	clear();
	init();
}, false);

// 界面的初始化
function init(){
	line = document.getElementById("line").value - 0 || default_line;
	column = document.getElementById("column").value - 0 || default_column;
	minesCount = document.getElementById("minesCount").value - 0 || default_minesCount;

	if(line * column < minesCount){
		alert("地雷数溢出，请重新设置数量！");
		return;
	}

	minesArray = randomMines();

	var html = "";
	var sideLen = getBoxLength();
	for(var i=0; i<line; i++){
		html += "<tr>";
		for(var j=0; j<column; j++){
			html += "<td id='" + (i + "_" + j) + "' class='unclick' width='" + sideLen +"px' height='" + sideLen 
				+ "px' onmousedown='try{checkMouse(this)}catch(e){}'></td>";
		}
		html += "</tr>";
	}
	with(document){
		getElementById("gameTable").innerHTML = html;
		getElementById("line").value = line;
		getElementById("column").value = column;
		getElementById("minesCount").value = minesCount;
	}
	
	gameState = 1;
	timeHandler = recordTime();
}

/**
 * 暂停游戏
 */
function pauseGame(){
	gameState = 2;
	document.getElementById("pause").innerText = "继续";
	window.clearInterval(timeHandler);
	document.getElementById("gameTable").style.display = "none";
}

/**
 * 继续游戏
 * @return {[type]} [description]
 */
function proceedGame(){
	gameState = 1;
	document.getElementById("pause").innerText = "暂停";
	timeHandler = recordTime();
	document.getElementById("gameTable").style.display = "block";
}

/**
 * @description 生成随机地雷矩阵
 * @return {[Array]} 返回随机生成的地雷矩阵
 */
function randomMines(){
	var minesArray_temp = new Array().concat();
	var count = minesCount || default_minesCount;
	var temp = new Array();
	for(var i=0; i<column; i++){
		temp.push(0);
	}
	for(var j=0; j<line; j++){
		Array.prototype.push.call(minesArray_temp, temp.concat());
	}
	with(Math){
		while(count > 0){
			var line_random = floor(random() * line);
			var column_random = floor(random() * column);
			if(!!minesArray_temp[line_random][column_random]){
				continue;
			}
			minesArray_temp[line_random][column_random] = 1;
			count--;
		}
	}
	return minesArray_temp;
}

/**
 * @param  {[Number]} 矩阵行
 * @param  {[Number]} 矩阵列
 * @return {[Number]} 如果该位置有地雷返回-1，否则返回周围地雷数
 */
function detectMines(x, y){
	//地雷格不需要检查
	if(minesArray[x][y] == 1){
		return -1;
	}
	//所检查的区域坐标
	var area_x_start = x - 1 < 0 ? x : x - 1;
	var area_x_end = (x + 1 > line - 1) && x || x + 1;
	var area_y_start = y - 1 < 0 ? y : y - 1;
	var area_y_end = (y + 1 > column - 1) && y || y + 1;

	var count = 0;
	for(var i=area_x_start; i<=area_x_end; i++){
		for(var j=area_y_start; j<=area_y_end; j++){
			!!minesArray[i][j] && count++;
		}
	}
	return count;
}

/* 检测td是否是地雷*/
function checkMines(td){
	var _this = td;
	//是否为地雷格，1为是，大于0为周围有地雷，小于0为空白格
	var isMine = -1;
	var position = _this.id.split("_");
	var mines = detectMines(position[0] - 0, position[1] - 0);
	//此格为地雷
	if(mines < 0 && mines == -1){
		_this.innerHTML = "";
		var img = document.createElement("img")
		_this.appendChild(img);
		img.src = "./images/mine.png";
		img.style.width = '80%';
		img.style.height = '80%';
		isMine = 1;
	}else if(mines > 0){
		//周围有地雷
		var temp = Math.floor(mines / 2);
		var clas = roundMineColors[temp > 2 && 2 || temp];
		_this.innerHTML = "<span class='" + clas + "'>" + mines + "</span>";
		isMine = 0;
	}else{
		//空白块
		_this.innerHTML = "";
	}
	_this.className = "clicked";
	return isMine;
}

/**
 * 鼠标右键标记
 * @param  {[type]} td [description]
 * @return {[type]}    [description]
 */
function markMines(td){
	var _this = td;
	if(_this.innerHTML.indexOf("flag") != -1){
		_this.innerHTML = "";
		return;
	}
	if(!!_this.innerHTML)
		return;
	var img = document.createElement("img")
	_this.appendChild(img);
	img.src = "./images/flag.png";
	img.style.width = '80%';
	img.style.height = '80%';
}

/**
 * 鼠标点击事件调度
 * @param  {[type]} td [description]
 * @return {[type]}    [description]
 */
function checkMouse(td){
	var _this = td;
	if(gameState === -1){
		alert("游戏已结束，请重新开始");
		return;
	}
	if(gameState === 2){
		alert("游戏已暂停");
		return;	
	}
	//如果此方格点击过
	if(_this.className.indexOf("clicked") != -1)
		return;
	var e = e || window.event;
	
	if(e.button == "0"){
		var isMine = checkMines(td);
		//鼠标左键
		if(isMine > 0){
			gameOver();
		}else if(isMine < 0){
			//先记录得分，再递归查找周围格子
			recordScore(1);
			findBlankBox(td, 1);
		}else{
			//记录得分
			recordScore(1);
		}
	}else if(e.button == "2"){
		//鼠标右键
		markMines(td);
	}

	var score = document.getElementById("score").innerText - 0;
	if(score >= (line * column - minesCount)){
		
		alert("恭喜您已顺利通关！");
		gameOver();
		return;
	}

}

/**
 * 游戏结束
 * @return {[type]} [description]
 */
function gameOver(){
	updataMes();
	var tds = document.getElementsByTagName("td");
	for (var i = 0; i < tds.length; i++) {
		tds[i].removeEventListener("onmousedown", checkMouse);
	}
	gameState = -1;
	if(!!timeHandler)
		window.clearInterval(timeHandler);
	alert("游戏结束, 你的得分是 " + document.getElementById("score").innerText);
	displayAllMines();
	
}

/**
 * 根据外层div的width/height的比率获取每个td的边长
 * @return {[type]} [description]
 */
function getBoxLength(){
	var width = document.getElementById("gameArea").offsetWidth;
	var height = document.getElementById("gameArea").offsetHeight;
	var rate = width / height;
	if(column / line >= width / height){
		return Math.floor(width / (column - 0 + 1) - 2);
	}
	return Math.floor(height / (line - 0 + 1) - 2);
}

/**
 * 时间记录
 * @return {[type]} [description]
 */
function recordTime(){
	return setInterval((function(){
		var start = document.getElementById("time").innerText - 0;
		return function(){
			start++;
			document.getElementById("time").innerText = start;
		};
	})(), 1000);
}

/**
 * 得分记录
 * @param  {[Number]} s [每次得分]
 * @return {[type]}   [description]
 */
function recordScore(s){
	var score = document.getElementById("score");
	score.innerText = score.innerText - 0 + s;
	// currentscore = score.innerText;
}

/**
 * 清空时间和得分记录
 * @return {[type]} [description]
 */
function clear(){
	if(!!timeHandler)
		window.clearInterval(timeHandler);
	document.getElementById("time").innerText = "0";
	document.getElementById("score").innerText = "0";
	currentscore = 0;
	// document.getElementById("leftboom").innerText = "0";
	gameState = 0;
}

/**
 * game over时显示全部方分布情况
 * @return {[type]} [description]
 */
function displayAllMines(){
	var tds = document.getElementById("gameArea").getElementsByTagName("td");
	for (var i = 0; i < tds.length; i++) {
		if(tds[i].className.indexOf("clicked") == -1){
			var isMark = tds[i].innerHTML.indexOf("flag") != -1;
			checkMines(tds[i]);
			//如果以前右键标记了，将其背景颜色改为红色
			if(isMark){
				tds[i].style.backgroundColor = "pink";
			}
		}
	}
}

/**
 * 递归找到周围空白格
 * type=0是只查找该格子上下左右相邻四个格子的情况
 * tye=1是查找周围八个格子的情况
 * @param  {[type]} td   [description]
 * @param  {[type]} type [递归模式]
 * @return {[type]}      [description]
 */
function findBlankBox(td, type){
	var _this = td;
	var position = _this.id.split("_");
	var x = position[0] - 0;
	var y = position[1] - 0;
	type = type || 1
	if(!type){
		//需要递归检查的区域
		var checkArea = new Array();
		var temp;
		x - 1 >= 0 && (temp = document.getElementById((x - 1) + "_" + y)).className.indexOf("clicked") == -1 && checkArea.push(temp);
		x + 1 <= line - 1 && (temp = document.getElementById((x + 1) + "_" + y)).className.indexOf("clicked") == -1 && checkArea.push(temp);
		y - 1 >= 0 && (temp = document.getElementById(x + "_" + (y - 1))).className.indexOf("clicked") == -1 && checkArea.push(temp);
		y + 1 <= column - 1 && (temp = document.getElementById(x + "_" + (y + 1))).className.indexOf("clicked") == -1 && checkArea.push(temp);

		for(var current in checkArea){
			if(checkMines(checkArea[current]) < 0){
				recordScore(1);
				findBlankBox(checkArea[current], type);
			}
		}
	}else{
		//所检查的区域坐标
		var area_x_start = x - 1 < 0 ? x : x - 1;
		var area_x_end = (x + 1 > line - 1) && x || x + 1;
		var area_y_start = y - 1 < 0 ? y : y - 1;
		var area_y_end = (y + 1 > column - 1) && y || y + 1;

		for(var i=area_x_start; i<=area_x_end; i++){
			for(var j=area_y_start; j<=area_y_end; j++){
				if(i == x && j == y)
					continue;
				var td_current = document.getElementById(i + "_" + j)
				if(td_current.className.indexOf("clicked") != -1)
					continue;
				recordScore(1);
				if(checkMines(td_current) < 0){
					findBlankBox(td_current, type)
				}
			}
		}
	}
	
}

/**
 * 给相应的container添加html
 * @param  {[type]} container [description]
 * @param  {[type]} content   [description]
 * @return {[type]}           [description]
 */
function showContent(container, content){
	if(document.innerHTML)
		container.innerHTML = content;
}

/**
 * 根据className获取DOM数组
 * @param  {[type]} rootNode  [查找的根节点, 默认为document]
 * @param  {[type]} classname [查找的className]
 * @return {[type]}           [description]
 */
function getElementsByClassName(rootNode, classname){
	if(!rootNode)
		rootNode = document;
	if(rootNode.getElementsByClassName)
		return rootNode.getElementsByClassName(className);
	var allNodes = rootNode.getElementsByTagName("*");
	var classArray = new Array();
	for (var i = 0; i < allNodes.length; i++) {
		if(allNodes[i].className.indexOf(classname) != -1){
			classArray[classArray.length] = allNodes[i];
		}
	}
	return allNodes;
}

function displayRanking() {
	
	var historyMessage=JSON.parse(localStorage.getItem("messageStorage"));//用户历史信息
	var ranking=new Array();
	for(var i=0;i<historyMessage.length;i++) {
		var player=historyMessage[i];
		var name_highScore={};//存取玩家及其对应最高纪录的数组
		var currentScore=player.score;//当前玩家历史得分数组
		var currentHighScore=currentScore[0];//当前玩家最高分
		for(var j=0;j<currentScore.length;j++){
			if(currentHighScore<currentScore[j])
			{
				currentHighScore=currentScore[j];
			}
		}
		name_highScore.name=player.name;
		name_highScore.score=currentHighScore;
		ranking.push(name_highScore); //将玩家以及对应的最高分组成的对象放入数组中
	}
  
	//对数组按照分数排序
	var k, m, tmp;
	for (k = 1; k < ranking.length; k++)
	{
		tmp = ranking[k];
		m = k - 1;
		while (m>=0 && tmp.score < ranking[m].score)
		{
			ranking[m + 1] = ranking[m];
			m--;
		}
		ranking[m + 1] = tmp;
	}
  //        console.log(ranking);
	//创建结点
	for(var f=ranking.length-1;f>=0;f--){
		var ul=document.getElementById('ranking');
		var li=document.createElement('li');
		li.innerHTML="玩家："+ranking[f].name+"--------最高分："+ranking[f].score;
		ul.appendChild(li);
	}
  
  }
  function initMes(){
	var message_child={};
	var historyMessage=JSON.parse(localStorage.getItem("messageStorage"));//用户历史信息
	var flag=false;

	if(historyMessage != null){
		for(var i=0;i<historyMessage.length;i++){
			if(historyMessage[i].name===currentName){
				flag=true; //已经有该用户
			}
		}
	}
	if(!flag){//新用户
		message_child.name=currentName;
		message_child.score=[0];
		if(historyMessage==null){
			historyMessage=new Array();//不仅是新用户，而且该游戏还没有任何历史记录

		}
		historyMessage.push(message_child);//将新用户的信息对象放入数组中
		localStorage.setItem("messageStorage",JSON.stringify(historyMessage));//存入本地

	}
  }
  
  function updataMes() {
	var historyMessage=JSON.parse(localStorage.getItem("messageStorage"));//用户历史信息
  
	for(var i=0;i<historyMessage.length;i++){
		if(historyMessage[i].name==currentName){
			historyMessage[i].score.push(document.getElementById("score").innerText);
			localStorage.setItem("messageStorage",JSON.stringify(historyMessage));//存入本地
		}
	}
  }