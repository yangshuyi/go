import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListPage.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, List, NavBar, PullToRefresh, Tabs} from "antd-mobile";
import {ExclamationCircleFill, RedoOutline, StarFill, StarOutline} from "antd-mobile-icons";
import {useLocation} from "react-router";
import ProblemFilterView from "./ProblemFilterView";
import GameUtils from "../util/game-utils";
import Constants from "../../Constants";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";


function ProblemListPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
    }

    useActivate(() => {
        let {fromPageKey, param} = NavigateUtils.getPageResult();
        if (currPageKey === fromPageKey) {
            if (param?.needRefreshFlag) {
                executeQuery(false);
            }
        }
    });


    let [filterParam, setFilterParam] = useState({
        pageNo: 1,
        pageSize: 100,
        sortByColumn: 'statusId',
        sortDirection: 'ASC',
    });

    let [listData, setListData] = useState([]);
    const [loadingFlag, setLoadingFlag] = React.useState(false);

    const executeQuery = async (appendFlag, refreshFlag = false) => {
        if (appendFlag === false && !refreshFlag) {
            setListData([]);
            setLoadingFlag(true);
        }

        let result = await GameUtils.loadGameData();

        setLoadingFlag(false);

        if (appendFlag === false && refreshFlag) {
            setListData([]);
        }

        if (result) {
            setListData(result.list);
        }
    }

    const navToProblemMgmtPage = (problem) => {
        NavigateUtils.navigateTo(navigate, Constants.ROUTER.PROBLEM_MGMT.path, {
            state: {
                key: currPageKey,
                problemId: problem?.id,
            },
        });
    }

    const navBack = async (needRefreshFlag) => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (
        <div className="technician-task-list-page">
            <NavBar
                onBack={() => navBack(false)}
                right={<Button color="primary" fill="solid" size="small" onClick={() => navToProblemMgmtPage(null)}>新增棋局</Button>}
            >棋局列表</NavBar>

            <div className="xms-page-content with-padding-top">
                <ProblemFilterView/>
                <PullToRefresh
                    onRefresh={async () => {
                        await executeQuery(false, true);
                    }}
                >
                    <List>
                        {listData.map((problem, i) => {
                            return (
                                <List.Item key={i}
                                           prefix={<ExclamationCircleFill title={problem.priorityText} className={"priority " + problem.priorityCode}/>}
                                           extra={problem.introLabel}
                                           description={<div className="">{problem.introValue}</div>}
                                           arrow={false} onClick={() => navToProblemMgmtPage(problem)}
                                >
                                    {problem.code}
                                </List.Item>
                            )
                        })}
                    </List>
                </PullToRefresh>
                {loadingFlag ? <XmsSpinView/> : null}
            </div>
        </div>
    )
}

export default ProblemListPage;



