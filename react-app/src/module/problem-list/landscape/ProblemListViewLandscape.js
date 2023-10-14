import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListViewLandscape.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {useLocation} from "react-router";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../../util/ProblemUtils";
import ListView from "./ListView";
import GameView from "../../../components/game/GameView";
import {Button, NavBar} from "antd-mobile";


function ProblemListViewLandscape(props) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
        setInitLoadingFlag(true);
        await handleFilterChange(null);
        setInitLoadingFlag(false);

        setPageTitle("棋局列表");
    }

    useActivate(async () => {
        let {fromPageKey, param} = NavigateUtils.getPageResult();
        if (props.currPageKey === fromPageKey) {
            if (param?.action === "DEL") {
                let newListData = _.reject(listData, {id: param.problemId});
                setListData(newListData);
            } else if (param?.action === "SAVE") {
                let newListData = [...listData];
                let listItem = _.find(listData, {id: param.problemId});
                if (listItem) {
                    let model = await ProblemUtils.loadProblemById(listItem.id);
                    _.assign(listItem, model);
                    listItem.$visited = true;
                }
                setListData(newListData);
            } else if (param?.action === "VIEW") {
                let newListData = [...listData];
                let listItem = _.find(listData, {id: param.problemId});
                if (listItem) {
                    listItem.$visited = true;
                }
                setListData(newListData);
            }
        }
    });

    const [pageTitle, setPageTitle] = useState()

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

        let newListData = _.reject(listData, {id: problem.id});
        setListData(newListData);
    }

    const navToProblemMgmtPage = (problem) => {
        if (props.onNavToProblemMgmtPage) {
            props.onNavToProblemMgmtPage(problem)
        }
    }

    const navToProblemTestPage = (idx) => {
        if (props.onNavToProblemTestPage) {
            props.onNavToProblemTestPage(idx)
        }
    }

    const navBack = async (needRefreshFlag) => {
        if (props.onNavBack) {
            props.onNavBack(needRefreshFlag)
        }
    }

    return (
        <div className="problem-list-page">
            <NavBar
                onBack={() => navBack(false)}
                left={<Button color="primary" fill="solid" size="small" onClick={() => navToProblemMgmtPage(null)}>新增棋局</Button>}
            >{pageTitle}</NavBar>

            <div className="xms-page-content with-padding-top problem-list-view-landscape">
                <div className="list-area">
                    <ListView/>
                </div>
                <div className="game-area">
                    {/*<GameView game={formData}/>*/}
                </div>
            </div>
        </div>
    )
}

export default ProblemListViewLandscape;



