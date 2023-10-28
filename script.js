
let canvas, ctx;
let socket = io('https://alpha-check-backend-d219e140751f.herokuapp.com/');
let message_output;

class FrontEndState{
    constructor(player_color){
        this.game_ongoing = true;
        //this.player_color
        this.message = '';
        this.marked_piece = 0;
        this.last_played_piece = 0;
        this.pause = true;
        this.player_color = player_color;
        this.legal_moves = [];
    }
}

let front_end_state;


function reflect(board_matrix){
    reflected_matrix = []// fill with zero
    for(var i=0; i<8; i++){
        reflected_matrix[i] = [0,0,0,0,0,0,0,0];
    }
    //console.log(reflected_matrix);

    for(var i=0; i<8; i++){
        for (var j=0; j<8;j++){
            reflected_matrix[i][j] = board_matrix[7-i][7-j];
        }
    }
    //console.log(reflected_matrix);
    return reflected_matrix;
}

function draw(){
    //message_output.textContent = message

    let marked_piece = front_end_state.marked_piece;
    let board = front_end_state.game_state['board'];
    let last_played_piece = front_end_state.last_played_piece;
    if (front_end_state.player_color == 1){
        board = reflect(front_end_state.game_state['board']);
        if (front_end_state.marked_piece != 0){
            marked_piece = [7-front_end_state.marked_piece[0],7-front_end_state.marked_piece[1]];
        }
        if (front_end_state.last_played_piece != 0){
            last_played_piece =  [7-front_end_state.last_played_piece[0],7-front_end_state.last_played_piece[1]];
        }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(message_output)
    message_output.innerText = front_end_state.message;
    for (var i=0; i<8; i++){
        for (var j=0; j<8;j++){
            
            if (board[i][j] == -3){
                //ctx.globalAlpha = 1;
                ctx.fillStyle = 'white';
                //ctx.strokeRect(j*50,i*50,50,50);
                ctx.fillRect(j*50,i*50,50,50);
            }
            else{
                if (board[i][j] == -1){
                    ctx.fillStyle = `rgb(200,40,80)`;
                    ctx.beginPath();
                    ctx.arc((j*50)+25,(i*50)+25, 20, 0, 2 * Math.PI);
                    ctx.fill()
                    //ctx.drawImage(purple_image, j*50,i*50,50,50);
                }
                else if(board[i][j] == -2){
                    ctx.fillStyle = `rgb(200,40,80)`;
                    ctx.beginPath();
                    ctx.arc((j*50)+25,(i*50)+25, 20, 0, 2 * Math.PI);
                    ctx.fill()

                    ctx.fillStyle = `rgb(255,255,255)`;
                    ctx.beginPath();
                    ctx.arc((j*50)+25,(i*50)+25, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    //ctx.drawImage(purple_king_image, j*50,i*50,50,50);
                }
                else if(board[i][j] == 1){
                    ctx.fillStyle = `rgb(0,0,0)`;
                    ctx.beginPath();
                    ctx.arc((j*50)+25,(i*50)+25, 20, 0, 2 * Math.PI);
                    ctx.fill()
                }
                else if(board[i][j] == 2){
                    ctx.fillStyle = `rgb(0,0,0)`;
                    ctx.beginPath();
                    ctx.arc((j*50)+25,(i*50)+25, 20, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.fillStyle = `rgb(255,255,255)`;
                    ctx.beginPath();
                    ctx.arc((j*50)+25,(i*50)+25, 5, 0, 2 * Math.PI);
                    ctx.fill();

                    //ctx.drawImage(black_king_image, j*50,i*50,50,50);
                }
                if (last_played_piece != 0){
                    if (i == last_played_piece[0] & j == last_played_piece[1]){
                        ctx.strokeStyle = 'green';
                        //ctx.fillStyle = 'blue';
                        //ctx.globalAlpha = 0.1;
                        
                        line_width = 4;
                        ctx.lineWidth = line_width;
                        
                        //ctx.fillRect(j*50,i*50,50,50);
                        ctx.strokeRect((j*50)+line_width/2,(i*50)+line_width/2,50-line_width,50-line_width);
                        //ctx.stroke();
                    }
                }


                if (marked_piece != 0){
                    if (i == marked_piece[0] & j == marked_piece[1]){
                        ctx.strokeStyle = 'blue';
                        //ctx.fillStyle = 'blue';
                        //ctx.globalAlpha = 0.1;
                        
                        line_width = 4;
                        ctx.lineWidth = line_width;
                        
                        //ctx.fillRect(j*50,i*50,50,50);
                        ctx.strokeRect((j*50)+line_width/2,(i*50)+line_width/2,50-line_width,50-line_width);
                        //ctx.stroke();
                    }
                }
            } 
            //if (board[i][j] != -3){
        }
    }
}


socket.on('update and play', function(client_data){ //only called at the start of turn
                                                //and at the start of game
    //console.log(client_data)
    front_end_state.game_state = client_data['game state'];
    front_end_state.legal_moves = client_data['legal moves']
    front_end_state.game_ongoing = client_data['game ongoing']
    front_end_state.message = client_data['message']
    front_end_state.last_played_piece = client_data['last played piece']

    //console.log("got it");
    //console.log(game_state['board']);
    //if (front_end_state.player_color == front_end_state.game_state['player turn']){
        
    //}
    front_end_state.pause = false
    draw();
    //console.log(game_state['board']);
});

socket.on('update and await', function(client_data){ //only called at the start of turn
    //and at the start of game
//console.log(client_data)
    front_end_state.game_state = client_data['game state'];
    front_end_state.legal_moves = client_data['legal moves']
    front_end_state.game_ongoing = client_data['game ongoing']
    front_end_state.message = client_data['message']
    front_end_state.last_played_piece = client_data['last played piece']

    //console.log("got it");
    //console.log(game_state['board']);
    draw();
    socket.emit('awaiting AI turn');
//console.log(game_state['board']);
});


//only send a request. If it is the players turn
//if they select a piece return legal moves
//if they select a legal move play it
//else do nothing

function sign(x){
    if(x>0){
        return 1;
    }
    else if(x <0){
        return -1
    }
    else{
        return 0
    }
}

function process_input(i,j){
    if (front_end_state.game_ongoing == true){
        if (!front_end_state.pause){
            console.log('its my turn',i,j);
            console.log('its my turn',i,j,front_end_state.game_state['board'][i][j], front_end_state.marked_piece)
            if (sign(front_end_state.game_state['board'][i][j]) == front_end_state.player_color){ //player selected their own piece
                //socket.emit('legal moves request');\
                //console.log('MARKED PIECE!!!',i,j,(i,j))
                front_end_state.marked_piece = [i,j]
                draw()
            }
            else if (front_end_state.marked_piece != 0){ //there is a marked piece, so we compute the move
                
                move_i = i-front_end_state.marked_piece[0]
                move_j = j-front_end_state.marked_piece[1]
               
                //check inclusion of legal move

                console.log('candidate move',[front_end_state.marked_piece,[move_i,move_j]], front_end_state.legal_moves)
                for (var x=0; x< front_end_state.legal_moves.length; x++){
                    move = front_end_state.legal_moves[x]
                    if (move[0][0] == front_end_state.marked_piece[0] &  move[0][1] == front_end_state.marked_piece[1] & move_i == move[1][0] & move_j == move[1][1]){
                        console.log('move chosen', move)
                        front_end_state.pause = true;
                        front_end_state.marked_piece = 0;
                        socket.emit('move chosen',move)
                    }
                }
            }
        }
    }
}


socket.on('start game', function(start_game_data){ //only called at the start of turn
    //and at the start of game
//console.log(client_data)
    player_color = start_game_data['player color'];
    client_data  = start_game_data['client data'];
    front_end_state = new FrontEndState(player_color);

    front_end_state.game_state = client_data['game state'];
    front_end_state.legal_moves = client_data['legal moves'];
    front_end_state.game_ongoing = client_data['game ongoing'];
    front_end_state.message = client_data['message'];
    //console.log("got it");
    //console.log(game_state['board']);
    if (front_end_state.player_color == front_end_state.game_state['player turn']){
        front_end_state.pause = false;

    }
    //console.log(front_end_state.game_state['board']);

    message_output = document.getElementById('message');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click',function(event){
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        if (player_color  == 1){
            process_input(Math.floor((400-y)/50),Math.floor((400-x)/50));
        }
        else{
            process_input(Math.floor(y/50),Math.floor(x/50));
        }
        
        //
        //socket.emit('user click',{i:Math.floor(y/400),i:Math.floor(x/400)})

        console.log(x,y);
    })



    
    
    draw();
    if (player_color != 1){
        socket.emit('awaiting AI start');
    }
        
    //console.log(game_state['board']);
});