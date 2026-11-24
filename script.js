(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Typing roles: only roles that match the resume targets */
  var roles = ['Python Developer', 'Backend Developer', 'Software Engineer'];
  var el = document.getElementById('typing-text');
  var ri = 0, ci = 0, del = false;
  function type() {
    var cur = roles[ri];
    el.textContent = cur.substring(0, ci);
    if (!del && ci === cur.length) { del = true; return setTimeout(type, 1800); }
    if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    ci += del ? -1 : 1;
    setTimeout(type, del ? 50 : 100);
  }
  if (el && !reduce) { ci = 0; type(); }

  /* Reveal sections on scroll (content stays visible if JS fails) */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(function (s) { io.observe(s); });

  /* Active nav link */
  var links = document.querySelectorAll('.nav-links a');
  addEventListener('scroll', function () {
    var cur = '';
    document.querySelectorAll('section[id]').forEach(function (s) { if (scrollY >= s.offsetTop - 160) cur = s.id; });
    links.forEach(function (l) { l.classList.toggle('active-link', l.getAttribute('href') === '#' + cur); });
  });

  /* 3D tilt on project cards */
  document.querySelectorAll('.project-card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      if (reduce) return;
      var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      c.style.transform = 'rotateY(' + x * 10 + 'deg) rotateX(' + (-y * 10) + 'deg) translateZ(8px)';
    });
    c.addEventListener('pointerleave', function () { c.style.transform = ''; });
  });

  /* Hero 3D: the five layers of Library Management System V2 */
  var names = [['config', '#2EC4B6'], ['database', '#FFB547'], ['models', '#6C8CFF'], ['services', '#FF7A90'], ['utils', '#9BE564']];
  var lab = document.getElementById('labels');
  names.forEach(function (n) { var i = document.createElement('i'); i.style.setProperty('--c', n[1]); i.textContent = n[0]; lab.appendChild(i); });
  try {
    var stage = document.getElementById('stage');
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    stage.appendChild(r.domElement);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, .1, 50);
    cam.position.set(0, 2.2, 8.5); cam.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, .7));
    var dl = new THREE.DirectionalLight(0xffffff, .9); dl.position.set(4, 6, 5); scene.add(dl);
    var g = new THREE.Group(); scene.add(g);
    var slabs = [];
    names.forEach(function (n) {
      var geo = new THREE.BoxGeometry(3.4, .34, 3.4);
      var m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: n[1], transparent: true, opacity: .85, roughness: .4 }));
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6 })));
      g.add(m); slabs.push(m);
    });
    var mx = 0, my = 0, t = 0;
    addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    function size() { var w = stage.clientWidth, h = stage.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    size(); addEventListener('resize', size);
    (function loop() {
      if (!reduce) t += .006;
      g.rotation.y += (t + mx * 1.4 - g.rotation.y) * .05;
      g.rotation.x += (my * .5 - g.rotation.x) * .05;
      var k = .6 + (reduce ? 0 : Math.sin(t * 3) * .18);
      slabs.forEach(function (s, i) { s.position.y = (i - 2) * (.62 + k * .35); });
      r.render(scene, cam);
      requestAnimationFrame(loop);
    })();
  } catch (err) {
    var s = document.getElementById('stage'); if (s) s.style.display = 'none';
  }
})();
