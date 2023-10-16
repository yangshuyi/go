import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemInfoView.css';

import {DownOutlined, EditFilled, HeartFilled, UpOutlined} from "@ant-design/icons";
import Constants from "../../Constants";


function ProblemInfoViewActionBarVertical(props) {
    useEffect(() => {
        if (props.problem) {
            init();
        }
    }, [props.problem]);


    const init = async () => {
        let formData = props.problem;
        setFormData(formData);
    }

    const [formData, setFormData] = useState();
    const [levelOptions, setLevelOptions] = useState(_.values(Constants.LEVEL_OPTIONS));

    const handleFieldChange = (field, value) => {
        setFormData((oldData) => {
            let newData = {...oldData};
            newData[field] = value;

            if (props.onChange) {
                props.onChange(newData);
            }
            return newData;
        });
    }

    const openProblemMgmtPage = () => {

    }


    return (formData == null ? null :
            <>
                <div className="problem-info-view-action-bar vertical">
                    {levelOptions.map((levelOption) => (
                        <div key={levelOption.value} className={levelOption.value === formData.level ? "action-bar-item selected" : "action-bar-item unselected"}
                             onClick={() => handleFieldChange("level", levelOption.value)}>
                            <div className="icon">{levelOption.icon}</div>
                            <div className="text">{levelOption.text}</div>
                        </div>
                    ))}

                    <div className={formData.hardFlag ? "action-bar-item selected" : "action-bar-item unselected"}
                         onClick={() => handleFieldChange("hardFlag", !formData.hardFlag)}>
                        <div className="icon"><HeartFilled style={{fontSize: '22px', color: 'red'}}/></div>
                        <div className="text">难题</div>
                    </div>

                    <div className="action-bar-item unselected"
                         onClick={openProblemMgmtPage}>
                        <div className="icon"><EditFilled style={{fontSize: '22px', color: 'var(--adm-color-primary)'}}/></div>
                        <div className="text">管理</div>
                    </div>
                </div>
            </>
    )
}

export default ProblemInfoViewActionBarVertical;



