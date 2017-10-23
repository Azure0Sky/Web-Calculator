var globalExp = '';
var ans = '';
var executed = false;
var numOfParen = 0;         //the number of left parenthesis hasn't been closed

function Calculator()
{
    var answer = document.getElementById('ans-bar').childNodes[1];

    var theButtons = document.getElementsByClassName('one-button');

    for ( var i = 6; i < theButtons.length; i += 5 ) {
        for ( var j = 0, k = i; j < 3; ++j, ++k )
            theButtons[k].addEventListener('click', CallNum);
    }
    theButtons[22].removeEventListener('click', CallNum);   //decimal point
    theButtons[23].removeEventListener('click', CallNum);   //equal sign

    for ( i = 9; i < theButtons.length; i +=5 ) {
        theButtons[i].addEventListener('click', CallOperator);
    }

    for ( i = 0; i < theButtons.length; i += 5 ) {
        theButtons[i].addEventListener('click', CallOthers);
    }
    
    theButtons[1].addEventListener('click', CallNum);   //left parenthesis
    theButtons[2].addEventListener('click', CallNum);   //right parenthesis
    theButtons[3].addEventListener('click', Delete);
    theButtons[4].addEventListener('click', Clear);

    theButtons[22].addEventListener('click', CallDot);  //decimal point
    theButtons[23].addEventListener('click', ExecCalculation);  //equal sign
}

function CallNum()
{
    var displayExp = document.getElementById('exp-bar').childNodes[1];

    if ( executed ) {
        displayExp.textContent = '0';
        executed = false;
    }

    if ( displayExp.textContent == '0' )
        displayExp.textContent = '';

    var len = displayExp.textContent.length;
    //check whether the 0 in the end is valid
    if ( displayExp.textContent.endsWith( '0' ) &&
         isNaN( displayExp.textContent[len-2] ) && 
         displayExp.textContent[len-2] != '.' ) {
        Delete();
    }

    if ( this.textContent == '(' )
        ++numOfParen;
    else if ( this.textContent == ')' )
        --numOfParen;

    displayExp.textContent += this.textContent;
    globalExp += this.textContent;

    if ( globalExp == '0' )
        globalExp = '';
}

function CallOperator()
{
    var theButtons = document.getElementsByClassName('one-button');
    var displayExp = document.getElementById('exp-bar').childNodes[1];

    if ( executed ) {
        displayExp.textContent = '0';
        executed = false;
    }

    //Not allowed to input the same operator
    //Not allowed to input operator after '-'
    if ( displayExp.textContent.endsWith( this.textContent ) ||
         displayExp.textContent.endsWith( '-' ) )
        return;

    //If the expression ends with an operator, then take place it with
    //the one that input lastly.
    if ( this.textContent != '-' ) {
        for ( var i = 9; i < theButtons.length; i += 5 ) {
            if ( displayExp.textContent.endsWith( theButtons[i].textContent ) ) {
                Delete();
                break;
            }
        }
    }

    displayExp.textContent += this.textContent;
    if ( globalExp.length == 0 )
        globalExp += '0';

    if ( this.textContent == '+' )
        globalExp += '+';
    else if ( this.textContent == '-' )
        globalExp += '-';
    else if ( this.textContent == '×' )
        globalExp += '*';
    else if ( this.textContent == '÷' )
        globalExp += '/';
}

function CallOthers() 
{
    var displayExp = document.getElementById('exp-bar').childNodes[1];

    if ( executed ) {
        displayExp.textContent = '';
        executed = false;
    }

    if ( displayExp.textContent == 0 )
            displayExp.textContent = '';

    displayExp.textContent += this.textContent;
    if ( this.textContent != 'Ans' ) {
        displayExp.textContent += '(';
        globalExp += ( 'Math.' + ( this.textContent == '√' ? 'sqrt' : this.textContent ) + '(' );
        ++numOfParen;
    } else {
        globalExp += 'ans';
    }
}

function CallDot() 
{
    var displayExp = document.getElementById('exp-bar').childNodes[1];
    var pos = displayExp.textContent.lastIndexOf( '.' );

    if ( executed ) {
        displayExp.textContent = '0';
        executed = false;
    }

    if ( pos != -1 && !isNaN( displayExp.textContent.substring( pos+1 ) ) ) {
        return;
    }

    displayExp.textContent += '.';
    globalExp += '.';
}

function ExecCalculation() 
{
    var displayExp = document.getElementById('exp-bar').childNodes[1];

    if ( numOfParen > 0 ) {
        while ( numOfParen-- ) {
            globalExp += ')';
        }
    }

    numOfParen = 0;

    try {

        var res = eval( globalExp );
        res = ResultProcess( res );

        displayExp.textContent = res;
        ans = res;
        document.getElementById('ans-bar').childNodes[1].textContent = 'Ans = ' + res;
    
    } catch( err ) {

        displayExp.textContent = 'Error';
        document.getElementById('ans-bar').childNodes[1].textContent = 'Error';
    }
    
    globalExp = '';
    executed = true;
}

function Delete()
{
    if ( executed )
        return;

    var displayExp = document.getElementById('exp-bar').childNodes[1];

    var pos = displayExp.textContent.length-1,        //the position of the last charactor after deleting
        globalPos = globalExp.length-1;

    var iPos = displayExp.textContent.lastIndexOf( 'i' ),
        oPos = displayExp.textContent.lastIndexOf( 'o' ),
        aPos = displayExp.textContent.lastIndexOf( 'a' ),
        rPos = displayExp.textContent.lastIndexOf( '√' ),
        AnsPos = displayExp.textContent.lastIndexOf( 'A' );

    if ( ( iPos != -1 && iPos + 2 == pos ) ||   
         ( oPos != -1 && oPos + 2 == pos ) ||
         ( aPos != -1 && aPos + 2 == pos ) ) {
        pos -= 3;
        globalPos -= 8;
        --numOfParen;
    } else if ( rPos != -1 && rPos + 1 == pos ) {
        pos -= 1;
        globalPos -= 9;
        --numOfParen;
    } else if ( AnsPos != -1 && AnsPos + 2 == pos ) {
        pos -= 2;
        globalPos -= 2;
    }

    displayExp.textContent = displayExp.textContent.substring( 0, pos );
    if ( displayExp.textContent.length == 0 )
        displayExp.textContent = '0';

    globalExp = globalExp.substring( 0, globalPos );
    if ( globalExp == '0' )
        globalExp = '';
}

function Clear() {
    document.getElementById('exp-bar').childNodes[1].textContent = '0';
    globalExp = '';
    numOfParen = 0;
}

//show 15 numbers at most
//refer to Google
function ResultProcess ( res )
{
    var temp = res.toString();

    if ( temp.replace(/^-/, "").replace(/\./, "").length <= 15 ) {
        res = temp;
    } else if ( temp.indexOf( 'e' ) != -1 ) {
        temp = res.toPrecision( 15 ).replace(/\.?0*e/, 'e');  //clear 0 before e
    } else {
        temp = res.toPrecision( 15 );
        if ( temp.indexOf( '.' ) != -1 )
            res = temp.replace(/\.?0*$/, '');   //clear 0
        else
            res = temp;
    }

    return res;
}

window.onload = Calculator;