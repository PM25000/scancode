// pages/notScanList/notScanList.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        labelId:'',
        labels:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptLabelId', (data) => {
            console.log(data.tsql)
            this.setData({
                tsql:data.tsql,
            })
            wx.request({
                url: 'http://120.25.152.151:8080/index.php', 
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                dataType: "json",
                data: { 
                    tsql: data.tsql,
                    uid: "sa",
                    pwd: "xkdsa",
                    offset: "-1",
                },
                success: (res) => {
                    console.log(res.data);
                    wx.showToast({
                        title: '查询成功！！！',
                        icon: 'success',
                        duration: 1500
                    })
                    this.setData({
                        ret: res.data,
                    })
                    console.log(res.data);
                }
            })
        })
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