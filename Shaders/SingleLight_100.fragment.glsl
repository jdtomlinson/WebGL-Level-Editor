#version 100
// Fragment Shader, GLSL v1.10

precision mediump float;

// INPUTS
uniform sampler2D u_diffuseTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_specularTexture;
uniform sampler2D u_ambientTexture;
uniform vec3 u_lightPosition;
varying vec4 a_screenPosition;
varying vec4 a_worldPosition;
varying vec4 a_surfaceColor;
varying vec4 a_surfaceNormal;
varying vec2 a_textureCoordinates;


// OUTPUTS
//out vec4 a_fragColor;


//-----------------------------------------------------------------------------------------------
void main()
{
	vec4 diffuseTexel = texture2D( u_diffuseTexture, a_textureCoordinates );
	//a_fragColor = a_surfaceNormal;
	vec3 lightToPoint = normalize( u_lightPosition - a_worldPosition.xyz );
	gl_FragColor = ( diffuseTexel * a_surfaceColor ) * dot( lightToPoint, normalize( a_surfaceNormal.xyz ) );
	gl_FragColor.w = 1.0;
}