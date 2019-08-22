var pageMol={
    dvv:null,     //vue数据渲染
    loadcomplate: false, //数据是否加载完成
    pagesize:1,    //当前加载的页面
    dataitem:[],   //数据列表
    currcateid:0,   //当前分类的ID

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
            api.refreshHeaderLoadDone();

        });

        //滚动刷新
        api.addEventListener({
            name: 'scrolltobottom',
            extra: {threshold: 50}
         }, function(ret, err){
              if(!pageMol.loadcomplate){
                  pageMol.pagesize++;
                  pageMol.bindData();
              }

         })


    },

    complate:function(){
      var elloading = $api.dom(".list-item-loading");
      $api.addCls(elloading, 'l_hide');
      var elbootom = $api.dom(".databootom");
      $api.addCls(elbootom, 'l_show');
      pageMol.loadcomplate = true;
    },

    //绑定数据
    bindData:function()
    {
        var parms = {
            url:"taokeapi/getitembycate/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.pagesize+"/cateid/"+pageMol.currcateid+"/sorttype/"+pageMol.sort_type+"/sorttype_sub/"+pageMol.sort_type_sub,
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
                    var th_dom = $api.dom("#el_vue_list");
                    Vue.nextTick(function(){
                        //缓存图片
                        imageCache(th_dom);
                        hide_div2(th_dom);
                    });
                  //	api.refreshHeaderLoadDone();
                    api.refreshHeaderLoadDone();
                }
                else {
                    pageMol.loadcomplate = true;
                    pageMol.complate();
                }
            }
        }
        JM_GET(parms);
    },

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
      pageMol.bindData();
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

   pageMol.bindData();
}
