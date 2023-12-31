import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './DataMaintenancePage.css';

import {useNavigate} from "react-router-dom";
import {Button, Dialog, List, NavBar, Radio, Space, Switch} from "antd-mobile";
import {useLocation} from "react-router";
import {DialogUtils, NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import GithubUtils from "../util/GithubUtils";
import BookUtils from "../../components/book/BookUtils";
import TagUtils from "../../components/tag/TagUtils";
import ProblemUtils from "../util/ProblemUtils";
import ConfigUtils from "../../components/config/ConfigUtils";

function DataMaintenancePage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;
        init();
    }, []);

    const [onlineFlag, setOnlineFlag] = useState(true);
    const [remoteDataInfo, setRemoteDataInfo] = useState({
        dataVersion: null,
        cnt: null,
    });
    const [localDataInfo, setLocalDataInfo] = useState({
        dataVersion: null,
        cnt: null,
    });


    const init = async () => {
        let onlineFlag = false;
        try {
            await GithubUtils.fetchAllAssets();
            onlineFlag = true;
        } catch (e) {
            onlineFlag = false;
        }
        setOnlineFlag(onlineFlag);

        if (onlineFlag) {
            await refreshRemoteDataInfo(false);
        }
        await refreshLocalDataInfo(false);

        let showBoard = await ConfigUtils.getShowBoardFlag();
        setShowBoard(showBoard);

        let screenOrientationLandscape = await ConfigUtils.getScreenOrientationLandscape();
        setScreenOrientationLandscape(screenOrientationLandscape)

        setDataInitialized(true);
    }

    const refreshRemoteDataInfo = async (showMsgFlag) => {
        let remoteDataInfo = await GithubUtils.loadRemoteDataInfo();
        setRemoteDataInfo(remoteDataInfo);

        if (showMsgFlag) {
            DialogUtils.showSuccessMessage("Success");
        }
    }

    const refreshLocalDataInfo = async (showMsgFlag) => {
        setLocalDataInfo({
            dataVersion: await ConfigUtils.getDataVersion(),
            count: await ProblemUtils.queryCount(),
        });

        if (showMsgFlag) {
            DialogUtils.showSuccessMessage("Success");
        }
    }

    const downloadRemoteData = async () => {
        let assetData = remoteDataInfo.assetData;
        if (!assetData) {
            return;
        }

        let clearFlag = true;
        if (remoteDataInfo.dataVersion < localDataInfo.dataVersion) {
            let confirmResult = await Dialog.confirm({
                content: "远程版本较老，是否下载？"
            });
            if (!confirmResult) {
                return;
            }
            clearFlag = await Dialog.confirm({
                content: "下载方式？",
                confirmText: '全量替换',
                cancelText: '合并替换',
            });
        }

        await BookUtils.syncFromRemote(assetData);
        await TagUtils.syncFromRemote(assetData);
        await ProblemUtils.syncFromRemote(assetData, clearFlag);
        await ConfigUtils.updateDataVersion(remoteDataInfo.dataVersion);

        await refreshLocalDataInfo(false);


        DialogUtils.showSuccessMessage("Success");

    }

    const uploadLocalData = async (showMsgFlag) => {
        //refresh local data version
        await refreshLocalDataInfo(false);

        let problemList = await ProblemUtils.queryAll();
        problemList = _.orderBy(problemList, ['id'], ['asc']);
        await GithubUtils.uploadAssetData(problemList);

        await refreshRemoteDataInfo(false);

        if (showMsgFlag) {
            DialogUtils.showSuccessMessage("Success");
        }
    }

    const [showBoard, setShowBoard] = useState(false);
    const handleShowBoardChange = async (showMsgFlag) => {
        let newShowBoard = !showBoard;
        setShowBoard(newShowBoard);

        await ConfigUtils.setShowBoardFlag(newShowBoard);

        if (showMsgFlag) {
            DialogUtils.showSuccessMessage("Success");
        }
    }

    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState(false);
    const handleScreenOrientationLandscapeChange = async (showMsgFlag) => {
        let newScreenOrientationLandscape = !screenOrientationLandscape;
        setScreenOrientationLandscape(newScreenOrientationLandscape);

        await ConfigUtils.setScreenOrientationLandscape(newScreenOrientationLandscape);

        if (showMsgFlag) {
            DialogUtils.showSuccessMessage("Success");
        }
    }

    const navBack = async (needRefreshFlag) => {
        NavigateUtils.navigateBack(navigate, location, {});
    }

    return (!dataInitialized ? <XmsSpinView/> :
            <div className="data-maintenance-page">
                <NavBar onBack={() => navBack(false)}>
                    数据维护
                </NavBar>

                <div className="xms-page-content with-padding-top padding">
                    <List>
                        <List.Item extra={<Switch checked={onlineFlag} uncheckedText='离线' checkedText='在线' onChange={init}/>}>
                            网络状态
                        </List.Item>
                    </List>
                    <List header="远程数据">
                        <List.Item extra={
                            <Space>
                                <Button size='mini' color='primary' fill='outline' loading='auto' disabled={onlineFlag === false} onClick={() => refreshRemoteDataInfo(true)}>刷新</Button>
                                <Button size='mini' color='primary' fill='outline' loading='auto' disabled={onlineFlag === false || !remoteDataInfo.dataVersion}
                                        onClick={downloadRemoteData}>下载</Button>
                            </Space>
                        }>
                            操作
                        </List.Item>
                        <List.Item extra={remoteDataInfo.dataVersion}>
                            数据版本
                        </List.Item>
                        <List.Item extra={remoteDataInfo.count}>
                            数据量
                        </List.Item>
                    </List>
                    <List header="本地数据">
                        <List.Item extra={
                            <Space>
                                <Button size='mini' color='primary' fill='outline' loading='auto' disabled={onlineFlag === false || !remoteDataInfo.dataVersion} onClick={uploadLocalData}>上传</Button>
                            </Space>
                        }>
                            操作
                        </List.Item>
                        <List.Item extra={localDataInfo.dataVersion}>
                            数据版本
                        </List.Item>
                        <List.Item extra={localDataInfo.count}>
                            数据量
                        </List.Item>
                    </List>
                    <List header="系统配置">
                        <List.Item extra={<Switch checked={showBoard} onChange={() => handleShowBoardChange(true)}/>}>
                            展示棋盘
                        </List.Item>
                        <List.Item extra={<Switch checked={screenOrientationLandscape} onChange={() => handleScreenOrientationLandscapeChange(true)}/>}>
                            横屏布局
                        </List.Item>
                    </List>

                </div>
            </div>
    )
}

export default DataMaintenancePage;



