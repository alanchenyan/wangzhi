  var voidcount = 2;
	var voideurl=[];
	voideurl[0]= "http://video.haodanku.com/48cef148e15d3f4ed09dcfc807d4e6b3?attname=1562213260.mp4";
	voideurl[1]= "http://video.haodanku.com/142fa4941299283beeefb74bdc081492?attname=1562213261.mp4";
	voideurl[2]= "http://video.haodanku.com/1b9e78c7284615af5f5bc04a904fd124?attname=1562235646.mp4";
	var douyindata=[];

	var mySwiper = null;
	var item_index = 0;
	var item_index2 = 0;
	var plyers=[];
	var curr_player = null;
	var last_player = null;
	var next_player = null;

	function create_next_slide(){
		var top = $(document).scrollTop();
    $(document).on('scroll.unable',function (e) {
        $(document).scrollTop(top);
    })



		 item_index = item_index +1;
		 mySwiper.addSlide(item_index, '<div class="swiper-slide"><video id="example_video_'+item_index+'" class="video-js voidcls"></video></div>');
		 plyers[item_index] = videojs('example_video_'+item_index,{
				muted: true,
				height: api.frameHeight,
				width:api.frameWidth,
				controls:false,
				muted:false,
				controls:false,
				//autoplay:true,
				loop:true,
		 });
		 videojs("example_video_"+item_index).ready(function() {
		                 var myPlayer = this;
		  							 console.log("下一个url:"+douyindata[item_index].dy_video_url+" index:"+item_index);
		                 myPlayer.src(douyindata[item_index].dy_video_url); /*动态设置video.js播放的地址。*/
		 });
	}


	apiready = function () {
		  var frameHeight = api.frameHeight;
		  var frameWidth  = api.frameWidth;
			var dm= $api.dom(".videotitle");
			var offset = $api.offset($api.dom(".radio-footer"));
			frameHeight = frameHeight -offset.h;
			//$api.css(dm,"top:"+api.frameHeight+"px");
			//alert(api.pageParam.voide);
      initScrillDiv();


			mySwiper = new Swiper('.swiper-container', {
				autoplay: false,//可选选项，自动滑动
				direction : 'vertical',
				height:  api.frameHeight-60,
				width: api.frameWidth,
				slidesPerView : 1,

				on: {
			    slideChangeTransitionStart: function(){
							  if(this.activeIndex > voidcount){
									 mySwiper.slidePrev();
									 return;
								}
							 console.log("activeIndex:"+this.activeIndex);
							 last_player = plyers[this.previousIndex]
							 curr_player = plyers[this.activeIndex];
							 item_index2=this.activeIndex;
							 last_player.pause();
							 curr_player.play();
							 if(this.activeIndex > this.previousIndex){
								 	 create_next_slide();
							 }
							 initUIinfo();

			    },
				}

			})


			plyers[item_index] = videojs('example_video_'+item_index,{
				 muted: true,
				 height: api.frameHeight,
				 width:api.frameWidth,
				 controls:false,
				 muted:false,
				 controls:false,
				 autoplay:true,
				 loop:true,
			});
			//初始化斗音数据
			initdy(function(){
					videojs("example_video_"+item_index).ready(function() {
					                var myPlayer = this;
													console.log("当前url:"+douyindata[item_index].dy_video_url+" index:"+item_index);
					                myPlayer.src(douyindata[item_index].dy_video_url); /*动态设置video.js播放的地址。*/
					             		initUIinfo();
													create_next_slide();
					});


			});







	}

  //初始化滚动列表
  function initScrillDiv(){
    var htmlstr="<ul>"
    for (var i = 0; i < 20; i++) {
         var rdindex = randomNum(0,names.length);
         var nicknames = names[rdindex];
         var rd = randomNum(0,10);
         var str=""
         if(rd<5){
            str= "<li><div class = 'go-bye-box'><span class = 'go-bye-left'>正在观看</span><span class = 'go-bye-right'>"+nicknames+"</span></div></li>";
         }
         else if(rd == 6 || rd == 7){
           str= "<li><div class = 'go-like-box'><span class = 'go-like-name'>"+nicknames+"</span><span class = 'go-like-title'>喜欢了这个商品</span></div></li>";
         }else{
           str= "<li><div class = 'go-byed-box'><span class = 'go-byed-left'>已购买</span><span class = 'go-byed-right'>"+nicknames+"</span></div></li>";
         }
         htmlstr = htmlstr +str;
    }
    htmlstr = htmlstr +"</ul>";
    var dm= $api.dom("#scrollDiv");
    $api.html(dm,htmlstr);

    $("#scrollDiv").Scroll({line:1,speed:500,timer:2000});
  }

   $(document).ready(function(){
        $("#scrollDiv").Scroll({line:1,speed:500,timer:2000});
	});

	//初始化界面信息
	function initUIinfo() {
			var dyinfo = douyindata[item_index2];
			if(dyinfo){
				$api.attr($api.dom(".footer-img"),'src',dyinfo.itempic+"_100x100.jpg");
				$api.text($api.dom("#el_1"),dyinfo.itemendprice);
				$api.text($api.dom("#el_2"),dyinfo.couponmoney);
				$api.text($api.dom("#el_3"),clcrate1(dyinfo.tkrates,dyinfo.itemendprice));
				$api.text($api.dom(".footer-old-price"),dyinfo.itemprice);
				$api.text($api.dom(".videotitle"),dyinfo.dy_video_title);
        $api.text($api.dom(".zans"),changeW(dyinfo.itemsale));
			}
	}

	function onbuy(){
			var dyinfo = douyindata[item_index2];
			open_good_detais_itemid(dyinfo.itemid)

	}


	//初始化斗音数据
	function initdy(call){
		var parms = {
				url:"taokeapi2/getdy",
				callback:function(ret){
						if(ret.flag)
						{
								var datas = ret.data.data;
								douyindata = datas;
								voidcount = datas.length;
								console.log("获取斗音数据量:"+voidcount);
								call();
						}
						else {

						}
				}
		}
		JM_GET(parms);

	}

   function autopersent(){
   		var x = 60;
		var y = 0;
		var num = Math.floor(Math.random() * 7 + 1);
		var index=$('.persent-box').children('img').length;
		var rand = parseInt(Math.random() * (x - y + 1) + y);

		$(".persent-box").append("<img class = 'persent-img' src=''>");
		$('.persent-img:eq(' + index + ')').attr('src','../image/auto/'+num+'.png')
		$(".persent-img").animate({
			bottom:"300px",
			opacity:"0",
			left: rand,
		},3000)

		// ++i;

		// if (i == 5) {
		// 	// alert('1');
		// 	var n_html = '<p class = "persent-btn"></p>';
		// 	$(".persent-box").html(n_html);
		// 	i =0;
		// }

		if (index > 5) {
				$('.persent-img:eq(' + 1 + ')').remove();
		}
   }

   	setInterval(autopersent, 500);
