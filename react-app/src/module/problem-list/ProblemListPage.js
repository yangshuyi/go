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
import ConfigUtils from "../../components/config/ConfigUtils";
import ProblemListViewPortrait from "./portrait/ProblemListViewPortrait";
import ProblemListViewLandscape from "./landscape/ProblemListViewLandscape";


function ProblemListPage(props) {
    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState(() => ConfigUtils.getScreenOrientationLandscape());

    const navigate = useNavigate();

    useEffect(() => {
        init();
    }, []);

    let init = async () => {
    }

    const navBack = async (needRefreshFlag) => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (


        screenOrientationLandscape ?
            <ProblemListViewLandscape onNavBack={navBack}/>
            :
            <ProblemListViewPortrait onNavBack={navBack}/>

    )
}

export default ProblemListPage;



