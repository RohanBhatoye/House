camera {
  location <0, 0, -7>
  look_at <0, 0, 0>
  angle 30
}

light_source { <10, 10, -10> color rgb <1, 1, 1> }

box {
  <-5, -5, -5>, <5, 5, 5>
  texture {
    pigment {
      wood
      turbulence 0.3
      scale 0.1
      octaves 5
      lambda 2.5
      omega 0.7
      color_map {
         [0.0 color rgb <0.8, 0.8, 0.4>]
        [0.3 color rgb <0.9, 0.9, 0.5>]
        [0.6 color rgb <1.0, 1.0, 0.6>]
        [1.0 color rgb <1.0, 1.0, 0.8>]
      }
    }
    finish {
      ambient 0.1
      diffuse 0.9
      specular 0.6
      reflection 0.1
    }
  }
}