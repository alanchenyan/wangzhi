var pageMol={
    cateid:0,
    itemTM:[],  //天猫的数据

    //初始化
    initlize:function() {
        pageMol.binddata();

    },

    showProgress:function(){
      api.showProgress({
        title: '使劲加载中...',
        text: '粉喵每天都是双11...',
        modal: true
      });
    },

    //初始化所有数据
    binddata:function(){
      pageMol.showProgress();

      var parms = {
          url:"brandc/getdata/cateid/"+pageMol.cateid,
          callback:function(ret){
              if(ret.flag)
              {
                  api.hideProgress();
                  var dataModel = ret.data;
                  var htmlstr = "";
                  itemTM = dataModel;
                  for(var i = 0; i < dataModel.length; i++)
                  {
                     var info = dataModel[i];
                     htmlstr += '<div class="aui-col-xs-3" onclick="openBrandUrl('+info.id+')"><img src="../image/thum1.png"  id="img_cache_s" data-url="'+info.imgs+'"    class = "nav-icon"><div class="aui-grid-label">'+info.name+'</div><p class = "icon-span"><span class ="scal-span">平均返利'+info.rebate+'%</span></p></div>';

                  }
                  $api.html($api.dom("#tmlist"),htmlstr);
                  var cache_el = $api.domAll('#img_cache_s');
                  imageCache2(cache_el);
              }
              else {
                //  pageMol.complate();
              }
          }
      }
      JM_GET(parms);
    }

}

//打开品牌天猫店
function openBrandUrl(brandid)
{
    brandid = brandid-1;

    var brand_url = itemTM[brandid].urls;
    openBrowser(brand_url,itemTM[brandid].name)
   
}
