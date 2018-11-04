// components/rsv_timer/cal.js

let generateWeekdays = (selectedDate) => {
  let weekdayIndex = selectedDate.getDay(),
      tmpDay = new Date(selectedDate.toString()),
      today = new Date(),
      weekdays = [];
  tmpDay.setDate(selectedDate.getDate() - weekdayIndex)
  for (let i = 0; i < 7; i++) {
    let newDay = {
      date: tmpDay.toString(),
      year: tmpDay.getFullYear(), 
      mon: tmpDay.getMonth(), 
      day: tmpDay.getDate(), 
      selected: (tmpDay.getDate() === selectedDate.getDate()) ? true : false,
    }
    if (tmpDay.getDate() === today.getDate() && tmpDay.getMonth() === today.getMonth() && tmpDay.getFullYear() === today.getFullYear()) {
      newDay.today = true  // 此处仍需处理，尚不完善
    }
    weekdays.push(newDay)
    tmpDay.setDate(tmpDay.getDate()+1)
  }
  return weekdays
}

let MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let getMonthName = (index) => {
  return MonthNames[index]
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
    date: {
      type: String,  // 传入形如2018/11/07的日期字符串
      observer: function(newVal, oldVal, changedPath) {
        this.move2Date(new Date(newVal), false)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    calTitle: '', // 日历标题：月份+年份
    weekdays: [], // 当前周的日期列表
    selectedDayIndex: -1, // 本周内被选中的日期在列表中的下标
  },

  /**
   * 组件的声明周期钩子
   */
  lifetimes: {
    attached() {
      // 若传入了默认选中日期，则初始化为传入的日期；若未传入，则初始化为今天
      let { date } = this.data
      let selectedDate = date ? (new Date(date)) : (new Date())
      this.move2Date(selectedDate, date ? false : true)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 将week切换到_date所在的周
     *
     * @param {*} _date
     * @param {*} needBubble 是否需要冒泡事件
     */
    move2Date(_date, needBubble) {
      let weekdays = generateWeekdays(_date),
          selectedDayIndex = _date.getDay(),
          calTitle = getMonthName(weekdays[selectedDayIndex].mon) + ' ' + weekdays[selectedDayIndex].year
      this.setData({
        weekdays,
        selectedDayIndex,
        calTitle
      })
      // 冒泡到上层去
      if (needBubble) {
        this.triggerEvent('switchDate', {
          date: (new Date(weekdays[selectedDayIndex].date)).toLocaleDateString()
        })
      }
    },

    /**
     * 在week视图上点选日期，将日期切换到点选的那天
     *
     */
    switchDate(e) {
      let newSelectedIndex = e.target.dataset.weekdayIndex
      let { weekdays } = this.data
      this.move2Date(new Date(weekdays[newSelectedIndex].date), true)
    },

    /**
     * 点击箭头切换的前/后一周，将日期切换到选中日期在下周/上周的对应的日期
     *
     */
    switchWeek(e) {
      let direction = e.target.dataset.direction     // 1-向右翻 -1-向左翻
      let { weekdays, selectedDayIndex } = this.data,
          selectedDay = new Date(weekdays[selectedDayIndex].date) // 获取当前选中的日期

      selectedDay.setDate(selectedDay.getDate() + 7 * direction); // 切换到下周/上周的对应的日期

      this.move2Date(selectedDay, true)
    }

  }
})
