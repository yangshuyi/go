import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './GamePlayPage.css';

import {useNavigate} from "react-router-dom";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ConfigUtils from "../../components/config/ConfigUtils";
import GamePlayPagePortrait from "./portrait/GamePlayPagePortrait";
import Constants from "../../Constants";

function GamePlayPage(props) {
    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState();
    const navigate = useNavigate();

    const [game, setGame] = useState(null);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;

        if (!dataInitialized) {
            init();
        }
    }, []);

    let init = async () => {
        let screenOrientationLandscape = await ConfigUtils.getScreenOrientationLandscape()
        setScreenOrientationLandscape(screenOrientationLandscape)

        setGame({
            chessBoardSize: _.find(Constants.CHESS_BOARD_SIZE_OPTIONS, {value:19}).value,
            chessBoard: [],
            nextChessType: Constants.CHESS_TYPE.B.value,
        });

        setDataInitialized(true);
    }

    const navBack = async (needRefreshFlag) => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (dataInitialized !== true ? <XmsSpinView/> :
            screenOrientationLandscape === true ?
                <GamePlayPagePortrait game={game} onNavBack={navBack}/>
                :
                <GamePlayPagePortrait game={game} onNavBack={navBack}/>
    )
}

export default GamePlayPage;



