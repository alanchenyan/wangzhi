var pageMol={
    dvv:null,     //vue数据渲染
    loadcomplate: false, //数据是否加载完成
    pagesize:1,    //当前加载的页面
    dataitem:[],   //数据列表
    cateid: 0,
    initlize:function() {
        dataitem = Array();
        pagesize = 1;
        loadcomplate = false;


    },

    complate:function(){
      var elloading = $api.dom(".list-item-loading");
      $api.addCls(elloading, 'l_hide');

    },

    //绑定分类数据
    BindCate:function()
    {
      //获得大分类数据
      var root_list_data = getCateData(0);
      if(!root_list_data)
      {
          toast("分类数据错误");
          return;
      }
      var cate_list_data = $api.strToJson(root_list_data);
      var html_str ='<span onclick="rankcate(0)" class="applist-classify-category am-margin-right cat classify-category-active" data-type="-1"> <img class="am-padding-xs am-round" src="http://img.fqapps.com/FtJ-LkJOoDl_g7oBSKw4fTfV-een-600" /> <span class="am-text-xs">全部</span></span>';

      for (var i = 0; i < cate_list_data.length; i++) {
        var item = cate_list_data[i];
        html_str = html_str + '  <span onclick="rankcate('+item.hdk_cid+')"  class="applist-classify-category am-margin-right cat " data-type="'+item.id+'"> <img class="am-padding-xs am-round" src="'+item.app_icon+'" /> <span class="am-text-xs">'+item.name+'</span></span>';
      }
      var navdom = $api.dom('#title_el');
      $api.html(navdom,html_str);

    },

    //绑定数据
    bindData:function()
    {
        var parms = {
            url:"taokeapi2/rankbk/minid/"+pageMol.pagesize+"/type/"+pageMol.cateid,
            callback:function(ret){
                if(ret.flag && ret.msg=="success")
                {
                   var dataModel = ret.data.data;
                  pageMol.pagesize = ret.data.min_id;
                   for(var i = 0; i < dataModel.length; i++)
                   {
                      var info = dataModel[i];
                      info.rank = i;
                      pageMol.dataitem.push(info);
                   }
                    pageMol.dvv.data = pageMol;
                    var th_dom = $api.dom("#goods_list");
                    Vue.nextTick(function(){
                        //缓存图片
                        imageCache(th_dom);
                    });
                    document.getElementById("goods_list").style.display="";
                    pageMol.complate();
                }
                else {

                }
            }
        }
        JM_GET(parms);
    },


}

//选择分类排行
function rankcate(cateid)
{
    pageMol.dataitem = Array();
    var elloading = $api.dom(".list-item-loading");
    $api.removeCls(elloading, 'l_hide');
  //  $api.addCls(elloading, 'l_show');

    pageMol.cateid = cateid;
    pageMol.pagesize = 1;
    pageMol.bindData();
}
