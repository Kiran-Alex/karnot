import React from 'react'
import { ChipProps } from '~/types'

const Chip: React.FC<ChipProps> = ({ label, backgroundColor, borderColor, textColor }) => {
    return (
        <div
            className="text-xs py-[3px] px-[10px] border rounded-[4px] flex flex-row justify-center items-center w-fit"
            style={{
                backgroundColor: backgroundColor,
                color: textColor,
                borderColor: borderColor,
            }}
        >
            <span>{label}</span>
        </div>
    )
}

export default Chip
