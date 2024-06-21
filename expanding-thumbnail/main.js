function animate(thumb) {
    let expand = 'expand';
    let show = 'show';
    if (thumb.classList.contains(expand)) [expand,show] = [show,expand];
    thumb.classList.toggle(expand);
    setTimeout(() => thumb.classList.toggle(show),500);
  }
  
  const init = (e) => e.target.matches('.thumb') && animate(e.target);
  
  window.addEventListener('click',init,false);