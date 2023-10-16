import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemTestViewLandscape.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar} from "antd-mobile";
import {useLocation} from "react-router";
import {DialogUtils, NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../../util/ProblemUtils";
import GameView from "../../../components/game/GameView";
import ProblemInfoActionBarVertical from "../../../components/problem-info/ProblemInfoActionBarVertical";


function ProblemTestViewLandscape(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        init(props.problemOrderIdx);
    }, [props.problemOrderIdx]);

    const [formData, setFormData] = useState();
    const [nextOrderIdx, setNextOrderIdx] = useState(null);

    let init = async (orderIdx) => {
        setFormData(null);
        let problem = await ProblemUtils.loadProblemByFilteredOrderIdx(orderIdx);
        if (problem == null) {
            await DialogUtils.showAlertMessage(`Could not find Problem by orderIdx: ${orderIdx}`);
            await navBack();
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

    const modifiedObj = useRef(null);

    const handleProblemChanged = async (problemFormData) => {
        setFormData(problemFormData);
        await ProblemUtils.saveProblem(problemFormData, true);

        if(props.onProblemChanged){
            props.onProblemChanged(problemFormData)
        }
    }

    return (formData == null ? <XmsSpinView/> :
            <div className="problem-test-view-landscape">
                    <GameView singleRow={true} game={formData}/>
                    <ProblemInfoActionBarVertical problem={formData} onChange={handleProblemChanged}/>

                {/*<ProblemInfoView problem={formData} onChange={handleProblemChange}/>*/}
            </div>
    )
}

export default ProblemTestViewLandscape;



