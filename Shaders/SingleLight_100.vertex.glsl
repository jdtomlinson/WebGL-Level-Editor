#version 100
// Vertex Shader, GLSL v1.00


// INPUTS
uniform mat4 u_modelViewProjectionMatrix;
attribute vec4 a_vertex;
attribute vec4 a_color;
attribute vec4 a_normal;
attribute vec4 a_texCoord;


// OUTPUTS
varying vec4 a_screenPosition;
varying vec4 a_worldPosition;
varying vec4 a_surfaceColor;
varying vec4 a_surfaceNormal;
varying vec2 a_textureCoordinates;


//-----------------------------------------------------------------------------------------------
void main()
{
	gl_Position = u_modelViewProjectionMatrix * a_vertex;
	a_screenPosition = gl_Position;
	a_worldPosition = a_vertex;
	a_surfaceNormal = a_normal;
	a_surfaceColor = a_color;
	a_textureCoordinates = a_texCoord.xy;
}