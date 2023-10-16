import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import _ from 'lodash';


import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, InfiniteScroll, List, NavBar, PullToRefresh, SwipeAction, Tabs} from "antd-mobile";
import {useLocation} from "react-router";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import {EyeFilled, HeartFilled, StarFilled} from "@ant-design/icons";
import ProblemUtils from "../../util/ProblemUtils";
import ProblemFilterView from "../ProblemFilterView";

const ListView = (props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            updateProblem: updateProblem,
            deleteProblem: deleteProblem,
        }
    });

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
        setInitLoadingFlag(true);
        await handleFilterChange(null);
        setInitLoadingFlag(false);
    }

    let updateProblem = async (problemId) => {
        let newListData = [...listData];
        let listItem = _.find(newListData, {id: problemId});
        if (listItem) {
            let model = await ProblemUtils.loadProblemById(listItem.id);
            _.assign(listItem, model);
            listItem.$visited = true;
        }
        setListData(newListData);
    }

    let deleteProblem = async (problemId) => {
        let newListData = _.reject(listData, {id: problemId});
        setListData(newListData);
    }

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

    const handleDeleteProblem = async (problem) => {
        if (props.onDeleteProblem) {
            props.onDeleteProblem(problem)
        }

        await deleteProblem(problem.id)
    }

    const navToProblemMgmtPage = (problem) => {
        if (props.onNavToProblemMgmtPage) {
            props.onNavToProblemMgmtPage(problem)
        }
    }

    const navToProblemTestPage = (problem) => {
        problem.$visited = true;

        if (props.onNavToProblemTestPage) {
            props.onNavToProblemTestPage(problem)
        }
    }

    return (
        <div className="list-view">
            <ProblemFilterView onChange={handleFilterChange}/>

            <div className="list-container">
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
                                <List.Item
                                    prefix={problem.$levelIcon}
                                    description={problem.$introLabel}
                                    arrow={false} extra={
                                    <div className="flex-row">
                                        <HeartFilled style={{fontSize: '22px', color: problem.hardFlag ? 'red' : 'transparent'}}/>
                                        <div>
                                            <div>E{problem.ebbinghausTimes || 0}</div>
                                            <EyeFilled style={{color: problem.$visited ? 'black' : 'transparent'}}/>
                                        </div>
                                    </div>
                                }
                                    onClick={() => navToProblemTestPage(problem)}
                                >
                                    <div>{problem.$introValue}</div>
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


const WrapListView = forwardRef(ListView);

export default WrapListView;



