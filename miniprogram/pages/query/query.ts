import { formatTime } from "../../utils/util";

// pages/query/query.ts
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        res:[""],
        scanRes:'',
        curId:0,
        scanFunctionIsUseAble: false,
        ret:{},
        time:'time',
        orderId: 'SH2022021602',
        itemId: 0,
        total: 0,
        billCod:0,
        productId:'',//产品编号
        specifications:'',//规格型号
        count:0,
        scanCount:0,
        matCode:'',//客户料号
        notScanCnt:0,
        notScanTsql:'',
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
        this.saveScanCnt()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        this.saveScanCnt()
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

    

    handleScan()
    {
        wx.scanCode({
            onlyFromCamera: true,
            scanType: ['barCode'],
            success: (res) => {
                this.setData({
                    orderId:'SH'+res.result,
                })
                this.queryOrder(null)
            },
            complete: () => {
            }
        })
    },


    takeCode(e) {
        if (!this.data.scanFunctionIsUseAble)
            return;
        if(e.detail.type!='qrcode'){
            return;
        }
        var res:string = e.detail.result;
        if(res==this.data.scanRes){
            return;
        }
        this.setData({
            scanFunctionIsUseAble: false,
            scanRes:res,
        })
        console.log(e);
        
        this.setData({
            [`res[${this.data.curId}]`]:res,
        })
        
        const innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        })
        innerAudioContext.src = 'music/aa.mp3'
        // console.log(innerAudioContext.src)
        innerAudioContext.play()

        if(this.data.curId==0){
            let resContext=res.split('*')[1]
            if(resContext==this.data.matCode || resContext==this.data.specifications){
                this.setData({
                    [`res[${this.data.curId+2}]`]:'',
                })
                setTimeout(() => {
                    this.setData({
                        scanFunctionIsUseAble: true,
                        curId:this.data.curId^1,
                    })
                }, 1200);
            }else{
                this.setData({
                    scanFunctionIsUseAble: true,
                    [`res[${this.data.curId+2}]`]:'客户标签型号与发货型号不符',
                })
                return;
            }
        }else{
            let tsql=`SELECT  spec_type_no, batch_no,
            pln_amt, mat_code,  print_date, if_scan, 
            scan_date
            FROM label_detail 
            WHERE label_detail.lab_id = '${res}'`
            console.log(tsql)
            this.sqlQueryById(tsql,0,(data)=>{
                if(data==null){
                    this.setData({
                        scanFunctionIsUseAble: true,
                        [`res[${this.data.curId+2}]`]:'查询规格型号失败',
                    })
                    return;
                }
                if(data.if_scan=='Y'){
                    this.setData({
                        scanFunctionIsUseAble: true,
                        [`res[${this.data.curId+2}]`]:'该标签已扫描',
                    })
                    return;
                }
                let resContext:string=data.spec_type_no.trim()
                this.setData({
                    [`res[${this.data.curId}]`]:resContext,
                })
                if(resContext!=this.data.specifications){
                    this.setData({
                        scanFunctionIsUseAble: true,
                        [`res[${this.data.curId+2}]`]:'入库标签型号与发货型号不符',
                    })
                    return;
                }
                this.setData({
                    [`res[${this.data.curId+2}]`]:'',
                    scanCount:this.data.scanCount+Number(data.pln_amt),
                })
                
                let tsql=`update label_detail
                set if_scan = 'Y',
                     scan_date = getdate()
                WHERE lab_id = '${res}'`
                console.log(tsql)
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
                        offset: -2,
                    },
                    success: (res) => {
                        console.log(res.data);
                        wx.showToast({
                            title: '查询成功！！！',
                            icon: 'success',
                            duration: 1500
                        })
                    }
                })

                if(this.data.notScanCnt==0){
                    let labelId=res.substr(0,10)+'%'
                    //console.log(labelId)
                    let tsql=`SELECT  lab_id, spec_type_no, batch_no,
                    pln_amt, mat_code,  print_date, if_scan, 
                    scan_date
                    FROM label_detail 
                    WHERE ( isnull(LABEL_DETAIL.IF_SCAN,'N') = 'N' ) And  
                    ( LABEL_DETAIL.LAB_ID like '${labelId}' ) And  
                    ( datediff(dd,LABEL_DETAIL.print_date,'${data.print_date.date}') = 0 )`
                    console.log(tsql)
                    this.setData({
                        notScanTsql:`SELECT  lab_id
                        FROM label_detail 
                        WHERE ( isnull(LABEL_DETAIL.IF_SCAN,'N') = 'N' ) And  
                        ( LABEL_DETAIL.LAB_ID like '${labelId}' ) And  
                        ( datediff(dd,LABEL_DETAIL.print_date,'${data.print_date.date}') = 0 )`,
                    })
                    this.sqlQueryCnt(tsql,(cnt)=>{
                        this.setData({
                            notScanCnt:cnt-1,
                        })
                    })
                }else{
                    this.setData({
                        notScanCnt:this.data.notScanCnt-1,
                    })
                    if(this.data.notScanCnt==0){
                        this.data.notScanTsql=''
                    }
                }
                setTimeout(() => {
                    this.setData({
                        scanFunctionIsUseAble: true,
                        curId:this.data.curId^1,
                        res:[''],
                    })
                }, 1200);
            })
            
        }

        this.setData({
            
        })

        
    },

    
    last_item(e){
        if(this.data.total==0)return;
        var data=this.data.itemId;
        if (data>1) data -= 1;
        this.setData({
            itemId: data
        });
        this.updateInfo()
    },
    next_item(e){
        if(this.data.total==0)return;
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
        if(e!=null){
            console.log(e.detail.value.orderId)
            this.setData({
                orderId: e.detail.value.orderId
            })
        }
        this.saveScanCnt()

        let tsql=`SELECT BILL_DET.DELIVER_LIST_NO
   FROM BILL_DET
  WHERE BILL_DET.DELIVER_LIST_NO =  '${this.data.orderId}'`;

        this.sqlQueryCnt(tsql,(cnt)=>{
            console.log(cnt)
            if(cnt!=0){
                this.setData({
                    itemId:1,
                    total:Number(cnt),
                    scanFunctionIsUseAble:true,
                })
                console.log(this.data.total)
                this.updateInfo()
            }
            else
            {
                this.setData({
                    itemId:0,
                    total:0,
                    productId:'',//产品编号
                    specifications:'',//规格型号
                    count:0,
                    scanCount:0,
                    matCode:'',//客户料号
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
                    title: '查询成功！！！',
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
                    title: '查询成功！！！',
                    icon: 'success',
                    duration: 1500
                })
                this.setData({
                    ret: res.data,
                })
                t(Number(res.data.cnt))
                //console.log(res.data);
            }
        })
    },
    updateInfo(){
        this.saveScanCnt()
        let tsql=`SELECT new_start_mat_code = MAT_MASTER.new_start_mat_code,
        in_NUM = BILL_DET.in_NUM,       
        mat_name = MAT_MASTER.SPEC_TYPE_NO,  
        USER_MATCODE  = customer_mat.USER_MATCODE,
        scan_amt = BILL_DET.scan_amt,
        bill_cod = BILL_DET.BILL_COD
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
                curId:0,
                productId:data.new_start_mat_code.trim(),
                specifications:data.mat_name.trim(),
                matCode:data.USER_MATCODE.trim(),
                count:Number(data.in_NUM),
                scanCount:Number(data.scan_amt),
                preScanCount:Number(data.scan_amt),
                billCod:Number(data.bill_cod),
                res:[""],
                scanRes:'',
                notScanCnt:0,
                notScanTsql:'',
            })
        });
    },

    saveScanCnt(){
        let tsql = `update BILL_DET 
        set scan_amt = ${this.data.scanCount}
        WHERE BILL_DET.DELIVER_LIST_NO =  '${this.data.orderId}' 
        and BILL_COD = ${this.data.billCod}`
        console.log(tsql)
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
                offset: -2,
            },
            success: (res) => {
                console.log(res.data);
                wx.showToast({
                    title: '查询成功！！！',
                    icon: 'success',
                    duration: 1500
                })
            }
        })
    },
    jmpNotScanList(){
        //console.log(111)
        wx.navigateTo({
            url: '/pages/notScanList/notScanList',
            events: {

            },
            success:(res)=>{
                res.eventChannel.emit('acceptLabelId',{
                    tsql: this.data.notScanTsql,
                })
            }
        })
    }
})