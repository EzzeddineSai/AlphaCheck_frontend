# AlphaCheck

AlphaCheck is a checkers AI based on [AlphaZero](https://arxiv.org/abs/1712.01815). The project consists of 4 components:
 - AlphaCheck_frontend (this repository). You can play against AlphaCheck [here](https://ezzeddinesai.github.io/AlphaCheck_frontend/)
 - [AlphaCheck_backend](https://github.com/EzzeddineSai/AlphaCheck_backend/)
 - [AlphaCheck_model](https://github.com/EzzeddineSai/AlphaCheck_model)
 - [AlphaCheck_train](https://github.com/EzzeddineSai/AlphaCheck_train)

The components work together in the following way:

The rules for checkers are implemented in the file [gameclasses.py](https://github.com/EzzeddineSai/AlphaCheck_train/blob/main/gameclasses.py). The rules follow the standard American checkers rules with forced takes, but with the additional cap of 100 moves (which would be a draw). This file also includes a JSON based summary of a game states, which is used later on for serving the game. The model itself consists of a fully connected (initially random) neural network which is built in file [generatedata](https://github.com/EzzeddineSai/AlphaCheck_train/blob/main/generatedata.py). Following the AlphaZero algorithm, self-play games are played in a way that statistically adjusts the neural network's choices according to the Monte Carlo Tree Search algorithm. These self-play games are then used to train the future iteration of the neural network. The actual configurations used are given in the file [config.py](https://github.com/EzzeddineSai/AlphaCheck_train/blob/main/config.py).

After training the resulting neural network and the game are served using two gunicorn Flask servers deployed on Heroku. Finally, the frontend consists of play Javascript deployed on github pages.
