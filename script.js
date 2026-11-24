(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Typing roles (match the roles on the resume) */
  var roles = ['Python Developer', 'Backend Developer', 'Software Engineer'];
  var el = document.getElementById('typing-text');
  var ri = 0, ci = 0, del = false;
  function type() {
    var cur = roles[ri];
    el.textContent = cur.substring(0, ci);
    if (!del && ci === cur.length) { del = true; return setTimeout(type, 1700); }
    if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    ci += del ? -1 : 1;
    setTimeout(type, del ? 45 : 95);
  }
  if (el && !reduce) { ci = 0; type(); }

  /* Scroll reveal */
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

  /* Layers of Library Management System V2 (real files from the repo) */
  var layers = [
    { n: 'config', c: '#2EC4B6', f: ['db_config.py'], d: 'Reads the database settings from environment variables, so no password is stored in the code.' },
    { n: 'database', c: '#FFB547', f: ['connection.py', 'create_database.py', 'create_tables.py'], d: 'Opens the MySQL connection and creates the database and the books table.' },
    { n: 'models', c: '#6C8CFF', f: ['book.py'], d: 'The Book class. It holds one book: ID, title, author, category and quantity.' },
    { n: 'services', c: '#FF7A90', f: ['book_service.py'], d: 'BookService does the work: add, view, search, update quantity and delete, using parameterized SQL queries.' },
    { n: 'utils', c: '#9BE564', f: ['validator.py'], d: 'Checks every input (ID, title, author, category, quantity) before it reaches the database.' }
  ];
  var sel = 3;
  var lab = document.getElementById('labels'), info = document.getElementById('info'), btns = [];
  function show(i) {
    sel = i;
    var L = layers[i];
    info.style.setProperty('--c', L.c);
    info.innerHTML = '<h3>' + L.n + '/</h3><p>' + L.d + '</p>' + L.f.map(function (x) { return '<code>' + x + '</code>'; }).join('');
    btns.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i); });
  }
  layers.forEach(function (L, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.style.setProperty('--c', L.c); b.textContent = L.n;
    b.addEventListener('click', function () { show(i); });
    lab.appendChild(b); btns.push(b);
  });
  show(sel);

  /* Three.js scene: background particles + interactive layer stack */
  try {
    var bg = document.getElementById('bg');
    var rb = new THREE.WebGLRenderer({ canvas: bg, alpha: true, antialias: true });
    rb.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    var sb = new THREE.Scene(), cb = new THREE.PerspectiveCamera(60, 1, .1, 100);
    cb.position.z = 30;
    var N = 160, pos = new Float32Array(N * 3);
    for (var i = 0; i < N * 3; i++) pos[i] = (Math.random() - .5) * 70;
    var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x38bdf8, size: .16, transparent: true, opacity: .55 }));
    sb.add(pts);

    var stage = document.getElementById('stage');
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    stage.appendChild(r.domElement);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, .1, 50);
    cam.position.set(0, 2.4, 9); cam.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, .75));
    var dl = new THREE.DirectionalLight(0xffffff, .9); dl.position.set(4, 6, 5); scene.add(dl);
    var g = new THREE.Group(); scene.add(g);
    var slabs = layers.map(function (L, i) {
      var geo = new THREE.BoxGeometry(3.4, .36, 3.4);
      var m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: L.c, transparent: true, opacity: .82, roughness: .4, emissive: L.c, emissiveIntensity: 0 }));
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55 })));
      m.userData.i = i; m.position.y = (i - 2) * .72; g.add(m); return m;
    });

    var mx = 0, my = 0, t = 0, drag = false, lx = 0, spin = 0;
    addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    stage.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; stage.style.cursor = 'grabbing'; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointerup', function (e) { drag = false; stage.style.cursor = 'grab'; });
    stage.addEventListener('pointermove', function (e) { if (drag) { spin += (e.clientX - lx) * .01; lx = e.clientX; } });
    var ray = new THREE.Raycaster(), v = new THREE.Vector2(), moved = 0;
    stage.addEventListener('click', function (e) {
      var b = stage.getBoundingClientRect();
      v.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(v, cam);
      var h = ray.intersectObjects(slabs, false)[0];
      if (h) show(h.object.userData.i);
    });

    function size() {
      var w = stage.clientWidth, h = stage.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      rb.setSize(innerWidth, innerHeight, false); cb.aspect = innerWidth / innerHeight; cb.updateProjectionMatrix();
    }
    size(); addEventListener('resize', size);

    (function loop() {
      if (!reduce && !drag) t += .005;
      g.rotation.y += (t + spin + mx * 1.2 - g.rotation.y) * .06;
      g.rotation.x += (my * .45 - g.rotation.x) * .06;
      slabs.forEach(function (s, i) {
        var on = i === sel;
        s.position.x += ((on ? .7 : 0) - s.position.x) * .12;
        s.material.emissiveIntensity += ((on ? .55 : 0) - s.material.emissiveIntensity) * .12;
        s.material.opacity += ((on ? .95 : .72) - s.material.opacity) * .12;
      });
      if (!reduce) { pts.rotation.y += .0007; pts.rotation.x += .0003; }
      cb.position.y += ((-scrollY * .004) - cb.position.y) * .05;
      r.render(scene, cam); rb.render(sb, cb);
      requestAnimationFrame(loop);
    })();
  } catch (err) {
    var s = document.getElementById('stage'); if (s) s.style.display = 'none';
    var b2 = document.getElementById('bg'); if (b2) b2.style.display = 'none';
  }
})();
