var pageMol={
    dvv:null,     //vue数据渲染
    loadcomplate: false, //数据是否加载完成
    pagesize:1,    //当前加载的页面
    dataitem:[],   //数据列表
    keywods:'',   //关键词的内容
    searchtype:0, //0-淘宝 1-京东 2-拼多多
    sort_type:0,    //0综合排序 1价格 2佣金 3销量
    sort_type_sub:0,  // 0无选择 1-降序 2-升序
    initlize:function() {
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
            pageMol.sort_type = 0;
            pageMol.sort_type_sub = 0;
            pageMol.dataitem = Array();
            pageMol.bindNewItemData();

        });

        //滚动刷新
        api.addEventListener({
            name: 'scrolltobottom',
            extra: {threshold: 50}
         }, function(ret, err){
              if(!pageMol.loadcomplate){
                  pageMol.pagesize++;
                  pageMol.bindNewItemData();
              }

         })


    },

    complate:function(){
      $api.css($api.dom("#list-wrapper"),'display:none');
      $api.css($api.dom(".databootom"),'display:block');

      pageMol.loadcomplate = true;
    },

    //绑定数据
    bindNewItemData:function()
    {
        if(pageMol.pageid == app.farme_newday){
            pageMol.binddatanew();
        }
        else if(pageMol.pageid == app.frame_search){
            pageMol.searchdata();
        }
    },

    //今日上新数据
    binddatanew:function(){
        var parms = {
            url:"taokeapi1/getnewitem/pageindex/"+pageMol.pagesize+"/sorttype/"+pageMol.sort_type+"/sorttype_sub/"+pageMol.sort_type_sub,
            callback:function(ret){
                if(ret.flag)
                {
                   var dataModel = ret.data;
                   for(var i = 0; i < dataModel.length; i++){
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
                    api.refreshHeaderLoadDone();
                    if(dataModel.length <20){
                        pageMol.complate();
                        pageMol.loadcomplate = true;
                    }

                }
                else {
                    pageMol.loadcomplate = true;

                }
            }
        }
        JM_GET(parms);
    },

    //关键词查询数据
    searchdata:function(){
      var serchurl ="";
      if(pageMol.searchtype == 0){
          serchurl="taokeapi/serchwords/pagenumber/"+pageMol.pagesize+"/sorttype/"+pageMol.sort_type+"/sorttype_sub/"+pageMol.sort_type_sub;
      }
      else if(pageMol.searchtype == 1){
          //京东
          serchurl="jdc/serchjd/pagenumber/"+pageMol.pagesize+"/sorttype/"+pageMol.sort_type+"/sorttype_sub/"+pageMol.sort_type_sub;
      }
      else if(pageMol.searchtype == 2){
          //拼多多
          serchurl="jdc/serchpddwords/pagenumber/"+pageMol.pagesize+"/sorttype/"+pageMol.sort_type+"/sorttype_sub/"+pageMol.sort_type_sub;
      }
      var parms = {
          url:serchurl,
          values:{
             keywods: pageMol.keywods,
          },
          callback:function(ret){
              if(ret.flag)
              {
                 var dataModel = ret.data;
                 if(dataModel.length == 0){
                   pageMol.loadcomplate = true;
                   pageMol.complate();
                   return;
                 }
                 for(var i = 0; i < dataModel.length; i++){
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
                  api.refreshHeaderLoadDone();
                  if(dataModel.length <20){
                      pageMol.complate();
                      pageMol.loadcomplate = true;
                  }
              }
              else {
                  pageMol.loadcomplate = true;
                  pageMol.complate();
              }
          }
      }
      JM_POST(parms);
    }

}


function SortCahnage(sorttype)
{

   //删除所有选中样式
   var sortlist =  document.getElementById("sort_list").getElementsByTagName("div");
   for(var i =0; i< sortlist.length; i++)
   {
        var img_s = sortlist[i].getElementsByTagName("img");
        for (var j = 0; j < img_s.length; j++) {
            if(j == 0)
              img_s[j].src = "../image/shang.png";
            else {
              img_s[j].src = "../image/sxia.png";
            }
        }
        var span_s = sortlist[i].getElementsByTagName("span");
        for (var j = 0; j < span_s.length; j++) {

            span_s[j].style.color = "	#1C1C1C";
        }
   }
   if(sorttype == 0)
   {
      pageMol.sort_type = 0;
      pageMol.sort_type_sub = 0;
      pageMol.dataitem = Array();
      pageMol.bindNewItemData();
      return;
   }

   // 1价格 2佣金 3销量
   pageMol.sort_type = sorttype;
   var dd_m = null;
   if(pageMol.sort_type == 1){
      dd_m =  document.getElementById("s_price");
      dd_m.getElementsByTagName("span")[0].style.color = "red";
    }
   else if(pageMol.sort_type == 2){
      dd_m =  document.getElementById("s_yy");
      dd_m.getElementsByTagName("span")[0].style.color = "red";
    }
   else if(pageMol.sort_type == 3){
      dd_m =  document.getElementById("s_xl");
      dd_m.getElementsByTagName("span")[0].style.color = "red";
    }

   if(pageMol.sort_type_sub == 0)
   {
      dd_m.getElementsByTagName("img")[1].src = "../image/sxiaac.png";
      pageMol.sort_type_sub = 1;
      //降序
   }
   else if(pageMol.sort_type_sub == 1)
   {
      //升序
      dd_m.getElementsByTagName("img")[0].src = "../image/shangac.png";
      pageMol.sort_type_sub =0;
   }
   pageMol.dataitem = Array();
   pageMol.pagesize = 1;

   pageMol.bindNewItemData();
}
