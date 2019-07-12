import Loadmore from './loadmore'

const install = function(Vue) {
  Vue.directive('Loadmore', Loadmore)
}

if (window.Vue) {
  window.clipboard = Loadmore
  Vue.use(install); // eslint-disable-line
}

Loadmore.install = install
export default Loadmore
