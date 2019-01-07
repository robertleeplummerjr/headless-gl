{
  'variables': {
    'platform': '<(OS)',
    'angle_lib_dir': '<(module_root_dir)/deps/angle/out/Debug'
  },
  'conditions': [
    ['platform == "mac"', {'variables': {'platform': 'darwin'}}],
    ['platform == "win"', {'variables': {'platform': 'win32'}}]
  ],
  'targets': [
    {
      'target_name': 'webgl',
      'defines': [
        'VERSION=1.0.0',
        'EGL_EGL_PROTOTYPES=1'
      ],
      'sources': [
        'src/bindings.cc',
        'src/webgl.cc',
        'src/procs.cc'
      ],
      'include_dirs': [
        "<!(node -e \"require('nan')\")",
        '<(module_root_dir)/deps/angle/include'
      ],
      'conditions': [
        [
          'OS=="linux"', {
            'libraries' : [
              '-Wl,-rpath,<@(angle_lib_dir)',
              '-lGLESv2',
              '-lEGL',
            ],
            'library_dirs' : ['<(angle_lib_dir)'],
          }
        ],
        [
          'OS=="mac"', {
            'libraries' : [
              '-Wl,-rpath,<@(angle_lib_dir)',
              '-lGLESv2',
              '-lEGL',
            ],
            'library_dirs' : ['<(angle_lib_dir)'],
          }
        ]
      ]
    }
  ]
}
