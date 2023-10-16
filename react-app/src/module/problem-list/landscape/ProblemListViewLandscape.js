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
import ProblemInfoActionBarVertical from "../../../components/problem-info/ProblemInfoActionBarVertical";
import ProblemTestViewLandscape from "../../problem-test/landscape/ProblemTestViewLandscape";


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
        setSelectedProblem(null);
        setPageTitle("棋局列表");
    }

    const navToProblemMgmtPage = (problem) => {
        alert("navToProblemMgmtPage")
    }

    const navToProblemTestPage = async (problem) => {
        if (problem == null) {
             return;
        }

        setPageTitle(problem.$introValue);
        setSelectedProblem(problem);
    }

    const [selectedProblem, setSelectedProblem] = useState(null);

    const handleTitleClick = async () => {
        if (!selectedProblem) {
            return;
        }

        try {
            await navigator.clipboard.writeText(selectedProblem.id);
            await DialogUtils.showSuccessMessage(`复制ID:${selectedProblem.id}成功`);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

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
            >
                <div onClick={handleTitleClick}>{pageTitle}</div>
            </NavBar>

            <div className="xms-page-content with-padding-top problem-list-view-landscape">
                <div className="list-area">
                    <ListView
                        onDeleteProblem={handleDeleteProblem}
                        onNavToProblemMgmtPage={navToProblemMgmtPage}
                        onNavToProblemTestPage={navToProblemTestPage}
                    />
                </div>
                <div className="game-area">
                    {selectedProblem ?
                        <ProblemTestViewLandscape problemOrderIdx={selectedProblem.orderIdx}/>
                        : null
                    }
                </div>

            </div>
        </div>
    )
}

export default ProblemListViewLandscape;



