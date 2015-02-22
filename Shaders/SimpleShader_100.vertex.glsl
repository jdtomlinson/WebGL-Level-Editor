#version 100
// Vertex Shader, GLSL v1.00


// INPUTS
attribute vec4 a_vertex;
attribute vec4 a_color;
attribute vec4 a_texCoord;
attribute vec4 a_normal;
attribute vec4 a_tangent;
uniform bool u_useTexture;
uniform float u_time;
uniform mat4 u_modelViewProjectionMatrix;


// OUTPUTS
varying vec4 a_screenPosition;
varying vec4 a_worldPosition;
varying vec4 a_surfaceColor;
varying vec2 a_textureCoordinates;
varying vec4 a_surfaceNormal;
varying vec4 a_surfaceTangent;
varying vec3 a_surfaceBitangent;


//-----------------------------------------------------------------------------------------------
void main()
{
	gl_Position = u_modelViewProjectionMatrix * a_vertex;
	a_screenPosition = gl_Position;
	a_worldPosition = a_vertex;
	a_surfaceColor = a_color;
    a_textureCoordinates = a_texCoord.xy;
	a_surfaceNormal = a_normal;
    a_surfaceTangent = a_tangent;
	a_surfaceBitangent = cross( a_normal.xyz, a_tangent.xyz );
}