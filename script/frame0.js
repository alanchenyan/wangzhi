var pageMol={
	  tvv:null,
		xvv:null,
		lvv:null,
		Titemlist:[],			//推荐数据
		Likeitemlist:[],     //猜你喜欢数据
		Xiaolianglist:[], //销量排行数据
		Tpagesize:1,
		Likepagesize:1,
		loading:false,
    tjcomplate:false,
		catelist:[],
		typeid:0,

		keytype:0,      //当前查询词类型
		flashdata:[],
		initlize:function() {
				pageMol.flashdata = getSysInfo().home_flash;

				//初始化首页导航代码
				var navstr  =getSysInfo().nav_html;
				navstr = escape2Html(navstr);
				$api.html($api.dom("#swiper-daohang"),navstr);

				//初始化首页活动广告
				var datastr  =getSysInfo().active_html;
				datastr = escape2Html(datastr);
				$api.html($api.dom(".fashion"),datastr);
				/********************滚动刷新***********************/
	     api.addEventListener({
				 name: 'scrolltobottom',
					extra: {threshold: 50}
	      }, function(ret, err){

	          //继续加载下一页
						if(!pageMol.tjcomplate || pageMol.Titemlist.length == 0)
						{
								  pageMol.Tpagesize++;
									if(pageMol.typeid == 0)
									{
											pageMol.bindTjData();
									}else {
											pageMol.BindKeyList();
									}
						}

	      })


		},

		//初始化头部颜色
		inittitlecolor:function(index){

				var box=document.getElementById('head');
				var maincolor = pageMol.flashdata[index].maincolor
				box.style.background=maincolor;
				api.sendEvent({name: 'changecolor_event',extra:maincolor });
		},

		complate:function(){
      var elloading = $api.dom(".list-item-loading");
      $api.addCls(elloading, 'l_hide');
      var elbootom = $api.dom(".databootom");
      $api.addCls(elbootom, 'l_show');
      pageMol.loadcomplate = true;
    },
		/*******************绑定数据****************************/
		bindTjData:function()
		{
			var elloading = $api.dom(".list-item-loading");
			$api.addCls(elloading, 'l_show');
			var parms = {
					//url:"taokeapi/gettuijian/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.Tpagesize,
					url:"taokeapi2/getitemlist2/minid/"+pageMol.Tpagesize,
					callback:function(ret){
							if(ret.flag && !ret.data.code)
							{
								var dataModel = ret.data.data;
								pageMol.Tpagesize = ret.data.min_id;

								 for(var i = 0; i < dataModel.length; i++)
								 {
										var info = dataModel[i];
										info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
										info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
										pageMol.Titemlist.push(info);
								 }
								 	pageMol.tvv.data = pageMol;
									pageMol.tjcomplate = false;
									var th_dom = $api.dom("#el_tj_list");
									Vue.nextTick(function(){
			                //缓存图片
			                imageCache(th_dom);
											//返利隐藏
 										  hide_div(th_dom);
			            });
							}
							else {
									alert("数据加载完成");
									pageMol.complate();
									pageMol.tjcomplate = true;

							}
					}
			}
			JM_GET(parms);
		},



		//绑定顶部分类导航;;关键词导航
		BindKeyList:function()
		{
			var parms = {
					url:"taokeapi/getitembykey/devicevalue/"+getDeviceValue()+"/pagenumber/"+pageMol.Tpagesize+"/keystype/"+pageMol.typeid,
					callback:function(ret){
							if(ret.flag )
							{
								var dataModel = ret.data;

								 for(var i = 0; i < dataModel.length; i++)
								 {
										var info = dataModel[i];
										info.commissionrate1 = clcrate1(info.commissionrate,info.newprice);
										info.commissionrate2 = clcrate2(info.commissionrate,info.newprice);
										pageMol.Titemlist.push(info);
								 }
									pageMol.tvv.data = pageMol;
									pageMol.tjcomplate = false;
									var th_dom = $api.dom("#el_tj_list");
									Vue.nextTick(function(){
											//缓存图片
											imageCache(th_dom);
									});
							}
							else {
									alert("数据加载完成");
									pageMol.complate();
									pageMol.tjcomplate = true;

							}
					}
			}
			JM_GET(parms);
		},

		//红包判断
		isRedpack:function()
		{
			var isRedpack = api.getPrefs({sync: true,key: 'isRedpack1'});
 
			if(!isRedpack || isRedpack == ''){

				api.openFrame({
						name: 'frame_redpack',
						url: 'widget://html/dialog/frame_redpack.html',
						bgColor:'rgba(0,0,0,0.5)',
						rect: {
								x: 0,
								y: 0,
								w: api.winWidth,
								h: api.winHeight
						},
						animation:{
								type:"movein",
								subType:"from_top",
								duration:50
						},
						bounces:false
				});
			}

			/*var parms = {
					url:"userext/isredpack/token/"+usermgr.get_usertoken(),
					callback:function(ret){

					}
			}
			JM_GET(parms);*/

		}



};


/* 当前页面高度 */
function pageHeight() {
    return document.body.scrollHeight;
}
/* 当前页面宽度 */
function pageWidth() {
    return document.body.scrollWidth;
}

//获取商品内容页面
function getindexitem(typeid)
{
		var tab_nav_list = $api.domAll('.tab_nav div');
	  for (var i = 0; i < tab_nav_list.length; i++) {
					$api.removeCls(tab_nav_list[i], 'sel');
		}
		$api.addCls(tab_nav_list[typeid], 'sel');
		pageMol.Titemlist = Array();
		pageMol.tjcomplate = false;
		pageMol.Tpagesize = 1;
		pageMol.typeid = typeid;
		if(typeid == 0)
		{
				pageMol.bindTjData();
		}else {
				pageMol.BindKeyList();
		}

}

//打开斗音
function openvoide(){
	api.openWin({
			name:'frame_voide_index',
			url: 'widget://html/frame_video_item.html',

	});
}

//打开早起红包挑战
function openzaoqi(){
	 toast2("暂未开放!敬请期待");
}

//打开线报
function openxb(){
	api.openWin({
			name:'frame_xianbao',
			url: 'widget://html/huodong/frame_xianbao.html',

	});

}
