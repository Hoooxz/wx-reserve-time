# 预约时间选择器（微信小程序组件）

`wx-reserve-time` 是一个用于时间预约的微信小程序组件，可以 0.5h 为单位进行时间段选择。

## 使用方法

将 `miniapp/components/rsv_timer` 文件夹拷贝到小程序工程中，在使用此组件的页面配置文件 `page.json` 中，添加如下字段：

```json
  "usingComponents": {
    "rsv-timer": "path/rsv_timer/rsv_timer"
  }
```

即可在 `page.wxml` 中使用该组件：

```html
<rsv-timer 
  bind:selectDate="onSelectDate"
  bind:selectPeriods="onSelectPeriods"
  propDate="{{date}}"
  propReservedPeriods="{{reservedPeriods}}"
></rsv-timer>
```

## 传入参数

**1. propDate** [String]

含义: 默认选中日期

示例: 2018/11/11

**2. propReservedPeriods** [Array]

含义: 已预约时间段

示例: 

```json
[{
  "id": "1234567",
  "start": "9:00",
  "end": "12:30"
}, {
  "id": "1234568",
  "start": "15:30",
  "end": "18:00"
}]
```
**3. propSelectable** [Boolean]

含义: 可否选中新的时间段

**4. propLoading** [Boolean]

含义: 预约时间段的加载状态

## 绑定事件

**1. selectDate**

含义: 选中日期

参数示例：

```json
{
  "date": "2018/11/11"
}
```

**2. selectPeriods**

含义: 选中时间段

参数示例：

```json
{
  "period": {
    "start": "9:00",
    "end": "12:30"
  }
}
```

## Todo

- [ ] 传入参数：已预约时间段可提供特殊标记

- [ ] 绑定事件: 用户点击已预约时间段