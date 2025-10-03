document.addEventListener('DOMContentLoaded', () => {
  // alle sections met class .selection en een id
  const sections = Array.from(document.querySelectorAll('.selection[id]'));
  // alle nav links binnen .heading, maar we werken alleen met links die een hash hebben en corresponderende section
  const allNavLinks = Array.from(document.querySelectorAll('.heading a'));
  const navLinks = allNavLinks.filter(a => a.hash && document.getElementById(a.hash.slice(1)));

  // helper: markeer active link
  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + id));
  };

  // probeer IntersectionObserver (robuust), compenseer voor vaste header hoogte als aanwezig
  const header = document.querySelector('.heading');
  const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 0;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      root: null,
      rootMargin: `-${headerHeight}px 0px 0px 0px`, // compenseert fixed header
      threshold: 0.55 // >50% zichtbaar = active
    });
    sections.forEach(s => obs.observe(s));
  } else {
    // fallback: kies sectie waarvan midden het dichtst bij viewport-centrum ligt
    const onScroll = () => {
      const center = window.innerHeight / 2;
      let closest = null;
      let minDist = Infinity;
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < minDist) { minDist = dist; closest = s; }
      });
      if (closest) setActive(closest.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // click handlers: alleen voor interne anchors; geef directe feedback en laat smooth scroll + snap werken
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return; // veiligheid
      e.preventDefault();
      setActive(id); // directe highlight
      target.scrollIntoView({ behavior: 'smooth' }); // laat CSS scroll-snap/scroll-padding de finale plaats bepalen
      // update url hash zonder te scrollen extra (valt terug bij browser support)
      history.replaceState(null, '', '#' + id);
    });
  });

  // initial highlight bij laden (kies sectie bij viewport-centrum of eerste)
  const initial = sections.find(s => {
    const r = s.getBoundingClientRect();
    return r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2;
  }) || sections[0];
  if (initial) setActive(initial.id);
});
