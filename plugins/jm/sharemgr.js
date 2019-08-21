var sharemgr ={
    //分享功能的发封装

    /* 微信分享 */
    /* 分享图片内容 */
    /*
     * thumbpath:缩略图片的地址 支持 fs://、widget:// 协议。大小不能超过32K
     * imgpath: 分享图片的 url 地址 （支持 fs://、widget://），长度不能超过10M，[图片列表]
     * m_scene session（会话） timeline（朋友圈）favorite（收藏）
     */
    shareWxImage:function(imgcount,imgpath,m_scene){
      console.log("点击微信好友分享:"+imgpath +" 数量:"+imgcount);
      var wx = api.require('wx');
      if(imgcount >= 1 && m_scene =='session'){
         //多图分享；
         if(api.systemType == 'ios'){
             console.log("IOS多图分享开始");
            //苹果系统调用 系统分享 Android 平台不支持 widget://
            var sharedModule = api.require('shareAction');
            sharedModule.shareImage({
                images: imgpath
            });
            //关闭窗体
            var dialogBox = api.require('dialogBox');
            dialogBox.close({
                dialogName: 'actionMenu'
            });
         }
         else {
             //安卓调用多图分享
             wx.shareImage({
               scene: m_scene,
               thumb: "widget://image/thum.png",
               contentUrl: imgpath
             }, function(ret, err) {
               if (ret.status) {
                   console.log("分享一张图成功:"+imgpath);
               } else {
                   console.log("分享一张图失败:"+imgpath);
               }
             });
         }

      }
      else{
        console.log("微信一张图分享:"+imgpath);
          wx.shareImage({
            scene: m_scene,
            thumb: "widget://image/thum.png",
            contentUrl: imgpath
          }, function(ret, err) {
            if (ret.status) {
                console.log("分享一张图成功:"+imgpath);
            } else {
                console.log("分享一张图失败:"+imgpath);
            }
          });
      }


    },

    //分享网页
    //title: 网页的标题
    //description: 描述
    //thumb:缩略图
    //pageurl: 网页地址
    //m_scene session（会话） timeline（朋友圈）favorite（收藏）
    shareWxPage:function(title,description,thumb,pageurl,m_scene){
      var wx = api.require('wx');
      wx.shareWebpage({
        scene: m_scene,
        title: title,
        description: description,
        thumb: thumb,
        contentUrl: pageurl
      }, function(ret, err) {
        if (ret.status) {
            alert('分享成功');
        } else {
            console.log("分享失败:"+ret.code);
        }
      });
    },


    //分享单张本地图片到 QQ 空间或 QQ 好友、讨论组、群聊
    //QZone：分享到 QQ 空间
    //QFriend：分享给好友、讨论组、群聊
    shareQQimg:function(imgcount,imgpath,m_scene){
        var qq = api.require('QQPlus');
        console.log("QQ分享:"+m_scene + " 图片:"+imgpath);
        qq.shareImage({
            type : m_scene,
            imgPath: imgpath
        },function(ret,err){
            if (ret.status){
                toast2("分享成功");
            } else {
                toast("分享失败:"+JSON.stringify(err))
            }
        });
    }

}
