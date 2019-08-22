apiready = function () {
       
}  

//模拟从后台获取到头部推荐分类数组集合
var classify_data =new Array()
classify_data[0]="商城推荐";
classify_data[1]="全网搜索";

var swiper = new Swiper('#swiper-container-one', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            // return '<span class="' + className + '">' + (index + 1) + '</span>';
            return '<span class="' + className + '">' + (classify_data[index]) + '</span>';
        },
      },
      observer:true,
      observeParents:true,
      //监听滚动事件
      on:{
        slideChangeTransitionStart: function () {
            // console.log(this.realIndex);
            var swiper_index = this.realIndex;
            
            // swiper-slide-active
            var slide_height = $("#swiper-container-one").find(".swiper-wrapper").find(".swiper-slide-active").find(".slide-box").height();
            // alert(slide_height);
            $('#swiper-container-one').css('height',slide_height+'px');

            // //滚动条定位
            // if (swiper_index== 1) {
            //     $(".swiper-pagination").scrollLeft(swiper_index * 1);
            // }else if(swiper_index ==10) {
            //      $(".swiper-pagination").scrollLeft(swiper_index * 38);
            // }else if (swiper_index==9){
            //      $(".swiper-pagination").scrollLeft(swiper_index * 35);
            // }else{
            //     $(".swiper-pagination").scrollLeft(swiper_index * 30);
            //     $(".swiper-container-two").css("display","none");
            // }
            
        }
      },

});
