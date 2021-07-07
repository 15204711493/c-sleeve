// pages/order/order.js

import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Order} from "../../models/order";

const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderItems;
    let localItemCount;
    const skuIds = cart.getCheckedSkuIds()
    orderItems = this.getCartOrderItems(skuIds)
    localItemCount = skuIds.length
    const order = new Order(orderItems,localItemCount)
    try {
      order.checkOrderIsOk()
    }catch (e){
      console.error()
      // this.setData({
      //   isOk:false
      // })
      return

    }


  },

  async getCartOrderItems(skuIds){
    const skus = await Sku.getSkuById(skuIds)
    const orderItems = this.packageOrderItems(skus)
    return orderItems

  },

  packageOrderItems(skus){
    skus.map(sku=>{
      const count = cart.getSkuCountBySkuId(sku.id)
      return new OrderItem(sku,count)
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }


})