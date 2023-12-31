import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListViewLandscape.css';

import {DialogUtils} from "sirius-react-mobile";
import ListView from "./ListView";
import {Button, NavBar} from "antd-mobile";
import ProblemTestViewLandscape from "../../problem-test/landscape/ProblemTestViewLandscape";


function ProblemListViewLandscape(props) {
    const domListViewRef = useRef();

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
        setPageTitle("棋局列表");
    }

    const [pageTitle, setPageTitle] = useState()

    const handleDeleteProblem = async (problem) => {
        setSelectedProblem(null);
        setPageTitle("棋局列表");
    }

    const navToProblemMgmtPage = (problem) => {
        alert("navToProblemMgmtPage")
    }

    const navToProblemTestPage = async (problem) => {
        if (problem == null) {
             return;
        }

        problem.$visited = true;
        setPageTitle(problem.$introValue);
        setSelectedProblem(problem);
    }

    const [selectedProblem, setSelectedProblem] = useState(null);

    const handleProblemChanged = async (newProblemFormData) => {
        let problem = await domListViewRef.current.updateProblem(newProblemFormData.id);
        setPageTitle(problem.$introValue);
    }

    const handleTitleClick = async () => {
        if (!selectedProblem) {
            return;
        }

        try {
            await navigator.clipboard.writeText(selectedProblem.id);
            await DialogUtils.showSuccessMessage(`复制ID:${selectedProblem.id}成功`);
        } catch (err) {
            console.error('Failed to copy: ', err);
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
            >
                <div onClick={handleTitleClick}>{pageTitle}</div>
            </NavBar>

            <div className="xms-page-content with-padding-top problem-list-view-landscape">
                <div className="list-area">
                    <ListView ref={domListViewRef}
                        onDeleteProblem={handleDeleteProblem}
                        onNavToProblemMgmtPage={navToProblemMgmtPage}
                        onNavToProblemTestPage={navToProblemTestPage}
                    />
                </div>
                <div className="game-area">
                    {selectedProblem ?
                        <ProblemTestViewLandscape problemOrderIdx={selectedProblem.orderIdx} onProblemChanged={handleProblemChanged}/>
                        : null
                    }
                </div>

            </div>
        </div>
    )
}

export default ProblemListViewLandscape;



