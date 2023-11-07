import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListPage.css';

import {useNavigate} from "react-router-dom";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ConfigUtils from "../../components/config/ConfigUtils";
import ProblemListViewPortrait from "./portrait/ProblemListViewPortrait";
import ProblemListViewLandscape from "./landscape/ProblemListViewLandscape";

function ProblemListPage(props) {
    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;

        if (!dataInitialized) {
            init();
        }
    }, []);

    let init = async () => {
        let screenOrientationLandscape = await ConfigUtils.getScreenOrientationLandscape()
        setScreenOrientationLandscape(screenOrientationLandscape)

        setDataInitialized(true);
    }

    const navBack = async (needRefreshFlag) => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (dataInitialized !== true ? <XmsSpinView/> :
            screenOrientationLandscape === true ?
                <ProblemListViewLandscape onNavBack={navBack}/>
                :
                <ProblemListViewPortrait onNavBack={navBack}/>
    )
}

export default ProblemListPage;



