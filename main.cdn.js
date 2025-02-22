import VueWindowModal from './index.vue'

// Exporta o componente para uso global
export default VueWindowModal;

// Opcional: expõe o componente no escopo global para uso direto via CDN
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('VueWindowModal', VueWindowModal);
}