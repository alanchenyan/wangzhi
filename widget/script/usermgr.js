
/*
  用户管理脚本
*/
var usermgr={
    useritem:null,  //用户对象
    toekn:0,     //用户登录唯一凭证

    //初始化用户信息
    //Token 去初始化用户消息
    initlize:function(){

    },


    inituser:function(user,token){
        usermgr.set_userid(user.userid);
        usermgr.set_phone(user.phone);
        usermgr.set_openid(user.openid);
        usermgr.set_headimg(user.avatarurl);
        usermgr.set_score(user.uscore);
        usermgr.set_username(user.nickname);
        //设置渠道和会员id
        usermgr.set_rid(user.relationid);
        usermgr.set_sid(user.specialid);
        usermgr.set_usertoken(token);
        usermgr.set_userinfo(user);
        usermgr.set_umoney(user.umoney);
        usermgr.set_login();
    },

    //用户登录成功
    loginsucces:function(user,token){
         if(token == '' || !user){
              toast('token验证失败');
              return;
         }
        usermgr.inituser(user,token);
        var clipBoard = api.require('clipBoard');
        clipBoard.set({
            value: ''
        }, function(ret, err) {});
         //跳转页面
         //api.closeWin();
         api.sendEvent({name: 'loginsucess',extra: {  username: user.nickname}});

         console.log("用户:"+user.userid+" 登录成功 token:"+token);

         


    },
    //用户是否已登录
    set_login:function(){
      api.setGlobalData({key: 'islogin',  value: 1});
    },
    set_loginout:function(){
      api.setGlobalData({key: 'islogin',  value: 0});
      usermgr.get_userid(0);
      usermgr.get_username('');
      usermgr.set_rid(0);
      usermgr.set_sid(0);
      usermgr.set_headimg('');
      usermgr.set_score(0);
      usermgr.set_topopenid(0);
      usermgr.set_usertoken('');
      usermgr.set_phone(0);
      usermgr.set_openid(0);
      usermgr.set_umoney(0);

    },
    get_login:function(){
      return api.getGlobalData({key: 'islogin'});
    },
    //检查登录
    checkLogin:function(){

      if(!usermgr.get_login() && !istest()){
        param = {};
        param.url = "widget://html/user/loginframe.html";
        param.name = "loginframe";
        openFram(param);
        return false;
      }
      else if(!usermgr.get_login() && istest()){
        param = {};
        param.url = "widget://html/user/login_passs.html";
        param.name = "login_passs";
        openFram(param);
        return false;
      }

      return true;
    },

    //设置用户ID --内存
    set_userid:function(userid){
      api.setGlobalData({key: 'userid',  value: userid});
    },
    //获取用户ID
    get_userid:function(){
        return api.getGlobalData({key: 'userid'});
    },

    //用户名称
    set_username:function(nickname){
      api.setGlobalData({key: 'nickname',  value: nickname});
    },
    //获取用户ID
    get_username:function(){
        return api.getGlobalData({key: 'nickname'});
    },

    //设置用户余额
    set_umoney:function(umoney){
      umoney=umoney+"";
      api.setGlobalData({key: 'umoney',  value: umoney});
      api.sendEvent({name: 'base_userdata_event'});
    },
    get_umoney:function(){
        var value= api.getGlobalData({key: 'umoney'});
        return parseFloat(value)
    },

    //渠道ID
    set_rid:function(val){
      api.setGlobalData({key: 'rid',  value: val});
    },
    get_rid:function(){
      return api.getGlobalData({key: 'rid'});
    },

    //会员ID
    set_sid:function(val){
        api.setGlobalData({key: 'sid',  value: val});
    },
    get_sid:function(){
        return api.getGlobalData({key: 'sid'});
    },

    //头像
    set_headimg:function(val){
      api.setGlobalData({key: 'headimg',  value: val});
    },
    get_headimg:function(){
        return api.getGlobalData({key: 'headimg'});
    },
    //积分
    set_score:function(val){
      api.setGlobalData({key: 'score',  value: val});
      api.sendEvent({name: 'base_userdata_event'});
    },
    get_score:function(){
        return api.getGlobalData({key: 'score'});
    },

    //设置手机号码
    set_phone:function(phone){
      api.setGlobalData({key: 'phone',  value: phone});
    },
    get_phone:function(phone){
      return api.getGlobalData({key: 'phone'});
    },


    //设置邀请码的上级userid
    set_agentid:function(userid){
      api.setGlobalData({key: 'agentid',  value: userid});
    },
    get_agentid:function(){
        return api.getGlobalData({key: 'agentid'});
    },
    //微信的openid
    set_openid:function(openid){
      api.setGlobalData({key: 'openid',  value: openid});
    },
    get_openid:function(){
        return api.getGlobalData({key: 'openid'});
    },

    //用户数据对象
    set_userinfo:function(userinfo){
      api.setGlobalData({key: 'userinfo',  value: userinfo});
    },
    get_userinfo:function(){
        return api.getGlobalData({key: 'userinfo'});
    },
    //淘宝相关字段数据

    //淘宝的openid
    set_topopenid:function(openid){
      api.setGlobalData({key: 'topopenid',  value: openid});
    },
    get_topopenid:function(){
        return api.getGlobalData({key: 'topopenid'});
    },

    //淘宝名称
    set_topnick:function(nickname){
      api.setGlobalData({key: 'topnickname',  value: nickname});
    },
    get_topnick:function(){
        return api.getGlobalData({key: 'topnickname'});
    },


    //用户是否走注册；流程
    //reg:0 or 1
    set_isreg:function(reg){
      api.setGlobalData({key: 'isreg',  value: reg});
    },
    get_isreg:function(){
        return api.getGlobalData({key: 'isreg'});
    },

    //设置用户token
    set_usertoken:function(toekn){
      api.setPrefs({
          key: 'usertoken',
          value: toekn
          });
     },

    //获取用户token
    get_usertoken:function(){
      //同步返回结果：
      var tk = api.getPrefs({
          sync: true,
          key: 'usertoken'
      });
      return tk;
    },


    //验证token
    //是否登录验证 true: 其他false
    authoruser:function(flag)
    {
        var parms = {
        url:"user/index/token/"+usermgr.get_usertoken(),
        isflag:flag,
        callback:function(ret){
            if(ret.flag)
            {
                //验证成功
                usermgr.inituser(ret.data,usermgr.get_usertoken());
            }
            else {
              //  pageMol.complate();
                usermgr.set_loginout();
            }
        }
      }
      JM_GET(parms);

    }



}
