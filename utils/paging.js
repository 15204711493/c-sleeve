import {Http} from "./http";


class Paging{

    req
    start
    count
    locker = false
    url
    moreData = true
    accumulator = []

    constructor(req,count = 10,start = 0) {
        this.req = req
        this.start = start
        this.count = count
        this.url = req.url

    }

     async getMoreData(){
        if(!this.moreData){
            return
        }
        if(!this.getLocker()){
            return
        }
        const data = await this.actualGetData()
        this.releaseLocker()
        return data
     }

     async actualGetData(){
        const req = this.getCurrentReq()
        let paging = await Http.request(req)

         if(!paging){
             return null
         }
         if(paging.total ===0){
              return {
                  empty:true,
                  items:[],
                  moreData:false,
                  accumulator:[]
              }
         }
          this.moreData = Paging.moreData(paging.total_page,paging.page)
          if(this.moreData){
              this.start += this.count
          }

         this._accumulator(paging.items)
         return {
              empty: false,
              items: paging.items,
              moreData: this.moreData,
              accumulator: this.accumulator
         }
     }

     _accumulator(items){
        this.accumulator = this.accumulator.concat(items)
     }

     static moreData(totalPage,pageNum){
        return pageNum < totalPage-1
     }

     getCurrentReq(){
        let url = this.url
        const params =`start=${this.start}&count=${this.count}`
         if(url.includes('?')){
             url+= '&'+params
         }else {
             url+= '?'+params
         }
         this.req.url = url
         return this.req
     }


     getLocker(){
        if(this.locker){
            return false
        }
        this.locker = true
         return true
     }

     releaseLocker(){
        this.locker = false
     }
}

export {
    Paging
}