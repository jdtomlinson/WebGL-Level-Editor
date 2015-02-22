//----------------------------------------------------------------------------------------------------------
function Mouse()
{
    this.currentX = 0.0;
    this.currentY = 0.0;
    this.lastX = 0.0;
    this.lastY = 0.0;
    this.isLeftPressed = false;
    this.isRightPressed = false;
}


//----------------------------------------------------------------------------------------------------------
var OnMouseDown = function( event )
{
    if( event.button === 0 )
        mouse.isLeftPressed = true;
    else if( event.button === 2 )
        mouse.isRightPressed = true;
	
	mouse.lastX = event.clientX;
	mouse.lastY = event.clientY;
	mouse.currentX = event.clientX;
	mouse.currentY = event.clientY;
}


//----------------------------------------------------------------------------------------------------------
var OnMouseUp = function( event )
{
	if( event.button === 0 )
        mouse.isLeftPressed = false;
    else if( event.button === 2 )
        mouse.isRightPressed = false;
}


//----------------------------------------------------------------------------------------------------------
var OnMouseMove = function( event )
{	
	if( mouse.isLeftPressed || mouse.isRightPressed )
	{
		mouse.currentX = event.clientX;
		mouse.currentY = event.clientY;
	}
}


//----------------------------------------------------------------------------------------------------------
var mouse = new Mouse();

document.addEventListener( "mousedown", OnMouseDown );
document.addEventListener( "mouseup", OnMouseUp );
document.addEventListener( "mousemove", OnMouseMove );