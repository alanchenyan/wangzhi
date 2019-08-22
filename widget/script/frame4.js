var pageMol={



		//获取统计的基本数据
		get_base_order:function(){
				api.showProgress({title: '努力加载中...',text: '',modal: false});
				var parms = {
					url:"order/getbasedata/token/"+usermgr.get_usertoken(),
					callback:function(ret){
							if(ret.flag)
							{
								var data = ret.data;
								$api.text($api.dom('#now-title-p_1'),data.today.toFixed(2) );
								$api.text($api.dom('#now-title-p_2'),data.yesterday.toFixed(2));
								$api.text($api.dom('#now-title-p_3'),data.fansinum);
								api.hideProgress();
							}
							else {
								//  pageMol.complate();
							}
					}
		 	}
			JM_GET(parms);

		},


}



	var swiper_thr = new Swiper('#swiper-container-thr', {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination-thr',
        clickable: true,
      },
	  observer:true,
      observeParents:true,
    });
