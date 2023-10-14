import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListPage.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, InfiniteScroll, List, NavBar, PullToRefresh, SwipeAction, Tabs} from "antd-mobile";
import {useLocation} from "react-router";
import Constants from "../../Constants";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../util/ProblemUtils";
import {EyeFilled, HeartFilled, StarFilled} from "@ant-design/icons";
import ProblemFilterView from "./ProblemFilterView";
import ConfigUtils from "../../components/config/ConfigUtils";
import HomePageLandscape from "../home/HomePageLandscape";
import HomePagePortrait from "../home/HomePagePortrait";
import ProblemListPagePortrait from "./ProblemListPagePortrait";


function ProblemListPage(props) {
    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState(() => ConfigUtils.getScreenOrientationLandscape());

    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
    }

    const handleDeleteProblem = async (problem) => {
        await ProblemUtils.deleteProblemById(problem.id, true);
    }

    const navToProblemMgmtPage = (problem) => {
        NavigateUtils.navigateTo(navigate, Constants.ROUTER.PROBLEM_MGMT.path, {
            state: {
                key: currPageKey,
                problemId: problem?.id,
            },
        });
    }

    const navToProblemTestPage = (idx) => {
        NavigateUtils.navigateTo(navigate, Constants.ROUTER.PROBLEM_TEST.path, {
            state: {
                key: currPageKey,
                idx: idx,
            },
        });
    }

    const navBack = async (needRefreshFlag) => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (
        <div className="problem-list-page">
            <NavBar
                onBack={() => navBack(false)}
                right={<Button color="primary" fill="solid" size="small" onClick={() => navToProblemMgmtPage(null)}>新增棋局</Button>}
            >棋局列表</NavBar>

            {screenOrientationLandscape ?
            <ProblemListPageLandscape currPageKey={currPageKey}
                onDeleteProblem={handleDeleteProblem}
                onNavToProblemMgmtPage={navToProblemMgmtPage}
                onNavToProblemTestPage={navToProblemTestPage}
            />
            :
            <ProblemListPagePortrait currPageKey={currPageKey}
                onDeleteProblem={handleDeleteProblem}
                onNavToProblemMgmtPage={navToProblemMgmtPage}
                onNavToProblemTestPage={navToProblemTestPage}
            />
            }
        </div>
    )
}

export default ProblemListPage;



