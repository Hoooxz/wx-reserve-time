// components/rsv_timer/period.js

let hourViewArr = [
  { clock:  9, title: ' 9:00 am', reserved: [false, false], selected: [false, false] },
  { clock: 10, title: '10:00 am', reserved: [false, false], selected: [false, false] },
  { clock: 11, title: '11:00 am', reserved: [false, false], selected: [false, false] },
  { clock: 12, title: '12:00 am', reserved: [false, false], selected: [false, false] },
  { clock: 13, title: '13:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 14, title: '14:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 15, title: '15:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 16, title: '16:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 17, title: '17:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 18, title: '18:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 19, title: '19:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 20, title: '20:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 21, title: '21:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 22, title: '22:00 pm', reserved: [false, false], selected: [false, false] },
  { clock: 23, title: '23:00 pm', reserved: [false, false], selected: [false, false] },
  { title: '', reserved: [false, false], selected: [false, false] },
];

// 0-unused 1-selected 2-reserved 3-reserved_mark
let InitialPeriodDataArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * 生成已选中时间段str
 *
 * @param {*} arr 半小时时间段period数据arr
 * @returns
 */
let makeSelectedStr = (arr) => {
  let startIndex = arr.indexOf(1),
      endIndex = arr.lastIndexOf(1)

  if (startIndex == -1 || endIndex == -1) {
    return {
      start: '',
      end: ''
    }
  }

  let startStr = (Math.floor(startIndex / 2) + 9) + ':' +  (startIndex % 2 ? '30' : '00')
  let endStr = (Math.floor(endIndex / 2) + 9 + (endIndex % 2 ? 1 : 0)) + ':' +  (endIndex % 2 ? '00' : '30')

  return{
    start: startStr,
    end: endStr
  }
}

/**
 * 修正数组，使其存在连续的tag序列，中间不能被stone打断
 * 
 * 数组默认值为none(0)，可被修改为tag(1)；若元素为stone(2/3)则不可被修改
 *
 * @param {*} arr     将被修改的数组
 * @param {*} i_tag   将被tag的数组元素下标
 */
let adjustArr = (arr, i_tag) => {
  let NONE = 0, TAG = 1, STONE1 = 2, STONE2 = 3
  let start = arr.indexOf(TAG),
      end = arr.lastIndexOf(TAG)

  if (start === -1 && end === -1) {
    arr[i_tag] = TAG;
    return arr
  }

  if(start === end) {
    // 若当前只tag了一个
    if (i_tag <= start) {
      // i_tag在start之前，只标记i_tag
      arr[i_tag] = TAG
      arr[start] = NONE
    } else {
      let hasStone = false;
      for (let i = start + 1; i < i_tag; i++) {
        if(arr[i] == STONE1 || arr[i] == STONE2) {
          hasStone = true;
          break;
        }
      }
      if (hasStone) {
        // i_tag与start之间存在stone，只标记i_tag
        arr[start] = NONE
        arr[i_tag] = TAG
      } else {
        // i_tag与start之间不存在stone，标记从start到i_tag间的全部
        for (let i = start; i <= i_tag; i++) {
          arr[i] = TAG
        }
      }
    }
  } else {
    // 当前已标记多个
    if (i_tag > start && i_tag <= end) {
      // 选在了start与end之间，则取消i_tag之后直到end的标记
      for (let i = i_tag + 1; i <= end; i++) {
        arr[i] = NONE
      }
    } else {
      // 不在start到end之间，则取消start到end的标记，重新标记
      for (let i = start; i <= end; i++) {
        arr[i] = NONE
      }
      arr[i_tag] = TAG
    }
  }
  return arr;
}

Component({

  relations: {
    '../rsv_timer': {
      type: 'parent',
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    selectedPeriods: {
      type: Array,
      observer: function(newVal, oldVal, changedPath) {
        let periodDataArr = InitialPeriodDataArr.concat()  // 此处要进行数组拷贝，否则只是引用的拷贝，会造成InitialPeriodsArr被修改

        for (let i in newVal) {
          let period = newVal[i]
          let startArr = period.start.split(':')
          let startIndex = parseInt(startArr[0] - 9) * 2 + (startArr[1] === '30' ? 1 : 0);
          let endArr = period.end.split(':')
          let endIndex = parseInt(endArr[0] - 9) * 2 + (endArr[1] === '30' ? 0 : -1);
          for (let i = startIndex; i <= endIndex; i++) {
            periodDataArr[i] = period.mark ? 3 : 2;
          }
        }
        this.setData({
          periodDataArr
        })
        this.generateViews(periodDataArr)
      }
    },
    selectable: {
      type: Boolean,
      observer: function (newVal) {
        if(!newVal) {
          let periodDataArr = InitialPeriodDataArr.concat()
          this.setData({
            periodDataArr
          })
          this.generateViews(periodDataArr)
        }
      }
    },
    loading: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    periodDataArr: [],
    hourViews: [],
  },

  /**
   * 组件的声明周期钩子
   */
  lifetimes: {
    attached() {
      // 组件创建时会调用propSelectedPeriods-observer函数，故不再专门生成视图
      // TODO: 还需彻底研究清楚prop-observer与组件生命周期的关系
      // this.generateViews(InitialPeriodDataArr)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 生成以小时hour为单位的视图arr
     *
     * @param {*} periodDataArr 以半小时时间段period为单位的数据arr
     */
    generateViews(periodDataArr) {
      let that = this
      let hourViews = [],
          hourViewsTmplate = hourViewArr.concat(),
          hourViewLine = []

      for (let i = 0; i < periodDataArr.length; i += 2) {
        let j = Math.floor(i / 2)
        let period = hourViewsTmplate[j]
        period.selected[0] = (periodDataArr[i]   == 1) ? true : false
        period.reserved[0] = (periodDataArr[i]   == 2 || periodDataArr[i] == 3) ? true : false
        period.selected[1] = (periodDataArr[i+1] == 1) ? true : false
        period.reserved[1] = (periodDataArr[i+1] == 2 || periodDataArr[i+1] == 3) ? true : false
        period.viewIndex = i / 2
        hourViewLine.push(period)
        if((i+2)%8 == 0) {
          hourViews.push(hourViewLine)
          hourViewLine = []
        }
      }
      hourViewLine.push(hourViewsTmplate[periodDataArr.length+1])
      hourViews.push(hourViewLine)

      that.setData({
        hourViews
      })
    },

    /**
     * 点击了某个半小时时间段period
     *
     * @param {*} e
     * @returns
     */
    onHalfHour(e) {
      // e.target.dataset - {clock, index}
      let that = this
      let { periodDataArr } = that.data
      let { period_i } = e.target.dataset

      // 若已预定，则直接退出
      if(periodDataArr[period_i] == 2 || periodDataArr[period_i] == 3) {
        return;
      }

      if (!that.data.selectable) {
        wx.showToast({
          title: '当前日期不允许选择',
          icon: 'none'
        })
        setTimeout(() => {
          wx.hideToast()
        }, 2000);
        return;
      }

      // 若未预定，则进行选中
      periodDataArr = adjustArr(periodDataArr, period_i)
      that.setData({
        periodDataArr
      })

      // 刷新视图显示
      this.generateViews(periodDataArr)

      // 将选中的时间段冒泡到上层
      this.triggerEvent('selectPeriods', {
        period: makeSelectedStr(periodDataArr)
      })
    }


  }
})
