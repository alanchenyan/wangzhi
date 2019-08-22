var pageMol ={
    dvv:null,     //vue数据渲染
    dvv2:null,     //vue数据渲染
    pageindex1:1,
    pageindex2:1,
    currtype:1, //当前类型  1-直接 2-间接
    loadcomplate1:false,
    loadcomplate2:false,
    datalist:[],
    datalist2:[],

    //初始化
    initlize:function(){
      pageMol.currtype = 1;
      //滚动刷新
      api.addEventListener({
          name: 'scrolltobottom',
          extra: {threshold: 50}
       }, function(ret, err){
           if(pageMol.currtype == 1){
              //直接
              if(!pageMol.loadcomplate1){
                pageMol.pageindex1++;
                pageMol.getFansi(0);
              }

           }
           else {
             if(!pageMol.loadcomplate2){
               pageMol.pageindex2++;
               pageMol.getFansi(-1);
             }
           }

       })

    },

    getFansi:function(userid){
        api.showProgress({title: '努力加载中...',text: '',modal: false});
        var index = 1;
        if(userid == 0)
            index  = pageMol.pageindex1;
        else {
            index  = pageMol.pageindex2;
        }
        var parms = {
            url:"user/getfansinum/userid/"+userid+"/token/"+usermgr.get_usertoken()+"/pageindex/"+index,
            callback:function(ret){
                api.hideProgress();
                if(ret.flag)
                {
                    if(userid == 0 && ret.data.length > 0){
                      for (var i = 0; i < ret.data.length; i++) {
                            var info = ret.data[i];
                            pageMol.datalist.push(info);
                      }
                      if(pageMol.datalist.length == 0){
                          $api.removeCls($api.dom(".nofansi"), 'l_hide');
                      }

                    }
                    else {
                        pageMol.loadcomplate1 = true;
                    }

                    if(userid == -1 && ret.data.length > 0){
                      //间接粉丝
                      for (var i = 0; i < ret.data.length; i++) {
                            var info = ret.data[i];
                            pageMol.datalist2.push(info);
                      }

                    }
                    else {
                        pageMol.loadcomplate2 = true;
                    }


                }
                else {
                  //  pageMol.complate();
                }
            }
        }
        JM_GET(parms);
    }



}
