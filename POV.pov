camera {
  location <0, 10, 0>
  look_at <0, 0, 0>
  angle 90
}

light_source { <10, 10, -10> color rgb <1, 1, 1> }

plane {
  y, 0
  texture {
    pigment {
      checker
      color rgb <0.3, 0.3, 1.0>, rgb <1.0, 1.0, 1.0>
      scale 0.8
    }
    finish {
      ambient 0.1
      diffuse 0.9
      specular 0.6
      reflection 0.1
    }
  }
}