var pageMol = {
    navbarlist: [],
    currPageIndex: 0,
    framelist: [],
    framelist3: [],
    framegroupname: [],
    footheight:54,
    isflag:true,
    //初始化数据
    initlize: function() {
        var header = $api.byId('head');
        headers = $api.domAll(header, '.head');
        for (var i = 0; i < headers.length; i++) {
            $api.fixIos7Bar(headers[i]);
        }
        var offset = $api.offset(header);


        pageMol.navigationBar = api.require('navigationBar');

        //初始化页面 作为预加载
        pageMol.framelist[0] = new Array(); //底部导航页面
        pageMol.framelist[1] = new Array(); //底部导航页面
        //底部菜单初始化
        for (var i = 0; i < 5; i++) {
           if(i == 3){
             pageMol.framelist[0][i] = {
                 name: 'frame_goodshare',
                 url: 'widget://html/faquan/goodshare.html',
                 bgColor: 'rgba(0,0,0,.2)',
                 bounces: false,
                 scrollEnabled: true,
                 vScrollBarEnabled: false,
                 overScrollMode: 'always'
             };
           }else {
             pageMol.framelist[0][i] = {
                 name: 'frame' + i,
                 url: 'widget://html/frame' + i + '.html',
                 bgColor: 'rgba(0,0,0,.2)',
                 bounces: false,
                 scrollEnabled: true,
                 vScrollBarEnabled: false,
                 overScrollMode: 'always'
             };
           }

        }
        //社区发圈窗体 重新设置
        //初始化导航索引3的窗体集合--社区
        pageMol.framelist3 =Array();
        pageMol.framelist3[0] = {
            name: 'frame_faquan_tj',
            url: './faquan/goodshare.html',
            bgColor: 'rgba(0,0,0,.2)',
            bounces: false,
            scrollEnabled: true,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            overScrollMode: 'always'
        };
        //宣传素材
        pageMol.framelist3[1] = {
            name: 'frame_faquan_sc',
            url: './faquan/frame_sucai.html',
            bgColor: 'rgba(0,0,0,.2)',
            bounces: false,
            scrollEnabled: true,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            overScrollMode: 'always'
        };
        //粉喵学院
        pageMol.framelist3[2] = {
            name: 'frame_faquan_xy',
            url: './faquan/frame_xy.html',
            bgColor: 'rgba(0,0,0,.2)',
            bounces: false,
            scrollEnabled: true,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            overScrollMode: 'always'
        };

    },

    BindCateList: function() {
        //初始化顶部导航条
        //顶部菜单导航
        pageMol.navbarlist = new Array();
        pageMol.navbarlist[0] = new Array();


        //获得大分类数据
        var root_list_data = getCateData(0);
        if (!root_list_data) {
            toast("分类数据错误");
            return;
        }
        var cate_list_data = $api.strToJson(root_list_data);
        for (var i = 0; i < cate_list_data.length; i++) {
            pageMol.navbarlist[0][i] = cate_list_data[i].name
        }

        //显示顶部分类导航
        var carehtml ='<span id="cateel" class="on" onclick="SelCate(0)">精选</span> <span id="cateel" onclick="SelCate(1)">猜你喜欢</span>';
        for (var i = 0; i < pageMol.navbarlist[0].length; i++) {
            carehtml += ' <span id="cateel" onclick="SelCate('+(i+2)+')" >'+pageMol.navbarlist[0][i]+'</span>';
        }
        $api.html($api.dom(".jd_nav"),carehtml);


        pageMol.framegroupname[0] = "frame_home_index";
        pageMol.framegroupname[3] = "frame_faquan_index";
        //famre的列表
        //精选
        pageMol.framelist[1][0] = {
            name: 'frame0',
            url: './frame0.html',
            bgColor: 'rgba(0,0,0,.2)',
            bounces: false,
            scrollEnabled: true,
            vScrollBarEnabled: true,
            overScrollMode: 'always'
        };
        //猜你喜欢
        pageMol.framelist[1][1] = {
            name: 'frame_love',
            url: './frame_item_list.html',
            bgColor: 'rgba(0,0,0,.2)',
            bounces: false,
            scrollEnabled: true,
            vScrollBarEnabled: true,
            overScrollMode: 'always',
            pageParam: {
                cateid: cid,
                frametype: -1
            }
        }; //frametype: = -1 猜你喜欢数据
        //分类列表
        for (var i = 0; i < cate_list_data.length; i++) {
            var htmlurl = './frame_item_list_cate.html';
            var cid = cate_list_data[i].id;
            var cidimg = cate_list_data[i].app_ad_img;
            var cidimgurl = cate_list_data[i].app_ad_url;

            pageMol.framelist[1][i + 2] = {
                name: 'frame_cate_' + i,
                url: htmlurl,
                bgColor: 'rgba(0,0,0,.2)',
                bounces: false,
                scrollEnabled: true,
                vScrollBarEnabled: true,
                overScrollMode: 'always',
                pageParam: {
                    cateid: cid,
                    banner: cidimg,
                    bannerurl: cidimgurl
                }
            };
        }

    },

    fnNavigationBar: function(index, isOpen) {
        if(isOpen){
            api.openFrame({
              name: 'faquan_title',
              url: './faquan/frame_win.html',
              rect: {
                  x: 0,
                  y: 0,
                  w: 'auto',
                  h: 75
              },
            });
        }
        else {
          api.setFrameAttr({
              name: 'faquan_title',
              hidden: true
          });
        }

    },

    //切换发圈功能的窗体
    swperframe3:function(index){

      api.setFrameGroupIndex({
          name: pageMol.framegroupname[3],
          index: index
      });
    },

    //窗体打开
    fnOpenFrameGroup: function(index, isOpen) {

        var farme_list = pageMol.framelist[1];
        var win_height = $api.dom('#head').offsetHeight;
        if(index == 0 && pageMol.isflag ){
            win_height = win_height + $api.offset($api.dom(".jd_nav")).h;
            var systemType = api.systemType;
            if(systemType == 'ios'){
              win_height = win_height -26;
            }else{
                win_height = win_height -19;
            }
        }
        if(index == 0 && !pageMol.isflag ){
            win_height = win_height -1;
        }
        //alert($api.offset($api.dom(".jd_nav")).h);
        var f_y = win_height;
        if(index == 3){
            farme_list =  pageMol.framelist3;
            f_y =  70;
        }

        if (isOpen) {
            pageMol.currPageIndex = index;
            api.openFrameGroup({
                name: pageMol.framegroupname[index],
                scrollEnabled: true,
                rect: {
                    x: 0,
                    y: f_y,
                    w: api.winWidth,
                    h: 'auto',
                    marginBottom:pageMol.footheight,
                },
                index: 0,
                preload: 1,
                frames: farme_list
            },
            function(ret, err) {
                if(index == 3){
                    //发圈顶部导航
                    api.sendEvent({name: 'evt_faquan_tools_index',extra: ret.index});
                    return;
                }
                if(index == 0){
                    //首页顶部导航
                  //  api.sendEvent({name: 'faquanindex',extra: ret.index});
                   if(ret.index < 3)
                      $(".jd_nav").scrollLeft(ret.index*30);
                  else if(ret.index > 5 && ret.index < 8)
                      $(".jd_nav").scrollLeft(ret.index*40);
                  else if(ret.index > 8 && ret.index < 12)
                      $(".jd_nav").scrollLeft(ret.index*50);
                  else if(ret.index > 12  )
                      $(".jd_nav").scrollLeft(ret.index*60);

                   var ellist = $api.domAll('#cateel');
                   for (var i = 0; i < ellist.length; i++) {

                        if(i == ret.index)
                          $api.addCls(ellist[i], 'on');
                        else {
                          $api.removeCls(ellist[i], 'on');
                        }
                   }


                }

            });
        } else {
            //隐藏
              api.setFrameGroupAttr({
                    name: pageMol.framegroupname[index],
                    hidden: true
              });
        }

        //底部导航靠前
        var NVTabBar = api.require('NVTabBar');
        NVTabBar.bringToFront();

    },

    fnOpenFrame: function(index, isOpen) {
        var f_y = 0;
        var win_height = $api.dom('#head').offsetHeight ;
        var f_h = api.winHeight -54;
        if(index == 1){
          f_y = win_height- $api.offset($api.dom(".jd_nav")).h;
          f_h = f_h-54;
        }

        if (isOpen) {
            api.openFrame({
                name: pageMol.framelist[0][index].name,
                url: pageMol.framelist[0][index].url,
                bounces: false,
                rect: {
                    x: 0,
                    y: f_y,
                    w: 'auto',
                    h: f_h
                },
                vScrollBarEnabled: false
            });
        } else {
            api.setFrameAttr({
                name: pageMol.framelist[0][index].name,
                hidden: true
            });

        }

        //底部导航靠前
        var NVTabBar = api.require('NVTabBar');
        NVTabBar.bringToFront();
    },
    //窗体切换入口
    fnChange: function(index) {
        var win_height = $api.dom('head').offsetHeight;
        if (index == 4 && !usermgr.checkLogin()) {
            //打开我的界面 ；判断用户是否登录
            return;
        }
        if (index == 2 && !usermgr.checkLogin()) {
            //打开赚钱界面；必须用户登录才可以
            return;
        }
        for (var i = 0; i <= 4; i++) {
            if (index == i) {
                switch (i) {
                case 4:
                    pageMol.fnOpenFrame(i, true);
                    break;
                case 3:

                    if(!istest()){
                      pageMol.fnOpenFrameGroup(i, true); //社区界面特殊
                      pageMol.fnNavigationBar(i,true);
                    }else {
                      pageMol.fnOpenFrame(i, true);
                    }
                    break;
                case 2:
                    pageMol.fnOpenFrame(i, true);
                    break;
                case 1:
                    pageMol.fnOpenFrame(i, true);
                    break;
                case 0:
                    pageMol.fnOpenFrameGroup(i, true);
                    break;
                default:
                    break;
                }
            } else {
                //$api.removeCls(eHeaderLis[i], 'head_act');
                switch (i) {
                case 4:
                    pageMol.fnOpenFrame(i, false);
                    break;
                case 3:
                    if(!istest()){
                      pageMol.fnOpenFrameGroup(i, false); //社区界面特殊
                      pageMol.fnNavigationBar(i,false);
                    }else {
                      pageMol.fnOpenFrame(i, false);
                    }
                    break;

                case 2:
                    pageMol.fnOpenFrame(i, false);
                    break;
                case 1:
                    pageMol.fnOpenFrame(i, false);
                    break;
                case 0:
                    pageMol.fnOpenFrameGroup(i, false);
                    break;
                default:
                    break;
                }
            }
        }

    },

    //初始化底部导航
    NVTabBarInit: function() {
        var NVTabBar = api.require('NVTabBar');
         NVTabBar.open({
            styles: {
                bg: '#FFFFFF',
                h: pageMol.footheight,
                dividingLine: {     //（可选项）JSON对象；模块顶部的分割线配置
                   width: 0.5,      //（可选项）数字类型；分割线粗细；默认：0.5
                   color: '#D3D3D3'    //（可选项）字符串类型；分割线颜色；默认：#000
                },
                badge: {
                    bgColor: '#f00',
                    numColor: '#000',
                    size: 6.0,
                    centerY: 2
                }
            },
            items: [{
                w: api.winWidth / 5.0,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                    normal: 'widget://image/footer/f1.png',
                    highlight: 'widget://image/footer/f1_s.png',
                    selected: 'widget://image/footer/f1_s.png',
                },
                title: {
                    text: '首页',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 5.0,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                  normal: 'widget://image/footer/f2.png',
                  highlight: 'widget://image/footer/f2_s.png',
                  selected: 'widget://image/footer/f2_s.png',
                },
                title: {
                    text: '分类',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 5.0,
                bg: {
                    marginB: 9,
                    image: 'rgba(200,200,200,0)'
                },
                iconRect: {
                    w: 50,
                    h: 50,
                },
                icon: {
                  normal: 'widget://image/footer/f3.png',
                  highlight: 'widget://image/footer/f3.png',
                  selected: 'widget://image/footer/f3.png',
                },
                title: {
                    text: '赚钱',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 5.0,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                  normal: 'widget://image/footer/f4.png',
                  highlight: 'widget://image/footer/f4_s.png',
                  selected: 'widget://image/footer/f4_s.png',
                },
                title: {
                    text: '社区2',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 5.0,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                  normal: 'widget://image/footer/f5.png',
                  highlight: 'widget://image/footer/f5_s.png',
                  selected: 'widget://image/footer/f5_s.png',
                },
                title: {
                    text: '我的',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            }],
            selectedIndex: 0
        },
        function(ret, err) {
            if (ret) {
                if (ret.eventType == "click" && ret.index == 0) {
                    pageMol.fnChange(0)
                }
                else if (ret.eventType == "click" && ret.index == 1) {
                    pageMol.fnChange(1)
                }
                else if (ret.eventType == "click" && ret.index == 2) {
                    pageMol.fnChange(2)
                }
                else if (ret.eventType == "click" && ret.index == 3) {
                  pageMol.fnChange(3)
                }
                else if (ret.eventType == "click" && ret.index == 4) {
                  pageMol.fnChange(4)
                }


            }
        });
    },

    NVTabBarInit_ios: function() {
        var NVTabBar = api.require('NVTabBar');
         NVTabBar.open({
            styles: {
                bg: '#FFFFFF',
                h: pageMol.footheight,
                dividingLine: {     //（可选项）JSON对象；模块顶部的分割线配置
                   width: 0.5,      //（可选项）数字类型；分割线粗细；默认：0.5
                   color: '#D3D3D3'    //（可选项）字符串类型；分割线颜色；默认：#000
                },
                badge: {
                    bgColor: '#f00',
                    numColor: '#000',
                    size: 6.0,
                    centerY: 2
                }
            },
            items: [{
                w: api.winWidth / 5.0,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                    normal: 'widget://image/footer/f1.png',
                    highlight: 'widget://image/footer/f1_s.png',
                    selected: 'widget://image/footer/f1_s.png',
                },
                title: {
                    text: '首页',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 3.5,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                  normal: 'widget://image/footer/f2.png',
                  highlight: 'widget://image/footer/f2_s.png',
                  selected: 'widget://image/footer/f2_s.png',
                },
                title: {
                    text: '分类',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 3.5,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                  normal: 'widget://image/footer/f4.png',
                  highlight: 'widget://image/footer/f4_s.png',
                  selected: 'widget://image/footer/f4_s.png',
                },
                title: {
                    text: '社区3',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            },
            {
                w: api.winWidth / 4.0,
                iconRect: {
                    w: 25.0,
                    h: 25.0,
                },
                icon: {
                  normal: 'widget://image/footer/f5.png',
                  highlight: 'widget://image/footer/f5_s.png',
                  selected: 'widget://image/footer/f5_s.png',
                },
                title: {
                    text: '我的',
                    size: 12.0,
                    normal: '#696969',
                    selected: '#eb4f38',
                    marginB: 6.0
                }
            }],
            selectedIndex: 0
        },
        function(ret, err) {
            if (ret) {
                if (ret.eventType == "click" && ret.index == 0) {
                    pageMol.fnChange(0)
                }
                else if (ret.eventType == "click" && ret.index == 1) {
                    pageMol.fnChange(1)
                }
                else if (ret.eventType == "click" && ret.index == 2) {
                    pageMol.fnChange(3)
                }
                else if (ret.eventType == "click" && ret.index == 3) {
                  pageMol.fnChange(4)
                }

            }
        });
    },
    //启动APP 引导
    openNewApp:function(){
      api.openFrameGroup({
          name: 'group1',
          rect: {
              x: 0,
              y: 0,
              w: 'auto',
              h: 'auto'
          },
          frames: [{
              name: 'frame_new1',
              url: './frame_new_app.html',
              pageParam: {index:1}
          }, {
            name: 'frame_new2',
            url: './frame_new_app.html',
            pageParam: {index:2}
          }, {
            name: 'frame_new3',
            url: './frame_new_app.html',
            pageParam: {index:3}
          }]
      }, function(ret, err) {
          var index = ret.index;
      });
    },


    //下载分享图
    downShareImg:function(){
      //下载分享图片
      api.getPrefs({
          key: 'initer_imgpaths'
      }, function(ret, err) {
          var data = ret.value;
          if(!data || data ==''){
              var parms = {
                  url:"syscfg/shareims/token/"+usermgr.get_usertoken(),
                  callback:function(ret){
                      if(ret.flag)
                      {
                          var imgs = ret.data.imgs;
                          var codeimg = ret.data.erweima;
                          var count = 0;
                          CanvasImg.shareimags = imgs;
                          CanvasImg.sharecount = 0;
                          CanvasImg.sharesumcount = imgs.length;
                          CanvasImg.canvasShareImg(imgs[0],codeimg,usermgr.get_userinfo().yqcode,function(imagedata){
                            //api.hideProgress();
                            var htmlstr ='';
                             for (var i = 0; i < CanvasImg.shareimagsdata.length; i++) {
                                 var imgname = CanvasImg.shareimagsdata[i];
                                 var imgpaths = api.fsDir+"/"+imgname;
                                 htmlstr = htmlstr +'<div class="swiper-slide"> <img src="'+imgpaths+'"  /></div>';
                             }
                             var savedata = [];
                             savedata[0] = htmlstr;
                             savedata[1] = CanvasImg.shareimagsdata;
                               api.setPrefs({
                                   key: 'initer_imgpaths',
                                   value: $api.jsonToStr(savedata),
                               });

                          });
                      }
                    }
                }
                JM_GET(parms);
          }else {
            //存在数据
             console.log("分享图片已存在!");

          }

      });
    }

};
