var pageMol={
    dvv:null,     //vue数据渲染
    loadcomplate: false, //数据是否加载完成
    pagesize:1,    //当前加载的页面
    dataitem:[],   //数据列表


    initlize:function() {
          dataitem = Array();
          pagesize = 1;
          var elloading = $api.dom(".list-item-loading");
          $api.addCls(elloading, 'l_show');

          pageMol.loadcomplate = false;
          api.setRefreshHeaderInfo({
              visible: true,
              loadingImg: 'widget://image/refresh.png',
              bgColor: '#fff',
              textColor: '#ccc',
              textDown: '下拉刷新...',
              textUp: '松开试试...',
              showTime: true
          }, function(ret, err) {
              pageMol.pagesize = 1;
              pageMol.dataitem = [];
              pageMol.loadcomplate = false;
              pageMol.bindData();
          });

          //滚动刷新
          api.addEventListener({
              name: 'scrolltobottom',
              extra: {threshold: 50}
           }, function(ret, err){
                if(!pageMol.loadcomplate ){
                    pageMol.pagesize++;
                    pageMol.bindData();
                }


           })
    },

    complate:function(){
      var elloading = $api.dom(".list-item-loading");
      $api.addCls(elloading, 'l_hide');
      pageMol.loadcomplate = true;
    },

    //绑定数据商品推荐数据
    bindData:function()
    {

      var parms = {
          url:"faquanc/getlist/pageindex/"+pageMol.pagesize,
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data.data;
                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    //图片处理
                    info.addtime = info.addtime.substr(10,6);
                    info.imglist = $api.strToJson(info.imglist);
                    info.imglist.push(info.itempic);
                    info.sellnum = changeW(info.sellnum);
                    info.oldprice = info.newprice +info.actmoney;
                    info.oldprice = Decimal2(info.oldprice);
                    info.ids = "mark_"+ info.id;
                    info.mds = "ment_"+ info.id;
                    pageMol.dataitem.push(info);
                 }
                 pageMol.dvv.data = pageMol;
                 var th_dom = $api.dom("#el_list");
                 Vue.nextTick(function(){
                     //缓存图片
                     imageCache(th_dom);
                 });
                 if(dataModel.length == 0){
                     pageMol.complate();
                 }
                 api.refreshHeaderLoadDone();
              }
              else {
                  pageMol.complate();
                  api.refreshHeaderLoadDone();
              }
          }
      }
      JM_GET(parms);

    },

    //复制评论，并且创建淘口令
    //rid: 用户的渠道ID；主要；分享出去能透出字段；追踪订单左右
    copyment:function(itemid,mds,token){
       //请求获取淘口令
       api.showProgress({title: '复制中...',text: '生成口令...',modal: false});
       var parms = {
        url:"taokeapi/getkouling/itemid/"+itemid+"/token/"+token,
        callback:function(ret){
            api.hideProgress();
            if(ret.flag)
            {
                var info = ret.data;
                var kouling = info.kouling;
                var el = "#"+mds;
                //获得里面的文字内容
                var contentstr = $api.text($api.dom(el));
                kouling = kouling.replace("￥","");
                kouling = kouling.replace("￥","");
                contentstr = contentstr.replace("复制评论后自动生成淘口令",kouling);
                CopyData(contentstr);
            }
            else {
                toast2(ret.msg);
            }
        }
      }
      JM_GET(parms);

    },

    //物品的分享
    //sharetype:0-微信好友 1-微信朋友圈 2-QQ 3-QQ空间
    shareGoodsIMG:function(sharetype,goodinfo,token){
        //创建图片到本地;最后一张图单独处理；主图生成宣传图；
        var imglist = goodinfo.imglist;
        if(imglist.length <= 0){
            toast2("没有图片可以分享");
            return;
        }
        else{
            //获取二维码 和 商品数据
            api.showProgress({title: '',text: '分享中...',modal: false});
            var parms = {
             url:"taokeapi/gershareewm/itemid/"+goodinfo.itemid+"/token/"+token,
             callback:function(ret){
                 if(ret.flag)
                 {
                     var info = ret.data;
                     var erweima = info.erweima; //二维码
                     var iteminfo = info.iteminfo; //物品数据
                     var typeimg = '../../image/goods/tb.png';
                     if(iteminfo.usertype == 1){
                        //天猫
                        typeimg = '../../image/goods/tm.png';
                     }
                     CanvasImg.canvasGoodsImg("../../image/bj.jpg",typeimg,erweima,iteminfo,true,function(ret,img_main_file){
                         //下载网络图到本地

                         if(sharetype == 0){
                            //微信好友分享;下载其他图片
                            CanvasImg.downImgs(goodinfo.imglist,function(flimgs){
                                if(ret == 0){  //主图合成成；给加上
                                    flimgs.unshift(img_main_file);
                                }
                                sharemgr.shareWxImage(flimgs.length,flimgs,'session');

                            });

                         }
                         else if(sharetype == 1){
                            //微信朋友圈
                            sharemgr.shareWxImage(1,img_main_file,'timeline');
                         }
                         else if(sharetype == 2){
                            //QQ好友
                            sharemgr.shareQQimg(1,img_main_file,'QFriend');
                         }
                         else if(sharetype == 3){
                            //QQ空间
                            sharemgr.shareQQimg(1,img_main_file,'QZone');
                         }
                         else{
                             //系统分享
                             CanvasImg.downImgs(goodinfo.imglist,function(flimgs){
                                 if(ret == 0){  //主图合成成；给加上
                                     flimgs.unshift(img_main_file);
                                 }
                                 var sharedModule = api.require('shareAction');
                                 sharedModule.share({images: flimgs,type: 'image '});
                                 //关闭窗体
                                 var dialogBox = api.require('dialogBox');
                                 dialogBox.close({
                                     dialogName: 'actionMenu'
                                 });
                             });


                         }


                     });


                 }
                 else {
                     api.hideProgress();
                     toast2(ret.msg);
                 }
               }
             }
             JM_GET(parms);



        }

  }

}
