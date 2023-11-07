import React, {useEffect, useRef, useState} from 'react';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";

import KeepAlive, {AliveScope} from "react-activation";
import ProblemListPage from "./module/problem-list/ProblemListPage";
import ProblemTestPage from "./module/problem-test/portrait/ProblemTestPagePortrait";
import Constants from "./Constants";
import MainPage from "./module/main/MainPage";
import HomePage from "./module/home/HomePage";

import {DomUtils} from "sirius-common-utils";
import {SpinUtils, XmsRouterListener} from "sirius-react-mobile";
import GithubUtils from "./module/util/GithubUtils";
import DataMaintenancePage from "./module/data-maintenance/DataMaintenancePage";
import ProblemMgmtPage from "./module/problem-mgmt/ProblemMgmtPage";
import GamePlayPage from "./module/game-play/GamePlayPage";


function Entrance(props) {
    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;

        if(!dataInitialized) {
            init();
        }
    }, []);

    const init = async () => {
        await GithubUtils.init();

        setDataInitialized(true);
    }

    function handleRouterChange(oldLocation, newLocation) {
        DomUtils.resetBodyScroll();
    }

    return (
        <div className='entrance'>
            {dataInitialized ? (
                <AliveScope>
                    <HashRouter basename='/'>
                        <XmsRouterListener onRouteChange={handleRouterChange}/>
                        <Routes>
                            <Route index element={<Navigate to={Constants.ROUTER.HOME.path}/>}/>
                            <Route path={Constants.ROUTER.MAIN.path} element={<MainPage/>}>
                                <Route index element={<Navigate to={Constants.ROUTER.HOME.path}/>}/>
                                <Route path={Constants.ROUTER.HOME.path} element={<HomePage/>}/>

                                <Route path={Constants.ROUTER.PROBLEM_LIST.path} element={
                                    <KeepAlive cacheKey={Constants.ROUTER.PROBLEM_LIST.path} name={Constants.ROUTER.PROBLEM_LIST.path}>
                                        <ProblemListPage/>
                                    </KeepAlive>
                                }/>
                                <Route path={Constants.ROUTER.PROBLEM_TEST.path} element={<ProblemTestPage/>}/>
                                <Route path={Constants.ROUTER.PROBLEM_MGMT.path} element={<ProblemMgmtPage/>}/>

                                <Route path={Constants.ROUTER.GAME_PLAY.path} element={<GamePlayPage/>}/>

                                <Route path={Constants.ROUTER.DATA_MAINTENANCE.path} element={<DataMaintenancePage/>}/>
                            </Route>
                        </Routes>
                    </HashRouter>
                </AliveScope>
            ) : null}
        </div>
    )
}

export default Entrance;
