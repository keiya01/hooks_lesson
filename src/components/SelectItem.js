import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SelectItem(props) {
    const {
        name,
        color,
        activeColor,
        isActive,
        icon,
        iconSize,
        onClick
    } = props
    const fontSize = iconSize || 13
    const selectColor = isActive ? activeColor : color
    const selected = isActive && 'selected'
    const selectStyle = {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: selectColor,
        color: selectColor,
        fontSize,
    }
    return (
        <div
            className={css(styles.filterBox, styles[selected])}
            style={selectStyle}
            onClick={onClick}>
            <p className={css(styles.selectText)}>
                {
                    icon
                        ?
                        <FontAwesomeIcon
                            icon={icon} />
                        :
                        name
                }
            </p>
        </div>
    )
}

const styles = StyleSheet.create({
    filterBox: {
        cursor: 'pointer',
        width: 55,
        height: 55,
        borderRadius: '50%',
        backgroundColor: '#fff',
        float: 'left',
        textAlign: 'center',
        marginRight: 30,
        ':active': {
            transform: 'translateY(1px)'
        },
        '@media(max-width: 450px)': {
            width: 45,
            height: 45,
            marginRight: 20
        }
    },
    selectText: {
        lineHeight: '51px',
        fontWeight: 'bold',
        '@media(max-width: 450px)': {
            lineHeight: '41px'
        }
    },
})