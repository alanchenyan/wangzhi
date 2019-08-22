var timerid = 0;
var currtime =0;
apiready = function () {
  //api.showProgress({title: '连接服务',text: '与服务器建立连接',modal: false});
  //在线人数
  var rdvalue = randomNum(100,200)
  var gkrs = rdvalue/100;
  $api.text($api.dom("#ggkk"),gkrs);
  ReqData();

  //定时请求数据
  currtime= 20;
  timerid = setInterval(ReqData,15000);
  setInterval(ClcTime,1000);
/*  ws_sk.addEventListener(function(ret, err) {
       if(ret.status){
           if(ret.evenType == 'Connected'){
             api.hideProgress();
             console.log("与服务器连接成功 ok~~~~~~~~~")
           }
           else if(ret.evenType == 'ReturnData'){
             var dataobj = $api.strToJson(ret.data);
              console.log("收到数据:"+ret.data)
             if(dataobj.msgtype == 100){
                if(dataobj.textstr){
                    var ans  = buildtxtmsg(dataobj);
                    $('.speak_box').append(ans);
                }
                if(dataobj.imgurl && dataobj.imgurl !=""){
                    var ans  = buildtxtimg(dataobj);
                    $('.speak_box').append(ans);
                }
                if(dataobj.itemid && dataobj.itemid !=""){
                    var ans  = buildbuymsg(dataobj);
                    $('.speak_box').append(ans);
                }
                for_bottom();
             }

           }
           else if(ret.evenType == 'Closed'){
              alert("与服务器断开连接");
              api.closeFrame();
           }

       }else {
         alert("与服务器断开连接");
         api.closeFrame();

       }
  });
*/

}

//计算发送时间
function ClcTime(){
  currtime = currtime -1;
  $api.text($api.dom("#ggkkm"),currtime);
}

//定时请求服务器
function ReqData()
{
    var parms = {
      url:"taokeapi3/getxb",
      callback:function(ret){
          if(ret.flag)
          {
              var dataobj = ret.data;
              if(dataobj.textstr){
                  var ans  = buildtxtmsg(dataobj);
                  $('.speak_box').append(ans);
              }
              if(dataobj.imgurl && dataobj.imgurl !=""){
                  var ans  = buildtxtimg(dataobj);
                  $('.speak_box').append(ans);
              }
              if(dataobj.itemid && dataobj.itemid !=""){
                  var ans  = buildbuymsg(dataobj);
                  $('.speak_box').append(ans);
              }
              for_bottom();
              currtime = 20;
          }
          else {
            //  pageMol.complate();
          }
      }
  }
  JM_GET(parms);
}

//创建头像
function createhead(dataobj){
  var ans  = '<div class="answer"><div class="heard_img left">';
    if(dataobj.headurl && dataobj.headurl != ""){
        ans += "<img src=\""+dataobj.headurl+"\"/></div>";
    }else{
      ans += '<img src="../image/t4.jpg"/></div>';
    }

  return ans;
}
//创建消息
function createmsg(dataobj){
  var sthtml = dataobj.textstr;
  if(dataobj.textstr1 && dataobj.textstr1 != ""){
    sthtml = sthtml+"</br>=====================</br>";
    sthtml = sthtml+dataobj.textstr1;
  }
  sthtml = filters(sthtml);
  return '<div class="answer_text"><p>'+sthtml+'</p><i></i>';
}

//创建图片消息
function buildtxtimg(dataobj){
  var htmstr = createhead(dataobj);
  htmstr = htmstr + '<div class="answer_text"><p>	<img class="msgimg" src="'+dataobj.imgurl+'" onclick="onimgborwer(\''+dataobj.imgurl+'\')" /></p><i></i>';
  htmstr += '</div></div>';
  return htmstr;
}
//创建文本消息
function buildtxtmsg(dataobj){
    var htmstr = createhead(dataobj);
    htmstr = htmstr + createmsg(dataobj);
    htmstr += '</div></div>';
    return htmstr;
}

//创建购买商品按钮
function buildbuymsg(dataobj){
    var htmstr = createhead(dataobj);
    htmstr = htmstr + '<div class="answer_text"><div class="buybtn"  onclick="onbuy('+dataobj.itemid+')"> 立即购买 </div><i></i>';
    htmstr += '</div></div>';
    return htmstr;
}


//浏览图片
function onimgborwer(url){
  var list = [];
  list[0] = url;
  CanvasImg.openBrowserImg(list,0);
}

//购买
function onbuy(itemid){
  	open_good_detais_itemid(itemid)
}

//关闭直播间
function fcloseWin(){
  api.closeWin();

}
