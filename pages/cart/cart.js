// pages/cart/cart.js
import {Cart} from "../../models/cart";
import {Caculator} from "../../models/caculator";
const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems:[],
    isEmpty:false,
    allChecked:false,
    totalPrice:0,
    totalSkuCount:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cartData = cart.getAllSkuFromServer()
    this.setData({
      cartItems:cartData.items
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     const cart = new Cart();
     const cartItems = cart.getAllCartItemFromLocal().items;
     if(cart.isEmpty()){
       this.empty()
       return
     }
     this.setData({
       cartItems:cartItems
     })

    this.notEmpty()
    this.isAllChecked()
    this.refreshCartData()
  },

  refreshCartData(){
    const checkedItems = cart.getCheckedItems()
    const calculator = new Caculator(checkedItems)
    calculator.calc()
    this.setCalcData(calculator)
  },

  onCountFloat(event){
    this.refreshCartData()
  },
  setCalcData(calculator){
    const totalPrice = calculator.getTotalPrice()
    const totalSkuCount = calculator.getTotalSkuCount()
    this.setData({
      totalPrice,
      totalSkuCount
    })

  },

  isAllChecked(){
   const allChecked = cart.isAllChecked()
      this.setData({
        allChecked
      })
  },

  empty(){
    this.setData({
      isEmpty:true
    })
    wx.hideTabBarRedDot({
      index:2
    })
  },

    onSingleCheck(event){
      this.isAllChecked()
      this.refreshCartData()
    },

    onDeleteItem(event){
      this.isAllChecked()
      this.refreshCartData()

    },
    onCheckAll(event){
      const checked = event.detail.checked
        cart.checkAll(checked)
        this.setData({
            cartItems:this.data.cartItems
        })
      this.refreshCartData()
    },
  notEmpty(){
    this.setData({
      isEmpty:false
    })
    wx.showTabBarRedDot({
      index:2
    })

  },

  onSettle(event){
    if(this.data.totalSkuCount <= 0){
      return
    }
    wx.navigateTo({
      url:`/pages/order/order`
    })

  }

})