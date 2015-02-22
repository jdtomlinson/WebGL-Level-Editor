//----------------------------------------------------------------------------------------------------------
const POSITION_SIZE = 3;
const POSITION_OFFSET = 0;
const COLOR_SIZE = 4;
const COLOR_OFFSET = POSITION_OFFSET + ( 4 * POSITION_SIZE );
const TEX_COORD_SIZE = 2;
const TEX_COORD_OFFSET = COLOR_OFFSET + ( 4 * COLOR_SIZE );
const NORMAL_SIZE = 3;
const NORMAL_OFFSET = TEX_COORD_OFFSET + ( 4 * TEX_COORD_SIZE );
const TANGENT_SIZE = 3;
const TANGENT_OFFSET = NORMAL_OFFSET + ( 4 * NORMAL_SIZE );
const VERTEX_SIZE = 4 * ( POSITION_SIZE + COLOR_SIZE + TEX_COORD_SIZE + NORMAL_SIZE + TANGENT_SIZE );
const ONE_OVER_PI = 1.0 / Math.PI;
const ONE_OVER_ONE_EIGHTY = 1.0 / 180.0;


//----------------------------------------------------------------------------------------------------------
function ConvertRadToDeg( rad )
{
    return rad * ( 180.0 * ONE_OVER_PI );
}


//----------------------------------------------------------------------------------------------------------
function ConvertDegToRad( deg )
{
    return deg * ( Math.PI * ONE_OVER_ONE_EIGHTY );
}


//----------------------------------------------------------------------------------------------------------
function Vector2( x, y )
{
    this.x = x;
    this.y = y;
}


//----------------------------------------------------------------------------------------------------------
function SubtractVector2( a, b, result )
{
    result.x = a.x - b.x;
    result.y = a.y - b.y;
}


//----------------------------------------------------------------------------------------------------------
function Vector3( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
}


//----------------------------------------------------------------------------------------------------------
function AddVector3( a, b, result )
{
    result.x = a.x + b.x;
    result.y = a.y + b.y;
    result.z = a.z + b.z;
}


//----------------------------------------------------------------------------------------------------------
function SubtractVector3( a, b, result )
{
    result.x = a.x - b.x;
    result.y = a.y - b.y;
    result.z = a.z - b.z;
}


//----------------------------------------------------------------------------------------------------------
function MultiplyVector3( vec, scalar )
{
    vec.x *= scalar;
    vec.y *= scalar;
    vec.z *= scalar;
}


//----------------------------------------------------------------------------------------------------------
function GetLengthVector3( vec )
{
    return Math.sqrt( ( vec.x * vec.x ) + ( vec.y * vec.y ) + ( vec.z * vec.z ) );
}


//----------------------------------------------------------------------------------------------------------
function NormalizeVector3( vec )
{
    var length = GetLengthVector3( vec );
	var oneOverLength = 1.0;

	if( length != 0.0 )
		oneOverLength = 1.0 / length ;

	vec.x *= oneOverLength;
	vec.y *= oneOverLength;
	vec.z *= oneOverLength;
}


//----------------------------------------------------------------------------------------------------------
function DotProductVector3( a, b )
{
    return ( a.x * b.x ) + ( a.y * b.y ) + ( a.z * b.z );
}


//----------------------------------------------------------------------------------------------------------
function CrossProduct( a, b, result )
{
    result.x = ( a.y * b.z ) - ( b.y * a.z );
	result.y = -( a.x * b.z ) + ( b.x * a.z );
	result.z = ( a.x * b.y ) - ( b.x * a.y );
}


//----------------------------------------------------------------------------------------------------------
function Color3( r, g, b )
{
    this.r = r;
    this.g = g;
    this.b = b;
}


//----------------------------------------------------------------------------------------------------------
function Color4( r, g, b, a )
{
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}


//----------------------------------------------------------------------------------------------------------
function EulerAngles( yaw, pitch, roll )
{
    this.yaw = yaw;
    this.pitch = pitch;
    this.roll = roll;
}


//----------------------------------------------------------------------------------------------------------
function AddEulerAngles( a, b, result )
{
    result.yaw = a.yaw + b.yaw;
    result.pitch = a.pitch + b.pitch;
    result.roll = a.roll + b.roll;
}


//----------------------------------------------------------------------------------------------------------
function MultiplyEulerAngles( angles, scalar )
{
    angles.yaw *= scalar;
    angles.pitch *= scalar;
    angles.roll *= scalar;
}


//----------------------------------------------------------------------------------------------------------
function Vertex()
{
    this.position = new Vector3( 0.0, 0.0, 0.0 );
    this.color = new Color4( 1.0, 1.0, 1.0, 1.0 );
    this.texCoords = new Vector2( 0.0, 0.0 );
    this.normal = new Vector3( 0.0, 0.0, 0.0 );
    this.tangent = new Vector3( 0.0, 0.0, 0.0 );
}


//----------------------------------------------------------------------------------------------------------
function Camera()
{
    this.position = new Vector3( 0.0, 0.0, 0.0 );
    this.orientation = new EulerAngles( 0.0, 0.0, 0.0 );
}


//----------------------------------------------------------------------------------------------------------
function Light()
{
    this.position = new Vector3( 0.0, 0.0, 0.0 );
    this.direction = new Vector3( 0.0, 0.0, 0.0 );
    this.color = new Color4( 1.0, 1.0, 1.0, 1.0 );
    this.innerRadius = 0.0;
	this.outerRadius = 0.0;
	this.innerApertureDot = -1.0;
	this.outerApertureDot = -1.0;
	this.fractionAmbient = 0.0;
	this.isPositionless = false;
}


//----------------------------------------------------------------------------------------------------------
function SetVertexTangent( vertex, prevAdjacentVert, nextAdjacentVert )
{
    ComputeSurfaceTangentsAtVertex( vertex.tangent, vertex.position, vertex.normal, vertex.texCoords, prevAdjacentVert.position, prevAdjacentVert.texCoords, nextAdjacentVert.position, nextAdjacentVert.texCoords );
}


//----------------------------------------------------------------------------------------------------------
function ComputeSurfaceTangentsAtVertex(
    out_vertexSurfaceTangent,
	thisVertexPosition,
	thisVertexNormal,
	thisVertexTexCoords,
	previousAdjacentVertexPosition,
	previousAdjacentVertexTexCoords,
	nextAdjacentVertexPosition,
	nextAdjacnetVertexTexCoords
)
{
    var vecToPrevious = new Vector3( 0.0, 0.0, 0.0 );
    SubtractVector3( previousAdjacentVertexPosition, thisVertexPosition, vecToPrevious );
    
	var vecToNext = new Vector3( 0.0, 0.0, 0.0 );
    SubtractVector3( nextAdjacentVertexPosition, thisVertexPosition, vecToNext );

	var texToPrevious = new Vector2( 0.0, 0.0 );
    SubtractVector2( previousAdjacentVertexTexCoords, thisVertexTexCoords, texToPrevious );
    
	var texToNext = new Vector2( 0.0, 0.0 );
    SubtractVector2( nextAdjacnetVertexTexCoords, thisVertexTexCoords, texToNext );

	var oneOverDeterminant = 1.0 / ( ( texToPrevious.x * texToNext.y ) - ( texToNext.x * texToPrevious.y ) );

	var uDirectionInWorldSpace = new Vector3( ( texToNext.y * vecToPrevious.x - texToPrevious.y * vecToNext.x ), ( texToNext.y * vecToPrevious.y - texToPrevious.y * vecToNext.y ), ( texToNext.y * vecToPrevious.z - texToPrevious.y * vecToNext.z ) );
	var vDirectionInWorldSpace = new Vector3( ( texToPrevious.x * vecToNext.x - texToNext.x * vecToPrevious.x ), ( texToPrevious.x * vecToNext.y - texToNext.x * vecToPrevious.y ), ( texToPrevious.x * vecToNext.z - texToNext.x * vecToPrevious.z ) );

	uDirectionInWorldSpace.x *= oneOverDeterminant;
    uDirectionInWorldSpace.y *= oneOverDeterminant;
    uDirectionInWorldSpace.z *= oneOverDeterminant;
    
	vDirectionInWorldSpace.x *= oneOverDeterminant;
    vDirectionInWorldSpace.y *= oneOverDeterminant;
    vDirectionInWorldSpace.z *= oneOverDeterminant;
    
	var bitangentFromCross = new Vector3( 0.0, 0.0, 0.0 );
    CrossProduct( thisVertexNormal, uDirectionInWorldSpace, bitangentFromCross );
    NormalizeVector3( bitangentFromCross )
    
	var tangentFromCross = new Vector3( 0.0, 0.0, 0.0 );
    CrossProduct( bitangentFromCross, thisVertexNormal, tangentFromCross );
    
	out_vertexSurfaceTangent.x = tangentFromCross.x;
    out_vertexSurfaceTangent.y = tangentFromCross.y;
    out_vertexSurfaceTangent.z = tangentFromCross.z;
}


//----------------------------------------------------------------------------------------------------------
function CreateVert( vertPosition, vertColor, vertTexCoords, vertNormal )
{
    var vert = new Vertex();
    
    if( vertPosition )
    {
        vert.position.x = vertPosition[0];
        vert.position.y = vertPosition[1];
        vert.position.z = vertPosition[2];
    }
    
    if( vertColor )
    {
        vert.color.r = vertColor[0];
        vert.color.g = vertColor[1];
        vert.color.b = vertColor[2];
        if( vertColor.length > 3 )
        {
            vert.color.a = vertColor[3];
        }
    }
    
    if( vertTexCoords )
    {
        vert.texCoords.x = vertTexCoords[0];
        vert.texCoords.y = vertTexCoords[1];
    }
    
    if( vertNormal )
    {
        vert.normal.x = vertNormal[0];
        vert.normal.y = vertNormal[1];
        vert.normal.z = vertNormal[2];
    }
    
    return vert;
}