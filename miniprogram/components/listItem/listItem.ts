// components/listItem/listItem.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item:{
            type: Object,
        },
        index:{
            type: Number,
        },
        itemId:{
            type: Number,
        },
        orderId:{
            type: String,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        productId:String,
        specifications:String,
        count:Number,
        scanCount:Number,
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
