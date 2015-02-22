//----------------------------------------------------------------------------------------------------------
var Keyboard = function()
{
    this.pressedKeys = [];
}


//----------------------------------------------------------------------------------------------------------
var OnKeyUp = function( event )
{
    keyboard.pressedKeys[ event.keyCode ] = false;
}


//----------------------------------------------------------------------------------------------------------
var OnKeyDown = function( event )
{
    keyboard.pressedKeys[ event.keyCode ] = true;
}


//----------------------------------------------------------------------------------------------------------
var keyboard = new Keyboard();

document.addEventListener( "keyup", OnKeyUp );
document.addEventListener( "keydown", OnKeyDown );