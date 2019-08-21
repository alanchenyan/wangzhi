var jmdialog = {

    //打开淘宝授权 提示框
    open_tbauthor_dialog2: function(callback) {
        var dialogBox = api.require('dialogBox');
        dialogBox.alert({
            texts: {
                title: '请完成淘宝授权',
                content: '淘宝官方要求授权后购买或者分享物品才能获得收益佣金',
                leftBtnTitle: '稍后在说',
                rightBtnTitle: '淘宝授权'
            },
            styles: {
                bg: '#fff',
                maskBg: 'rgba(0,0,0,0.5)',
                w: 250,
                corner: 15,
                title: {
                    marginT: 20,
                    icon: 'widget://image/sq.png',
                    iconSize: 30,
                    titleSize: 16,
                    titleColor: '#636363'
                },
                content: {
                    color: '#999999',
                    size: 14
                },
                left: {
                    marginB: 0,
                    marginL: 0,
                    w: 125,
                    h: 40,
                    corner: 0,
                    bg: '#eee',
                    color: '#696969',
                    size: 14
                },
                right: {
                    marginB: 0,
                    marginL: 0,
                    w: 125,
                    h: 40,
                    corner: 2,
                    bg: '#ea344f',
                    color: '#fff',
                    size: 12
                }
            }
        },
        function(ret) {
            if (ret.eventType == 'left') {
                dialogBox.close({
                    dialogName: 'alert'
                });
            } else {
                //点击去认证；
                callback();
                dialogBox.close({
                    dialogName: 'alert'
                });
            }
        });
    },

    //授权提示
    open_tbauthor_dialog3: function(title, txtvalue, callback) {
        var dialogBox = api.require('dialogBox');
        dialogBox.alert({
            texts: {
                title: title,
                content: txtvalue,
                leftBtnTitle: '稍后在说',
                rightBtnTitle: '重新授权'
            },
            styles: {
                bg: '#fff',
                maskBg: 'rgba(0,0,0,0.5)',
                w: 250,
                corner: 15,
                title: {
                    marginT: 20,
                    icon: 'widget://image/sq.png',
                    iconSize: 30,
                    titleSize: 16,
                    titleColor: '#636363'
                },
                content: {
                    color: '#999999',
                    size: 14
                },
                left: {
                    marginB: 0,
                    marginL: 0,
                    w: 125,
                    h: 40,
                    corner: 0,
                    bg: '#eee',
                    color: '#696969',
                    size: 14
                },
                right: {
                    marginB: 0,
                    marginL: 0,
                    w: 125,
                    h: 40,
                    corner: 2,
                    bg: '#ea344f',
                    color: '#fff',
                    size: 12
                }
            }
        },
        function(ret) {
            if (ret.eventType == 'left') {
                dialogBox.close({
                    dialogName: 'alert'
                });
            } else {
                //点击去认证；
                callback();
                dialogBox.close({
                    dialogName: 'alert'
                });
            }
        });
    },

    //打开分享提示框
    open_share_dialog: function(callback) {
        var dialogBox = api.require('dialogBox');
        dialogBox.actionMenu({
            rect: {
                h: 150
            },
            texts: {
                cancel: '取消'
            },
            items: [{
                text: '微信好友',
                icon: 'widget://image/share/share_wechat_icon.png'
            },
            {
                text: '朋友圈',
                icon: 'widget://image/share/share_friend_icon.png'
            },
            {
                text: 'QQ好友',
                icon: 'widget://image/share/share_qq_icon.png'
            },
            {
                text: 'QQ空间',
                icon: 'widget://image/share/share_qzone_icon.png'
            },{
                text: '更多分享',
                icon: 'widget://image/share/s_more.png'
            }],
            styles: {
                bg: '#FFF',
                column: 5,
                itemText: {
                    color: '#000',
                    size: 12,
                    marginT: 8
                },
                itemIcon: {
                    size: 50
                },
                cancel: {
                    bg: '#eee',
                    color: '#000',
                    h: 50,
                    size: 15
                }
            },
            tapClose:true,
        },
        function(ret) {
            if(ret.eventType == 'cancel'){
              dialogBox.close({
                  dialogName: 'actionMenu'
              });
            }else {
                callback(ret.index)
            }


        });

    },

    opentaobao:function(){
      var dialogBox = api.require('dialogBox');
      dialogBox.discount({
          rect: {
              w: 200,
              h: 300
          },
          styles: {
              bg: '#FFF',
              image: {
                  path: 'widget://image/opentao.gif',
                  marginB: 30
              },
              cancel: {
                  icon: 'widget://image/ccx.png',
                  w: 50,
                  h: 50
              }
          }
        }, function(ret) {
          alert(JSON.stringify(ret));
          if (ret.eventType == 'cancel') {
              dialogBox.close({
                  dialogName: 'discount'
              });
          }
        });
    }
}
