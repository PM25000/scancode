// pages/query/query.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        res:[""],
        curId:0,
        scanFunctionIsUseAble: true,
        ret:[],
        time:'time',
        orderId: '',
        itemId: 0,
        total: 0,
        productId:String,
        specifications:String,
        count:Number,
        scanCount:Number,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    takeCode(e) {
        if (this.data.scanFunctionIsUseAble){
            console.log("开始扫码了: ");
            this.setData({
                scanFunctionIsUseAble: false,
            
            })
            
            var res = e.detail.result;
            
            console.log(res);
            
            this.setData({
                [`res[${this.data.curId}]`]:res,
                curId:this.data.curId^1,
            })

            setTimeout(() => {
                this.setData({
                    scanFunctionIsUseAble: true,
                
                })
            }, 1000);

            
            const innerAudioContext = wx.createInnerAudioContext({
                useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
            })
            innerAudioContext.src = 'music/aa.mp3'
            console.log(innerAudioContext.src)
            innerAudioContext.play()
        }
        
    },

    formSubmit(e){
        console.log(e.detail.value);
        this.setData({
            time:e.timeStamp,
        })
        let tsql = e.detail.value.tsql;
        console.log(this.data.time);
        console.log(tsql);

        wx.request({
            url: 'http://120.25.152.151:8080/index.php', 
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            dataType: "json",
            data: { 
                tsql: tsql,
                uid: "sa",
                pwd: "xkdsa",
            },
            success: (res) => {
                console.log(res.data);
                wx.showToast({
                    title: '提交成功！！！',
                    icon: 'success',
                    duration: 1500
                })
                this.setData({
                    ret: res.data,
                })
                console.log(res.data);
            }
          })
          console.log(this.data.ret);
    },
    last_item(e){
      var data=this.data.itemId;
      if (data>1) data -= 1;
      this.setData({
        itemId: data
      });
      this.updateInfo()
    },
    next_item(e){
      var data=this.data.itemId;
      if (data<this.data.total) data += 1;
      this.setData({
        itemId: data
      });
      this.updateInfo()
    },
    // orderIdInput: function(e){
    //     this.setData({
    //         orderId: e.detail.value
    //     })
    // },
    queryOrder(e){
        console.log(e.detail.value.orderId)
        this.setData({
            orderId: e.detail.value.orderId
        })

        let tsql=`SELECT BILL_DET.DELIVER_LIST_NO
   FROM BILL_DET
  WHERE BILL_DET.DELIVER_LIST_NO =  '${e.detail.value.orderId}'`;

        this.sqlQueryCnt(tsql,(cnt)=>{
            console.log(cnt)
            if(cnt!=0){
                this.setData({
                    itemId:1,
                    total:Number(cnt),
                })
                console.log(this.data.total)
                this.updateInfo()
            }
            else
            {
                this.setData({
                    itemId:0,
                    total:null,
                    productId:String,
                    specifications:String,
                    count:Number,
                    scanCount:Number,

                })
            }
        });
        


    },
    sqlQueryById(tsql:string,id:Number,t:Function){
        //console.log(tsql);
        wx.request({
            url: 'http://120.25.152.151:8080/index.php', 
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            dataType: "json",
            data: { 
                tsql: tsql,
                uid: "sa",
                pwd: "xkdsa",
                offset: id,
            },
            success: (res) => {
                console.log(res.data);
                wx.showToast({
                    title: '提交成功！！！',
                    icon: 'success',
                    duration: 1500
                })
                this.setData({
                    ret: res.data,
                })
                t(res.data)
                //console.log(res.data);
            }
          })
          //console.log(this.data.ret);
    },
    sqlQueryCnt(tsql:string,t:Function){
        //console.log(tsql);
        wx.request({
            url: 'http://120.25.152.151:8080/index.php', 
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            dataType: "json",
            data: { 
                tsql: tsql,
                uid: "sa",
                pwd: "xkdsa",
            },
            success: (res) => {
                console.log(res.data);
                wx.showToast({
                    title: '提交成功！！！',
                    icon: 'success',
                    duration: 1500
                })
                this.setData({
                    ret: res.data,
                })
                t(res.data.cnt)
                //console.log(res.data);
            }
          })
    },
    updateInfo(){
        
        let tsql=`SELECT new_start_mat_code = MAT_MASTER.new_start_mat_code,
        in_NUM = BILL_DET.in_NUM,       
        mat_name = MAT_MASTER.SPEC_TYPE_NO,  
        USER_MATCODE  = customer_mat.USER_MATCODE,
        scan_amt = BILL_DET.scan_amt
   FROM BILL_DET left outer join (ct_od inner join CT_ORDER on ct_od.ORDER_NO = CT_ORDER.ORDER_NO)  on  BILL_DET.ct_cd = ct_od.ct_cd and 
                                           BILL_DET.ORDER_NO = ct_od.order_no             
         left outer join customer_mat with(nolock) on ct_od.usermat_id = customer_mat.id,  
        BILLOFLADING,
         MAT_MASTER,
        CUSTOM 
  WHERE BILLOFLADING.DELIVER_LIST_NO = BILL_DET.DELIVER_LIST_NO and
        BILL_DET.mat_type = MAT_MASTER.MAT_CODE  AND        
        BILLOFLADING.CUSTOMER_CODE = CUSTOM.CUSTOMER_CODE and         
          BILL_DET.DELIVER_LIST_NO =  '${this.data.orderId}'`;
        //console.log(tsql);

        this.sqlQueryById(tsql,this.data.itemId-1,(data)=>{
            this.setData({
                productId:data.new_start_mat_code,
                specifications:data.mat_name,
                count:data.in_NUM,
                scanCount:data.scan_amt,
            })
        });



    }
})