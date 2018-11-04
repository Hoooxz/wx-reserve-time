// components/rsv_timer/rsv_timer.js

Component({

  relations: {
    './cal/cal': {
      type: 'child',
    },
    './period/period': {
      type: 'child',
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    propReservedPeriods: {
      type: Array,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          propSelectedPeriods: newVal
        })
      }
    },
    propDate: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          propDate: newVal
        })
      }
    },
    propSelectable: {
      type: Boolean
    },
    propLoading: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onSwitchDate(e) {
      this.triggerEvent("selectDate", {
        date: e.detail.date
      })
    },

    onSelectPeriods(e) {
      this.triggerEvent("selectPeriods", {
        period: e.detail.period
      })
    }

  }
})
