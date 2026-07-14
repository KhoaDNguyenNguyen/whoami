// js/data/FileSystem.js

/**
 * Represents the static file system available in the terminal.
 */
export const VirtualFileSystem = {
  'about': {
    'profile.txt': '<span class="text-cyan">Nguyen Nguyen Dang Khoa</span>\n<span class="text-yellow">Electronics Engineering.</span>\n<span class="text-green">Ho Chi Minh City University of Technology and Engineering.</span>\n\nBuilding hardware instrumentation and writing statistical data analysis pipelines.\n\nHobby: Drinking coffee.',
    'now.txt': '<span class="text-green">✔</span> Debugging baseband signal extraction in SDR.\n<span class="text-green">✔</span> Porting legacy Fortran physics models to Python.\n<span class="text-green">✔</span> Studying neutrino phenomenology.'
  },
  'research': {
    'current_focus.txt': 'Bypassing LTI filter limitations using <span class="text-magenta">Bayesian parameter estimation</span> directly on complex baseband data.',
    'lab_notes': {
      'weak_signal_recovery.md': 'Standard FIR filters fail at <span class="text-red">SNR < 0</span> when signal and noise overlap.\n\nTreating the baseband data as an additive statistical model instead. Using <span class="text-yellow">Nested Sampling</span> to isolate the signal.\n\nProving to be more reliable than amplitude thresholding.',
      'legacy_code.md': 'Integrating Covariant Confined Quark Model <span class="text-magenta">Fortran</span> routines with <span class="text-blue">Python</span> via <span class="text-cyan">f2py</span>.\n\nRequired this to run 16-dimensional parameter estimation with <span class="text-yellow">Dynesty</span>.'
    }
  },
  'projects': {
    'thermognosis': {},
    'bayesian_sdr': {},
    'embedded_linux': {}
  },
  'reading': {
    'current.txt': '<span class="text-yellow">1.</span> Neutrino cross-sections\n<span class="text-yellow">2.</span> Reversible Jump MCMC implementations\n<span class="text-yellow">3.</span> High-speed ADC architectures',
    'bookshelf.txt': '<span class="text-cyan">»</span> Information Theory, Inference and Learning Algorithms (MacKay)\n<span class="text-cyan">»</span> Practical Electronics for Inventors (Scherz)'
  },
  'vson': {
    'why_vson.txt': 'Neutrino experiments are essentially massive <span class="text-magenta">DAQ</span> and <span class="text-magenta">signal processing</span> challenges.\n\nI understand the electronics and the statistics. I need to understand the physics to build the right tools.'
  },
  'intro.sh': '#!/bin/bash'
};