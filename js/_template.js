// Skeleton for a new simulation. Everything below is commented out on purpose,
// so this file does nothing until you copy it.
//
// To make a simulation:
//   1. Copy this file to js/sims/my-simulation.js (any name, no spaces).
//   2. Remove the leading "// " from the code below and fill in the blanks.
//   3. In your project page (projects/my-page.html) add, where the simulation
//      should appear:
//
//        <div id="sim-my-simulation"></div>
//
//      and, just before the closing </body> tag, after the project.js line:
//
//        <script src="../js/sim.js"></script>
//        <script src="../js/sims/my-simulation.js"></script>
//
//   4. The id in the div must match the id in Sim.create below.
//
// The full list of options is documented at the top of js/sim.js.
//
// ---------------------------------------------------------------------------
//
// Sim.create('#sim-my-simulation', {
//   ariaLabel: 'Describe what the picture shows, for screen readers',
//   aspect: 16 / 9,                // canvas width / height
//
//   // Simulation time advanced per step. A function lets a slider control it,
//   // for example the numerical step size h from the write-up.
//   dt: (params) => params.h,
//   timeScale: 1,                  // simulation time per real second
//
//   controls: [
//     // live: takes effect immediately
//     { id: 'h', label: 'Step size h', min: 0.001, max: 0.02, step: 0.001, value: 0.005 },
//     // resets: true restarts the simulation when changed (use for initial conditions)
//     { id: 'x0', label: 'Initial x', min: -1, max: 1, step: 0.05, value: 0.5, resets: true }
//   ],
//
//   // Build and return a fresh state. Called on load and on every reset.
//   init(params, view) {
//     return { x: params.x0, v: 0 };
//   },
//
//   // Advance the state by dt. Mutate the state object, no return value.
//   step(state, dt, params) {
//     // your numerical method goes here
//   },
//
//   // Draw the current state. g is a normal canvas 2D context in CSS pixels,
//   // already cleared and filled with the page background.
//   draw(g, state, params, view) {
//     g.fillStyle = view.colors.accent;
//     g.beginPath();
//     g.arc(view.width / 2 + state.x * 100, view.height / 2, 6, 0, 2 * Math.PI);
//     g.fill();
//   },
//
//   // Optional line of text under the canvas, refreshed about 10 times a second.
//   readouts(state, params, view) {
//     return [['t =', view.time.toFixed(2)]];
//   }
// });
