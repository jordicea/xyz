function getTitle(vm: any) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title;
  }

  return '';
}

export default {
  created() {
    const title = getTitle(this);
    if (title) {
      document.title = title;
    }
  },
};
