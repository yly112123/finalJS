$(function(){
	/*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/
    var socket = io('ws://localhost:80');
    var userlist=[]

    var avatar=document.getElementById("avatar").value;
	// /*登录*/
    var uname=document.getElementById("name").value;
    socket.emit('login',{username:uname,avatar:avatar})
    socket.on('loginlist',function(data){
        for(var i=0;i<data.length;i++){
            showuser(data[i]);
        }
        userlist=data;
    })

	/*发送消息*/
	$('.sendBtn').click(function(){
		sendMessage()
	});
	$(document).keydown(function(event){
		if(event.keyCode == 13){
			sendMessage()
		}
	})
	/*新人加入提示*/
	socket.on('add',function(data){
		var html = '<p>系统消息:'+data.username+'已加入群聊</p>';
        $('.chat-con').append(html);
        // showuser(data);
        var i=0;
        for( i;i<userlist.length;i++){
            if(data.username == userlist[i].username)
                break;
        }
        if(i===userlist.length)
        {
            showuser(data);
        }else{
            document.getElementById(data.username).style.display="block";
            document.getElementById(name+'name').style.display="block";
        }
	})
	/*接收消息*/
	socket.on('receiveMessage',function(data){
		showMessage(data);
    })
	/*退出群聊提示*/
	socket.on('leave',function(name){
		if(name != null){
			var html = '<p> 系统消息:'+name+'已退出群聊</p>';
            $('.chat-con').append(html);
            document.getElementById(name).style.display="none";
            document.getElementById(name+'name').style.display="none";
        }
	})
	/*发送消息*/
	function sendMessage(){
		var txt = $('#sendtxt').val();
		$('#sendtxt').val('');
		if(txt){
			socket.emit('sendMessage',{username:uname,message:txt,avatar:avatar});
		}
	}
	/*显示消息*/
	function showMessage(data){
        console.log(data)
		var html
		if(data.username === uname){
			html = '<div class="chat-item item-right clearfix"><span class="img fr" style="display:inline-block; width:40px; height:40px; background:url(/images/'+avatar+') no-repeat; background-size:100% 100%;"></span><span class="message fr">'+data.message+'</span></div>'
		}else{
			html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username+'</span><span class="img fl" style="display:inline-block; width:40px; height:40px; background:url(/images/'+data.avatar+') no-repeat; background-size:100% 100%;"></span><span class="fl message">'+data.message+'</span></div>'
		}
		$('.chat-con').append(html);
    }
    function showuser(data){
        html='<div style="height:50px;"><div class="images fl" style="display:block; width:40px; height:40px; background:url(/images/'+data.avatar+') no-repeat; background-size:100% 100%;" id="'+data.username+'"></div><p id="'+data.username+'name">'+data.username+'</p></div>';
        $('.users_list').append(html);
    }

})