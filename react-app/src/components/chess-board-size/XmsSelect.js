import React, {forwardRef, useEffect, useState} from 'react';
import _ from 'lodash';

import * as PropTypes from "prop-types";
import {Selector} from "antd-mobile";

/**
 *  Select
 *
 * Functionality:
 *
 * Notice:
 */
const XmsSelect = forwardRef((props, ref) => {
    const [valueArray, setValueArray] = useState([]);
    useEffect(() => {
        let valueArray = [];
        if (props.value == null) {
            valueArray = [];
        } else if (!_.isArray(props.value)) {
            valueArray = [props.value];
        } else {
            valueArray = props.value;
        }
        setValueArray(valueArray);
    }, [props.value]);

    const [options, setOptions] = useState([]);
    useEffect(() => {
        handleOptions();
    }, [props.options]);

    const handleOptions = () => {
        let options = _.map(props.options, (option) => {
             return {
                 description: null,
                 disabled: option[props.optionFieldDisabled],
                 label: option[props.optionFieldLabel],
                 value: option[props.optionFieldValue],
                 sort: option[props.optionFieldSort],
             }
        });

        if (props.optionFieldSort) {
            options = _.orderBy(options, props.sort, 'ASC');
        }
        setOptions(options);
    }

    const handleChange = (valueArray) => {
        setValueArray(valueArray);

        if (props.onChange) {
            let result = null;
            if (props.mode === 'multiple') {
                result = _.isEmpty(valueArray)?null:valueArray;
            } else {
                result = _.isEmpty(valueArray)?null:valueArray[0];
            }
            props.onChange(result);
        }
    }

    return (
        <Selector
            className={`xms-select ${props.className || ''}`} style={props.style} disabled={props.disabled}
            multiple={props.mode === 'multiple'} columns={props.columns} showCheckMark={props.showCheckMark}
            options={options} value={valueArray}
            onChange={handleChange}
        >
        </Selector>
    )
})

XmsSelect.propTypes = {
    mode: PropTypes.string,
    disabled: PropTypes.bool,
    columns: PropTypes.number,
    showCheckMark: PropTypes.bool,

    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string, PropTypes.number]),
    options: PropTypes.array.isRequired,
    optionFieldLabel: PropTypes.string,
    optionFieldValue: PropTypes.string,
    optionFieldDisabled: PropTypes.string,
    optionFieldSelected: PropTypes.string, //field value should be (true) / (not true),
    optionFieldSort: PropTypes.string,
}


XmsSelect.defaultProps = {
    mode: '', //'', 'multiple'
    columns: 3,

    optionFieldLabel: 'label',
    optionFieldValue: 'value',
    optionFieldDisabled: 'disabled',
    optionFieldSelected: 'selected',
    optionFieldSort: 'value',
}


export default XmsSelect;