import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListPage.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, InfiniteScroll, List, NavBar, PullToRefresh, SwipeAction, Tabs} from "antd-mobile";
import {useLocation} from "react-router";
import GameUtils from "../util/game-utils";
import Constants from "../../Constants";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../util/ProblemUtils";
import {EyeFilled, HeartFilled, StarFilled} from "@ant-design/icons";
import ProblemFilterView from "./ProblemFilterView";


function ProblemListPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
        setInitLoadingFlag(true);
        await handleFilterChange(null);
        setInitLoadingFlag(false);
    }

    useActivate(() => {
        let {fromPageKey, param} = NavigateUtils.getPageResult();
        if (currPageKey === fromPageKey) {
            // if (param?.needRefreshFlag) {
            //     executeQuery(false);
            // }

        }
    });

    const handleFilterChange = async (filterParam) => {
        await ProblemUtils.filterProblemList(filterParam);

        pageNo.current = 1;
        await executeQuery(false, false);
    }

    const handleLoadMore = async () => {
        pageNo.current++;
        await executeQuery(true);
    }

    let pageNo = useRef(0);
    let pageSize = useRef(20);

    let [listData, setListData] = useState([]);
    let [hasMoreFlag, setHasMoreFlag] = useState(false);
    const [initLoadingFlag, setInitLoadingFlag] = React.useState(false);

    const executeQuery = async (appendFlag) => {
        if (appendFlag === false) {
            setListData([]);
        }

        let result = await ProblemUtils.queryFilteredProblemByPage(pageNo.current, pageSize.current);

        if (result) {
            setListData((oldData)=>{
                return [...oldData, ...result.list];
            });
            setHasMoreFlag(result.hasMoreFlag);
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

            <ProblemFilterView onChange={handleFilterChange}/>

            <div className="xms-page-content with-padding-top">

                <List>
                    {listData.map((problem, idx) => {
                        return (
                            <SwipeAction key={problem.id} rightActions={[
                                {
                                    key: 'mgmt',
                                    text: '管理',
                                    color: 'primary',
                                    onClick: () => {
                                        navToProblemMgmtPage(problem)
                                    },
                                },
                            ]}
                            >
                                <List.Item prefix={problem.$levelIcon}
                                           description={problem.$introLabel}
                                           arrow={false} extra={problem.hardFlag ? <HeartFilled style={{fontSize: '22px', color: 'red'}}/> : null}
                                           onClick={() => navToProblemTestPage(idx)}
                                >
                                    <div className="flex-row">
                                        <div>{problem.$introValue}</div>
                                        {problem.$visited?<EyeFilled />:null}
                                    </div>
                                </List.Item>
                            </SwipeAction>
                        )
                    })}
                </List>
                {initLoadingFlag ? <XmsSpinView/> : <InfiniteScroll loadMore={handleLoadMore} hasMore={hasMoreFlag}/>}
            </div>
        </div>
    )
}

export default ProblemListPage;



