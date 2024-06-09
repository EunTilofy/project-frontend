export default defineAppConfig({
  pages: [
    'pages/training/index',
    'pages/center/index',
    'pages/club/index',
    'pages/add_training/index',
    'pages/detail_training/index',
    'pages/user_detail/index',
    'pages/manage/index',
    'pages/attendance/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar:
  {
    color: '#1D2129',
    selectedColor: '#165DFF',
    list:[
      {
        "selectedIconPath": "images/icon/training-selected.png",
        "iconPath": "images/icon/training.png",
        "pagePath": "pages/training/index",
        "text": "训练"
      },
      // {
      //   "selectedIconPath": "images/icon/competition-selected.png",
      //   "iconPath": "images/icon/competition.png",
      //   "pagePath": "pages/game/index",
      //   "text": "赛事"
      // },
      {
        "selectedIconPath": "images/icon/career-selected.png",
        "iconPath": "images/icon/career.png",
        "pagePath": "pages/club/index",
        "text": "生涯"
      },
      {
        "selectedIconPath": "images/icon/home-selected.png",
        "iconPath": "images/icon/home.png",
        "pagePath": "pages/center/index",
        "text": "我的"
      }
    ]
  },
  window: {
    backgroundColor: "#F7F8FA",
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#F7F8FA",
    navigationBarTitleText: "Hawkies",
    navigationBarTextStyle: "black",
    navigationStyle: "default"
},
})