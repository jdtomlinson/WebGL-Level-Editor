#version 100
// Vertex Shader, GLSL v1.00


// INPUTS
uniform mat4 u_modelViewProjectionMatrix;
uniform mat4 u_modelRotationMatrix;
attribute vec4 a_vertex;
attribute vec4 a_color;
attribute vec4 a_normal;
attribute vec4 a_tangent;
attribute vec4 a_texCoord;


// OUTPUTS
varying vec4 a_screenPosition;
varying vec4 a_worldPosition;
varying vec4 a_surfaceColor;
varying vec4 a_surfaceNormal;
varying vec4 a_surfaceTangent;
varying vec3 a_surfaceBitangent;
varying vec2 a_textureCoordinates;


//-----------------------------------------------------------------------------------------------
void main()
{
	gl_Position = u_modelViewProjectionMatrix * a_vertex;
	a_screenPosition = gl_Position;
	a_worldPosition = a_vertex;
	a_surfaceColor = a_color;
	a_surfaceNormal = u_modelRotationMatrix * a_normal;
	a_surfaceTangent = a_tangent;
	a_surfaceBitangent = cross(a_normal.xyz, a_tangent.xyz);
	a_textureCoordinates = a_texCoord.xy;
}