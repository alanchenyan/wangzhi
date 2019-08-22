var pageMol={
    dvv:null,     //vue数据渲染
    loadcomplate: false, //数据是否加载完成
    pagesize:1,    //当前加载的页面
    dataitem:[],   //数据列表
    pageid: 0,
    datatype:1,   //默认是淘宝
    initlize:function() {
        dataitem = Array();
        pagesize = 1;
        loadcomplate = false;

        api.setRefreshHeaderInfo({
            visible: true,
            loadingImg: 'widget://image/refresh.png',
            bgColor: '#fff',
            textColor: '#ccc',
            textDown: '下拉刷新...',
            textUp: '松开试试...',
            showTime: true
        }, function(ret, err) {
            pageMol.dataitem=[];
            pageMol.pagesize = 1;
            pageMol.loadcomplate = false;
            $api.css($api.dom(".list-item-loading"),'display:block');
            $api.css($api.dom(".databootom"),'display:none');
            pageMol.loaddata();
            api.refreshHeaderLoadDone();

        });

        //滚动刷新
        api.addEventListener({
            name: 'scrolltobottom',
            extra: {threshold: 50}
         }, function(ret, err){
              if(!pageMol.loadcomplate){
                  pageMol.pagesize++;
                  pageMol.loaddata();
              }

         })

    },

    loaddata:function(){
      if(pageMol.pageid == app.farme_love){
        pageMol.bindDataLove(); //猜你喜欢
      }
      else if(pageMol.pageid == app.farme_rank){
        pageMol.bindBandList(api.pageParam.cateid); //品牌
      }
      else if(pageMol.pageid == app.farme_thui) //特惠商品
      {
        pageMol.bindThItem();
      }
      else if(pageMol.pageid == app.frame_muyin) //特惠商品
      {
        pageMol.bindMother(api.pageParam.mid);
      }
      else if(pageMol.pageid == app.frame_jd) //JD
      {
        pageMol.bingJdc(api.pageParam.cateid);
      }
      else if(pageMol.pageid == app.frame_pdd) //拼多多
      {
        pageMol.bingPdd();
      }
      else {
        pageMol.bindDataType(api.pageParam.cateid);
      }
    },
    complate:function(){

      $api.css($api.dom(".list-item-loading"),'display:none');
      $api.css($api.dom(".databootom"),'display:block');

      pageMol.loadcomplate = true;
      api.refreshHeaderLoadDone();
    },
    //绑定数据--猜你喜欢
    bindDataLove:function()
    {
        var parms = {
            url:"taokeapi/getmaterialgoods/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.pagesize+"/materid/6708",
            callback:function(ret){
                if(ret.flag)
                {
                   var dataModel = ret.data;
                   for(var i = 0; i < dataModel.length; i++)
                   {
                      var info = dataModel[i];
                      info.sellnum = changeW(info.sellnum);
                      info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                      info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                      pageMol.dataitem.push(info);
                   }
                    pageMol.dvv.data = pageMol;
                    var th_dom = $api.dom("#el_list");
                    Vue.nextTick(function(){
                        //缓存图片
                        imageCache(th_dom);
                        hide_div(th_dom);
                    });
                  //	api.refreshHeaderLoadDone();
                    api.refreshHeaderLoadDone();
                }
                else {
                    pageMol.complate();
                }
            }
        }
        JM_GET(parms);
    },

    //绑定数据--品牌数据
    bindBandList:function(cateid)
    {

        var parms = {
            url:"taokeapi/getbandgoods/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.pagesize+"/cateid/"+cateid,
            callback:function(ret){
                if(ret.flag && !ret.data.code)
                {
                   var dataModel = ret.data.result_list.map_data;
                   for(var i = 0; i < dataModel.length; i++)
                   {
                      var info = dataModel[i];
                      var item = ConvertGoodItem(info);
                      item.sellnum = changeW(item.sellnum);
                      item.commissionrate1 = clcrate1(item.commissionrate,item.newprice);
                      item.commissionrate2 = clcrate2(item.commissionrate,item.newprice);
                      pageMol.dataitem.push(item);
                   }
                    pageMol.dvv.data = pageMol;
                    var th_dom = $api.dom("#el_list");
                    Vue.nextTick(function(){
                        //缓存图片
                        imageCache(th_dom);
                          hide_div(th_dom);
                    });
                  //	api.refreshHeaderLoadDone();
                    api.refreshHeaderLoadDone();
                }
                else {
                    pageMol.complate();
                }
            }
        }
        JM_GET(parms);
    },

    //绑定数据--
    //type=1是今日上新（当天新券商品），type=2是9.9包邮，type=3是30元封顶，type=4是聚划算，
    //type=5是淘抢购，type=6是0点过夜单，type=7是预告单，type=8是品牌单，type=9是天猫商品，type=10是视频单
    bindDataType:function(cateid)
    {
      var urls = "";
      //设置数据类型
      var datatype = 0;
      if(pageMol.pageid  == app.farme_you9){//99包邮
          datatype = 2;
          urls="taokeapi2/get99you/minid/"+pageMol.pagesize+"/cateid/"+cateid+"/type/"+datatype;
      }
      //alert("a");
      var parms = {
          url:urls,
          callback:function(ret){
              if(ret.flag && ret.msg=="success")
              {
                 var dataModel = ret.data.data;
                 //好单库 用 mmid获取数据
                 pageMol.pagesize = ret.data.min_id;

                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    info.sellnum = changeW(info.sellnum);
                    info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                    info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                    pageMol.dataitem.push(info);
                 }
                  pageMol.dvv.data = pageMol;
                  var th_dom = $api.dom("#el_list");
                  Vue.nextTick(function(){
                      //缓存图片
                      imageCache(th_dom);
                        hide_div(th_dom);
                  });

              }
              else {
                  pageMol.complate();

              }
          }
      }
      JM_GET(parms);
    },


    //淘好货--4094 物料ID
    bindThItem:function()
    {
        var parms = {
            url:"taokeapi/getmaterialgoods/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.pagesize+"/materid/4094",
            callback:function(ret){
                if(ret.flag)
                {
                   var dataModel = ret.data;
                   for(var i = 0; i < dataModel.length; i++)
                   {
                      var info = dataModel[i];
                      info.sellnum = changeW(info.sellnum);
                      info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                      info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                      pageMol.dataitem.push(info);
                   }
                    pageMol.dvv.data = pageMol;
                    var th_dom = $api.dom("#el_list");
                    Vue.nextTick(function(){
                        //缓存图片
                        imageCache(th_dom);
                          hide_div(th_dom);
                    });
                  //	api.refreshHeaderLoadDone();
                    api.refreshHeaderLoadDone();
                }
                else {
                    pageMol.complate();
                }
            }
        }
        JM_GET(parms);
    },

    //母婴类型
    //备孕：4040  0至6个月：4041 7-12月：4042 1-3岁：4043  4至6岁：4044 7至12岁：4045
    bindMother:function(m_id){
      var parms = {
          url:"taokeapi/getmaterialgoods/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.pagesize+"/materid/"+m_id,
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data;
                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    info.sellnum = changeW(info.sellnum);
                    info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                    info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                    pageMol.dataitem.push(info);
                 }
                  pageMol.dvv.data = pageMol;
                  var th_dom = $api.dom("#el_list");
                  Vue.nextTick(function(){
                      //缓存图片
                      imageCache(th_dom);
                        hide_div(th_dom);
                  });
                //	api.refreshHeaderLoadDone();
                  api.refreshHeaderLoadDone();
              }
              else {
                  pageMol.complate();
              }
          }
        }
      JM_GET(parms);
    },

    //联盟选单库绑定
    //fid 选单库编号ID； 联盟里面查看
    bingFavorite:function(fid){
      fid = api.pageParam.fid;
      var parms = {
          url:"taokeapi/getfavorites/fid/"+fid+"/pagenumber/"+pageMol.pagesize,
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data;
                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                    info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                    pageMol.dataitem.push(info);
                 }
                  pageMol.dvv.data = pageMol;
                  var th_dom = $api.dom("#el_list");
                  Vue.nextTick(function(){
                      //缓存图片
                      imageCache(th_dom);
                        hide_div(th_dom);
                  });
                //	api.refreshHeaderLoadDone();
                  api.refreshHeaderLoadDone();
              }
              else {
                  pageMol.complate();
              }
          }
        }
      JM_GET(parms);
    },

    //京东或者拼多多数据
    bingJdc:function(cid){
      var parms = {
          url:"jdc/getlist/cateid/"+cid+"/typeid/1/pageindex/"+pageMol.pagesize,
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data;
                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    info.sellnum = changeW(info.sellnum);
                    info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                    info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                    pageMol.dataitem.push(info);
                 }
                  pageMol.dvv.data = pageMol;
                  var th_dom = $api.dom("#el_list");
                  Vue.nextTick(function(){
                      //缓存图片
                      imageCache(th_dom);
                        hide_div(th_dom);
                  });
                //	api.refreshHeaderLoadDone();
                  api.refreshHeaderLoadDone();
              }
              else {
                  pageMol.complate();
              }
          }
        }
      JM_GET(parms);
    },


    //京东或者拼多多数据
    bingPdd:function(){
      var parms = {
          url:"jdc/getddlist/pageindex/"+pageMol.pagesize,
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data;
                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
                    info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
                    pageMol.dataitem.push(info);
                 }
                  pageMol.dvv.data = pageMol;
                  var th_dom = $api.dom("#el_list");
                  Vue.nextTick(function(){
                      //缓存图片
                      imageCache(th_dom);
                        hide_div(th_dom);
                  });
                //	api.refreshHeaderLoadDone();
                  api.refreshHeaderLoadDone();
              }
              else {
                  pageMol.complate();
              }
          }
        }
      JM_GET(parms);
    }

}
