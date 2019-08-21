var Taobao= {


    //初始化淘宝接口
    initTaobao:function(mmid,appkey,zoneId){
        var alibaichuan = api.require('alibaichuan');
        var param = {

        };
        alibaichuan.initTaeSDK(param,function(ret, err) {
            if (ret) {
                console.log("初始化淘宝SDK成功:"+JSON.stringify(ret));
            } else {
                console.log("初始化淘宝SDK失败:"+JSON.stringify(err));
            }
        });


    },

    //登录淘宝进行授权
    LoginTaobao:function(callback){
      var alibaichuan = api.require('alibaichuan');
      alibaichuan.showLogin(function(ret,err) {
          if (ret) {
              console.log("淘宝授权成功:"+JSON.stringify(ret));
              callback(true,ret);
          } else {
              console.log("淘宝授权失败:"+JSON.stringify(err));
              callback(false,err.message);
          }
          console.log("aaaa:"+JSON.stringify(ret));
      });


    },

    LoginOut:function(){
      var alibaichuan = api.require('alibaichuan');
      alibaichuan.logout(function(ret, err) {
            if (ret) {
                toast("退出成功");
            } else {
                toast("退出失败:"+JSON.stringify(err));
            }
        });

    },

    //请求渠道or会员 备案信息
    //isrid:1=渠道 2-会员
    AuthorAlimamRid:function(isrid)
    {

      //淘宝授权 获取 code
      Taobao.LoginTaobao(function(ret,data){
          if(ret)
          {
              var openid = data.openId;
              usermgr.set_topopenid(openid);
              //拼接URL；
              var sysinfo = getSysInfo();
              var toplmkey = sysinfo.lmkey;
              $url = 'https://oauth.taobao.com/authorize?response_type=code&client_id='+toplmkey+'&redirect_uri='+app.urls.author+'&view=wap&isrid='+isrid;
              //授权成功，拿到code
              openBrowser($url,'淘宝授权',true);
          }
          else {
              toast2(data);
          }
        });
    },




    //请求AccessToken 换取秘钥
    gettoekn:function(code,usertoken,isrid){
      var parms = {
          url:"taobaoapi/getaccesstoken/code/"+code+"/token/"+usertoken+"/isrid/"+isrid,
          callback:function(ret){
              if(ret.flag)
              {
                  //验证成功；保存渠道 or 会员信息
                  if(isrid == 1){
                      usermgr.set_rid(ret.data.id);
                  }else{
                      usermgr.set_sid(ret.data.id);
                  }
                  api.sendEvent({name: 'close_frame_author',extra: { }});
                  console.log("授权成功 类型:"+isrid + " 编号:"+ret.data.id);
              }
              else {
                  var msg = ret.msg.sub_msg;
                  if(!msg){
                      msg = ret.msg.msg;
                  }
                  api.sendEvent({name: 'close_frame_author',extra: { }});
                  //api.toast({msg: msg,duration: 4000,location: 'middle'});
                  api.alert({
                      title: '淘宝授权失败',
                      msg: msg,
                  }, function(ret, err) {
                  });
                  //authoTaobao(-1,msg);

              }
          }
      }
      JM_GET(parms);
    }




}
