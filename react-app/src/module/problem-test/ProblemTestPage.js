import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemTestPage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar} from "antd-mobile";
import {useLocation} from "react-router";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemInfoView from "../../components/problem-info/ProblemInfoView";
import ProblemUtils from "../util/ProblemUtils";
import GameView from "../../components/game/GameView";


function ProblemTestPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        if (location.state.idx == null) {
            console.log(`idx is null`);
            return;
        }
        init(location.state.idx);
    }, []);

    const [formData, setFormData] = useState();
    const [nextOrderIdx, setNextOrderIdx] = useState(null);

    let init = async (orderIdx) => {
        setFormData(null);
        let problem = await ProblemUtils.loadProblemByFilteredOrderIdx(orderIdx);
        if (problem == null) {
            console.error(`Could not find Problem by idx: ${orderIdx}`);
            return;
        }
        setFormData(problem);

        let nextOrderIdx = orderIdx + 1;
        let nextProblem = await ProblemUtils.loadProblemByFilteredOrderIdx(nextOrderIdx);
        if (nextProblem) {
            setNextOrderIdx(nextOrderIdx);
        } else {
            setNextOrderIdx(null);
        }
    }

    const modifiedObj = useRef();
    const handleProblemChange = async (problem) => {
        modifiedObj.current = problem;
    }

    const navBack = async () => {
        if (modifiedObj.current) {
            let problem = {}
            _.assign(problem, formData, modifiedObj.current);
            await ProblemUtils.saveProblem(problem);
        }
        NavigateUtils.navigateBack(navigate, location, {});
    }

    const handleNextProblem = async () => {
        if (nextOrderIdx) {
            await init(nextOrderIdx);
        }
    }

    return (formData == null ? <XmsSpinView/> :
            <div className="problem-test-page">
                <NavBar
                    onBack={() => navBack()}
                    right={nextOrderIdx ? <Button color="primary" fill="solid" size="small" onClick={() => handleNextProblem()}>下一局</Button> : null}
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



