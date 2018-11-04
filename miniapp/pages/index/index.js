//index.js

let initialReservedPeriods = [{
  start: '9:00',
  end: '12:00'
}, {
  start: '19:30',
  end: '21:00',
  mark: true
}]

Page({

  data: {
    date: '',
    reservedperiods: initialReservedPeriods,
    reservable: true,
    loading: false
  },

  onReservable() {
    this.setData({
      reservable: !this.data.reservable
    })
  },

  onLoading() {
    this.setData({
      loading: !this.data.loading
    })
  },

  onSelectDate (e) {
    this.setData({
      date: (new Date(e.detail.date)).toLocaleDateString()
    })
  },

  onSelectPeriods (e) {
    this.setData({
      period: e.detail.period
    })
  }
  
})
