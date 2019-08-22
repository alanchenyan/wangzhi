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
      pageMol.catelist[0] = {title: "好券商品" ,bg: '#fff',cid:1};
      // pageMol.catelist[1] = {title: "京粉推荐" ,bg: '#fff',cid:2};
      pageMol.catelist[1] = {title: "京仓配送" ,bg: '#fff',cid:15};
      pageMol.catelist[2] = {title: "特惠商品" ,bg: '#fff',cid:3};
      pageMol.catelist[3] = {title: "家电精选" ,bg: '#fff',cid:5};
      pageMol.catelist[4] = {title: "运动服饰" ,bg: '#fff',cid:4};
      pageMol.catelist[5] = {title: "超市好货" ,bg: '#fff',cid:6};
      pageMol.catelist[6] = {title: "居家生活" ,bg: '#fff',cid:7};
      pageMol.catelist[7] = {title: "9.9专区" ,bg: '#fff',cid:10};
      pageMol.catelist[8] = {title: "品牌好货" ,bg: '#fff',cid:11};
      pageMol.catelist[9] = {title: "潮流范儿" ,bg: '#fff',cid:12};
      pageMol.catelist[10] = {title: "品牌好货" ,bg: '#fff',cid:12};
      pageMol.catelist[11] = {title: "数码先锋" ,bg: '#fff',cid:13};

      //初始化 frame
      for (var i = 0; i < pageMol.catelist.length; i++) {
         var htmlurl = 'widget://html/frame_item_list.html';
         var cid = pageMol.catelist[i].cid;
         pageMol.framelist[i] = {name: 'frame_jdc_list_'+i,
                                    url: htmlurl,
                                    bgColor : 'rgba(0,0,0,.2)',
                                    bounces:false,
                                    scrollEnabled:true,
                                    vScrollBarEnabled:true,
                                    overScrollMode:'always',
                                    pageParam:{cateid:cid,frametype:pageMol.currPageid}
                                    };
      }
     //初始化顶部导航控件
     var headerH = $api.dom('#header').offsetHeight;
     var fontData = {size: '14',sizeSelected: '16',color: '#696969',colorSelected:'#A0522D'};
     pageMol.NVNavigationBar.open({
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
                w: 80,
                h: 44
            }
      },
       items: pageMol.catelist,
          selectedIndex:0,
          fixedOn: api.frameName,
          id: 'second'


       },
     function(ret, err) {
           switch (ret.eventType) {
               case 'show':
                   pageMol.navigationid = ret.id;
                   break;
               case 'click':
                   api.setFrameGroupIndex({
                       name: "home_jd_frame",
                       index: ret.index,
                       scroll: true
                   });
                   break;
             }
     });

     //打开默认页面
     pageMol.fnOpenFrameGroup(0,true);


    },


    //窗体打开
    fnOpenFrameGroup:function(index, isOpen) {
        var win_height = $api.dom('#header').offsetHeight;
        if (isOpen) {
            pageMol.currPageIndex = index;
            api.openFrameGroup({
                name: "home_jd_frame",
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
