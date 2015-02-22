//----------------------------------------------------------------------------------------------------------
const FRAMES_PER_SECOND = 60;
const FRAME_TIME_SECONDS = 1.0 / FRAMES_PER_SECOND;
const ONE_OVER_TWO_FIFTY_FIVE = 1.0 / 255.0;
const VERTEX_ATTRIB_POSITIONS = 0;
const VERTEX_ATTRIB_COLORS = 1;
const VERTEX_ATTRIB_TEX_COORDS = 2;
const VERTEX_ATTRIB_NORMALS = 3;
const VERTEX_ATTRIB_TANGENT = 4;
const CUBE_X_AXIS_HALF_LENGTH = 0.5;
const CUBE_Y_AXIS_HALF_LENGTH = 0.5;
const CUBE_Z_AXIS_HALF_LENGTH = 0.5;
const FIELD_OF_VIEW_Y = 45.0;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 10000.0;
const MOVE_SPEED_POINTS_PER_SECOND = 40.0;
const ROTATION_DEGREES_PER_SECOND = 480.0;


//----------------------------------------------------------------------------------------------------------
var gl = null;
var fbo = null;
var fboTexture = null;
var objCanvas = null;
var diffuseCanvas = null;
var normalCanvas = null;
var specularCanvas = null;
var emissiveCanvas = null;
var objFileReader = null;
var diffuseFileReader = null;
var normalFileReader = null;
var specularFileReader = null;
var emissiveFileReader = null;
var canvasShaderProgram = null;
var fboShaderProgram = null;
var uiShaderProgram = null;
var isUsingDiffuse = false;
var isUsingNormal = false;
var isUsingSpecular = false;
var isUsingEmissive = false;
var topMatrix = null;
var matrixStack = [];
var noMeshSelectedTexture = null;
var noDiffuseTexture = null;
var noNormalTexture = null;
var noSpecularTexture = null;
var noEmissiveTexture = null;
var fileText = "";
var canvasVertexShaderFileName = "Shaders/Normal_Map_100.vertex.glsl";
var canvasFragmentShaderFileName = "Shaders/Normal_Map_100.fragment.glsl";
var fboVertexShaderFileName = "Shaders/Click_FBO_100.vertex.glsl";
var fboFragmentShaderFileName = "Shaders/Click_FBO_100.fragment.glsl";
var uiVertexShaderFileName = "Shaders/SimpleShader_100.vertex.glsl";
var uiFragmentShaderFileName = "Shaders/SimpleShader_100.fragment.glsl";
var meshes = [];
var currentlySelectedMesh = null;
var selectedMeshAxis = new DebugAxis( 1.0 );
var selectedMeshRotationRings = new DebugRotationRings( 0.75 );
var worldCamera = new Camera();
var lights = [];


//----------------------------------------------------------------------------------------------------------
var PushMatrix = function()
{
    var newTopMatrix = mat4.create( topMatrix );
    matrixStack.push( newTopMatrix );
    topMatrix = newTopMatrix;
}


//----------------------------------------------------------------------------------------------------------
var PopMatrix = function()
{
    if( matrixStack.length > 1 )
    {
        matrixStack.pop();
        topMatrix = matrixStack[ matrixStack.length - 1 ];
    }
}


//----------------------------------------------------------------------------------------------------------
var OnLoadObj = function( event )
{
    var mesh = Mesh3D.GetMeshFromFile( event.target.result );
    LoadMesh( mesh );
    meshes.push( mesh );
}


//----------------------------------------------------------------------------------------------------------
var OnLoadDiffuseImg = function( event )
{
    if( currentlySelectedMesh == null )
        return;
    
    currentlySelectedMesh.diffuseTexture = CreateTexture( event.target.result );
    SetDiffuseCanvas( event.target.result );
}


//----------------------------------------------------------------------------------------------------------
var SetDiffuseCanvas = function( imgSrc )
{
    var ctx = diffuseCanvas.getContext( "2d" );
    var img = document.getElementById( "diffuseTexture" );
    img.src = imgSrc;
    ctx.drawImage( img, 0, 0, diffuseCanvas.width, diffuseCanvas.height );
}


//----------------------------------------------------------------------------------------------------------
var OnLoadNormalImg = function( event )
{
    if( currentlySelectedMesh == null )
        return;
    
    currentlySelectedMesh.normalTexture = CreateTexture( event.target.result );
    SetNormalCanvas( event.target.result );
}


//----------------------------------------------------------------------------------------------------------
var SetNormalCanvas = function( imgSrc )
{
    var ctx = normalCanvas.getContext( "2d" );
    var img = document.getElementById( "normalTexture" );
    img.src = imgSrc;
    ctx.drawImage( img, 0, 0, normalCanvas.width, normalCanvas.height );
}


//----------------------------------------------------------------------------------------------------------
var OnLoadSpecularImg = function( event )
{
    if( currentlySelectedMesh == null )
        return;
    
    currentlySelectedMesh.specularTexture = CreateTexture( event.target.result );
    SetSpecularCanvas( event.target.result );
}


//----------------------------------------------------------------------------------------------------------
var SetSpecularCanvas = function( imgSrc )
{
    var ctx = specularCanvas.getContext( "2d" );
    var img = document.getElementById( "specularTexture" );
    img.src = imgSrc;
    ctx.drawImage( img, 0, 0, specularCanvas.width, specularCanvas.height );
}


//----------------------------------------------------------------------------------------------------------
var OnLoadEmissiveImg = function( event )
{
    if( currentlySelectedMesh == null )
        return;
    
    currentlySelectedMesh.emissiveTexture = CreateTexture( event.target.result );
    SetEmissiveCanvas( event.target.result );
}


//----------------------------------------------------------------------------------------------------------
var SetEmissiveCanvas = function( imgSrc )
{
    var ctx = emissiveCanvas.getContext( "2d" );
    var img = document.getElementById( "emissiveTexture" );
    img.src = imgSrc;
    ctx.drawImage( img, 0, 0, emissiveCanvas.width, emissiveCanvas.height );
}


//----------------------------------------------------------------------------------------------------------
var OnDragOver = function( event )
{
    event.preventDefault();
}


//----------------------------------------------------------------------------------------------------------
var OnDropObj = function( event )
{
    var givenFiles = event.dataTransfer.files;
    if( givenFiles.length > 0 )
    {
        var file = givenFiles[0];
        if( file.name.lastIndexOf( ".obj" ) == file.name.length - 4 ) // ensure that this is an .obj file
        {
            objFileReader.readAsText( file );
        }
    }
    
    event.preventDefault();
}


//----------------------------------------------------------------------------------------------------------
var OnClickObj = function( event )
{
    var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    
    x -= objCanvas.offsetLeft;
    y -= objCanvas.offsetTop;
    
    y = objCanvas.clientHeight - y - 1;
    
    GetClickedMesh( x, y );
    UpdateTextureCanvasesBasedOnClickMesh();
    UpdateTextboxesBasedOnClickedMesh();
}


//----------------------------------------------------------------------------------------------------------
var OnDropDiffuse = function( event )
{
    var givenFiles = event.dataTransfer.files;
    if( givenFiles.length > 0 )
    {
        var file = givenFiles[0];
        diffuseFileReader.readAsDataURL( file );
    }
    
    event.preventDefault();
}


//----------------------------------------------------------------------------------------------------------
var OnDropNormal = function( event )
{
    var givenFiles = event.dataTransfer.files;
    if( givenFiles.length > 0 )
    {
        var file = givenFiles[0];
        normalFileReader.readAsDataURL( file );
    }
    
    event.preventDefault();
}


//----------------------------------------------------------------------------------------------------------
var OnDropSpecular = function( event )
{
    var givenFiles = event.dataTransfer.files;
    if( givenFiles.length > 0 )
    {
        var file = givenFiles[0];
        specularFileReader.readAsDataURL( file );
    }
    
    event.preventDefault();
}


//----------------------------------------------------------------------------------------------------------
var OnDropEmissive = function( event )
{
    var givenFiles = event.dataTransfer.files;
    if( givenFiles.length > 0 )
    {
        var file = givenFiles[0];
        emissiveFileReader.readAsDataURL( file );
    }
    
    event.preventDefault();
}


//----------------------------------------------------------------------------------------------------------
var GetShader = function( shaderType, shaderSource )
{
    var shader = gl.createShader( shaderType );
    if( !shader )
    {
        console.log( "Failed to create shader of type " + shaderType );
        alert( "Failed to create shader of type " + shaderType );
        return null;
    }
    
    gl.shaderSource( shader, shaderSource );
    gl.compileShader( shader );
    if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
    {
        console.log( gl.getShaderInfoLog( shader ) );
        alert( gl.getShaderInfoLog( shader ) );
        return null;
    }
    
    return shader;
}


//----------------------------------------------------------------------------------------------------------
var InitializeFileReader = function()
{
    if( !window.File || !window.FileReader || !window.FileList || !window.Blob )
    {
        alert( "Failed to load file reader. You won't be able to load files." );
        fileReader = null;
        return;
    }
    
    objFileReader = new window.FileReader();
    objFileReader.onload = OnLoadObj;
    
    diffuseFileReader = new window.FileReader();
    diffuseFileReader.onload = OnLoadDiffuseImg;
    
    normalFileReader = new window.FileReader();
    normalFileReader.onload = OnLoadNormalImg;
    
    specularFileReader = new window.FileReader();
    specularFileReader.onload = OnLoadSpecularImg;
    
    emissiveFileReader = new window.FileReader();
    emissiveFileReader.onload = OnLoadEmissiveImg;
}


//----------------------------------------------------------------------------------------------------------
var InitializeWebGL = function( canvas )
{
    var testWebGL = null;
    
    try
    {
        testWebGL = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );
    }
    catch(e) {}
    
    if( !testWebGL )
    {
        alert( "Unable to initialize WebGL. Your browser may not support it." );
        window.location = "http://get.webgl.org";
        testWebGL = null;
    }
    
    return testWebGL;
}


//----------------------------------------------------------------------------------------------------------
var InitializeCanvas = function()
{
    objCanvas = document.getElementById( "objCanvas" );
    objCanvas.addEventListener( "dragover", OnDragOver, false );
    objCanvas.addEventListener( "drop", OnDropObj, false );
    objCanvas.addEventListener( "click", OnClickObj, false );
    
    diffuseCanvas = document.getElementById( "diffuseCanvas" );
    diffuseCanvas.addEventListener( "dragover", OnDragOver, false );
    diffuseCanvas.addEventListener( "drop", OnDropDiffuse, false );
    
    normalCanvas = document.getElementById( "normalCanvas" );
    normalCanvas.addEventListener( "dragover", OnDragOver, false );
    normalCanvas.addEventListener( "drop", OnDropNormal, false );
    
    specularCanvas = document.getElementById( "specularCanvas" );
    specularCanvas.addEventListener( "dragover", OnDragOver, false );
    specularCanvas.addEventListener( "drop", OnDropSpecular, false );
    
    emissiveCanvas = document.getElementById( "emissiveCanvas" );
    emissiveCanvas.addEventListener( "dragover", OnDragOver, false );
    emissiveCanvas.addEventListener( "drop", OnDropEmissive, false );
    
    gl = InitializeWebGL( objCanvas );
    if( gl )
    {
        gl.enable( gl.BLEND );
        gl.enable( gl.DEPTH_TEST );
        gl.enable( gl.CULL_FACE );
        gl.frontFace( gl.CCW );
        gl.depthFunc( gl.LEQUAL );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        gl.viewport( 0, 0, objCanvas.clientWidth, objCanvas.clientHeight );
    }
}


//----------------------------------------------------------------------------------------------------------
var CreateShader = function( vertexShaderFileName, fragmentShaderFileName )
{
    var vertexShader = GetShader( gl.VERTEX_SHADER, GetFileText( vertexShaderFileName ) );
    var fragmentShader = GetShader( gl.FRAGMENT_SHADER, GetFileText( fragmentShaderFileName ) );
    
    if( !vertexShader || !fragmentShader )
    {
        console.log( "Failed to create shader!" )
        alert( "Failed to create shader!" );
        return null;
    }
    
    shaderProgram = gl.createProgram();
    gl.attachShader( shaderProgram, vertexShader );
    gl.attachShader( shaderProgram, fragmentShader );
    
    gl.bindAttribLocation( shaderProgram, VERTEX_ATTRIB_POSITIONS, "a_vertex" );
    gl.bindAttribLocation( shaderProgram, VERTEX_ATTRIB_COLORS, "a_color" );
    gl.bindAttribLocation( shaderProgram, VERTEX_ATTRIB_TEX_COORDS, "a_texCoords" );
    gl.bindAttribLocation( shaderProgram, VERTEX_ATTRIB_NORMALS, "a_normal" );
    gl.bindAttribLocation( shaderProgram, VERTEX_ATTRIB_TANGENT, "a_tangent" );
    
    gl.linkProgram( shaderProgram );
    if( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) )
    {
        console.log( gl.getProgramInfoLog( shaderProgram ) );
        alert( gl.getProgramInfoLog( shaderProgram ) );
        return null;
    }
    
    return shaderProgram;
}


//----------------------------------------------------------------------------------------------------------
var InitializeShaders = function()
{
    canvasShaderProgram = CreateShader( canvasVertexShaderFileName, canvasFragmentShaderFileName );
    fboShaderProgram = CreateShader( fboVertexShaderFileName, fboFragmentShaderFileName );
    uiShaderProgram = CreateShader( uiVertexShaderFileName, uiFragmentShaderFileName );
}


//----------------------------------------------------------------------------------------------------------
var InitializeFBO = function()
{
    fboTexture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, fboTexture );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, objCanvas.width, objCanvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture( gl.TEXTURE_2D, null );
    
    fbo = gl.createFramebuffer();
    gl.bindFramebuffer( gl.FRAMEBUFFER, fbo );
    gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTexture, 0 );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
}


//----------------------------------------------------------------------------------------------------------
var InitializeUI = function()
{
    selectedMeshAxis.vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, selectedMeshAxis.vbo );
    gl.bufferData( gl.ARRAY_BUFFER, GetConvertedVertices( selectedMeshAxis.vertices ), gl.STATIC_DRAW );
    
    selectedMeshRotationRings.vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, selectedMeshRotationRings.vbo );
    gl.bufferData( gl.ARRAY_BUFFER, GetConvertedVertices( selectedMeshRotationRings.vertices ), gl.STATIC_DRAW );
    
    window.onkeydown = CheckForMeshDelete;
}


//----------------------------------------------------------------------------------------------------------
var InitializeTextures = function()
{
    noMeshSelectedTexture = CreateTexture( "Default Images/NoMesh.png" );
    noDiffuseTexture = CreateTexture( "Default Images/NoDiffuse.png" );
    noNormalTexture = CreateTexture( "Default Images/NoNormal.png" );
    noSpecularTexture = CreateTexture( "Default Images/NoSpecular.png" );
    noEmissiveTexture = CreateTexture( "Default Images/NoEmissive.png" );
    selectedMeshRotationRings.ringTexture = CreateTexture( "Default Images/Ring.png" );
}


//----------------------------------------------------------------------------------------------------------
var InitializeTextureCanvases = function()
{
    var ctx = diffuseCanvas.getContext( "2d" );
    var img = document.getElementById( "diffuseTexture" );
    ctx.drawImage( img, 0, 0, diffuseCanvas.width, diffuseCanvas.height );
    
    ctx = normalCanvas.getContext( "2d" );
    img = document.getElementById( "normalTexture" );
    ctx.drawImage( img, 0, 0, normalCanvas.width, normalCanvas.height );
    
    ctx = specularCanvas.getContext( "2d" );
    img = document.getElementById( "specularTexture" );
    ctx.drawImage( img, 0, 0, specularCanvas.width, specularCanvas.height );
    
    ctx = emissiveCanvas.getContext( "2d" );
    img = document.getElementById( "emissiveTexture" );
    ctx.drawImage( img, 0, 0, emissiveCanvas.width, emissiveCanvas.height );
}


//----------------------------------------------------------------------------------------------------------
var InitializeLights = function()
{
    var light0 = new Light();
    light0.direction.x = 1.0;
    light0.direction.y = -1.0;
    light0.direction.z = -1.0;
    light0.isPositionless = true;
    
    var light1 = new Light();
    light1.fractionAmbient = 1.0;
    
    lights.push( light0 );
    lights.push( light1 );
}


//----------------------------------------------------------------------------------------------------------
var Initialize = function()
{
    InitializeFileReader();
    InitializeCanvas();
    InitializeShaders();
    InitializeFBO();
    InitializeUI();
    InitializeTextures();
    InitializeTextureCanvases();
    InitializeLights();
    topMatrix = mat4.create();
    mat4.identity( topMatrix );
    matrixStack.push( topMatrix );
}


//----------------------------------------------------------------------------------------------------------
var CheckForMeshDelete = function( event )
{
    if( currentlySelectedMesh === null )
        return;
    
    if( event.keyCode === 46 )
    {
        var meshIndex = meshes.indexOf( currentlySelectedMesh );
        meshes.splice( meshIndex, 1 );
        currentlySelectedMesh = null;
        UpdateTextboxesBasedOnClickedMesh();
        UpdateTextureCanvasesBasedOnClickMesh();
    }
}


//----------------------------------------------------------------------------------------------------------
var GetFileText = function( fileName )
{
    var xhr = new XMLHttpRequest();
    xhr.open( 'get', fileName, false );
    xhr.send();
    return xhr.responseText;
}


//----------------------------------------------------------------------------------------------------------
var RotateCurrentlySelectedMesh = function( rotationVec )
{
    if( currentlySelectedMesh === null )
        return;
    
    var textBoxRotationDeg = document.getElementById( "textBoxRotationDeg" );
    var rotationDeg = Number( textBoxRotationDeg.value );
    textBoxRotationDeg.value = "";
    if( rotationDeg === 0 || rotationDeg === "NaN" )
        return;
    
    mat4.rotate( currentlySelectedMesh.rotationMat, ConvertDegToRad( rotationDeg ), rotationVec );
}


//----------------------------------------------------------------------------------------------------------
var UpdateCurrentlySelectedMeshValues = function()
{
    if( currentlySelectedMesh === null )
        return;
    
    var textBoxPositionX = document.getElementById( "textBoxPositionX" );
    var textBoxPositionY = document.getElementById( "textBoxPositionY" );
    var textBoxPositionZ = document.getElementById( "textBoxPositionZ" );
    
    var textBoxScaleUniform = document.getElementById( "textBoxScaleUniform" );
    var textBoxScaleX = document.getElementById( "textBoxScaleX" );
    var textBoxScaleY = document.getElementById( "textBoxScaleY" );
    var textBoxScaleZ = document.getElementById( "textBoxScaleZ" );
    
    currentlySelectedMesh.position.x = Number( textBoxPositionX.value );
    currentlySelectedMesh.position.y = Number( textBoxPositionY.value );
    currentlySelectedMesh.position.z = Number( textBoxPositionZ.value );
    
    currentlySelectedMesh.uniformScale = Number( textBoxScaleUniform.value );
    currentlySelectedMesh.nonUniformScale.x = Number( textBoxScaleX.value );
    currentlySelectedMesh.nonUniformScale.y = Number( textBoxScaleY.value );
    currentlySelectedMesh.nonUniformScale.z = Number( textBoxScaleZ.value );
}


//----------------------------------------------------------------------------------------------------------
var UpdateTextboxesBasedOnClickedMesh = function()
{
    var textBoxPositionX = document.getElementById( "textBoxPositionX" );
    var textBoxPositionY = document.getElementById( "textBoxPositionY" );
    var textBoxPositionZ = document.getElementById( "textBoxPositionZ" );
    
    var textBoxRotationDeg = document.getElementById( "textBoxRotationDeg" );
    var buttonRoll = document.getElementById( "buttonRoll" );
    var buttonPitch = document.getElementById( "buttonPitch" );
    var buttonYaw = document.getElementById( "buttonYaw" );
    
    var textBoxScaleUniform = document.getElementById( "textBoxScaleUniform" );
    var textBoxScaleX = document.getElementById( "textBoxScaleX" );
    var textBoxScaleY = document.getElementById( "textBoxScaleY" );
    var textBoxScaleZ = document.getElementById( "textBoxScaleZ" );
    
    if( currentlySelectedMesh === null )
    {
        textBoxPositionX.value = "";
        textBoxPositionX.disabled = true;
        textBoxPositionY.value = "";
        textBoxPositionY.disabled = true;
        textBoxPositionZ.value = "";
        textBoxPositionZ.disabled = true;
        
        textBoxRotationDeg.value = "";
        textBoxRotationDeg.disabled = true;
        buttonRoll.disabled = true;
        buttonPitch.disabled = true;
        buttonYaw.disabled = true;
        
        textBoxScaleUniform.value = "";
        textBoxScaleUniform.disabled = true;
        textBoxScaleX.value = "";
        textBoxScaleX.disabled = true;
        textBoxScaleY.value = "";
        textBoxScaleY.disabled = true;
        textBoxScaleZ.value = "";
        textBoxScaleZ.disabled = true;
    }
    else
    {
        textBoxPositionX.value = currentlySelectedMesh.position.x;
        textBoxPositionX.disabled = false;
        textBoxPositionY.value = currentlySelectedMesh.position.y;
        textBoxPositionY.disabled = false;
        textBoxPositionZ.value = currentlySelectedMesh.position.z;
        textBoxPositionZ.disabled = false;
        
        textBoxRotationDeg.disabled = false;
        buttonRoll.disabled = false;
        buttonPitch.disabled = false;
        buttonYaw.disabled = false;
        
        textBoxScaleUniform.value = currentlySelectedMesh.uniformScale;
        textBoxScaleUniform.disabled = false;
        textBoxScaleX.value = currentlySelectedMesh.nonUniformScale.x;
        textBoxScaleX.disabled = false;
        textBoxScaleY.value = currentlySelectedMesh.nonUniformScale.y;
        textBoxScaleY.disabled = false;
        textBoxScaleZ.value = currentlySelectedMesh.nonUniformScale.z;
        textBoxScaleZ.disabled = false;
    }
}


//----------------------------------------------------------------------------------------------------------
var GetClickedMesh = function( screenPositionX, screenPositionY )
{
    if( meshes.length == 0 )
    {
        currentlySelectedMesh = null;
        return;
    }
    
    gl.bindFramebuffer( gl.FRAMEBUFFER, fbo );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clearDepth( 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    PushMatrix();
    
    gl.useProgram( fboShaderProgram );
    gl.enable( gl.DEPTH_TEST );
    mat4.perspective( FIELD_OF_VIEW_Y, objCanvas.clientWidth / objCanvas.clientHeight, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE, topMatrix );
    SetCameraPositionAndOrientation( worldCamera );
    
    for( var meshIndex = 0; meshIndex < meshes.length; ++meshIndex )
    {
        var mesh = meshes[ meshIndex ];
        
        PushMatrix();
        
        gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vbo );
        gl.vertexAttribPointer( VERTEX_ATTRIB_POSITIONS, POSITION_SIZE, gl.FLOAT, false, VERTEX_SIZE, POSITION_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_COLORS, COLOR_SIZE, gl.FLOAT, false, VERTEX_SIZE, COLOR_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_TEX_COORDS, TEX_COORD_SIZE, gl.FLOAT, false, VERTEX_SIZE, TEX_COORD_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_NORMALS, NORMAL_SIZE, gl.FLOAT, false, VERTEX_SIZE, NORMAL_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_TANGENT, TANGENT_SIZE, gl.FLOAT, false, VERTEX_SIZE, TANGENT_OFFSET );
        
        mat4.translate( topMatrix, [ mesh.position.x, mesh.position.y, mesh.position.z ] );
        mat4.multiply( topMatrix, mesh.rotationMat );
        mat4.scale( topMatrix, [ mesh.uniformScale * mesh.nonUniformScale.x, mesh.uniformScale * mesh.nonUniformScale.y, mesh.uniformScale * mesh.nonUniformScale.z ] );
        
        var rValue = ( meshIndex % 256 ) * ONE_OVER_TWO_FIFTY_FIVE;
        var gValue = ( Math.floor( meshIndex / 256 ) % 256 ) * ONE_OVER_TWO_FIFTY_FIVE;
        var bValue = ( Math.floor( meshIndex / ( 256 * 256 ) ) % 256 ) * ONE_OVER_TWO_FIFTY_FIVE;
        gl.uniform3f( gl.getUniformLocation( fboShaderProgram, 'u_colorID' ), rValue, gValue, bValue );
        
        gl.uniformMatrix4fv( gl.getUniformLocation( fboShaderProgram, 'u_modelViewProjectionMatrix' ), false, topMatrix );
        gl.drawArrays( gl.TRIANGLES, 0, mesh.vertices.length );
        
        PopMatrix();
    }
    
    PopMatrix();
    
    var pixelData = new Uint8Array( 4 );
    gl.readPixels( screenPositionX, screenPositionY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelData );
    
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    
    if( pixelData[0] == 255 && pixelData[1] == 255 && pixelData[2] == 255 )
    {
        currentlySelectedMesh = null;
        return;
    }
    
    var meshIndex = pixelData[0] + ( pixelData[1] * 256 ) + ( pixelData[2] * 256 * 256 );
    if( meshIndex >= meshes.length )
    {
        currentlySelectedMesh = null;
        return;
    }
    
    currentlySelectedMesh = meshes[ meshIndex ];
}


//----------------------------------------------------------------------------------------------------------
var UpdateTextureCanvasesBasedOnClickMesh = function()
{
    if( currentlySelectedMesh === null )
    {
        SetDiffuseCanvas( noMeshSelectedTexture.src );
        SetNormalCanvas( noMeshSelectedTexture.src );
        SetSpecularCanvas( noMeshSelectedTexture.src );
        SetEmissiveCanvas( noMeshSelectedTexture.src );
        
        return;
    }
    
    if( currentlySelectedMesh.diffuseTexture === null )
        SetDiffuseCanvas( noDiffuseTexture.src );
    else
        SetDiffuseCanvas( currentlySelectedMesh.diffuseTexture.src );
    
    if( currentlySelectedMesh.normalTexture === null )
        SetNormalCanvas( noNormalTexture.src );
    else
        SetNormalCanvas( currentlySelectedMesh.normalTexture.src );
    
    if( currentlySelectedMesh.specularTexture === null )
        SetSpecularCanvas( noSpecularTexture.src );
    else
        SetSpecularCanvas( currentlySelectedMesh.specularTexture.src );
    
    if( currentlySelectedMesh.emissiveTexture === null )
        SetEmissiveCanvas( noEmissiveTexture.src );
    else
        SetEmissiveCanvas( currentlySelectedMesh.emissiveTexture.src );
}


//----------------------------------------------------------------------------------------------------------
var GetConvertedVertices = function( vertices )
{
    var convertedVerts = [];
    
    for( var vertIndex = 0; vertIndex < vertices.length; ++vertIndex )
    {
        var floatIndex = vertIndex * VERTEX_SIZE;
        var vert = vertices[ vertIndex ];
        
        // add position
        convertedVerts.push( vert.position.x );
        convertedVerts.push( vert.position.y );
        convertedVerts.push( vert.position.z );
        
        // add color
        convertedVerts.push( vert.color.r );
        convertedVerts.push( vert.color.g );
        convertedVerts.push( vert.color.b );
        convertedVerts.push( vert.color.a );
        
        // add texture coordinates
        convertedVerts.push( vert.texCoords.x );
        convertedVerts.push( vert.texCoords.y );
        
        // add normals
        convertedVerts.push( vert.normal.x );
        convertedVerts.push( vert.normal.y );
        convertedVerts.push( vert.normal.z );
        
        // add tangents
        convertedVerts.push( vert.tangent.x );
        convertedVerts.push( vert.tangent.y );
        convertedVerts.push( vert.tangent.z );
    }
    
    return new Float32Array( convertedVerts );
}


//----------------------------------------------------------------------------------------------------------
var LoadMesh = function( mesh )
{
    if( mesh.vertices.length === 0 )
    {
        console.log( "WARNING: This mesh has no vertices and will not be loaded" );
        return;
    }
    
    var cameraView = new Vector3( 0.0, 0.0, 0.0 );
    cameraView.x = Math.cos( ConvertDegToRad( -worldCamera.orientation.yaw ) ) * Math.cos( ConvertDegToRad( worldCamera.orientation.pitch ) );
    cameraView.y = Math.sin( ConvertDegToRad( -worldCamera.orientation.yaw ) ) * Math.cos( ConvertDegToRad( worldCamera.orientation.pitch ) );
    cameraView.z = Math.sin( ConvertDegToRad( worldCamera.orientation.pitch ) );
    MultiplyVector3( cameraView, mesh.radius * 2.0 );
    AddVector3( cameraView, worldCamera.position, cameraView );
    AddVector3( mesh.position, cameraView, mesh.position );
    
    var convertedVerts = GetConvertedVertices( mesh.vertices );
    
    mesh.vbo = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vbo );
    gl.bufferData( gl.ARRAY_BUFFER, convertedVerts, gl.STATIC_DRAW );
    
    gl.enableVertexAttribArray( VERTEX_ATTRIB_POSITIONS );
    gl.enableVertexAttribArray( VERTEX_ATTRIB_COLORS );
    gl.enableVertexAttribArray( VERTEX_ATTRIB_TEX_COORDS );
    gl.enableVertexAttribArray( VERTEX_ATTRIB_NORMALS );
    gl.enableVertexAttribArray( VERTEX_ATTRIB_TANGENT );
    
    gl.vertexAttribPointer( VERTEX_ATTRIB_POSITIONS, POSITION_SIZE, gl.FLOAT, false, VERTEX_SIZE, POSITION_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_COLORS, COLOR_SIZE, gl.FLOAT, false, VERTEX_SIZE, COLOR_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_TEX_COORDS, TEX_COORD_SIZE, gl.FLOAT, false, VERTEX_SIZE, TEX_COORD_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_NORMALS, NORMAL_SIZE, gl.FLOAT, false, VERTEX_SIZE, NORMAL_OFFSET );
    gl.vertexAttribPointer( VERTEX_ATTRIB_TANGENT, TANGENT_SIZE, gl.FLOAT, false, VERTEX_SIZE, TANGENT_OFFSET );
}


//----------------------------------------------------------------------------------------------------------
var BindTexture = function( texture, textureLayer, textureLayerNum, uniformName, usingCheckName )
{
    if( texture )
    {
        gl.activeTexture( textureLayer );
        gl.bindTexture( gl.TEXTURE_2D, texture.glTexture );
        gl.uniform1i( gl.getUniformLocation( canvasShaderProgram, uniformName ), textureLayerNum );
        gl.uniform1i( gl.getUniformLocation( canvasShaderProgram, usingCheckName ), 1 );
    }
    else
    {
        gl.activeTexture( textureLayer );
        gl.bindTexture( gl.TEXTURE_2D, null );
        gl.uniform1i( gl.getUniformLocation( canvasShaderProgram, usingCheckName ), 0 );
    }
}


//----------------------------------------------------------------------------------------------------------
var BindLight = function()
{
    gl.uniform1i( gl.getUniformLocation( canvasShaderProgram, 'u_numberOfLights' ), lights.length );
    
    for( var lightIndex = 0; lightIndex < lights.length; ++lightIndex )
    {
        var light = lights[ lightIndex ];
        
        gl.uniform3f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_position' ), light.position.x, light.position.y, light.position.z );
        gl.uniform3f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_direction' ), light.direction.x, light.direction.y, light.direction.z );
        gl.uniform4f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_colorAndBrightnessAlpha' ), light.color.r, light.color.g, light.color.b, light.color.a );
        gl.uniform1f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_innerRadius' ), light.innerRadius );
        gl.uniform1f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_outerRadius' ), light.outerRadius );
        gl.uniform1f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_innerApertureDot' ), light.innerApertureDot );
        gl.uniform1f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_outerApertureDot' ), light.outerApertureDot );
        gl.uniform1f( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_fractionAmbient' ), light.fractionAmbient );
        gl.uniform1i( gl.getUniformLocation( canvasShaderProgram, 'u_lights[' + lightIndex + '].m_isPositionless' ), light.isPositionless );
    }
}


//----------------------------------------------------------------------------------------------------------
var SetCameraPositionAndOrientation = function( camera )
{
    mat4.rotate( topMatrix, ConvertDegToRad( -90.0 ), [ 1.0, 0.0, 0.0 ] );
    mat4.rotate( topMatrix, ConvertDegToRad( 90.0 ), [ 0.0, 0.0, 1.0 ] );
    
    mat4.rotate( topMatrix, ConvertDegToRad( camera.orientation.roll ), [ 1.0, 0.0, 0.0 ] );
    mat4.rotate( topMatrix, ConvertDegToRad( camera.orientation.pitch ), [ 0.0, 1.0, 0.0 ] );
    mat4.rotate( topMatrix, ConvertDegToRad( camera.orientation.yaw ), [ 0.0, 0.0, 1.0 ] );
    
    mat4.translate( topMatrix, [ -camera.position.x, -camera.position.y, -camera.position.z ] );
}


//----------------------------------------------------------------------------------------------------------
var UpdateCameraPositionFromInput = function( deltaSeconds )
{
    var yawRadians = ConvertDegToRad( worldCamera.orientation.yaw );
    var cameraMoveVector = new Vector3( 0.0, 0.0, 0.0 );
    var cameraForwardXY = new Vector3( Math.cos( -yawRadians ), Math.sin( -yawRadians ), 0.0 );
    var cameraLeftXY = new Vector3( -cameraForwardXY.y, cameraForwardXY.x, 0.0 );
    
    if( keyboard.pressedKeys[ 87 ] ) // W key
    {
        AddVector3( cameraMoveVector, cameraForwardXY, cameraMoveVector );
    }
    else if( keyboard.pressedKeys[ 83 ] ) // S key
    {
        SubtractVector3( cameraMoveVector, cameraForwardXY, cameraMoveVector );
    }
    
    if( keyboard.pressedKeys[ 65 ] ) // A key
    {
        AddVector3( cameraMoveVector, cameraLeftXY, cameraMoveVector );
    }
    else if( keyboard.pressedKeys[ 68 ] ) // D key
    {
        SubtractVector3( cameraMoveVector, cameraLeftXY, cameraMoveVector );
    }
    
    if( keyboard.pressedKeys[ 69 ] ) // E key
    {
        cameraMoveVector.z += 1.0;
    }
    else if( keyboard.pressedKeys[ 81 ] ) // Q key
    {
        cameraMoveVector.z -= 1.0;
    }
    
    MultiplyVector3( cameraMoveVector, MOVE_SPEED_POINTS_PER_SECOND * deltaSeconds );
    AddVector3( worldCamera.position, cameraMoveVector, worldCamera.position );
}


//----------------------------------------------------------------------------------------------------------
var UpdateCameraOrientationFromInput = function( deltaSeconds )
{
    var rotationRadiansPerSecond = ConvertDegToRad( ROTATION_DEGREES_PER_SECOND );
    var cameraRotation = new EulerAngles( 0.0, 0.0, 0.0 );
    cameraRotation.yaw += mouse.currentX - mouse.lastX;
    cameraRotation.pitch -= mouse.currentY - mouse.lastY;
    MultiplyEulerAngles( cameraRotation, rotationRadiansPerSecond * deltaSeconds );
    AddEulerAngles( worldCamera.orientation, cameraRotation, worldCamera.orientation );
    
    if( worldCamera.orientation.yaw > 180.0 )
    {
        worldCamera.orientation.yaw -= 360.0;
    }
    else if( worldCamera.orientation.yaw < -180.0 )
    {
        worldCamera.orientation.yaw += 360.0;
    }
    
    if( worldCamera.orientation.pitch > 90.0 )
    {
        worldCamera.orientation.pitch = 90.0;
    }
    else if( worldCamera.orientation.pitch < -90.0 )
    {
        worldCamera.orientation.pitch = -90.0;
    }
}


//----------------------------------------------------------------------------------------------------------
var Render3D = function()
{
    PushMatrix();
    
    gl.useProgram( canvasShaderProgram );
    gl.enable( gl.DEPTH_TEST );
    mat4.perspective( FIELD_OF_VIEW_Y, objCanvas.clientWidth / objCanvas.clientHeight, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE, topMatrix );
    SetCameraPositionAndOrientation( worldCamera );
    BindLight();
    
    for( var meshIndex = 0; meshIndex < meshes.length; ++meshIndex )
    {
        var mesh = meshes[ meshIndex ];
        
        PushMatrix();
        
        gl.bindBuffer( gl.ARRAY_BUFFER, mesh.vbo );
        gl.vertexAttribPointer( VERTEX_ATTRIB_POSITIONS, POSITION_SIZE, gl.FLOAT, false, VERTEX_SIZE, POSITION_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_COLORS, COLOR_SIZE, gl.FLOAT, false, VERTEX_SIZE, COLOR_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_TEX_COORDS, TEX_COORD_SIZE, gl.FLOAT, false, VERTEX_SIZE, TEX_COORD_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_NORMALS, NORMAL_SIZE, gl.FLOAT, false, VERTEX_SIZE, NORMAL_OFFSET );
        gl.vertexAttribPointer( VERTEX_ATTRIB_TANGENT, TANGENT_SIZE, gl.FLOAT, false, VERTEX_SIZE, TANGENT_OFFSET );
        
        mat4.translate( topMatrix, [ mesh.position.x, mesh.position.y, mesh.position.z ] );
        mat4.multiply( topMatrix, mesh.rotationMat );
        mat4.scale( topMatrix, [ mesh.uniformScale * mesh.nonUniformScale.x, mesh.uniformScale * mesh.nonUniformScale.y, mesh.uniformScale * mesh.nonUniformScale.z ] );
        
        BindTexture( mesh.diffuseTexture, gl.TEXTURE0, 0, "u_diffuseTexture", "u_isUsingDiffuse" );
        BindTexture( mesh.normalTexture, gl.TEXTURE1, 1, "u_normalTexture", "u_isUsingNormal" );
        BindTexture( mesh.specularTexture, gl.TEXTURE2, 2, "u_specularTexture", "u_isUsingSpecular" );
        BindTexture( mesh.emissiveTexture, gl.TEXTURE3, 3, "u_emissiveTexture", "u_isUsingEmissive" );
        
        gl.uniform1i( gl.getUniformLocation( canvasShaderProgram, 'u_isHighlighted' ), ( mesh === currentlySelectedMesh ) );
        gl.uniformMatrix4fv( gl.getUniformLocation( canvasShaderProgram, 'u_modelRotationMatrix' ), false, mesh.rotationMat );
        gl.uniformMatrix4fv( gl.getUniformLocation( canvasShaderProgram, 'u_modelViewProjectionMatrix' ), false, topMatrix );
        gl.drawArrays( gl.TRIANGLES, 0, mesh.vertices.length );
        
        PopMatrix();
    }
    
    PopMatrix();
    
    if( currentlySelectedMesh != null )
    {
        gl.useProgram( uiShaderProgram );
        gl.disable( gl.DEPTH_TEST );
        
        PushMatrix();
        
        mat4.perspective( FIELD_OF_VIEW_Y, objCanvas.clientWidth / objCanvas.clientHeight, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE, topMatrix );
        
        SetCameraPositionAndOrientation( worldCamera );
        
        var positionDifference = new Vector3( 0.0, 0.0, 0.0 );
        SubtractVector3( worldCamera.position, currentlySelectedMesh.position, positionDifference );
        var scaleSize = 0.1 * GetLengthVector3( positionDifference );
        
        PushMatrix();
        
        mat4.translate( topMatrix, [ currentlySelectedMesh.position.x, currentlySelectedMesh.position.y, currentlySelectedMesh.position.z ] );
        mat4.scale( topMatrix, [ scaleSize, scaleSize, scaleSize ] );
        
        gl.uniformMatrix4fv( gl.getUniformLocation( uiShaderProgram, 'u_modelViewProjectionMatrix' ), false, topMatrix );
        gl.uniform1i( gl.getUniformLocation( uiShaderProgram, 'u_isUsingTexture' ), false );
        selectedMeshAxis.Render();
        
        PopMatrix();
        
        PushMatrix();
        
        mat4.translate( topMatrix, [ currentlySelectedMesh.position.x, currentlySelectedMesh.position.y, currentlySelectedMesh.position.z ] );
        mat4.multiply( topMatrix, currentlySelectedMesh.rotationMat );
        mat4.scale( topMatrix, [ scaleSize, scaleSize, scaleSize ] );
        
        gl.uniformMatrix4fv( gl.getUniformLocation( uiShaderProgram, 'u_modelViewProjectionMatrix' ), false, topMatrix );
        gl.uniform1i( gl.getUniformLocation( uiShaderProgram, 'u_isUsingTexture' ), true );
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, selectedMeshRotationRings.ringTexture.glTexture );
        gl.uniform1i( gl.getUniformLocation( uiShaderProgram, 'u_diffuseTexture' ), 0 );
        gl.uniform1i( gl.getUniformLocation( uiShaderProgram, 'u_isUsingTexture' ), true );
        selectedMeshRotationRings.Render();
        
        PopMatrix();
        
        PopMatrix();
    }
}


//----------------------------------------------------------------------------------------------------------
var Update = function()
{
    UpdateCameraPositionFromInput( FRAME_TIME_SECONDS );
    if( mouse.isRightPressed )
    {
        UpdateCameraOrientationFromInput( FRAME_TIME_SECONDS );
    }
	
	mouse.lastX = mouse.currentX;
	mouse.lastY = mouse.currentY;
}


//----------------------------------------------------------------------------------------------------------
var Render = function()
{
    gl.clearColor( 0.0, 0.4, 0.6, 1.0 );
    gl.clearDepth( 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    Render3D();
}


//----------------------------------------------------------------------------------------------------------
var RunFrame = function()
{
    setTimeout( RunFrame, FRAME_TIME_SECONDS );
    Update();
    Render();
}


//----------------------------------------------------------------------------------------------------------
var main = function()
{
    Initialize();
    RunFrame();
}
