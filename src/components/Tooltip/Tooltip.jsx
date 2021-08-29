import React, {useEffect} from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const StyledTooltip = styled.div`
    position: absolute;
    padding: 8px 16px;
    background-color: grey;
    opacity: ${props => props.visible ? '1' : '0'};
`;

const isOutsideWindow = (tooltipDimensions, windowDimensions, style) => {
    const verticallyOutOfBounds = style.top < 0  ||
                                  (style.top + tooltipDimensions.height) > windowDimensions.height;
    
    const horizontallyOutOfBounds = style.left < 0 || 
                                    style.left + tooltipDimensions.width > windowDimensions.width;

    return verticallyOutOfBounds || horizontallyOutOfBounds
}

const getStyle = (tooltipPosition, anchorDimensions, tooltipDimensions, windowDimensions, pointerPosition) => {
    const safeVertical = 8,
          safeHorizontal = 16,
          positions = {
            top: {
                top: anchorDimensions.top - tooltipDimensions.height - safeVertical,
                left: anchorDimensions.left + (anchorDimensions.width - tooltipDimensions.width) / 2
            },
            topStart: {
                top: anchorDimensions.top - tooltipDimensions.height - safeVertical,
                left: anchorDimensions.left - tooltipDimensions.width + safeHorizontal
            },
            topEnd: {
                top: anchorDimensions.top - tooltipDimensions.height - safeVertical,
                left: anchorDimensions.right - safeHorizontal
            },
            bottom: {
                top: anchorDimensions.bottom + safeVertical,
                left: anchorDimensions.left + (anchorDimensions.width - tooltipDimensions.width) / 2
            },
            bottomStart: {
                top: anchorDimensions.bottom + safeVertical,
                left: anchorDimensions.left - tooltipDimensions.width + safeHorizontal
            },
            bottomEnd: {
                top: anchorDimensions.bottom + safeVertical,
                left: anchorDimensions.right - safeHorizontal
            },
            right: {
                top: anchorDimensions.top + (anchorDimensions.height - tooltipDimensions.height) / 2,
                left: anchorDimensions.right + safeHorizontal
            },
            left: {
                top: anchorDimensions.top + (anchorDimensions.height - tooltipDimensions.height) / 2,
                left: anchorDimensions.left - tooltipDimensions.width - safeHorizontal
            }
        }

    //lol this bit is horrible
    const key = tooltipPosition + (pointerPosition === 'center' ? '' : (pointerPosition.charAt(0).toUpperCase() + pointerPosition.slice(1) ))
    let style = positions[key]

    if(isOutsideWindow(tooltipDimensions, windowDimensions, style)) {
        for (const [currentKey, value] of Object.entries(positions)) {
            if (currentKey === key) continue;

            if(!isOutsideWindow(tooltipDimensions, windowDimensions, value)) {
                style = value;
                break;
            }
        }
    }
    return style
}

function Tooltip({anchorRef, tooltipPosition, pointerPosition}) {
    const [visible, setVisibility] = React.useState(false),
          [tooltipStyle, setTooltipStyle] = React.useState({}),
          tooltipRef = React.useRef(),
          windowDimensions = useWindowDimensions()


    useEffect(() => {
        if (anchorRef.current) {
            anchorRef.current.addEventListener('mouseenter',() => setVisible(true))
            anchorRef.current.addEventListener('mouseleave',() => setVisible(false))
        }
        return () => {
            if (anchorRef.current) {
                anchorRef.current.removeEventListener('mouseenter', () => setVisible(true))
                anchorRef.current.addEventListener('mouseleave',() => setVisible(false))
            }
        }
    }, [anchorRef])

    useEffect(() => {
        if (!anchorRef.current || !tooltipRef.current) return
        setTooltipStyle({})
        
        const anchorDimensions = anchorRef.current.getBoundingClientRect(),
              tooltipDimensions = tooltipRef.current.getBoundingClientRect()

        let style = getStyle(tooltipPosition, anchorDimensions, tooltipDimensions, windowDimensions, pointerPosition)

        setTooltipStyle(style)
    }, [anchorRef, tooltipRef, tooltipPosition, windowDimensions, pointerPosition])

    const setVisible = (visible) => {
        setVisibility(visible);
    }

    return (<StyledTooltip ref={tooltipRef} visible={visible} style={tooltipStyle}>Hello Rui!</StyledTooltip>)
}

Tooltip.propTypes = {
    anchorRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    tooltipPosition:  PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
    pointerPosition: PropTypes.oneOf(['center', 'start', 'end']).isRequired,
}

export default Tooltip;