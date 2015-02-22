#version 100
// Fragment Shader, GLSL v1.00

precision mediump float;

// INPUTS
uniform vec3 u_colorID;
varying vec4 a_screenPosition;
varying vec4 a_worldPosition;
varying vec2 a_textureCoordinates;
varying vec4 a_surfaceColor;
varying vec4 a_surfaceTangent;
varying vec3 a_surfaceBitangnet;

// OUTPUTS
//out vec4 a_fragColor;


//-----------------------------------------------------------------------------------------------
void main()
{
	gl_FragColor = vec4( u_colorID, 1.0 );
}