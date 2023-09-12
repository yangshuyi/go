import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemMgmtPage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar} from "antd-mobile";
import {useLocation} from "react-router";
import {DialogUtils, NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemInfoView from "../../components/problem-info/ProblemInfoView";
import ProblemUtils from "../util/ProblemUtils";
import GameView from "../../components/game/GameView";
import ProblemFormView from "./ProblemFormView";
import {AppUtils, FormUtils, FormUtils as XmsFormUtils} from "sirius-common-utils";
import Constants from "../../Constants";


function ProblemMgmtPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    const problemFormViewRef = useRef();

    useEffect(() => {
        init(location.state.problemId);
    }, []);

    const [formData, setFormData] = useState();

    const [data, setData] = useState();

    let init = async (problemId) => {
        setFormData(null);

        let problem = null;
        if (problemId) {
            problem = await ProblemUtils.loadProblemById(problemId);
            problem.$title = "编辑棋局";
        } else {
            let lastProblem = AppUtils.getLocalStorageObjItem("LAST_PROBLEM");
            if (lastProblem == null) {
                problem = {
                    chessBoardSize: 11,
                    nextChessType: Constants.CHESS_TYPE.B.value,
                    level: Constants.LEVEL_OPTIONS["3"].value,
                };
            } else {
                problem = {
                    ...lastProblem,
                    id: null,
                    title: ProblemUtils.generateNewGameTitle(lastProblem.title),
                }
            }
            problem.$title = "新建棋局";
        }
        setFormData(problem);
    }

    const handleDel = async () => {
        let confirmMsg = await DialogUtils.showConfirmDialog("确定要删除么？");
        if (confirmMsg) {
            await ProblemUtils.deleteProblemById(location.state.problemId, true);
            await navBack("DEL", location.state.problemId);
        }

    }

    const handleSave = async () => {
        let problemParam = await problemFormViewRef.current.getFormData();
        if (!problemParam) {
            return;
        }

        await ProblemUtils.saveProblem(problemParam, true);
        AppUtils.setLocalStorageObjItem("LAST_PROBLEM", problemParam);

        await DialogUtils.showSuccessMessage("Save Successfully");

        if (location.state.problemId) {
            //编辑场景，保存后直接返回
            await navBack("SAVE", location.state.problemId);
        } else {
            //新增场景，保存后重新进入下一条
            await init(null);
        }
    }

    const navBack = async (action, problemId) => {
        NavigateUtils.navigateBack(navigate, location, {
            action: action, problemId: problemId
        });
    }

    return (formData == null ? <XmsSpinView/> :
            <div className="problem-mgmt-page">
                <NavBar
                    onBack={() => navBack()}
                    left={location.state.problemId ? <Button color="danger" fill="solid" size="small" onClick={() => handleDel()}>删除</Button> : null}
                    right={<Button color="primary" fill="solid" size="small" onClick={() => handleSave()}>保存</Button>}
                >
                    <div>{formData.$title}</div>
                </NavBar>

                <div className="xms-page-content">
                    <ProblemFormView ref={problemFormViewRef} problem={formData}/>
                </div>

                {/*{JSON.stringify(data)}*/}
            </div>
    )
}

export default ProblemMgmtPage;



