//----------------------------------------------------------------------------------------------------------
const DEBUG_ARROW_HEAD_LENGTH = 0.05;
const DEBUG_ROTATION_RINGS_LINEAR_ALPHA = 0.5;


//----------------------------------------------------------------------------------------------------------
var DebugAxis = function( axisLength )
{
    this.position = new Vector3( 0.0, 0.0, 0.0 );
    this.vbo = null;
    this.vertices = [];
    this.Render = DrawDebugAxis;
    
    InitalizeDebugAxis( this, axisLength );
}


//----------------------------------------------------------------------------------------------------------
var DebugRotationRings = function( ringRadius )
{
    this.position = new Vector3( 0.0, 0.0, 0.0 );
    this.vbo = null;
    this.vertices = [];
    this.ringTexture = null;
    this.Render = DrawDebugRotationRings;
    
    InitalizeDebugRotationRings( this, ringRadius );
}


//----------------------------------------------------------------------------------------------------------
var InitalizeDebugAxis = function( axis, axisLength )
{
    // X axis
    axis.vertices.push( CreateVert( [ 0.0, 0.0, 0.0 ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ axisLength, 0.0, 0.0 ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ axisLength, 0.0, 0.0 ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ axisLength - DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ axisLength, 0.0, 0.0 ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ axisLength - DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ axisLength, 0.0, 0.0 ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ axisLength - DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ axisLength, 0.0, 0.0 ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ axisLength - DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH ], [ 1.0, 0.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    // Y axis
    axis.vertices.push( CreateVert( [ 0.0, 0.0, 0.0 ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ 0.0, axisLength, 0.0 ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, axisLength, 0.0 ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ -DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, axisLength, 0.0 ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ -DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, axisLength, 0.0 ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, axisLength, 0.0 ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 1.0, 0.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    // Z axis
    axis.vertices.push( CreateVert( [ 0.0, 0.0, 0.0 ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ 0.0, 0.0, axisLength ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, 0.0, axisLength ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ -DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, 0.0, axisLength ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ -DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, 0.0, axisLength ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ DEBUG_ARROW_HEAD_LENGTH, -DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    
    axis.vertices.push( CreateVert( [ 0.0, 0.0, axisLength ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
    axis.vertices.push( CreateVert( [ DEBUG_ARROW_HEAD_LENGTH, DEBUG_ARROW_HEAD_LENGTH, axisLength - DEBUG_ARROW_HEAD_LENGTH ], [ 0.0, 0.0, 1.0, 1.0 ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0, 0.0 ] ) );
}


//----------------------------------------------------------------------------------------------------------
var InitalizeDebugRotationRings = function( rotationRings, ringRadius )
{
    // roll (negative X facing)
    rotationRings.vertices.push( CreateVert( [ 0.0, ringRadius, -ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, -ringRadius, -ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, ringRadius, ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    rotationRings.vertices.push( CreateVert( [ 0.0, -ringRadius, -ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, -ringRadius, ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, ringRadius, ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    // roll (positive X facing)
    rotationRings.vertices.push( CreateVert( [ 0.0, ringRadius, -ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, ringRadius, ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, -ringRadius, -ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    rotationRings.vertices.push( CreateVert( [ 0.0, -ringRadius, -ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, ringRadius, ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ 0.0, -ringRadius, ringRadius ], [ 1.0, 0.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    // pitch (positive Y facing)
    rotationRings.vertices.push( CreateVert( [ ringRadius, 0.0, -ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, 0.0, ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, 0.0, -ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    rotationRings.vertices.push( CreateVert( [ -ringRadius, 0.0, -ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, 0.0, ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, 0.0, ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    // pitch (negative Y facing)
    rotationRings.vertices.push( CreateVert( [ ringRadius, 0.0, -ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, 0.0, -ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, 0.0, ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    rotationRings.vertices.push( CreateVert( [ -ringRadius, 0.0, -ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, 0.0, ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, 0.0, ringRadius ], [ 0.0, 1.0, 0.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    // yaw (negative Z facing)
    rotationRings.vertices.push( CreateVert( [ ringRadius, -ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, -ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    rotationRings.vertices.push( CreateVert( [ -ringRadius, -ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    // yaw (positive Z facing)
    rotationRings.vertices.push( CreateVert( [ ringRadius, -ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, -ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    
    rotationRings.vertices.push( CreateVert( [ -ringRadius, -ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 1.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ ringRadius, ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 0.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
    rotationRings.vertices.push( CreateVert( [ -ringRadius, ringRadius, 0.0 ], [ 0.0, 0.0, 1.0, DEBUG_ROTATION_RINGS_LINEAR_ALPHA ], [ 1.0, 0.0 ], [ 0.0, 0.0, 0.0 ] ) );
}


//----------------------------------------------------------------------------------------------------------
var DrawDebugAxis = function()
{
    PushMatrix();
    
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vbo );
    gl.vertexAttribPointer( VERTEX_ATTRIB_POSITIONS, POSITION_SIZE, gl.FLOAT, false, VERTEX_SIZE, POSITION_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_COLORS, COLOR_SIZE, gl.FLOAT, false, VERTEX_SIZE, COLOR_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_TEX_COORDS, TEX_COORD_SIZE, gl.FLOAT, false, VERTEX_SIZE, TEX_COORD_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_NORMALS, NORMAL_SIZE, gl.FLOAT, false, VERTEX_SIZE, NORMAL_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_TANGENT, TANGENT_SIZE, gl.FLOAT, false, VERTEX_SIZE, TANGENT_OFFSET );
    
    gl.drawArrays( gl.LINES, 0, this.vertices.length );
    
    PopMatrix();
}


//----------------------------------------------------------------------------------------------------------
var DrawDebugRotationRings = function()
{
    PushMatrix();
    
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vbo );
    gl.vertexAttribPointer( VERTEX_ATTRIB_POSITIONS, POSITION_SIZE, gl.FLOAT, false, VERTEX_SIZE, POSITION_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_COLORS, COLOR_SIZE, gl.FLOAT, false, VERTEX_SIZE, COLOR_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_TEX_COORDS, TEX_COORD_SIZE, gl.FLOAT, false, VERTEX_SIZE, TEX_COORD_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_NORMALS, NORMAL_SIZE, gl.FLOAT, false, VERTEX_SIZE, NORMAL_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_TANGENT, TANGENT_SIZE, gl.FLOAT, false, VERTEX_SIZE, TANGENT_OFFSET );
    
    gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length );
    
    PopMatrix();
}