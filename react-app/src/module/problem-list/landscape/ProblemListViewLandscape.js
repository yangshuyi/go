import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListViewLandscape.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {useLocation} from "react-router";
import {DialogUtils, NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../../util/ProblemUtils";
import ListView from "./ListView";
import GameView from "../../../components/game/GameView";
import {Button, NavBar} from "antd-mobile";


function ProblemListViewLandscape(props) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
        setPageTitle("棋局列表");
    }

    const [pageTitle, setPageTitle] = useState()

    const handleDeleteProblem = async (problem) => {
        setProblemFormData(null);
    }

    const navToProblemMgmtPage = (problem) => {
        alert("navToProblemMgmtPage")
    }

    const navToProblemTestPage = async (orderIdx) => {
        let problem = await ProblemUtils.loadProblemByFilteredOrderIdx(orderIdx);
        if (problem == null) {
            await DialogUtils.showAlertMessage(`Could not find Problem by orderIdx: ${orderIdx}`);
            return;
        }
        setProblemFormData(problem);
    }

    const [problemFormData, setProblemFormData] = useState();


    const navBack = async (needRefreshFlag) => {
        if (props.onNavBack) {
            props.onNavBack(needRefreshFlag)
        }
    }

    return (
        <div className="problem-list-page">
            <NavBar
                onBack={() => navBack(false)}
                left={<Button color="primary" fill="solid" size="small" onClick={() => navToProblemMgmtPage(null)}>新增棋局</Button>}
            >{pageTitle}</NavBar>

            <div className="xms-page-content with-padding-top problem-list-view-landscape">
                <div className="list-area">
                    <ListView
                        onDeleteProblem={handleDeleteProblem}
                        onNavToProblemMgmtPage={navToProblemMgmtPage}
                        onNavToProblemTestPage={navToProblemTestPage}
                    />
                </div>
                <div className="game-area">
                    {problemFormData ?
                        <GameView game={problemFormData}/>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ProblemListViewLandscape;



