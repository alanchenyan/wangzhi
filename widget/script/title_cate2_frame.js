var pageMol={
    catelist:[],
    navigationBarHeight:40,  //顶部导航条  高度
    currPageIndex:0,
    framelist:[],
    navigationid:0,
    currPageid:0,

    initlize:function() {
        pageMol.NVNavigationBar = api.require('NVNavigationBar');
    },

    //绑定顶部分类条
    BindCateList:function(){
        pageMol.catelist =new Array();
        //获得大分类数据
        var root_list_data = getCateData(0);
        if(!root_list_data)
        {
            toast("分类数据错误");
            return;
        }
        var cate_list_data = $api.strToJson(root_list_data);
        pageMol.catelist[0] = {title: '全部' ,bg: '#fff'};
        for (var i = 0; i < cate_list_data.length; i++) {
            pageMol.catelist[i+1] = {title: cate_list_data[i].name ,bg: '#fff'};

            //$(".chc-box ul").append('<li><span><i style="background-image: url('+cate_list_data[i].app_icon+');"></i><span>'+cate_list_data[i].name+'</span></span></li>');
        }


        //创建顶部导航条 字体样式
        var fontData = {size: '14',sizeSelected: '16',color: '#696969',colorSelected:'#A0522D',alpha:1};
        var headerH = $api.dom('#header').offsetHeight;
        //初始化 frame
        for (var i = 0; i < pageMol.catelist.length; i++) {
           var htmlurl = './frame_item_list.html';
           var cid = 0;
           if(i==0)
              cid = 0;
          else {
              if(pageMol.currPageid == 2){
                 //品牌 传自己
                   cid = cate_list_data[i-1].id;
              }else {
                  cid = cate_list_data[i-1].hdk_cid;
              }

          }

           pageMol.framelist[i] = {name: 'frame_cate2list_'+i,
                                      url: htmlurl ,
                                      bgColor : 'rgba(0,0,0,.2)',
                                      bounces:false,
                                      scrollEnabled:true,
                                      vScrollBarEnabled:true,
                                      overScrollMode:'always',
                                      pageParam:{cateid:cid,frametype:pageMol.currPageid} //0-9.9
                                      };
        }
        pageMol.NVNavigationBar.open({
    //       rect: {
    //         x:0,
    //           y: headerH,
    //           w: api.winWidth,
    //           h: pageMol.navigationBarHeight,
    //         },
     //
    //           items:pageMol.catelist,
    //           styles: {
    //        orientation: 'horizontal',
    //        bg: '#6b6b6b',
    //        bgAlpha: 1,
    //        font:fontData,
    //        itemSize: {
    //            w: 90,
    //            h: 44
    //        }
    //  },
    //           selectedLine: {
    //                           color :'#A0522D', // 字符串；下划线的颜色
    //                           width : 3,     // 数字；下划线的宽度
    //                           marginLR :8,  // 数字；相对于整个item左右边距
    //                       },
    //           selectedIndex: 0,

        rect: {
             x: 0,
             y: headerH,
             w: api.frameWidth,
             h: pageMol.navigationBarHeight,
        },
       styles: {
             orientation: 'horizontal',
             bg: '#6b6b6b',
             bgAlpha: 1,
             font: fontData,
             itemSize: {
                 w: 60,
                 h: 54
             }
       },
        items: pageMol.catelist,
           selectedIndex:0,
           fixedOn: api.frameName,
           id: 'first'


        },
        function(ret, err) {
              switch (ret.eventType) {
                  case 'show':
                      pageMol.navigationid = ret.id;
                      break;
                  case 'click':
                      api.setFrameGroupIndex({
                          name: "home_cate2_frame",
                          index: ret.index,
                          scroll: true
                      });
                      break;
                }
        });

    },


    //窗体打开
    fnOpenFrameGroup:function(index, isOpen) {
        var win_height = $api.dom('#header').offsetHeight;
        if (isOpen) {
            pageMol.currPageIndex = index;
            api.openFrameGroup({
                name: "home_cate2_frame",
                scrollEnabled: true,
                rect: {
                    x: 0,
                    y: win_height+pageMol.navigationBarHeight,
                    w: api.winWidth ,
                    h:'auto'
                },
                index: 0,
                preload:0,
                frames:pageMol.framelist
            }, function(ret, err) {
                  if (pageMol.currPageIndex < 2) {
                    pageMol.NVNavigationBar.setSelected({
  id: pageMol.navigationid,
  index: ret.index,
  selected: true
}, function(ret) {
  // alert(JSON.stringify(ret));
});
                  } else {
                      //changeStyle(ret.index);

                  }



            });
        }
        else{
          //隐藏

        }

    }

}
