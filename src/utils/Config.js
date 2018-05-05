const Config = {
  baseURL:'http://39.105.25.18:8080',
  ContentType:'application/json',
  secretQuestion:{
    0:'您母亲的姓名是?',
    1:'您配偶的姓名是?',
    2:'您的出生地是?',
  },
  cardTypeColor:{
    "story":"#87d068",
    "task":"#2db7f5",
    "bug":"#ff0000",
    "other":"#800080"
  },
  cardStatusColor:{
    "freezed":null,
    "pretodo":"purple",
    "todo":"blue",
    "todo:s":"blue",
    "doing":"volcano",
    "done":"green",
    "done:s":"green"
  },
  sprintStatusColor:{
    "open":"#0fe00f",
    "closed":"#00000073"
  },
  itemTypes:{
    card: 'card'
  }
};

export default Config;
