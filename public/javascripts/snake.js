var map = document.getElementById('map');
var lock = true; //控制贪吃蛇游戏是否中止
var lock2 = true;
var begin = document.getElementById('begin');
var timer;
var currentscore=0;//当前得分
var speed = 200;//初始速度
var currentName=document.getElementById('name').innerHTML;
var flag=false;
    // 使用构造方法创建蛇，
    // initMes();
    function Snake()
    {
      speedChange();
      // 设置蛇的宽、高、默认走的方向
      this.width = 10;
      this.height = 10;
      this.direction = 'right';
      // 记住蛇的状态，当吃完食物的时候，就要加一个，初始为3个小点为一个蛇，
      this.body = [
        {x:2, y:0},  // 蛇头，第一个点
        {x:1, y:0},  // 蛇脖子，第二个点
        {x:0, y:0}  // 蛇尾，第三个点
      ];
      // 显示蛇
      this.display = function() {
        // 创建蛇
        for (var i=0; i<this.body.length; i++) {
          if (this.body[i].x != null) {  // 当吃到食物时，x==null，不能新建，不然会在0，0处新建一个
            var s = document.createElement('div');
            // 将节点保存到状态中，以便于后面删除
            this.body[i].flag = s;
            // 设置宽高
            s.style.width = this.width + 'px';
            s.style.height = this.height + 'px';
            s.style.borderRadius = "50%";
            s.style.background = "rgb(" + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + ")";
            // 设置位置
            s.style.position = 'absolute';
            s.style.left = this.body[i].x * this.width + 'px';
            s.style.top = this.body[i].y * this.height + 'px';
            
            // 添加进去
            map.appendChild(s);
          }
        }
      };
      // 让蛇跑起来,后一个元素到前一个元素的位置
      // 蛇头根据方向处理，所以i不能等于0
      this.run = function() {
        // 后一个元素到前一个元素的位置
        pauseAndOn();
        if(lock){
        for (var i=this.body.length-1; i>0; i--) {
          this.body[i].x = this.body[i-1].x;
          this.body[i].y = this.body[i-1].y;
        }
        // 根据方向处理蛇头
        switch(this.direction)
        {
          case "left":
            this.body[0].x -= 1;
            break;
          case "right":
            this.body[0].x += 1;
            break;
          case "up":
            this.body[0].y -= 1;
            break;
          case "down":
            this.body[0].y += 1;
            break;
        }
        // 判断是否出界,一蛇头判断,出界的话，
        if (this.body[0].x < 0 || this.body[0].x > 79 || this.body[0].y < 0 || this.body[0].y > 39) {
          clearInterval(timer);  // 清除定时器，
          alert("糟糕，您已碰壁！GAME OVER！");
          window.location.href="http://localhost:80/snake/"+currentscore;
          // updataMes();
          lock2=true;
          // 删除旧的
          for (var i=0; i<this.body.length; i++) {
            if (this.body[i].flag != null) {  // 如果刚吃完就死掉，会加一个值为null的
              map.removeChild(this.body[i].flag);
            }
          }
          this.body = [  // 回到初始状态，
            {x:2, y:0},
            {x:1, y:0},
            {x:0, y:0}
          ];
          this.direction = 'right';
          this.display();  // 显示初始状态
          return false;  // 结束
        }
        // 判断蛇头吃到食物，xy坐标重合，
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
          // 蛇加一节，因为根据最后节点定，下面display时，会自动赋值的
          this.body.push({x:null, y:null, flag: null});
          // 清除食物,重新生成食物
          map.removeChild(food.flag);
          currentscore+=1;
          document.getElementById('score').innerHTML = currentscore;
          food.display();
        }
        // 吃到自己死亡，从第五个开始与头判断，因为前四个永远撞不到
        for (var i=4; i<this.body.length; i++) {
          if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
            clearInterval(timer);  // 清除定时器，
            alert("贪吃蛇吃自己是犯规的！GAME OVER！");
            window.location.href="http://localhost:80/snake/"+currentscore;
            // updataMes();
            lock2=true;
            // 删除旧的
            for (var i=0; i<this.body.length; i++) {
              if (this.body[i].flag != null) {  // 如果刚吃完就死掉，会加一个值为null的
                map.removeChild(this.body[i].flag);
              }
            }
            this.body = [  // 回到初始状态，
              {x:2, y:0},
              {x:1, y:0},
              {x:0, y:0}
            ];
            this.direction = 'right';
            this.display();  // 显示初始状态
            return false;  // 结束
          }
        }
        // 先删掉初始的蛇，在显示新蛇
        for (var i=0; i<this.body.length; i++) {
          if (this.body[i].flag != null) {  // 当吃到食物时，flag是等于null，且不能删除
            map.removeChild(this.body[i].flag);
          }
        }
        // 重新显示蛇
        this.display();
 
      }
    }
    }
    // 构造食物
    function Food()
    {
      this.width = 10;
      this.height = 10;
      this.display = function() {
        var f = document.createElement('div');
        this.flag = f;
        f.style.width = this.width + 'px';
        f.style.height = this.height + 'px';
        f.style.background = 'red';
        f.style.borderRadius = '50%';
        f.style.position = 'absolute';
        this.x = Math.floor(Math.random()*80);
        this.y = Math.floor(Math.random()*40);
        f.style.left = this.x * this.width + 'px';
        f.style.top = this.y * this.height + 'px';
        map.appendChild(f);
      }
    }
    var snake = new Snake();
    var food = new Food();
    snake.display();  // 初始化显示
    food.display();
    // 给body加按键事件，上下左右
    document.body.onkeydown = function(e) {
      // 有事件对象就用事件对象，没有就自己创建一个，兼容低版本浏览器
      var ev = e || window.event;
      if(lock){
      switch(ev.keyCode)
      {
          case 38:
          if (snake.direction != 'down') {  // 向上的时候不能向下
            snake.direction = "up";
          }
          break;
        case 40:
          if (snake.direction != "up") {
            snake.direction = "down";
          }
          break;
        case 37:
          if (snake.direction != "right") {
            snake.direction = "left";
          }
          break;
        case 39:
          if (snake.direction != "left") {
            snake.direction = "right";
          }
          break;
        case 32:
            lock = false;
            document.getElementById('stop1').style.display = 'block';
            document.getElementById('stop').style.display = 'none';
            break;
        default:
            break;
        }
      }
    };
    // 点击开始时，动起来
    begin.onclick = function() {
      
      lock2 = false;
      currentscore = 0;
      document.getElementById('score').innerHTML = currentscore;
      clearInterval(timer);
      timer = setInterval("snake.run()", speed); // 小技巧，每500毫秒执行字符串，字符串执行内部代码
    };
    function pauseAndOn() {
    document.getElementById('stop').onclick = function() {
        lock = false;
        document.getElementById('stop1').style.display = 'block';
        document.getElementById('stop').style.display = 'none';
    }
    document.getElementById('stop1').onclick = function() {
        lock = true;
        document.getElementById('stop1').style.display = 'none';
        document.getElementById('stop').style.display = 'block';
    }
  };
//速度选择器
function speedChange() {
  document.getElementById('btn1').onclick = function() {
      if (lock2) {
          document.getElementById('btn1').style.opacity = '0.2';
          document.getElementById('btn2').style.opacity = '1';
          document.getElementById('btn3').style.opacity = '1';
          speed = 200;
      }
  }
  document.getElementById('btn2').onclick = function() {
      if (lock2) {
          document.getElementById('btn2').style.opacity = '0.2';
          document.getElementById('btn1').style.opacity = '1';
          document.getElementById('btn3').style.opacity = '1';
          speed = 100;
      }
  }
  document.getElementById('btn3').onclick = function() {
      if (lock2) {
          document.getElementById('btn3').style.opacity = '0.2';
          document.getElementById('btn1').style.opacity = '1';
          document.getElementById('btn2').style.opacity = '1';
          speed = 50;
      }
  }
}
// function displayRanking() {
//   var historyMessage=JSON.parse(localStorage.getItem("messageStorage"));//用户历史信息
//   var ranking=new Array();
//   for(var i=0;i<historyMessage.length;i++) {
//       var player=historyMessage[i];
//       var name_highScore={};//存取玩家及其对应最高纪录的数组
//       var currentScore=player.score;//当前玩家历史得分数组
//       var currentHighScore=currentScore[0];//当前玩家最高分
//       for(var j=0;j<currentScore.length;j++){
//           if(currentHighScore<currentScore[j])
//           {
//               currentHighScore=currentScore[j];
//           }
//       }
//       name_highScore.name=player.name;
//       name_highScore.score=currentHighScore;
//       ranking.push(name_highScore); //将玩家以及对应的最高分组成的对象放入数组中
//   }

//   //对数组按照分数排序
//   var k, m, tmp;
//   for (k = 1; k < ranking.length; k++)
//   {
//       tmp = ranking[k];
//       m = k - 1;
//       while (m>=0 && tmp.score < ranking[m].score)
//       {
//           ranking[m + 1] = ranking[m];
//           m--;
//       }
//       ranking[m + 1] = tmp;
//   }
//   for(var f=ranking.length-1;f>=0;f--){
//       var ul=document.getElementById('ranking');
//       var li=document.createElement('li');
//       li.innerHTML="玩家："+ranking[f].name+"------最高分："+ranking[f].score;
//       ul.appendChild(li);
//   }

// }
// function initMes(){
//   var message_child={};
//   var historyMessage=JSON.parse(localStorage.getItem("messageStorage"));//用户历史信息
//   if(historyMessage != null){
//       for(var i=0;i<historyMessage.length;i++){
//           if(historyMessage[i].name===currentName){
//               flag=true; //已经有该用户
//           }
//       }
//   }
//   if(!flag){//新用户
//       message_child.name=currentName;
//       message_child.score=[0];
//       if(historyMessage==null){
//           historyMessage=new Array();//不仅是新用户，而且该游戏还没有任何历史记录
//       }
//       historyMessage.push(message_child);//将新用户的信息对象放入数组中
//       localStorage.setItem("messageStorage",JSON.stringify(historyMessage));//存入本地
//   }
// }

// function updataMes() {
//   var historyMessage=JSON.parse(localStorage.getItem("messageStorage"));//用户历史信息
//   for(var i=0;i<historyMessage.length;i++){
//       if(historyMessage[i].name==currentName){
//           historyMessage[i].score.push(currentscore);
//           localStorage.setItem("messageStorage",JSON.stringify(historyMessage));//存入本地
//       }
//   }
// }