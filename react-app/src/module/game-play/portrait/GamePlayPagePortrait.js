import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './GamePlayPagePortrait.css';

import {NavBar} from "antd-mobile";
import {XmsSpinView} from "sirius-react-mobile";
import GameView from "../../../components/game/GameView";

function GamePlayPagePortrait(props) {

    useEffect(() => {
        init();
    }, []);


    let init = async () => {

    }

    const navBack = async () => {
        if (props.onNavBack) {
            props.onNavBack();
        }
    }

    return (props.game == null ? <XmsSpinView/> :
            <div className="game-play-page">
                <NavBar onBack={() => navBack()}>
                    <div>下棋</div>
                </NavBar>

                <div className="xms-page-content">
                    <GameView game={props.game} singleRow={false}/>
                </div>
            </div>
    )
}

export default GamePlayPagePortrait;



