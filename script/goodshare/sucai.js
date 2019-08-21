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
              api.refreshHeaderLoadDone();

          });

          //滚动刷新
          api.addEventListener({
              name: 'scrolltobottom',
              extra: {threshold: 50}
           }, function(ret, err){
                if(!pageMol.loadcomplate ){
                    pageMol.pagesize ++;
                    pageMol.bindDataSc();
                }


           })
    },

    complate:function(){ 
      var elloading = $api.dom(".list-item-loading");
      $api.addCls(elloading, 'l_hide');
      pageMol.loadcomplate = true;
    },

    //绑定素材数据
    bindDataSc:function()
    {
      var parms = {
          url:"faquanc/getlistsc/pageindex/"+pageMol.pagesize,
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

              }
              else {
                  pageMol.complate();
              }
          }
      }
      JM_GET(parms);

    },



}
