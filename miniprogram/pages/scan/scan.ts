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
//         let tsql=`SELECT BILL_DET.DELIVER_LIST_NO,   
//         BILL_DET.BILL_COD,   
//         PRO_CD = MAT_MASTER.MAT_NAME,   
//         new_start_mat_code = MAT_MASTER.new_start_mat_code,
//         BILL_DET.ORDER_NO,    
//         BILL_DET.CT_CD,    
//         in_NUM = BILL_DET.in_NUM,       
//         BILL_DET.box_no,        
//         BILL_DET.detail_note,  
//         BILL_DET.pro_cd,     
//         BILL_DET.mat_type,   
//         mat_name = MAT_MASTER.SPEC_TYPE_NO,  
//         BILL_DET.note_no,   
//         BILL_DET.mat_unit,        
//         customer_code = CUSTOM.customer_code,  
//         CST_NAME = CUSTOM.CST_NAME, 
//         cst_two = CT_ORDER.CST_CODE, 
//         CT_ORDER.custom_order_no, 
//         BILLOFLADING.SEND_DATE,
//          money_code = CT_ORDER.money_code ,
//         USER_MATCODE  = customer_mat.USER_MATCODE   , 
//         cus_type = customer_mat.USER_spec_type_no   ,
//         com_name = case when BILLOFLADING.storage_no = '2' then '宇锋' else '大锋' end   ,
//         ct_od.bz,
//         ct_od.xp_type,
//         scan_amt = BILL_DET.scan_amt,
//         scan_date = BILL_DET.scan_date,
//         scan_man = BILL_DET.scan_man,
//         customer_add = BILLOFLADING.customer_add
//    FROM BILL_DET left outer join (ct_od inner join CT_ORDER on ct_od.ORDER_NO = CT_ORDER.ORDER_NO)  on  BILL_DET.ct_cd = ct_od.ct_cd and 
//                                            BILL_DET.ORDER_NO = ct_od.order_no             
//          left outer join customer_mat with(nolock) on ct_od.usermat_id = customer_mat.id,  
//         BILLOFLADING,
//          MAT_MASTER,
//         CUSTOM 
//   WHERE BILLOFLADING.DELIVER_LIST_NO = BILL_DET.DELIVER_LIST_NO and
//         BILL_DET.mat_type = MAT_MASTER.MAT_CODE  AND        
//         BILLOFLADING.CUSTOMER_CODE = CUSTOM.CUSTOMER_CODE and         
//           BILL_DET.DELIVER_LIST_NO =  'SH2022021602'`;
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