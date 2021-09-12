#version 300 es
  in vec4 vertex; 
  out vec2 pixelCoordinate; 
  void main(){
     gl_Position = vertex;  
     pixelCoordinate = vertex.xy*0.5+0.5; 
  }