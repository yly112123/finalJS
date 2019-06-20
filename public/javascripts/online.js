//浮动侧栏图片
var floatSideImg = "/images/snake2.jpg";
var floatSideImg2 = "/images/mine2.png";
var bg="/images/bg.jpg";
function open_snake()
{
 window.open('/snake');
}
function open_boom()
{
 window.open('/boom');
}
//左侧浮动窗口
document.writeln("<div id=\"floatAd\" style=\" width:141px; height:520px; position:fixed !important; position:absolute; _top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight)); z-index: 99999; left:0; top:18%; background:url("+floatSideImg+");cursor:pointer;\">");
document.writeln("<div onclick=\"closeFAd();\" style=\" width:26px; height:26px; float:right;background:url("+bg+");\"></div>");
document.writeln("<div style=\"width:141px; height:490px; float:right;\" onclick=\"open_snake();\"></div>");
document.writeln("</div>");
//右侧浮动窗口
document.writeln("<div id=\"floatAd2\" style=\" width:141px; height:520px; position:fixed !important; position:absolute; _top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight)); right:0; top:18%; background:url("+floatSideImg2+");cursor:pointer;\">");
document.writeln("<div onclick=\"closeFAd2();\" style=\" width:26px; height:26px; float:right;background:url("+bg+");\"></div>");
document.writeln("<div style=\"width:200px; height:490px; float:right;\" onclick=\"open_boom();\"></div>");
document.writeln("</div>");
//关闭浮动广告
function closeFAd()
{
 document.getElementById('floatAd').style.display = 'none';
}
//打开浮动广告
function showFAd()
{
 document.getElementById('floatAd').style.display = 'block';
}
//打开浮动窗口
function showFloat()
{
 document.getElementById('floatAd').style.display = 'block';
}

function closeFAd2()
{
 document.getElementById('floatAd2').style.display = 'none';
}
//打开浮动广告
function showFAd2()
{
 document.getElementById('floatAd2').style.display = 'block';
}
//打开浮动窗口
function showFloat2()
{
 document.getElementById('floatAd2').style.display = 'block';
}
//打开窗口 20 秒仅执行一次
setTimeout(showFAd,20000);
//每个 30 秒执行一次
setInterval(showFloat,30000);
//打开窗口 20 秒仅执行一次
setTimeout(showFAd2,20000);
//每个 30 秒执行一次
setInterval(showFloat2,30000);