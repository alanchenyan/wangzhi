var pageMol ={
    dvv:null,
    datalist:[],
    pageindex:1,
    loadcomplate:false,
    currtype:0,

    initlize:function(){
        pageMol.currtype = api.pageParam.typeid;

        api.addEventListener({
            name: 'scrolltobottom',
            extra: {threshold: 50}
         }, function(ret, err){
             if(!pageMol.loadcomplate){
               pageMol.pageindex++;
               pageMol.bindData();
             }
         })

    },

    bindData:function(){
      api.showProgress({title: '努力加载中...',text: '订单查询中...',modal: false});
      var parms = {
          url:"order/getorderlist/orderid/"+pageMol.currtype+"/pageindex/"+pageMol.pageindex+"/token/"+usermgr.get_usertoken(),
          callback:function(ret){
              api.hideProgress();
              if(ret.flag){
                 var datalist = ret.data.data;
                 for (var i = 0; i < datalist.length; i++) {
                      pageMol.datalist.push(datalist[i]);
                 }

                 if(pageMol.datalist.length ==0)
                    $api.removeCls($api.dom(".nofansi"), 'l_hide');
                  if(datalist.length ==0)
                       pageMol.loadcomplate = true;
              }
              else {
                //  pageMol.complate();
                  pageMol.loadcomplate = true;
              }
          }
      }
      JM_GET(parms);

    },


}
