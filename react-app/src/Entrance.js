import React, {useEffect, useRef, useState} from 'react';
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";

import KeepAlive, {AliveScope} from "react-activation";
import ProblemListPage from "./module/problem-list/ProblemListPage";
import Constants from "./Constants";
import MainPage from "./module/main/MainPage";
import HomePage from "./module/home/HomePage";

import {DomUtils} from "sirius-common-utils";
import {SpinUtils, XmsRouterListener} from "sirius-react-mobile";


function Entrance(props) {
    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;
        init();
    }, []);

    const init = async () => {
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
                            </Route>
                        </Routes>
                    </HashRouter>
                </AliveScope>
            ) : null}
        </div>
    )
}

export default Entrance;
