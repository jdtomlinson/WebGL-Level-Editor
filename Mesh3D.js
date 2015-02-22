//----------------------------------------------------------------------------------------------------------
var Mesh3D = function()
{
    this.position = new Vector3( 0.0, 0.0, 0.0 );
    this.rotationMat = new mat4.create();
    mat4.identity( this.rotationMat );
    this.uniformScale = 1.0;
    this.nonUniformScale = new Vector3( 1.0, 1.0, 1.0 );
    this.radius = 0;
    this.vbo = null;
    this.diffuseTexture = null;
    this.normalTexture = null;
    this.specularTexture = null;
    this.emissiveTexture = null;
    this.vertices = [];
    this.AddVert = function( vertex ) { this.vertices.push( vertex ); }
    this.CreateVert;
}


//----------------------------------------------------------------------------------------------------------
var GetVectorFromString = function( vecString, separatingChar, isConvertingToNumber )
{
    var valueList = vecString.trim().split( separatingChar );
    if( !isConvertingToNumber )
        return valueList;
    
    for( var valIndex = 0; valIndex < valueList.length; ++valIndex )
    {
        valueList[ valIndex ] = Number( valueList[ valIndex ] );
    }
    
    return valueList;
}


//----------------------------------------------------------------------------------------------------------
var SetFaceVertices = function( mesh, vertArray, positionArray, texCoordArray, normalArray )
{
    for( var vertIndex = 0; vertIndex < vertArray.length; ++vertIndex )
    {
        var vertData = GetVectorFromString( vertArray[ vertIndex ], '/', true );
        var vertPosition = [ 0.0, 0.0, 0.0 ];
        var vertTexCoord = [ 0.0, 0.0 ];
        var vertNormal = [ 0.0, 0.0, 0.0 ];
        
        var prevVertIndex = vertIndex - 1;
        var nextVertIndex = vertIndex + 1;
        
        if( prevVertIndex < 0 )
        {
            prevVertIndex = vertArray.length - 1;
        }
        
        if( nextVertIndex >= vertArray.length )
        {
            nextVertIndex = 0;
        }
        
        var prevVertData = GetVectorFromString( vertArray[ prevVertIndex ], '/', true );
        var nextVertData = GetVectorFromString( vertArray[ nextVertIndex ], '/', true );
        
        if( vertData.length > 0 )
        {
            var positionIndex = vertData[0];
            if( positionIndex != 0 )
            {
                vertPosition = positionArray[ positionIndex - 1 ];
            }
            
            if( vertData.length > 1 )
            {
                var texCoordIndex = vertData[1];
                if( texCoordIndex != 0 )
                {
                    vertTexCoord = texCoordArray[ texCoordIndex - 1 ];
                }
                
                if( vertData.length > 2 )
                {
                    var normalIndex = vertData[2];
                    if( normalIndex != 0 )
                    {
                        vertNormal = normalArray[ normalIndex - 1 ];
                    }
                }
            }
        }
        
        var vert = CreateVert( vertPosition, [ 1.0, 1.0, 1.0, 1.0 ], vertTexCoord, vertNormal );
        
        var prevPositionIndex = prevVertData[0];
        var prevTexCoordIndex = prevVertData[1];
        var nextPositionIndex = nextVertData[0];
        var nextTexCoordIndex = nextVertData[1];
        var tangent = new Vector3( 0.0, 0.0, 0.0 );
        
        if( prevPositionIndex != 0 && prevTexCoordIndex != 0 && nextPositionIndex != 0 && nextTexCoordIndex != 0 )
        {
            var prevVertPosition = positionArray[ prevPositionIndex - 1 ];
            var prevVertTexCoord = texCoordArray[ prevTexCoordIndex - 1 ];
            var nextVertPosition = positionArray[ nextPositionIndex - 1 ];
            var nextVertTexCoord = texCoordArray[ nextTexCoordIndex - 1 ];
            
            ComputeSurfaceTangentsAtVertex( vert.tangent,
                                            new Vector3( vertPosition[0], vertPosition[1], vertPosition[2] ),
                                            new Vector3( vertNormal[0], vertNormal[1], vertNormal[2] ),
                                            new Vector2( vertTexCoord[0], vertTexCoord[1] ),
                                            new Vector3( prevVertPosition[0], prevVertPosition[1], prevVertPosition[2] ),
                                            new Vector2( prevVertTexCoord[0], prevVertTexCoord[1] ),
                                            new Vector3( nextVertPosition[0], nextVertPosition[1], nextVertPosition[2] ),
                                            new Vector2( nextVertTexCoord[0], nextVertTexCoord[1] )
                                          );
        }
        
        mesh.AddVert( vert );
    }
}


//----------------------------------------------------------------------------------------------------------
Mesh3D.GetMeshFromFile = function( fileText )
{
    var returnMesh = new Mesh3D();
    
    var positions = [];
    var normals = [];
    var texCoords = [];
    
    var lines = fileText.split( "\n" );
    for( var lineIndex = 0; lineIndex < lines.length; ++lineIndex )
    {
        var line = lines[ lineIndex ].trim();
        
        if( line.length > 0 && line[0] == "#" )
        {
            continue;
        }
        
        if( line.length > 1 )
        {
            if( line.substr( 0, 2 ) == "v " )
            {
                positions.push( GetVectorFromString( line.substr( 2 ), ' ', true ) );
            }
            else if( line.substr( 0, 2 ) == "vn" )
            {
                normals.push( GetVectorFromString( line.substr( 2 ), ' ', true ) );
            }
            else if( line.substr( 0, 2 ) == "vt" )
            {
                texCoords.push( GetVectorFromString( line.substr( 2 ), ' ', true ) );
            }
            else if( line.substr( 0, 1 ) == "f" )
            {
                var faceData = GetVectorFromString( line.substr( 1 ), ' ', false );
                for( var i = 1; i < faceData.length - 1; ++i )
                {
                    SetFaceVertices( returnMesh, [ faceData[0], faceData[i], faceData[ i + 1 ] ], positions, texCoords, normals );
                }
            }
        }
    }
    
    for( var positionIndex = 0; positionIndex < positions.length; ++positionIndex )
    {
        var position = positions[ positionIndex ];
        for( var distanceIndex = 0; distanceIndex < position.length; ++distanceIndex )
        {
            var distance = Math.abs( position[ distanceIndex ] );
            if( distance > returnMesh.radius )
                returnMesh.radius = distance;
        }
    }
    
    return returnMesh;
}