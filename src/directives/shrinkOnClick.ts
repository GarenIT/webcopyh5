const shrinkOnClick = {
  beforeMount(el: any) {
    el.style.transition = 'transform 0.1s'; // 可以调整动画持续时间 
    el.addEventListener('click', () => {
      el.style.transform = 'scale(0.96)'; // 缩小的比例，可以根据需要调整
      setTimeout(() => {
        el.style.transform = 'none'; // 恢复原样
      }, 100); // 动画完成后的恢复时间，可以根据需要调整
    });
  }
};

export default shrinkOnClick;