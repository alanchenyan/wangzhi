var pageMol={
    dvv:null,     //vue数据渲染
    loadcomplate: false, //数据是否加载完成
    pagesize:1,    //当前加载的页面
    dataitem:[],   //数据列表
    timedata: [],
    starttime:0,
    endtime:0,

    complate:function(){
      //var elloading = $api.dom(".list-item-loading");
      //$api.addCls(elloading, 'l_hide');

    },

    initlize:function() {
      //初始化抢购时间
      pageMol.timedata[0]="0:8";
      pageMol.timedata[1]="8:12";
      pageMol.timedata[2]="12:14";
      pageMol.timedata[3]="14:18";
      pageMol.timedata[4]="18:21";
      pageMol.timedata[5]="21:0";
      var html_str ='';

      //<span class="swiper-slide" data-type="2513" data-check="0" data-types="1"> <label> 13:00</label> <p>已开抢</p> </span>
      var oDate = new Date();
      for (var i = 0; i < pageMol.timedata.length; i++) {

          var str = pageMol.timedata[i];
          var arr=str.split(':');
          var curr_hour = oDate.getHours();
          var titleste = "";
          if( Number(arr[0]) < 10){
            titleste = "0"+arr[0]+":00";
          }else{
            titleste = arr[0]+":00";
          }

          if(curr_hour >= Number(arr[0]) &&  curr_hour < Number(arr[1]) )
          {
            //在时间范围内；
              pageMol.starttime =Number(arr[0]);
              pageMol.endtime =Number(arr[1]);
              html_str +='<span class="swiper-slide" data-type="'+i+'" data-check="1" data-types="1"> <label> '+titleste+'</label> <p>正在疯抢</p> </span>';
          }
          else if(curr_hour >= Number(arr[0])  )  {
              html_str +=' <span class="swiper-slide" data-type="'+i+'" data-check="0" data-types="1"> <label> '+titleste+'</label> <p>已开抢</p> </span>';
          }
          else {
              html_str +=' <span class="swiper-slide" data-type="'+i+'" data-check="0" data-types="1"> <label> '+titleste+'</label> <p>即将开抢</p> </span>';
          }
      }
      document.getElementById('timenav_str').innerHTML =html_str;

      //滚动刷新
      api.addEventListener({
          name: 'scrolltobottom',
          extra: {threshold: 50}
       }, function(ret, err){
            if(!pageMol.loadcomplate){
                pageMol.pagesize ++;
                pageMol.BindData();
            }

       })

       $(".swiper-slide[data-check='1']").css("backgroundColor","#fff");
       $(".swiper-slide[data-check='1']").find("p").css("color","#fe4a65");
       $(".swiper-slide[data-check='1']").find("label").css("color","#fe4a65");

       var creIndex = $(".swiper-slide[data-check='1']").index()-1;
       var mySwiper = new Swiper('.swiper-container',{
           direction:"horizontal",
           slidesPerView:4,
           initialSlide :creIndex,
       })
       $('.swiper-slide').click(function(){
           //获取当前开始时间
           var timestr = pageMol.timedata[mySwiper.clickedIndex];
           var arr=str.split(':');
           pageMol.starttime =Number(arr[0]);
           pageMol.endtime =Number(arr[1]);

           mySwiper.slideTo(parseInt(mySwiper.clickedIndex-1), 1000, false);
           //加载数据
           pageMol.dataitem = Array();
           pageMol.loadcomplate = false;
           pageMol.pagesize = 1;
           pageMol.BindData();
       })

   //
       $(".swiper-slide").click(function(){
           $(".swiper-slide").css("backgroundColor","#fe4a65");
           $(".swiper-slide").find("p").css("color","#fff")
           $(".swiper-slide").find("label").css("color","#fff")


           $(this).css("backgroundColor","#fff");
           $(this).find("p").css("color","#fe4a65");
          $(this).find("label").css("color","#fe4a65");

           var types=$(this).attr("data-types");
           var type=$(this).attr("data-type");
           //alert(type);
           $(".jiaz").css("display","block");
            // getlist(type,types);
            //加载数据
       });

    },

    //绑定数据
    BindData:function()
    {
      var parms = {
          url:"taokeapi/getqgitem//pagenumber/"+pageMol.pagesize+"/starttimie/"+pageMol.starttime+"/endtime/"+pageMol.endtime,
          callback:function(ret){
              if(ret.flag && !ret.data.code)
              {

                 var dataModel = ret.data.results.results;
                 for(var i = 0; i < dataModel.length; i++)
                 {
                    var info = dataModel[i];
                    info.pic_url = info.pic_url+"_310x310.jpg";
                    info.zk =  ((info.zk_final_price/ info.reserve_price)*10).toFixed(1);
                    info.leftnum = (info.total_amount - info.sold_num);

                    //计算余量百分比
                    info.yliang = (info.leftnum/info.total_amount)*100;
                    info.yliang = Number(info.yliang);

                    pageMol.dataitem.push(info);
                 }
                  pageMol.dvv.data = pageMol;
                  var th_dom = $api.dom("#list_box");
                  Vue.nextTick(function(){
                      //缓存图片
                      imageCache(th_dom);
                  });


              }
              else {
                  pageMol.complate();
              }
          }
      }
      JM_GET(parms);
    },

}
