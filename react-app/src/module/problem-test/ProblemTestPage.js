import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemTestPage.css';

import {useNavigate} from "react-router-dom";
import {Button, InfiniteScroll, List, NavBar, PullToRefresh, SwipeAction, Tabs} from "antd-mobile";
import {useLocation} from "react-router";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemInfoView from "../../components/problem-info/ProblemInfoView";
import ChessBoard from "../../components/game/ChessBoard";
import ProblemUtils from "../util/ProblemUtils";
import GameUtils from "../util/game-utils";
import GameView from "../../components/game/GameView";


function ProblemTestPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        if (!location.state.problemId) {
            console.log(`problemId is null`);
            return;
        }
        init(location.state.problemId);
    }, []);

    const [formData, setFormData] = useState();
    const [hasNextProblem, setHasNextProblem] = useState(false);

    let init = async (problemId) => {
        let problem = await ProblemUtils.loadProblemById(problemId);
        setFormData(problem);
    }

    const modifiedObj = useRef();
    const handleProblemChange = async (problem) => {
        modifiedObj.current = problem;
    }

    const navBack = async () => {
        if(modifiedObj.current){
            await ProblemUtils.saveProblem(modifiedObj.current);
        }
        NavigateUtils.navigateBack(navigate, location, {});
    }


    return (formData == null ? <XmsSpinView/> :
            <div className="problem-test-page">
                <NavBar
                    onBack={() => navBack()}
                    right={hasNextProblem ? <Button color="primary" fill="solid" size="small" onClick={() => handleNextProblem()}>下一局</Button> : null}
                >
                    <div>{formData.$introValue}</div>
                </NavBar>

                <div className="xms-page-content">
                    <GameView game={formData}/>
                </div>

                <ProblemInfoView problem={formData} onChange={handleProblemChange}/>
            </div>
    )
}

export default ProblemTestPage;



