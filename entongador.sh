#!/bin/bash

A='http://entongue.herokuapp.com/set?tag=riot&lat='
LAT=-26.828660964966
LON=-65.199272155762
for i in {0..100}

do
    LAT=$(echo "$LAT + ( $RANDOM - 32767./2. ) / 32767./ 100. " | bc -l)
    LON=$(echo "$LON + ( $RANDOM - 32767./2. ) / 32767./ 100. " | bc -l)

    ARG="${A}${LAT}&lon=$LON"

    echo $ARG
    curl $ARG
done
