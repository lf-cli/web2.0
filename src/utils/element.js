// 这是我们常用的elementui组件 局部引入 避免包过大影响加载速度
import { Button, Loading, MessageBox, Select, Option, Tree, Input, Table, TableColumn, Pagination, DatePicker } from 'element-ui'
import { message } from '@/utils/message.js'

export default {
  install: function (Vue) {
    Vue.use(Button)
    Vue.use(Loading.directive)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Tree)
    Vue.use(Input)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Pagination)
    Vue.use(DatePicker)
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$message = message
    Vue.prototype.$confirm = MessageBox.confirm
  }
}
