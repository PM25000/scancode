// pages/scan/scan.ts
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
            })

            setTimeout(() => {
                this.setData({
                    scanFunctionIsUseAble: true,
                
                })
            }, 100);
        }
        
    },


    handleScan()
    {
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log(res)
                this.setData({
                    [`res[${this.data.curId}]`]:res.result,
                })
                console.log(this.data.res[this.data.curId])
            },
            complete: () => {
                this.data.curId^=1;
                console.log(this.data.curId);
            }
        })
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log(res)
                this.setData({
                    [`res[${this.data.curId}]`]:res.result,
                })
                console.log(this.data.res[this.data.curId])
            },
            complete: () => {
                this.data.curId^=1;
                console.log(this.data.curId);
            }
        })
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

    }
})