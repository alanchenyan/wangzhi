var pageMol={
  dvv:null,     //vue数据渲染
  loadcomplate: false, //数据是否加载完成
  pagesize:1,    //当前加载的页面
  dataitem:[],   //数据列表
  types:0,

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
        $api.css($api.dom(".list-item-loading"),"display:block")
        pageMol.pagesize = 1;
        pageMol.dataitem = Array();
        pageMol.loadcomplate = false;
        pageMol.bindData();


    });

    //滚动刷新
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {threshold: 50}
     }, function(ret, err){
          if(!pageMol.loadcomplate ){
              pageMol.pagesize ++;
              pageMol.bindData();
          }
     })
  },

  complate:function(){
    $api.css($api.dom(".list-item-loading"),"display:none")
    pageMol.loadcomplate = true;
  },

  //绑定素材数据
  bindData:function()
  {
    var parms = {
        url:"faquanc/getxueyuan/pageindex/"+pageMol.pagesize+"/adtype/"+pageMol.types,
        callback:function(ret){
            api.refreshHeaderLoadDone();
            if(ret.flag)
            {
               var dataModel = ret.data.data;
               var url = ret.msg;
               for(var i = 0; i < dataModel.length; i++)
               {
                  var info = dataModel[i];
                  info.url = url+"/"+info.id;
                  pageMol.dataitem.push(info);
               }
               pageMol.dvv.data = pageMol;
               var th_dom = $api.dom("#el_list");
               if(dataModel.length == 0 || dataModel.length < 20){
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
