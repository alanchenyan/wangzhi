//商品详情页面数据
var pageMol={
    goodItem: null, //物品对象
    topimags:[],
    itemID:0,
    loadcomplate:false,
    myImgsSwiper:null,  //轮播头像对象
    Tpagesize:1,
    tjcomplate:false,
    dvv:null,
    KEYSHOU:'KEY_SHOUCANG',    //收藏的key
    shoucdata:null,   //收藏数据
    issc:false,     //是否收藏
    reqcount : 0,
    datatype:0,   //0-淘宝 1-天猫 2-JD 3-拼多多
    jdurl:"",
    initlize:function() {
      //设置价格相关
        pageMol.datatype = pageMol.goodItem.usertype;

        $api.html($api.dom("#el_newprice"), '<em>&yen;</em>'+pageMol.goodItem.newprice+'');
        $api.html($api.dom("#old_newprice"), '<em>&yen;</em>'+pageMol.goodItem.itemprice+'');
        $api.text($api.dom("#rrr"),changeW(pageMol.goodItem.sellnum));
        if(pageMol.goodItem.sellnum <= 0)
        {
          $api.css($api.dom(".sp3"),"display:none");
        }
        //设置返利
        $api.text($api.dom(".m-t"), "￥"+clcrate1(pageMol.goodItem.commissionrate,pageMol.goodItem.newprice));
        $api.text($api.dom("#el_tz"), clcrate2(pageMol.goodItem.commissionrate,pageMol.goodItem.newprice));

        $api.text($api.dom("#good_title"), pageMol.goodItem.itemtitle);

        if(pageMol.datatype ==1)
          $api.attr($api.dom("#imgtype"),'src','../../image/goods/tm.png');
        else if(pageMol.datatype ==2){
            $api.attr($api.dom('#imgtype'),'src','../../image/goods/jd.png');
        }
        else if(pageMol.datatype ==3){
            $api.attr($api.dom("#imgtype"),'src','../../image/goods/cheng_iconPdd_xuxia.png');
        }
        //优惠券信息
        $api.text($api.dom("#youhuiquan"),pageMol.goodItem.couponprice);
        if(pageMol.goodItem.couponprice == 0){
            $api.text($api.dom("#youhuitie"),"已被抢完暂无优惠");
              $api.css($api.dom(".m-b"), "display:none");
        }else {
          $api.text($api.dom(".m-b"), "￥"+pageMol.goodItem.couponprice);
          $api.text($api.dom("#youhuitie"),pageMol.goodItem.couponendtime);
          var timeobj = new Date(pageMol.goodItem.couponendtime)

          $('#countdown').countDown({
              targetDate: {
                  'day':timeobj.getDate(),
                  'month':timeobj.getMonth()+1,
                  'year': timeobj.getFullYear(),
                  'hour': 0,
                  'min': 0,
                  'sec': 0
              }
          });

        }

        //初始化图片轮播
        pageMol.initSwiperImg();

        //滚动刷新
        api.addEventListener({
            name: 'scrolltobottom',
            extra: {threshold: 50}
         }, function(ret, err){
            //pageMol.bindTjData()

         })


    },

    //绑定物品描述信息
    //通过网页抓取来的描述
    bindDesc:function()
    {
      var url2 = app.host+app.fix+"otherapi/h5iteminfo/itemid/"+pageMol.itemID;
      var parms = {
          url:"otherapi/iteminfodtk/itemid/"+pageMol.itemID,
          callback:function(ret){
              if(ret.flag)
              {
                  var imglist = ret.data;
                  var htmlstr = "";
                  arr=imglist.split("//");
                  for (var i = 0; i < arr.length; i++) {
                    if(arr[i]!=''){
                      var imgs = "http://"+arr[i];
                      imgs= imgs.replace(',',"");

                      htmlstr += "<img src='"+imgs+"' width='100%'  />";
                    }

                  }
                //  $api.css($api.dom(".list-wrapper"), "display:none");
                  $api.html($api.dom("#imgs"), htmlstr);
              }
              else {

                api.ajax({
                    url: url2,
                    method: 'get',
                    timeout:30,
                    dataType:'json',
                    //headers:param.token?{_token:param.token,union:app.unionid}:{_token:'',union:app.unionid}
                },function(ret, err){
                      console.log('商品的描述;'+'ret:'+JSON.stringify(ret)+';err:'+$api.jsonToStr(err));
                      var result = ret.data;
                      if(!result){
                        return;
                      }
                      var imageStr = result;
                      var htmlstr = "";

                     for (var i = 0; i < imageStr.length; i++) {
                          htmlstr = htmlstr+"<img src='" + imageStr[i]+ "' style='width:100%;max-width:100%'>"
                     }
                     $api.html($api.dom("#imgs"), htmlstr);
                       console.log(15)

                });
              }
          }
      }
      JM_GET(parms);

      $api.css($api.dom(".openloading"), "display:none");

    },

    //绑定贝贝信息
    bindItems:function()
    {
      var urls = "https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?&api=mtop.taobao.detail.getdetail&v=6.0&ttid=2013%40taobao_h5_1.0.0&type=jsonp&dataType=jsonp&data=%7B%22itemNumId%22%3A%22" + pageMol.itemID + "%22%7D";
      api.ajax({
          url: urls,
          encode:false,
          method: 'GET',
          timeout:100,
          dataType:'json'
          //headers:param.token?{_token:param.token,union:app.unionid}:{_token:'',union:app.unionid}
      },function(ret, err){
        //  console.log('get taobao complate;'+'ret:'+JSON.stringify(ret)+';err:'+JSON.stringify(err));
          var gooddata = ret.data.item;
          //设置标题
        //  $api.text($api.dom(".good_title"), gooddata.title);
          //设置图片
          var smalllist =   gooddata.images;
          var imghtml = '<div class="swiper-wrapper">';
          //  pageMol.myImgsSwiper.addSlide(0,'<div class="swiper-slide"> <img src="'+gooddata.pict_url+'"  style = "width: 100%;height:350;"></div>');
          for (var i = 0; i < smalllist.length; i++) {
              var img_src = smalllist[i];
              var img_src_path = "";
              if(img_src.indexOf("http") == -1){
                  img_src_path = "http:"+img_src+"_350x350";
              }
              pageMol.myImgsSwiper.addSlide(i+1,'<div class="swiper-slide" onclick="openimg('+i+')">  <div class="pic"> <img src="'+img_src_path+'"   > </div></div>');
              pageMol.topimags.push("http:"+img_src);
          }
          //设置店铺相关
          var shopData = ret.data.seller;
          //店铺图片
          if(shopData.shopIcon!=""){
            if(shopData.shopIcon.indexOf("http") == -1){
               shopData.shopIcon = "http:"+shopData.shopIcon;
            }
              $api.attr($api.dom(".store_logo"),'src',shopData.shopIcon);
          }

          //店铺标题
          $api.text($api.dom("#shoptitle"),shopData.shopName);
          //判断天猫 还是淘宝
          if(shopData.shopType == "C")
          {
              $api.html($api.dom("#aui-list-item-right"),'<img   src="../../image/goods/taobao.png" />');
          }
          else {
              $api.html($api.dom("#aui-list-item-right"),'<img   src="../../image/goods/tmall.jpg" />');
          }
          pageMol.showPage();
          pageMol.bindDesc();

      });

    },

    //JD详情
    bindItemJd:function(){
      $api.css($api.dom(".m-txt2"),"display:none")
      $api.html($api.dom(".aui-list-item-right"),'<img class = "tmall_logo" src="../../image/goods/jd.png">');
      var smallimg = pageMol.goodItem.smallimg;
      var smalllist =[];
      for (var i = 0; i < smallimg.length; i++) {
          smalllist[i] = smallimg[i].url;
          if(i==4)
            break;
      }
      var imghtml = '<div class="swiper-wrapper">';
      for (var i = 0; i < smalllist.length; i++) {
          var img_src = smalllist[i];
          pageMol.myImgsSwiper.addSlide(i+1,'<div class="swiper-slide" onclick="openimg('+i+')"> <img src="'+img_src+'"  style = "width: 100%;height:350;"></div>');
          pageMol.topimags.push(img_src);
      }
      pageMol.showPage();
      var parms = {
          url:"jdc/getJdDetails/itemid/"+pageMol.itemID+"/type/1",
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data;
                 var htmstr = "";
                 for (var i = 0; i < dataModel.length; i++) {
                        var img = dataModel[i];
                        htmstr+="<img src='http://"+img+"' width='100%' /> ";
                 }
                 $api.html($api.dom("#imgs"), htmstr);
              }
          }
      }
      JM_GET(parms);
    },

    //拼多多详情
    bindItemPdd:function(){
      var parms = {
          url:"jdc/getPddDetails/itemid/"+pageMol.itemID,
          callback:function(ret){
              if(ret.flag)
              {
                 var datainfo = ret.data.goods_detail_response.goods_details[0];

                 //$api.html($api.dom(".aui-list-item-right"),'<img class = "tmall_logo" src="../../image/goods/jd.png">');

                 var smallimg = datainfo.goods_gallery_urls;
                 var smalllist =[];
                 for (var i = 0; i < smallimg.length; i++) {
                     smalllist[i] = smallimg[i];
                 }
                 var imghtml = '<div class="swiper-wrapper">';
                  var imghtml2 = '';
                 for (var i = 0; i < smalllist.length; i++) {
                     var img_src = smalllist[i];
                     pageMol.myImgsSwiper.addSlide(i+1,'<div class="swiper-slide" onclick="openimg('+i+')"> <img src="'+img_src+'"  style = "width: 100%;height:350;"></div>');
                     imghtml2 = imghtml2+"<img src="+img_src+" width=100% />";
                     pageMol.topimags.push(img_src);
                 }
                 //店铺图片
                 $api.attr($api.dom(".store_logo"),'src',"../../image/goods/cheng_iconPdd_xuxia.png");
                 //店铺标题
                 $api.text($api.dom("#shoptitle"),datainfo.mall_name);
                 //判断天猫 还是淘宝
                  $api.html($api.dom("#aui-list-item-right"),'<img class = "tmall_logo" src="../../image/goods/pdd_1.jpg">');
                 //设置服务分
                 var html_score = "";
                 html_score += "<span class = 'store-type-box'>店铺描述分：<span>"+datainfo.avg_desc+"</span></span>";
                 html_score += "<span class = 'store-type-box'>店铺物流分：<span>"+datainfo.avg_lgst+"</span></span>";
                 html_score += "<span class = 'store-type-box'>店铺服务分：<span>"+datainfo.avg_serv+"</span></span>";
                 $api.html($api.dom(".store-assess-box"),html_score);
                 var htmldesc="";
                 if(datainfo.goods_desc && datainfo.goods_desc != ""){
                    htmldesc="<div style='font-size:13px; border:1px dashed  red; width:97%; text-align:left; padding:5px;margin-left:1.5%'>"+datainfo.goods_desc+" </div></br>"
                 }


                 $api.html($api.dom("#imgs"), htmldesc+imghtml2);
                 pageMol.showPage();

              }
          }
      }
      JM_GET(parms);

    },


    showPage:function(){
        $api.css($api.dom(".openloading"), "display:none");
        $api.css($api.dom(".main"), "display:block");
        $api.css($api.dom(".footer"), "display:block");
    },

    //去跳转淘宝
    getlinkurl:function(){
      //查找商品详情信息；
      var urls = "taokeapi/geturl/itemid/"+pageMol.itemID+"/token/"+usermgr.get_usertoken();
      if(istest()){
          urls = "taokeapi/geturl2/itemid/"+pageMol.itemID+"/token/"+usermgr.get_usertoken();
      }
      var parms = {
          url:urls,
          callback:function(ret){
              if(ret.flag){
                  var dataModel = ret.data;
                  //跳转到淘宝页面
                  var alibaichuan = api.require('alibaichuan');
                  var url='https:'+dataModel.linkurl;
                  var param = {
                      url : url,
                      nativeview:true
                  };
                  alibaichuan.showDetailByURL(param, function(ret, err) {
                  });
                  closeLoading();

              }
              else {
                  closeLoading();
                  alert("该商品暂未参加活动推广");
              }
          }
      }
      JM_GET(parms);
    },

    //获取JD连接
    getlinkurlJd:function(isshare){
          var couponurl ="";
          if(pageMol.goodItem.couponurl!=null){
            couponurl = api.getGlobalData({key: 'jdcouponurl'});
          }
          api.showProgress({title: '',text: '',modal: false});
          var urls = "jdc/getlinkurl";
          var parms = {
              url:urls,
              values:{
                 itemid:pageMol.itemID,
                 userid:usermgr.get_userid(),
                 coupurl:couponurl,
              },
              callback:function(ret){

                  if(ret.flag){
                      var dataModel = ret.data;
                      if(isshare){
                        //分享
                        var kouling = dataModel.data.shortURL;//
                        var erweima = dataModel.erweima; //二维码
                        var iteminfo = pageMol.goodItem; //物品数据
                        var typeimg = '../../image/goods/jd.png';
                        api.showProgress({title: '',text: '合成图片',modal: false});
                        CanvasImg.canvasGoodsImg("../../image/bj.jpg",typeimg,erweima,iteminfo,false,function(ret,img_main_file){
                            api.hideProgress();
                            var pagedata ={};
                            if(ret == 0){  //主图合成成；给加上
                                pagedata.imglist = pageMol.topimags;
                                pagedata.jmimg = img_main_file;
                                pagedata.kouling = kouling;
                            }
                            pagedata.itemdata = pageMol.goodItem;
                            openwin("goods/shareframe",'分享商品',pagedata);
                        });


                      }else {
                          api.hideProgress();
                        if(dataModel.code == 200){
                            pageMol.jdurl = dataModel.data.shortURL;
                            if(api.systemType == 'ios'){
                              api.openApp({
                                  iosUrl: dataModel.data.shortURL,
                                  uri:dataModel.data.shortURL
                              });
                            }else {
                              api.openApp({
                                  iosUrl: 'openApp.jdMobile://',
                                  uri:dataModel.data.shortURL
                              });
                            }

                        }
                        else {
                             toast2("连接获取失败");
                        }
                      }

                  }
                  else {
                      closeLoading();
                      alert("该商品暂未参加活动推广");
                  }
              }
          }
          JM_POST(parms);
    },

    //获取拼多多连接
    getlinkurlpdd:function(isshare){
          api.showProgress({title: '',text: '',modal: false});
          var urls = "jdc/getpddlink/itemid/"+pageMol.itemID+"/userid/"+usermgr.get_userid();
          var parms = {
              url:urls,
              callback:function(ret){
                  if(ret.flag){
                      var dataModel = ret.data.goods_promotion_url_generate_response.goods_promotion_url_list[0];

                      if(isshare){
                        //分享
                        var kouling = dataModel.mobile_short_url;//
                        var erweima = ret.data.erweima; //二维码
                        var iteminfo = pageMol.goodItem; //物品数据
                        var typeimg = '../../image/goods/jd.png';
                        api.showProgress({title: '',text: '合成图片',modal: false});
                        CanvasImg.canvasGoodsImg("../../image/bj.jpg",typeimg,erweima,iteminfo,false,function(ret,img_main_file){
                            api.hideProgress();
                            var pagedata ={};
                            if(ret == 0){  //主图合成成；给加上
                                pagedata.imglist = pageMol.topimags;
                                pagedata.jmimg = img_main_file;
                                pagedata.kouling = kouling;
                            }
                            pagedata.itemdata = pageMol.goodItem;
                            openwin("goods/shareframe",'分享商品',pagedata);
                        });


                      }else {
                          api.hideProgress();
                          pageMol.jdurl = dataModel.mobile_short_url;
                          if(api.systemType == 'ios'){
                            api.openApp({
                                iosUrl:dataModel.mobile_short_url,
                              //  androidPkg: 'com.xunmeng.pinduoduo',
                                uri:dataModel.mobile_short_url
                            });
                          }
                          else {
                            api.openApp({
                                //iosUrl:"pinduoduo://",
                              //  androidPkg: 'com.xunmeng.pinduoduo',
                                uri:dataModel.mobile_short_url
                            });
                          }

                      }

                  }
                  else {
                      closeLoading();
                      alert("该商品暂未参加活动推广");
                  }
              }
          }
          JM_GET(parms);
    },


    //去分享
    sharegood:function(){
        //获取口令
        api.showProgress({title: '',text: '',modal: false});
        var parms = {
          url:"taokeapi/gershareewm/itemid/"+pageMol.itemID+"/token/"+usermgr.get_usertoken(),
         callback:function(ret){
             if(ret.flag)
             {
                 var info = ret.data;
                 var kouling = info.kouling;//口令
                 var erweima = info.erweima; //二维码
                 var iteminfo = info.iteminfo; //物品数据
                 var typeimg = '../../image/goods/tb.png';
                 if(pageMol.goodItem.usertype == 1){
                    //天猫
                    typeimg = '../../image/goods/tm.png';
                 }
                 //生成合成图
                  CanvasImg.canvasGoodsImg("../../image/bj.jpg",typeimg,erweima,iteminfo,false,function(ret,img_main_file){
                      api.hideProgress();
                      var pagedata ={};
                      if(ret == 0){  //主图合成成；给加上
                          pagedata.imglist = pageMol.topimags;
                          pagedata.jmimg = img_main_file;
                          pagedata.kouling = kouling;
                      }
                      pagedata.itemdata = pageMol.goodItem;
                      openwin("goods/shareframe",'分享商品',pagedata);
                  });

             }
             else {
                 toast2(ret.msg);
             }
         }
       }
       JM_GET(parms);
    },

    //数据加载完成函数
    complate:function(){
      /*var elloading = $api.dom(".list-item-loading");
      $api.addCls(elloading, 'l_hide');
      var elbootom = $api.dom(".databootom");
      $api.addCls(elbootom, 'l_show');*/
      pageMol.loadcomplate = true;
    },


    initSwiperImg:function(){
      //轮播
      pageMol.myImgsSwiper =  new Swiper('.slider-pic1', {
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        observer:true,
        observeParents:true,
        resistanceRatio : 0,
          pagination: {
              el: '.swiper-pagination',
              clickable: true,
          }
      });



    },



}



//var good_detail_offtop = $api.offset($api.dom('#good_detail')).t - 62;
//var good_tj_offtop =  $api.offset($api.dom('#good_tj')).t - 82;
