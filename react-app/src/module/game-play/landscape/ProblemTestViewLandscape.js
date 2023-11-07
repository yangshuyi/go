import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemTestViewLandscape.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar} from "antd-mobile";
import {useLocation} from "react-router";
import {DialogUtils, NavigateUtils, SpinUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../../util/ProblemUtils";
import GameView from "../../../components/game/GameView";
import ProblemInfoActionBarVertical from "../../../components/problem-info/ProblemInfoActionBarVertical";


function ProblemTestViewLandscape(props) {
    useEffect(() => {
        init(props.problemOrderIdx);
    }, [props.problemOrderIdx]);

    const [formData, setFormData] = useState();

    let init = async (orderIdx) => {
        setFormData(null);
        let problem = await ProblemUtils.loadProblemByFilteredOrderIdx(orderIdx);
        if (problem == null) {
            await DialogUtils.showAlertMessage(`Could not find Problem by orderIdx: ${orderIdx}`);
            return;
        }
        setFormData(problem);
    }

    const handleProblemChanged = async (problemFormData) => {
        setFormData(problemFormData);
        await ProblemUtils.saveProblem(problemFormData, true);

        if (props.onProblemChanged) {
            props.onProblemChanged(problemFormData)
        }
    }

    return (formData == null ? <XmsSpinView/> :
            <div className="problem-test-view-landscape">
                <GameView game={formData} singleRow={true}/>
                <ProblemInfoActionBarVertical problem={formData} onChange={handleProblemChanged}/>
            </div>
    )
}

export default ProblemTestViewLandscape;



