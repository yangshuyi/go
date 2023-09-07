import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './MainPage.css';

import {HashRouter, Route, useNavigate, Outlet} from "react-router-dom";
import {XmsSpinView} from "sirius-react-mobile";
import GithubUtils from "../util/GithubUtils";
import ProblemUtils from "../util/ProblemUtils";

function MainPage(props) {
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
        let problemList = [];
        let assetList = await GithubUtils.fetchAllAssets();
        for (let i = 0; i < assetList.length; i++) {
            assetList[i].problemList = await GithubUtils.downloadAssetData(assetList[i].downloadUrl);
            problemList = _.union(problemList, assetList[i].problemList);
        }
        console.log(`Totally find ${problemList.length} problems`);

        ProblemUtils.init(problemList);

        setDataInitialized(true);
    }

    return <>{dataInitialized ? <Outlet/> : <XmsSpinView/>}</>;
}

export default MainPage;



