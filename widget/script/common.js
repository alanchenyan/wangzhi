
var app={
    //host:'http://www.modoua.com/index.php/',
    host:'http://taobaoke.wzubi.com/index.php/',
    img_cdn:'',
    isdebug:1,//是否开启调试功能。开启调试功能将输入所有的请求信息
    fix:'api/',
    urls:{
      mao1:'http://www.modoua.com/index.php/web/viewinfo/index/cid/9',//天猫1元购物
      gonggao:'http://www.modoua.com/index.php/web/viewinfo/index/cid/10',//天猫1元购物
      author: 'http://www.modoua.com/index.php/api/taobaoapi/authorcode/', //联盟授权回调页面
      sharepage: 'http://www.modoua.com/h5/sharegoods/index.html',    //分享的中间页面地址
      //shareapp:'http://www.modoua.com/h5/shareapp/index.html',    //分享APP的链接地址
      alibao:'http://www.modoua.com/h5/alibao.html',             //zhifub活动
      yinsi:'http://www.modoua.com/h5/yingsi.html',             //隐私政策
    },
    SMS_KEY :'HUBAOLIN.',  //与服务器校验的KEY

    /**************选品库窗体类型选择**************/
    farme_love:-1,  //猜你喜欢
    farme_you9:0,   //9.9包邮
    farme_rank:1,   //排款排行
    farme_band:2,   //品牌数据
    farme_thui:3,  //特惠商品
    farme_newday:4, //今日上新
    frame_muyin:5,  //母婴版块
    frame_xuanpin:6,  //联盟选品库
    frame_search:7,   //商品搜索
    frame_userlevel:8,   //团长升级
    frame_jd:9,   //京东界面数据
    frame_pdd:10,    //拼多多界面数据
    /*********************************************/
}


/* GET 请求数据
 * param: url 地址
 *        timeout 可选超时时间
 *        callback 回调函数
*/
function JM_GET(param)
{
    var url=app.host+app.fix+param.url;
    console.log('get url("'+url+'") ajax ing...');
    api.ajax({
        url: url,
        method: 'get',
        timeout:param.timeout>0?param.timeout:30
    },function(ret, err){
        if(app.isdebug==true){
           console.log('get ajax complate;'+'ret:'+JSON.stringify(ret)+';err:'+$api.jsonToStr(err));
        }
        if (ret && ret !="") {
            if(ret.code== -1 && !param.isflag){ //用户登录失效; 排除首次登录
                api.closeWin();
                api.sendEvent({name: 'loginout_event',extra: {  username: 0}});
                api.toast({msg: "用户登录失败或已过期",duration: 2500,location: 'bottom'});
                return;
            }else{
              param.callback({flag:ret.code==1,data:ret.data,msg:ret.msg,ret:ret});
            }

        } else {
              api.openWin({
                  name:'FRAME_NETWORK',
                  url: 'widget://html/frame_network.html',
                  pageParam:{errinfo:err,errpage:param,ptype:1}
              });
          //  param.callback({flag:false,data:undefined,msg:'网络错误:'+$api.jsonToStr(err),ret:ret});
        }
    });
}


/*
  * POST 请求数据
  * param: url 地址
  *        timeout 可选超时时间
  *        callback 回调函数
*/
function JM_POST(param)
{
    var url=app.host+app.fix+param.url;
    var datas = {};
    datas.values=param.values;
    console.log('post url("'+url+'");'+'post data("'+JSON.stringify(datas)+'") ajax ing...');
    api.ajax({
        url: url,
        method: 'post',
        dataType: 'json',
        data: datas,
        timeout:30
        //headers:param.token?{_token:param.token,union:app.unionid}:{_token:'',union:app.unionid}
    },function(ret, err){

        if(app.isdebug==true){
          console.log('post ajax complate;'+'ret:'+JSON.stringify(ret)+';err:'+JSON.stringify(err));
        }
        if (ret) {
            param.callback({flag:ret.code==1,data:ret.data,msg:ret.msg,ret:ret});
        } else {
            api.toast({msg: "系统错误(001)",duration: 5000,location: 'bottom'});
            param.callback({flag:false,data:undefined,msg:'请求失败:'+ret.msg,ret:ret});
        }
    });

}


function filters(str){
      var s= str;
      s = s.replace(/&lt;/g,'<');
      s = s.replace(/&gt;/g,'>');
      return s;
}
// 补零
function PrefixInteger(num, length) {
 	return ( "0000000000000000" + num ).substr( -length );
}

//保留小数后2位
function Decimal2(str){
   return Number(str.toString().match(/^\d+(?:\.\d{0,2})?/));
}

function isNumber(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) && regNeg.test(val)){
        return true;
    }else{
        return false;
    }

}
//转换万单位
function changeW (x) {
    if(!isNumber(x))
      return x;
    if(!x) return x;
    if(Number(x) < 10000)
      return x;
    x=x/10000;
    x = x.toFixed(1);
    var y=x+"万";
    return y;
}
//保留一位小数
function numberto1(x)
{
    if(!x) return x;
    x = Number(x);
    if(x%1 === 0){
      return x;
    }
    return x.toFixed(1);
}

//获取设备编号 MD5几码
function getDeviceValue(){
    var devvalue = hex_md5(api.deviceId);
    return devvalue;
}


//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}

//时间戳转换
function fmtDate(timeStamp){
  //判断；如果是XXXX-XX-XX 时间格式就返回
  if(isNaN(timeStamp)&&!isNaN(Date.parse(timeStamp))){
　　  return timeStamp;
  }

  timeStamp = timeStamp/1000;
  var date = new Date();
   date.setTime(timeStamp * 1000);
   var y = date.getFullYear();
   var m = date.getMonth() + 1;
   m = m < 10 ? ('0' + m) : m;
   var d = date.getDate();
   d = d < 10 ? ('0' + d) : d;
   var h = date.getHours();
   h = h < 10 ? ('0' + h) : h;
   var minute = date.getMinutes();
   var second = date.getSeconds();
   minute = minute < 10 ? ('0' + minute) : minute;
   second = second < 10 ? ('0' + second) : second;
   return y + '-' + m + '-' + d;

}



//商品简要信息封装 (阿里妈妈)；导购物料的参数
function ConvertGoodItem(info)
{
  var cpuponvalue = info.coupon_amount;
  if(!cpuponvalue) cpuponvalue = 0;
  var item = {
      itemid:info.item_id,
      itempic:'http:'+info.pict_url,
      itemtitle:info.title,
      couponprice:info.coupon_amount,
      commissionrate:info.commission_rate, //佣金比例
      itemprice:info.zk_final_price,
      sellnum:info.volume,
      newprice:Decimal2(info.zk_final_price-info.coupon_amount), //计算卷后价格
      usertype:info.user_type,	//0表示集市，1表示商城
      couponstart:fmtDate(info.coupon_start_time),
      couponendtime:fmtDate(info.coupon_end_time)
  };
  if(app.isdebug==true){
     console.log('商品信息:'+ JSON.stringify(item));
  }
  return  item;
}

//就按佣金
//ratevalue 联盟的比例
//newprice 最新价格
function clcrate1(ratevalue,newprice){
  //例如：比例 2700
  var allvalue = parseFloat(ratevalue/100 * newprice);
  var cuurate = (allvalue*(60/100)) - (allvalue *0.1);
  return  cuurate.toFixed(2);
}
function clcrate2(ratevalue,newprice){
  //例如：比例 2700
  var allvalue = parseFloat(ratevalue/100 * newprice);
  var cuurate = (allvalue*(80/100))-(allvalue *0.1);
  return  cuurate.toFixed(2);
}

//打开商品详情窗体界面
//goodtype:1-淘宝 2-京东 3-拼多多
function openGoodDetails(iteminfo,goodtype){
  if(!usermgr.checkLogin()){
      return;
  }
  var url_s = 'widget://html/goods/shopgoodframe.html';
  if(iteminfo.couponurl!=null){
      api.setGlobalData({key: 'jdcouponurl',  value: iteminfo.couponurl});
  }
	api.openWin({
	    name: "frame_gooddetail",
	    url: url_s,
      progress:{
            title:"正在打开你的宝贝",           //type为default时显示的加载框标题
            text:"努力打开中",            //type为default时显示的加载框内容
            color:"#eee"            //type为page时进度条的颜色，默认值为#45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
        },
	    pageParam: {
	        item: iteminfo,
          type:goodtype
	    }
	});

}


function open_good_detais_itemid(itemid,isdir)
{
  //查找商品详情信息；
  api.showProgress({title: '打开商品...',text: '努力打开商品中...',modal: false});
  var parms = {
      url:"taokeapi/getgood/itemid/"+itemid,
      callback:function(ret){
          api.hideProgress();
          if(ret.flag)
          {
            var dataModel = ret.data;
            if(dataModel){
                 openGoodDetails(dataModel,isdir);
            }
            else {
              alert("该商品已下架,或者优惠活动结束");
            }
          }
          else {
              alert("该商品已下架,或者优惠活动结束");
          }
      }
  }
  JM_GET(parms);
}

//打开分类物品窗体界面
function openCateFrame(cateid,frame_type){
    var curr_cate_data  =  api.getGlobalData({key: 'rootCateInfo'+cateid});
    if(!curr_cate_data)
        return toast("分类数据未找到,请联系管理!");
    api.openWin({
      	    name: "frame_title_frame",
      	    url: 'widget://html/jm_title_frame.html',
      	    pageParam: {
                pagetype:"cate",
      	        pagedata: curr_cate_data
      	    }
    });
}

function openwin(winname,titie,dataid,data2,islogin){
  if(islogin){
    if(!usermgr.checkLogin())
        return;
  }

	api.openWin({
	    name: winname,
	    url: 'widget://html/'+ winname +'.html',
      showProgress:true,
      pageParam: {
	        data: dataid,
          data2: data2,
          tname:titie
	    }
	});
}





//浏览窗口链接
//URL地址参数
function openBrowser(url,title,auth) {
  //打开网页必须先授权登陆
  if(auth == true){
      var alibaichuan = api.require('alibaichuan');
      alibaichuan.showLogin(function(ret,err) {
      });
  }
  var farme_url = 'widget://html/frame_brower.html';
  api.openWin({
      name: "brand_frame_url",
      url: farme_url,
      vScrollBarEnabled:false,
      hScrollBarEnabled:false,
      progress:{
            title:"",           //type为default时显示的加载框标题
            text:"",            //type为default时显示的加载框内容
            color:"#eee"            //type为page时进度条的颜色，默认值为#45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
        },
       pageParam: {
           tname: title,
           url:url
      }
  });
}
function openBrowserTB(url) {
  var param = {
      url : url,
      nativeview:true
  };
  var alibaichuan = api.require('alibaichuan');
  alibaichuan.showDetailByURL(param, function(ret, err) {
  });
}



//打开窗口连接
function openFram(param){
  api.openWin({
      name: param.name,
      url: param.url,
      reload:param.reload==true?true:false,
      animation: {
          type: "push", //动画类型（详见动画类型常量）
          subType: "from_right", //动画子类型（详见动画子类型常量）
          duration: 300 //动画过渡时间，默认300毫秒
      },
      pageParam:param.pageParam
  });
}

//缓存图片方法
function cache(imgs,index)
{
  var el = imgs[index];
  var imgUrl = $api.attr(el, "data-url");
  api.imageCache({
    url: imgUrl,
    thumbnail:false
  }, function(ret, err) {
      var src = ret.url;
      $api.attr(el,"src",src);
      $api.attr(el,"data-cache","yes");
      var nextIndex = ++index;
      if(nextIndex < imgs.length) {
          cache(imgs, nextIndex);
      };
  });
}

function imageCache(el)
{
    var imgs = $api.domAll(el,"img[data-url][data-cache=no]");
    if(imgs.length > 0) {
        cache(imgs, 0);
    };
}

function hide_div(el){
  if(!usermgr.get_login() || istest()){
      var itemz_s = $api.domAll(el,".good_item_zhuan");
      for (var i = 0; i < itemz_s.length; i++) {
          var elinfo = itemz_s[i];
          $api.css(elinfo,"display:none");
      }
      var rows_s = $api.domAll(el,".good_row_item");
      for (var i = 0; i < rows_s.length; i++) {
          var elinfo = rows_s[i];
          $api.toggleCls(elinfo, 'good_row_item2');
      }
  }
}
function hide_div2(el){
  if(!usermgr.get_login() || istest()){
      var itemz_s = $api.domAll(el,".span-cc-bg");
      for (var i = 0; i < itemz_s.length; i++) {
          var elinfo = itemz_s[i];
          $api.css(elinfo,"display:none");
      }
  }
}

//img_el:图片列表的 选择器
function imageCache2(img_el)
{
    var srcs = img_el;
    if (srcs.length > 0) {
        for (var i = 0; i < srcs.length; i++) {
            (function(obj){
                api.imageCache({
                    url: $api.attr(obj, 'data-url')
                }, function(ret, err){
                    if( ret ){
                         $api.attr(obj, 'src', ret.url);
                    }
                });
            })(srcs[i]);
        }
    }
}

//加载系统配置数据
function loadSystemData(callback)
{
  var systemType = api.systemType;
  $cid = 100;
  if(systemType == 'ios')
    $cid = 101

  //安卓测试渠道 103

  var parms = {
      url:"syscfg/getsys/cid/"+$cid,
      callback:function(ret){
          if(ret.flag )
          {
             var datainfo = ret.data;
             //保存到内存中
             api.setGlobalData({
              key: 'sysinfo',
              value: datainfo
             });
             callback(datainfo);
          }else {
             callback(false);
          }
      }
  }
  parms.timeout =10;
  JM_GET(parms);
}
//获得系统配置参数
function getSysInfo(){
    return api.getGlobalData({key: 'sysinfo'});
}
function html2Escape(sHtml) {
 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}

function escape2Html(str) {
 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

//加载所有分类数据
function loadCateList(callback)
{
  var parms = {
      url:"category/getallcatelist",
      callback:function(ret){
          if(ret.flag )
          {
             var dataModel = ret.data;
             //初始化分类数据
             var dic_list = new Array();
             for (var i = 0; i < dataModel.length; i++) {
                  var pid = dataModel[i].pid;
                  if(!dic_list[pid]){
                      dic_list[pid] = new Array();
                  }
                  dic_list[pid][dic_list[pid].length] = dataModel[i];

                  api.setGlobalData({
                   key: 'rootCateInfo'+dataModel[i].id,
                   value: $api.jsonToStr(dataModel[i])
                  });
             }

            //加入内存中
            for (var i = 0; i < dic_list.length; i++) {
                api.setGlobalData({
                 key: 'rootCateList'+i,
                 value: $api.jsonToStr(dic_list[i])
                });
            }

             callback(dic_list);
          }
      }
  }
  JM_GET(parms);
}

//通用点击事件
//linktype: 1:物品ID 2-网络地址 3-内部窗体
//title:标题
//dataid: 如果是内部窗体  带上 dataid
//linkurl: 目标地址
function CommoneClick(linktype,title,dataid,linkurl){
  if(linktype == 1){
       open_good_detais_itemid(linkurl)
  }
  else if(linktype == 2){
      openBrowser(linkurl,title);
  }
  else if(linktype == 3){
      openwin(linkurl,title,dataid)
  }
}


//通过分类ID，获取数据； 0获取所有根分类
function getCateData(id,isali)
{
    return api.getGlobalData({key: 'rootCateList'+id});
}

function toast(msgstr)
{
   api.toast({msg: msgstr,duration: 2500,location: 'bottom'});
}

function toast2(msgstr)
{
   api.toast({msg: msgstr,duration: 2500,location: 'middle'});
}

function authoTaobao(code,itemstr){
  //消息事件；授权提示
  api.openFrame({
      name: 'frame_event_author',
      url: 'widget://html/dialog/frame_shouq.html',
      bgColor:'rgba(0,0,0,0.5)',
      rect: {
          x: 0,
          y: 0,
          w: api.winWidth,
          h: api.winHeight
      },
      pageParam: {
         code: code,
         itemstr:itemstr,
      },
      animation:{
          type:"movein",
          subType:"from_top",
          duration:100
      },
      bounces:false
  });
}

function CopyData(str,cllack){
    var clipBoard = api.require('clipBoard');
    clipBoard.set({
        value: str
    }, function(ret, err) {
        if (ret) {

            toast2("已复制成功!");
            api.setPrefs({
              key: 'copyvalue',
              value: str
            });

            cllack();
        } else {
            alert(JSON.stringify(err));
        }
    });
}
//是否是测试版本
function istest(){
  var ret =  api.getGlobalData({key: 'istest'});
  if(ret == 1)
    return true;
  else {
    return false;
  }
}

//是否有该权限
function isPermission(Permission,PermissionName){
  var resultList = api.hasPermission({
    list:Permission
  });

  if(!resultList || !resultList[0] || !resultList[0].granted){
      //弹出窗体
      api.openFrame({
          name: 'frame_permission',
          url: 'widget://html/dialog/frame_permission.html',
          bgColor:'rgba(0,0,0,0.5)',
          rect: {
              x: 0,
              y: 0,
              w: api.winWidth,
              h: api.winHeight
          },
          pageParam: {
             str: PermissionName
          },

          bounces:false
      });

  }
  return resultList[0].granted
}
