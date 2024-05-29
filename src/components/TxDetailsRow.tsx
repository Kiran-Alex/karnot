import React from 'react'
import { TxRowComponet } from '~/types'
const TxDetailsRow:React.FC <TxRowComponet> = ({label,children}) => {
  return (
   <>
      <div className="flex h-[38px] max-h-fit flex-row">
            <div className="w-[250px] flex flex-row items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[16px] h-[16px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              <span className="uppercase text-xs">{label}:</span>
            </div>
            <div className="h-full w-full border-b-[1px] border-[#383838] flex flex-row  items-center">{children}</div>
          </div>
   </>
  )
}

export default TxDetailsRow