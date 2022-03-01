#!/usr/bin/env bash

tmux new -s nspm -d

# nspm mobile-end
tmux rename-window -t nspm 'nspm (mobile)'
tmux send-keys -t nspm 'cd ./mobile' C-m

# nspm back-end
tmux new-window -t nspm
tmux rename-window -t nspm 'nspm (back)'
tmux send-keys -t nspm 'cd ./api' C-m

# nspm run
tmux new-window -t nspm
tmux rename-window -t nspm 'nspm (run)'

# Select the run window
tmux select-window -t nspm:3
tmux attach -t nspm
