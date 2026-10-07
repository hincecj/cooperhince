// Simulation toolkit for the "Read more" pages.
//
// This file is the framework only. Each simulation lives in its own file in
// js/sims/ and calls Sim.create(...). See js/sims/_template.js for a skeleton
// to copy, and the root README for the step by step instructions.
//
// What Sim.create does for you:
//   - builds a canvas that resizes with the page and stays sharp on retina screens
//   - Play/Pause and Reset buttons
//   - sliders, dropdowns and checkboxes from a list of controls
//   - a fixed time step loop, so the maths does not depend on the screen's refresh rate
//   - pauses itself when scrolled off screen or when the tab is hidden
//   - starts paused for visitors who have "reduce motion" switched on
//   - shows an error message in the box (instead of silently dying) if your code throws
//
// Usage:
//
//   Sim.create('#my-sim', {
//     ariaLabel: 'Three body problem',      // describes the canvas for screen readers
//     aspect: 16 / 9,                       // canvas width / height (default 16/9)
//     dt: (p) => p.h,                       // sim time advanced per step: a number, or a function of params
//     timeScale: 1,                         // sim time per real second: a number, or a function of params
//     autoplay: true,                       // set false to start paused
//
//     controls: [
//       { id: 'h', label: 'Step size h', min: 0.0005, max: 0.02, step: 0.0005, value: 0.005 },
//       { id: 'm', label: 'Mass', min: 1, max: 5, step: 0.1, value: 1, resets: true },
//       { id: 'preset', label: 'Preset', type: 'select', resets: true,
//         options: [{ value: 'a', label: 'Figure eight' }, { value: 'b', label: 'In line' }] },
//       { id: 'trail', label: 'Show trail', type: 'checkbox', value: true }
//     ],
//
//     init(params, view)            { return { /* new state */ }; },
//     step(state, dt, params)       { /* advance state by dt (mutate it) */ },
//     draw(g, state, params, view)  { /* draw with the 2D context g, in CSS pixels */ },
//     readouts(state, params, view) { return [['t =', view.time.toFixed(2)]]; }   // optional
//   });
//
// Controls:
//   - A control with resets: true restarts the simulation when changed (use it for
//     initial conditions). Without it the new value is picked up live (use it for
//     things like step size or damping).
//   - range controls need min, max, step. Add format: (v) => ... to change how the
//     value is shown next to the slider.
//
// view (passed to init and draw):
//   view.width, view.height   canvas size in CSS pixels
//   view.time                 simulation time elapsed since the last reset
//   view.colors               { bg, surface, border, text, muted, accent }, read from
//                             css/style.css so drawings match the site palette
//
// The returned object has play(), pause(), toggle(), reset(), setParam(id, value),
// redraw() and destroy().

(function (global) {
  'use strict';

  let uid = 0;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Reads the site palette from the CSS variables in css/style.css.
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const get = (name) => cs.getPropertyValue(name).trim();
    return {
      bg: get('--bg'),
      surface: get('--surface'),
      border: get('--border'),
      text: get('--text'),
      muted: get('--text-muted'),
      accent: get('--accent')
    };
  }

  // Number of decimals implied by a slider step, e.g. 0.0005 -> 4.
  function decimalsFor(step) {
    const s = String(step);
    if (s.indexOf('e-') !== -1) return parseInt(s.split('e-')[1], 10);
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
  }

  function create(target, options) {
    const root = typeof target === 'string' ? document.querySelector(target) : target;
    if (!root) {
      console.warn('Sim.create: could not find', target);
      return null;
    }

    const opts = Object.assign({
      ariaLabel: 'Simulation',
      aspect: 16 / 9,
      dt: 0.01,
      timeScale: 1,
      maxStepsPerFrame: 5000,
      controls: []
    }, options);

    if (typeof opts.init !== 'function' || typeof opts.step !== 'function' || typeof opts.draw !== 'function') {
      console.warn('Sim.create: init, step and draw functions are all required.');
      return null;
    }

    // ---------- parameters ----------
    const params = {};
    const ui = {};
    opts.controls.forEach((c) => {
      const type = c.type || 'range';
      if (type === 'select') {
        const first = c.options && c.options[0];
        params[c.id] = c.value !== undefined ? c.value : (first ? first.value : undefined);
      } else if (type === 'checkbox') {
        params[c.id] = !!c.value;
      } else {
        params[c.id] = c.value !== undefined ? c.value : c.min;
      }
    });

    // ---------- DOM ----------
    root.textContent = '';
    root.classList.add('sim');

    const stage = el('div', 'sim-stage');
    const canvas = el('canvas', 'sim-canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', opts.ariaLabel);
    stage.appendChild(canvas);

    const bar = el('div', 'sim-bar');
    const toggleBtn = el('button', 'sim-btn', 'Pause');
    toggleBtn.type = 'button';
    const resetBtn = el('button', 'sim-btn', 'Reset');
    resetBtn.type = 'button';
    const readout = el('div', 'sim-readout');
    bar.append(toggleBtn, resetBtn, readout);

    const errorBox = el('div', 'sim-error');
    errorBox.hidden = true;
    errorBox.setAttribute('role', 'alert');

    root.append(stage, bar, errorBox);

    if (opts.controls.length) {
      const panel = el('div', 'sim-controls');
      opts.controls.forEach((c) => {
        const type = c.type || 'range';
        const id = 'sim' + (++uid) + '-' + c.id;
        const wrap = el('div', 'sim-control');
        const head = el('div', 'sim-control-head');
        const label = el('label', null, c.label || c.id);
        label.htmlFor = id;
        head.appendChild(label);

        let input;
        let output = null;
        let fmt = null;

        if (type === 'select') {
          input = el('select');
          (c.options || []).forEach((option, index) => {
            const node = el('option', null, option.label !== undefined ? option.label : String(option.value));
            node.value = String(index);
            if (option.value === params[c.id]) node.selected = true;
            input.appendChild(node);
          });
        } else if (type === 'checkbox') {
          input = el('input');
          input.type = 'checkbox';
          input.checked = !!params[c.id];
        } else {
          input = el('input');
          input.type = 'range';
          input.min = c.min;
          input.max = c.max;
          input.step = c.step;
          input.value = params[c.id];
          fmt = c.format || ((v) => Number(v).toFixed(decimalsFor(c.step)));
          output = el('output', null, fmt(params[c.id]));
          output.htmlFor = id;
          head.appendChild(output);
        }
        input.id = id;

        input.addEventListener('input', () => {
          if (type === 'select') params[c.id] = c.options[Number(input.value)].value;
          else if (type === 'checkbox') params[c.id] = input.checked;
          else params[c.id] = Number(input.value);
          if (output) output.textContent = fmt(params[c.id]);
          if (c.resets) reset();
          else redraw();
        });

        ui[c.id] = { control: c, type, input, output, fmt };
        wrap.append(head, input);
        panel.appendChild(wrap);
      });
      root.appendChild(panel);
    }

    // ---------- state ----------
    const ctx = canvas.getContext('2d');
    const colors = readColors();
    const view = { width: 0, height: 0, dpr: 1, time: 0, colors };
    const reduceMotion = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);

    let state = null;
    let time = 0;
    let acc = 0;
    let last = 0;
    let raf = 0;
    let visible = true;
    let failed = false;
    let lastReadout = 0;
    let playing = opts.autoplay !== false && !reduceMotion;

    function guarded(fn) {
      try {
        fn();
        return true;
      } catch (err) {
        failed = true;
        playing = false;
        console.error(err);
        errorBox.hidden = false;
        errorBox.textContent = 'This simulation stopped because of an error: ' + err.message;
        syncToggle();
        return false;
      }
    }

    function stepSize() {
      return typeof opts.dt === 'function' ? opts.dt(params) : opts.dt;
    }

    function speed() {
      return typeof opts.timeScale === 'function' ? opts.timeScale(params) : opts.timeScale;
    }

    function syncToggle() {
      toggleBtn.textContent = playing ? 'Pause' : 'Play';
    }

    function updateReadouts(force) {
      if (typeof opts.readouts !== 'function' || !state) return;
      const now = performance.now();
      if (!force && now - lastReadout < 100) return;
      lastReadout = now;
      let items = [];
      view.time = time;
      guarded(() => { items = opts.readouts(state, params, view) || []; });
      readout.textContent = (Array.isArray(items) ? items : [items])
        .map((item) => (Array.isArray(item) ? item[0] + ' ' + item[1] : String(item)))
        .join('   ');
    }

    function redraw() {
      if (!state || !view.width) return;
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      ctx.clearRect(0, 0, view.width, view.height);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, view.width, view.height);
      view.time = time;
      guarded(() => opts.draw(ctx, state, params, view));
      updateReadouts(!playing);
    }

    function reset() {
      time = 0;
      acc = 0;
      last = 0;
      failed = false;
      errorBox.hidden = true;
      view.time = 0;
      guarded(() => { state = opts.init(params, view); });
      redraw();
      updateReadouts(true);
      schedule();
    }

    function frame(now) {
      raf = 0;
      if (!playing || !visible || document.hidden) {
        last = 0;
        return;
      }
      const realDt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;

      guarded(() => {
        const dt = stepSize();
        if (!(dt > 0)) throw new Error('dt must be greater than zero');
        acc += realDt * speed();
        let n = Math.floor(acc / dt);
        if (n > opts.maxStepsPerFrame) {
          n = opts.maxStepsPerFrame;
          acc = 0;
        } else {
          acc -= n * dt;
        }
        for (let i = 0; i < n; i++) opts.step(state, dt, params);
        time += n * dt;
      });

      redraw();
      schedule();
    }

    function schedule() {
      if (!raf && playing && visible && !document.hidden && !failed) {
        raf = requestAnimationFrame(frame);
      }
    }

    function play() {
      if (failed) return;
      playing = true;
      last = 0;
      syncToggle();
      schedule();
    }

    function pause() {
      playing = false;
      syncToggle();
      redraw();
    }

    function toggle() {
      if (playing) pause(); else play();
    }

    function setParam(id, value) {
      const entry = ui[id];
      if (!entry) return;
      params[id] = value;
      if (entry.type === 'select') {
        const index = entry.control.options.findIndex((option) => option.value === value);
        if (index >= 0) entry.input.value = String(index);
      } else if (entry.type === 'checkbox') {
        entry.input.checked = !!value;
      } else {
        entry.input.value = value;
        if (entry.output) entry.output.textContent = entry.fmt(value);
      }
      if (entry.control.resets) reset(); else redraw();
    }

    // ---------- sizing and visibility ----------
    function resize() {
      const w = Math.max(1, Math.floor(stage.clientWidth));
      const h = Math.max(1, Math.round(w / opts.aspect));
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      if (w === view.width && h === view.height && dpr === view.dpr) return;
      view.width = w;
      view.height = h;
      view.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + 'px';
      redraw();
    }

    const resizeObserver = 'ResizeObserver' in global ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(stage);

    const visibilityObserver = 'IntersectionObserver' in global
      ? new IntersectionObserver((entries) => {
          visible = entries[entries.length - 1].isIntersecting;
          last = 0;
          schedule();
        })
      : null;
    if (visibilityObserver) visibilityObserver.observe(root);

    function onVisibilityChange() {
      last = 0;
      schedule();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    toggleBtn.addEventListener('click', toggle);
    resetBtn.addEventListener('click', reset);

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      playing = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (visibilityObserver) visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      root.textContent = '';
      root.classList.remove('sim');
    }

    // ---------- start ----------
    syncToggle();
    resize();
    reset();

    return { play, pause, toggle, reset, setParam, redraw, destroy, params };
  }

  global.Sim = { create, colors: readColors };
})(window);
