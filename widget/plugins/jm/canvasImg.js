var CanvasImg = {
    fsimg:[],
    fsimgthum:[], //缩略图的大小
    imagelist:[],
    downindex:0,

    shareimags:[],
    shareimagsdata:[],
    sharecount:0,
    sharesumcount:0,
    //转换商品分享图
    //<canvas id="sharecanvas" style="background-color:white; width:80%;display: none;" class="am-text-center am-center"></canvas>
    //bgurl:背景图地址
    //itemtypeimg: 天猫 或者 淘宝路径
    //codeimg:二维码图片路径
    //iteminfo:{img. selnumm. newprice,couprice,oldprice}
    //issave: 是否保存本地
    canvasGoodsImg: function(bgurl,itemtypeimg,codeimg,iteminfo,issave=true,callback) {
        api.showProgress({title: '',text: '合成图片',modal: false});
        var canvas = document.getElementById('sharecanvas');
        //设置画布样式
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        canvas.width = 640;
        canvas.height = 1221;
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < imageData.data.length; i += 4) {
            // 当该像素是透明的，则设置成白色
            if (imageData.data[i + 3] == 0) {
                imageData.data[i] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        //console.log("背景图1");
        //图片背景图
        var bj_img = new Image();
        bj_img.setAttribute('crossOrigin', 'anonymous');
        bj_img.src = bgurl;
        //console.log("背景图2："+bgurl);
        bj_img.onload = function() {
            //console.log("背景图3");
            ctx.drawImage(bj_img, 0, 0, canvas.width, canvas.height);
            //物品的主图地址
            var item_img = new Image();
            item_img.setAttribute('crossOrigin', 'anonymous');
            item_img.src = iteminfo.itempic;
            item_img.onload = function() {
                ctx.drawImage(item_img, 42, 60, canvas.width-85, canvas.width-50);
                //二维码地址
                var code_img = new Image();
                code_img.setAttribute('crossOrigin', 'anonymous');
                code_img.src = codeimg;

                code_img.onload = function() {
                    ctx.drawImage(code_img, canvas.width - 225, canvas.height-260, 175, 175);
                    console.log('二维码地址:' + code_img.src);
                    /*商品的图标*/
                    var shoptype = "B";
                    var tb_img = new Image();
                    tb_img.setAttribute('crossOrigin', 'anonymous');
                    tb_img.src = itemtypeimg;

                    tb_img.onload = function() {
                        ctx.drawImage(tb_img, canvas.width - 590, canvas.width+20, 35, 35);
                        //商品标题
                        var str = iteminfo.itemtitle;
                        ctx.fillStyle = '#605761';
                        ctx.lineWidth = 1;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = "top";
                        ctx.font = '26px 微软雅黑';
                        var lineWidth = 0;
                        var canvasWidth = canvas.width - 60; //计算canvas的宽度
                        var initHeight = canvas.width+19; //绘制字体距离canvas顶部初始的高度
                        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
                        var curr_hang = 0
                        for (var i = 0; i <= str.length; i++) {
                            lineWidth += ctx.measureText(str[i]).width;
                            if (lineWidth > canvasWidth - 120) {
                                curr_hang++;
                                ctx.fillText(str.substring(lastSubStrIndex, i), 100, initHeight); //绘制截取部分
                                initHeight += 40; //字体的高度
                                lineWidth = 0;
                                lastSubStrIndex = i;
                            }
                            if (i == str.length - 1) {
                                curr_hang++;
                                ctx.fillText(str.substring(lastSubStrIndex, i + 1), 100, initHeight);
                            }
                        }
                        initHeight = canvas.width+60;
                        /*销量*/
                       var price = changeW(iteminfo.sellnum);
                        ctx.fillStyle = '#aba0ac';
                        ctx.textAlign = 'left';
                        ctx.font = '22px 微软雅黑';
                        ctx.textBaseline = "top";
                        ctx.fillText(price, 120, initHeight + 93);

                        /*卷后价格*/
                        var price =0;
                        var y = String(iteminfo.newprice).indexOf(".") + 1;
                        if(y <=0){
                            price = "¥ "+iteminfo.newprice+".0";
                        }else {
                            price = "¥ "+iteminfo.newprice;
                        }

                        ctx.fillStyle = 'red';
                        ctx.textAlign = 'left';
                        ctx.font = '55px Helvetica';
                        ctx.textBaseline = "top";
                        ctx.fillText(price, 400, initHeight + 138);

                        /*原价格*/
                         var price = "¥ "+iteminfo.itemprice;
                        ctx.fillStyle = '#aba0ac';
                        ctx.textAlign = 'left';
                        ctx.font = '20px Helvetica';
                        ctx.textBaseline = "top";
                        ctx.fillText(price, 500, initHeight + 93);
                        /*删除线*/
                      ctx.strokeStyle = '#aba0ac';
                        ctx.lineWidth = 1; // 改变线的粗细
                        ctx.moveTo(561, initHeight + 102); // 起始点
                        ctx.lineTo(500, initHeight + 102); // 第二点(如果是一条直线的话，就是终点)
                        ctx.stroke();


                        /*秘券金额*/
                         var end_price = "¥ "+iteminfo.couponprice;
                        ctx.fillStyle = '#FFF';
                        ctx.textAlign = 'left';
                        ctx.font = '25px Helvetica';
                        ctx.textBaseline = "top";
                        ctx.fillText(end_price, 135, initHeight + 147);
                        /*保存为图片*/
                        var image = new Image();
                        image.setAttribute('crossOrigin', 'anonymous');
                      //  image.src = canvas.toDataURL("img/png");
                        var imagedata = canvas.toDataURL("img/png");

                        console.log("合成成功:"+imagedata);
                        if(!issave){
                            callback(0,imagedata);
                            return;
                        }
                        //document.getElementById('testimg').src = imagedata;
                        //保存图片
                        var trans = api.require('trans');
                        imagedata=imagedata.replace('data:image/png;base64,','')
                        trans.saveImage({
                            base64Str: imagedata,
                            imgPath:"fs://jmimg/",
                            imgName:iteminfo.itemid+"_jm.png",
                        }, function(ret, err) {
                            if (ret.status) {
                                console.log("保存合成图:"+JSON.stringify(ret));
                                callback(0,"fs://jmimg/"+iteminfo.itemid+"_jm.png");
                            } else {
                                callback(1,"fs://jmimg/"+iteminfo.itemid+"_jm.png");
                            }
                        });
                        api.hideProgress();

                    }

                }

            }

        }

    },


    //分享图的合成
    canvasShareImg:function(info,codeimg,yqm,callback){
      //  api.showProgress({title: '',text: '生成海报',modal: false});
        var canvas = document.getElementById('sharecanvas');
        console.log("地址:"+info.url)
        //设置画布样式
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        canvas.width = 1080;
        canvas.height = 1920;
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        //图片背景图
        var bj_img = new Image();
        bj_img.setAttribute('crossOrigin', 'anonymous');
        bj_img.src = info.url;
        bj_img.onload = function() {
          ctx.drawImage(bj_img, 0, 0, canvas.width, canvas.height);
          //二维码地址
          var code_img = new Image();
          code_img.setAttribute('crossOrigin', 'anonymous');
          code_img.src = codeimg;
          code_img.onload = function() {
              ctx.drawImage(code_img, info.x, info.y, info.w, info.h);
              //邀请码文字
             var yamstr = "邀请码:"+yqm;
             ctx.textAlign = 'left';
             ctx.font = 'bold 60px normal';
             ctx.fillStyle = '#000';
             ctx.fillText(yamstr, info.x1, info.y1, info.w1, info.h1);
             /*保存为图片*/
             var image = new Image();
             image.setAttribute('crossOrigin', 'anonymous');
             var imagedata = canvas.toDataURL("img/jpg");
             var imagedata2=imagedata.replace('data:image/png;base64,','')
             var trans = api.require('trans');
             var filename = "juanmi_"+CanvasImg.sharecount+"_shareimg.png";
             console.log("filename:"+filename);
             trans.saveImage({
                   base64Str: imagedata2,
                   imgPath:"fs://jmimg/",
                   imgName:filename,
             }, function(ret, err) {
                 if (ret.status) {
                    var imgpah = "fs://jmimg/"+filename;
                    console.log("分享图路径fs:"+imgpah);
                    if(CanvasImg.sharecount == CanvasImg.sharesumcount-1){
                       //递归完成
                       CanvasImg.shareimagsdata.push("jmimg/"+filename);
                       callback(CanvasImg.shareimagsdata);
                       return true;
                    }
                    else {
                       CanvasImg.shareimagsdata.push("jmimg/"+filename);
                       CanvasImg.sharecount++;
                       CanvasImg.canvasShareImg(CanvasImg.shareimags[CanvasImg.sharecount],codeimg,yqm,callback);
                    }
                 }
             });



          }
        }
    },



    downImgsinfo:function(url,callback){
        console.log("开始下载:"+url+" 索引:"+CanvasImg.downindex);
        var hz = url.substring(url.length-4);
        var filename = hex_md5(url)+hz;
        api.download({
            url: url,
            savePath: 'fs://'+filename,
            cache: true,
            allowResume: true
          }, function(ret, err) {
              //0：下载中、1：下载完成、2：下载失败
              if(CanvasImg.imagelist.length == 1){
                  CanvasImg.fsimg.push('fs://'+filename);
                  callback(CanvasImg.fsimg);
                  return true;
              }
              if(CanvasImg.downindex == CanvasImg.imagelist.length-1){
                  //全部下载完成；返回给上层
                  console.log("下载完成 总共有"+CanvasImg.fsimg.length+" url :"+filename);
                  callback(CanvasImg.fsimg);
                  return true;
              }

              if (ret.state == 1) {
                  //微信分析缩略图不能超过32kb；这里做下判断
                  CanvasImg.fsimg.push('fs://'+filename);
                  console.log("下载成功 文件:fs://"+filename + " size:"+CanvasImg.fsimg.length);
                  CanvasImg.downindex++;
                  return CanvasImg.downImgsinfo(CanvasImg.imagelist[CanvasImg.downindex],callback)//递归自己
              }
              if(ret.state == 2){
                CanvasImg.downindex++;
                return CanvasImg.downImgsinfo(CanvasImg.imagelist[CanvasImg.downindex],callback)//递归自己
              }

          });
    },


    //网络图片下载
    //图片列表方式
    downImgs:function(imagelist,callback){
      if(imagelist.length<=0){
          return false;
      }
      CanvasImg.imagelist = Array();
      for (var i = 0; i < imagelist.length; i++) {
         CanvasImg.imagelist.push(imagelist[i]);
      }
      CanvasImg.fsimg = Array();
      CanvasImg.downindex = 0;
      CanvasImg.downImgsinfo(CanvasImg.imagelist[CanvasImg.downindex],callback);
    },


    //打开图片浏览器
    //imagelist:图片数组
    //index:显示的索引
    openBrowserImg:function(imagelist,index){
        var photoBrowser = api.require('photoBrowser');
        photoBrowser.open({
              images:imagelist,
              placeholderImg: 'widget://image/thum.png',
              bgColor: '#000',
              activeIndex:index
          }, function(ret, err) {
              if (ret.eventType == 'click') {
                  photoBrowser.close();
                  api.closeFrame({
                      name: 'frame_photo'
                  });

              }
              if (ret.eventType == 'change') {
                api.sendEvent({
                  name: 'photo_currindex',
                  extra: {index: ret.index,currurl:imagelist[ret.index]}
                });
              }
              if (ret.eventType == 'longPress') {
                  //长按图片提示
              }
              if (ret.eventType == 'show') {
                //  photoBrowser.setIndex({
                //        index: index
                //  });


                  var ull = "../frame_imgphoto.html";
                  api.openFrame({
                    name: 'frame_photo',
                    url: ull,
                    bgColor:'rgba(51,51,51,0)',
                    rect: {
                        x: 0,
                        y: api.winHeight -50,
                        w: 'auto',
                        h: '50'
                    },
                    pageParam: {
                        currindex: index,
                        sunnum:imagelist.length,
                        currurl:imagelist[index],
                    }
                });

               }
          });
          //打开图片的 frame



    },

}
