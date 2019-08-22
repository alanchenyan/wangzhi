//达人说页面内容
var pageMol={
  dvv:null,     //vue数据渲染
  dvv1:null,     //vue数据渲染
  loadcomplate: false, //数据是否加载完成
  pagesize:1,    //当前加载的页面
  dataitem:[],   //数据列表
  dataitem1:[],   //数据列表

      initlize:function() {
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

        pageMol.loadcomplate = true;
      },

      //绑定数据
      bindData:function()
      {
        var parms = {
            url:"faquanc/getdarenshuo/pageindex/"+pageMol.pagesize,
            callback:function(ret){
                if(ret.flag)
                {
                   var dataModel = ret.data.data;
                   for(var i = 0; i < dataModel.length; i++)
                   {
                      var info = dataModel[i];
                        info.image = info.image+"_300x300";
                        info.count = JSON.parse(info.gooditem).length;
                      if(i%2 == 0){

                          pageMol.dataitem.push(info);
                      }else{

                        pageMol.dataitem1.push(info);
                      }

                   }
                    pageMol.dvv.data = pageMol;
                    pageMol.dvv1.data = pageMol;



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
