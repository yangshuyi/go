import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemMgmtPage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar} from "antd-mobile";
import {useLocation} from "react-router";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemInfoView from "../../components/problem-info/ProblemInfoView";
import ProblemUtils from "../util/ProblemUtils";
import GameView from "../../components/game/GameView";
import ProblemFormView from "./ProblemFormView";
import {AppUtils} from "sirius-common-utils";
import Constants from "../../Constants";


function ProblemMgmtPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        init(location.state.problemId);
    }, []);

    const [formData, setFormData] = useState();

    let init = async (problemId) => {
        setFormData(null);

        let problem = null;
        if (problemId) {
            problem = await ProblemUtils.loadProblemById(problemId);
            problem.$title = "编辑棋局";
        } else {
            problem = AppUtils.getLocalStorageObjItem("DEFAULT_PROBLEM");
            if (problem == null) {
                problem = {
                    chessBoardSize: 11,
                    nextChessType: Constants.CHESS_TYPE.B.value,
                };
            }
            problem.$title = "新建棋局";
        }
        setFormData(problem);
    }

    const navBack = async () => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (formData == null ? <XmsSpinView/> :
            <div className="problem-test-page">
                <NavBar
                    onBack={() => navBack()}
                >
                    <div>{formData.$title}</div>
                </NavBar>

                <div className="xms-page-content">
                    <ProblemFormView problem={formData}/>
                </div>
            </div>
    )
}

export default ProblemMgmtPage;



