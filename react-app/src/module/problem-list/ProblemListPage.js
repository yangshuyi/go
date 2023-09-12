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

    useActivate(async () => {
        let {fromPageKey, param} = NavigateUtils.getPageResult();
        if (currPageKey === fromPageKey) {
            if (param?.action === "DEL") {
                let newListData = _.reject(listData, {id: param.problemId});
                setListData(newListData);
            } else if (param?.action === "SAVE") {
                let newListData = [...listData];
                let newData = _.find(listData, {id: param.problemId});
                if (newData) {
                    let model = await ProblemUtils.loadProblemById(newData.id);
                    _.assign(newData, model);
                }
                setListData(newListData);
            }
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
            setListData((oldData) => {
                return [...oldData, ...result.list];
            });
            setHasMoreFlag(result.hasMoreFlag);
        }
    }

    const handleDeleteProblem = (problem) => {
        ProblemUtils.deleteProblemById(problem.id);

        let newListData = _.reject(listData, {id: problem.id});
        setListData(newListData);
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
                    {listData.map((problem) => {
                        return (
                            <SwipeAction key={problem.orderIdx} closeOnAction={true} rightActions={[
                                {
                                    key: 'del',
                                    text: '删除',
                                    color: 'danger',
                                    onClick: () => handleDeleteProblem(problem),
                                },
                                {
                                    key: 'mgmt',
                                    text: '管理',
                                    color: 'primary',
                                    onClick: () => navToProblemMgmtPage(problem),
                                },
                            ]}
                            >
                                <List.Item prefix={problem.$levelIcon}
                                           description={problem.$introLabel}
                                           arrow={false} extra={problem.hardFlag ? <HeartFilled style={{fontSize: '22px', color: 'red'}}/> : null}
                                           onClick={() => navToProblemTestPage(problem.orderIdx)}
                                >
                                    <div className="flex-row">
                                        <div>{problem.$introValue}</div>
                                        {problem.$visited ? <EyeFilled/> : null}
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



